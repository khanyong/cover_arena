from pathlib import Path
from pypdf import PdfReader
from PIL import Image, ImageDraw
import pypdfium2 as pdfium
import json

folder = Path(__file__).resolve().parent
reader = PdfReader(folder / 'preview.pdf')
result = {'pageCount': len(reader.pages), 'pages': [
    {'page': i + 1, 'width': float(p.mediabox.width),
     'height': float(p.mediabox.height), 'textLength': len(p.extract_text() or '')}
    for i, p in enumerate(reader.pages)
]}
print(json.dumps(result, ensure_ascii=False, indent=2))
(folder / 'pdf-check.json').write_text(json.dumps(result, ensure_ascii=False, indent=2))
document = pdfium.PdfDocument(str(folder / 'preview.pdf'))
for kind in ['screen', 'print']:
    for start in [0, 8]:
        canvas = Image.new('RGB', (1200, 1800), '#d0d0d0')
        draw = ImageDraw.Draw(canvas)
        for k in range(8):
            idx = start + k
            if kind == 'print':
                im = document[idx].render(scale=1.5).to_pil()
                im.save(folder / f'print-{idx + 1:02}.png')
            else:
                im = Image.open(folder / f'slide-{idx + 1:02}.png')
            im.thumbnail((590, 410))
            x = (k % 2) * 600 + (600 - im.width) // 2
            y = (k // 2) * 450 + 28
            canvas.paste(im, (x, y))
            draw.text(((k % 2) * 600 + 12, (k // 2) * 450 + 8), f'{kind} SLIDE {idx + 1:02}', fill='black')
        canvas.save(folder / f'{kind}-contact-{start + 1:02}.png')
