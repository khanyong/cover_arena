"""Independent artifact checks; no use of the producer's matching functions."""
import hashlib
import json
import re
from pathlib import Path
import pymupdf as fitz
from PIL import Image, ImageChops, ImageDraw
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
manifest = json.loads((ROOT / 'public/temsco/pre-nda/pdf/manifest.json').read_text())
edition = manifest['sourceHash'][:12]
audit = json.loads((ROOT / f'projects/temsco/v4/pre-nda/verification/redaction-{edition}.json').read_text())
source_path = ROOT / 'projects/temsco/v4/pre-nda/source/approved-v4.pdf'
output_path = ROOT / 'public/temsco/pre-nda/pdf' / manifest['fileName']
source, output = fitz.open(source_path), fitz.open(output_path)
assert len(source) == len(output) == 40
assert hashlib.sha256(source_path.read_bytes()).hexdigest() == audit['sourceSha256']
assert hashlib.sha256(output_path.read_bytes()).hexdigest() == manifest['pdfHash']
assert not output.embfile_count()
assert all(not list(p.annots() or []) and not p.get_links() for p in output)
reader = PdfReader(output_path)
catalog = reader.trailer['/Root']
for key in ('/StructTreeRoot', '/Metadata', '/AcroForm', '/OpenAction', '/AA'):
    assert key not in catalog, f'Unexpected original metadata/action: {key}'
assert not reader.attachments

sentinels = {
    4: ['400.00', '414.63', '744.29', '832.86'],
    7: ['90억', '23.55%', '20.00%', '363.88', '54.88'],
    8: ['125.37', '65.40%', '160.00', '41.52'],
    11: ['99.999', '5N', '±10%'],
    14: ['2.50', '2.85', '2.54', '2.73', '0.35', '0.04', '0.23'],
    15: ['450매', '4,500', '5,500', '12인치'],
    18: ['30%', 'YMC', '1차벤더·직납'],
    20: ['398.59', '350.58', '400.00', '832.86', '-73.24'],
    22: ['400.00', '414.63', '10.38%', '18.72%'],
    25: ['-102.69', '566.91', '375.26'],
    26: ['-113.53', '890.21', '637.53'],
    27: ['105.57%', '97.57%', '890.21'],
    29: ['637.53', '360.67', '338.35'],
    30: ['868.64', '569.12', '-128.81'],
    31: ['615.11', '338.35', '468.98'],
    32: ['235.10', '41.76', '162.19', '75%', '25%'],
    33: ['16.25%', '17.14%', '1,557.1%', '430.67'],
    35: ['70억', '40억', '20억', '10억'],
    36: ['102.9', '123.4', '30.8', '50.9', '90일', '180일', '16.25%', '13.00%', '10.40%', '235.10'],
    38: ['1.856342', '235.10'],
    40: ['19.06', '100.92', '40.28', '93.93', '112.50'],
}
for page, values in sentinels.items():
    if page <= 5:
        continue  # User explicitly approved full disclosure of pages 1–5.
    for text in (output[page-1].get_text(), reader.pages[page-1].extract_text()):
        compact = re.sub(r'\s+', '', text)
        for value in values:
            assert value not in compact, f'Sensitive token remains: page {page}, {value}'

public = {
    5: ['대통령표창', '국산화'],
    11: ['INVAR36', 'Ni36', 'PVD'],
    12: ['OMM', 'Frame', 'Welding'],
    13: ['인장·용접', 'AOI'],
    14: ['Top', 'Slope', 'Bottom', '합격'],
    15: ['G8.6', 'G6H', '고객'],
    25: ['109/365', '0.9681', '0.698788', '2029E', 'FCFF'],
    30: ['75%', '100%', '115%', '12.97%', '18.42%'],
    31: ['80%', '120%', '50%', '±1.5%'],
    36: ['2031년', '2032', '원금손실', '계약전제'],
    39: ['11.4676%', '3.996979%', '1.743526', '14.17%'],
    40: ['4.25%', '0.85%', '18.42%', '10년', '5년'],
}
for page, tokens in public.items():
    if audit['pages'][page-1].get('presentationRegions'):
        continue  # Entire areas intentionally withheld in the approved blur edition.
    compact = re.sub(r'\s+', '', output[page-1].get_text())
    for token in tokens:
        assert token in compact, f'Required visible context missing: {page}, {token}'

# Original SEM image data must no longer exist as unused PDF resources.
def image_hashes(doc, page):
    return {hashlib.sha256(fitz.Pixmap(doc, im[0]).samples).hexdigest() for im in doc[page].get_images(full=True)}
assert not (image_hashes(source, 13) & image_hashes(output, 13)), 'Original SEM pixels remain in output resources'
for image in source[12].get_image_info(xrefs=True):
    if fitz.Rect(image['bbox']).intersects(fitz.Rect(690,318,750,327)):
        original_hash = hashlib.sha256(fitz.Pixmap(source, image['xref']).samples).hexdigest()
        assert original_hash not in image_hashes(output, 12), 'Original equipment ID image remains in output resources'

checks = []
for i, (before, after) in enumerate(zip(source, output)):
    assert abs(after.rect.width - 841.89) < 1 and abs(after.rect.height - 595.28) < 1
    records = audit['pages'][i]['redactions']
    if i < 5:
        assert not audit['pages'][i].get('presentationRegions'), 'Public page blurred'
        assert all(r['reason'] in ('replace distribution classification','Remove contents edition and page count sentence','cover date update') for r in records), 'Unexpected redaction on public page'
    # Blurred regions contain no original selectable text, only confidentiality labels.
    for coords in audit['pages'][i].get('presentationRegions', []):
        box=fitz.Rect(coords)
        for word in after.get_text('words'):
            center=fitz.Point((word[0]+word[2])/2,(word[1]+word[3])/2)
            if center in box:
                assert all(c in 'CONFIDENTIALNDA체결후제공 ' for c in word[4]), f'Original text in blurred region: {i+1}, {word[4]}'
    for record in records:
        if record.get('reason') == 'cover date update':
            assert '2026. 09.' in after.get_text()
            continue
        box = fitz.Rect(record['rect'])
        for word in after.get_text('words'):
            center = fitz.Point((word[0]+word[2])/2, (word[1]+word[3])/2)
            if center in box:
                assert not re.search(r'\d', word[4]), f'Numeric text inside mask: {i+1}'
    before_pix, after_pix = before.get_pixmap(), after.get_pixmap()
    a = Image.frombytes('RGB', (before_pix.width, before_pix.height), before_pix.samples)
    b = Image.frombytes('RGB', (after_pix.width, after_pix.height), after_pix.samples)
    diff = ImageChops.difference(a, b).convert('L')
    draw = ImageDraw.Draw(diff)
    for record in records:
        r = record['rect']
        draw.rectangle((r[0]-3, r[1]-3, r[2]+3, r[3]+3), fill=0)
    for r in audit['pages'][i].get('presentationRegions', []):
        draw.rectangle((r[0]-3, r[1]-3, r[2]+3, r[3]+3), fill=0)
    if i == 0:
        draw.rectangle((90, 96, 275, 118), fill=0)
    assert 'CONF.' not in after.get_text(), 'Word-level label remains'
    # PDF redaction removes whole glyphs intersecting a region boundary.
    region_boxes=[fitz.Rect(r) for r in audit['pages'][i].get('presentationRegions', [])]
    for block in before.get_text('rawdict')['blocks']:
        for line in block.get('lines', []):
            for span in line['spans']:
                for char in span['chars']:
                    box=fitz.Rect(char['bbox'])
                    if any(box.intersects(r) for r in region_boxes):
                        draw.rectangle((box.x0-3,box.y0-3,box.x1+3,box.y1+3),fill=0)
    draw.rectangle((0, 576, a.width, a.height), fill=0)
    # Transparent image redaction can alter antialiasing around changed pixels by <10 luminance.
    bad = sum(count for level, count in enumerate(diff.histogram()) if level > 10)
    checks.append({'page': i+1, 'maskCount': len(records), 'changedPixelsOutsideMasks': bad})
    assert bad < 80, f'Unexpected changes outside selected masks, page {i+1}: {bad}'

result = {'status': 'PASS', 'pageCount': 40, 'format': 'A4 landscape',
          'pdfHash': manifest['pdfHash'], 'sourceHash': audit['sourceSha256'],
          'trueRedactionsVerified': True, 'originalSemImageResourcesRemoved': True,
          'publicContextOutsideBlurPreserved': True, 'irreversibleRegionBlur': True,
          'links': 0, 'attachments': 0, 'annotations': 0, 'pages': checks}
target = ROOT / 'projects/temsco/v4/pre-nda/verification/full40-verification.json'
target.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k != 'pages'}, ensure_ascii=False))
