"""Create the full V4 investor copy with true, selective PDF redactions.

The source is a pinned private PDF, never a live browser with hidden elements.
Internal audit files contain removed values and must not be copied to public/.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path

import pymupdf as fitz

ROOT = Path(__file__).resolve().parents[2]
CONFIG = ROOT / "projects/temsco/v4/pre-nda/redaction-config.json"
NUMBER = re.compile(r"(?<![A-Za-z0-9_.])[-−+±]?\d[\d,]*(?:\.\d+)?(?:\s*[%％])?")
CLIENT = re.compile(r"LG디스플레이|삼성디스플레이|비전옥스|Visionox|eMagin|AMAT|CSOT|파인원|삼성|(?<![A-Za-z])(?:LGD|LG|SDC)(?![A-Za-z])", re.I)
SOURCE_ID = re.compile(r"X0[1-4](?:[·~–]X0[1-4])*|CAPEX_감가상각|\b[A-Z]{1,3}\d+(?::[A-Z]{1,3}\d+|[·/][A-Z]{1,3}\d+)*\b|[^\s/]+\.xlsx|회사소개서\([^)]*\)\s*p\.[\d·–—~\-]+|회사소개서\s*p\.[\d·–—~\-]+")
PRIVATE_STATUS = re.compile(r"(?:OMM 공급 )?가격 협상(?:·최종 공급 조건 협의| 진행| 중)?|1차 벤더 (?:승격 완료|등록 완료)|물량\s*30%\s*배정 확정|2026년 4분기 직수출 양산 계획")


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def lines(page):
    for block in page.get_text("rawdict")["blocks"]:
        if block["type"] != 0:
            continue
        for line in block["lines"]:
            chars = [c for s in line["spans"] for c in s["chars"]]
            yield "".join(c["c"] for c in chars), chars


def number_is_public(page, match, text, box):
    token = match.group().strip()
    value = token.lstrip("+-−±").replace(",", "").rstrip("%％").strip()
    before, after = text[:match.start()], text[match.end():]
    # Document navigation, calendar years and general periods are not company values.
    if box.y0 < 48 or (box.y0 > 550 and box.x0 > 780):
        return True
    if re.fullmatch(r"0[1-9]", value):
        return True
    if re.match(r"^(?:19|20)\d\d(?:\.|$)", value):
        return True
    if re.match(r"^\s*(?:안|개\s*연도|개\s*시나리오|차|세대|년|조)", after) and "." not in value:
        return True
    if value in ("109", "365") and ("109/365" in text):
        return True
    if value == "0" and (re.search(r"(?:g\s*=|ΔNWC\s*[= ]|배당\s*|발행비용\s*)$", before) or page == 36 and "배당 0" in text):
        return True
    if page in (25, 26) and value in ("0.9681", "0.8685", "0.7789", "0.6988", "0.698788"):
        return True
    if page == 27 and value == "11.47" and "%" in token:
        return True
    if page == 30 and ((174 < box.y0 < 212) or (box.y0 > 538 and "매출증분" in text)):
        return True
    if page == 31 and "%" in token and value != "75":
        return True
    if page == 36:
        if value in ("1", "2", "3", "01", "02", "03", "100", "98", "2", "0") and not ("희석" in text):
            return True
        if value in ("341", "345", "4") and "상법" in text:
            return True
    if page == 38 and value in ("2", "13.74") and "%" in token:
        return True
    return False


def collect_redactions(page, page_no, config):
    records = []

    def add_match(text, chars, start, end, reason):
        selected = chars[start:end]
        if not selected:
            return
        box = fitz.Rect(selected[0]["bbox"])
        for char in selected[1:]:
            box |= fitz.Rect(char["bbox"])
        records.append({"rect": list(box + (-.25, -.15, .25, .15)), "text": text[start:end], "reason": reason})

    for text, chars in lines(page):
        if not chars:
            continue
        if text.strip().startswith('셀:'):
            add_match(text, chars, 0, len(text), "private spreadsheet source map")
            continue
        for m in re.finditer(r"\bDrivers\b", text):
            add_match(text, chars, *m.span(), "private worksheet name")
        if page_no == 13:
            for m in re.finditer(r"p\.\d+(?:[·–-]\d+)*", text):
                add_match(text, chars, *m.span(), "private presentation page reference")
        if page_no == 18:
            for m in re.finditer(r"1차 벤더 · 직납|기존 공급사 YMC와 경쟁|YMC와의 경쟁 및", text):
                add_match(text, chars, *m.span(), "customer-specific commercial relationship")
        # Page 28 contains public competitor disclosures. Only Temsco-specific strategy is private.
        private_client_context = page_no != 28 or any(word in text for word in ("템스코", "진입", "목표", "가격"))
        if private_client_context:
            for m in CLIENT.finditer(text):
                add_match(text, chars, *m.span(), "customer identity")
        for m in PRIVATE_STATUS.finditer(text):
            add_match(text, chars, *m.span(), "commercial negotiation or allocation")
        # Source references: chemical/product codes such as G6H and INVAR36 remain visible.
        if any(word in text for word in ("출처", "원본", "X01", "X02", "X03", "X04", "Drivers", "회사 재무", "CAPEX_감가상각", "셀:", "행 및", "회사소개서")):
            for m in SOURCE_ID.finditer(text):
                if m.group() in ("G6", "G8", "INVAR36"):
                    continue
                add_match(text, chars, *m.span(), "private source identifier")
            for m in re.finditer(r"(?:[A-Z]{1,3}/)+[A-Z]{1,3}\d+|[A-Z]{1,3}\d+", text):
                if m.group() not in ("G6", "G8", "INVAR36") and ("셀:" in text or "행 및" in text):
                    add_match(text, chars, *m.span(), "private spreadsheet cell reference")
        for m in NUMBER.finditer(text):
            box = fitz.Rect(chars[m.start()]["bbox"])
            value = m.group().strip().lstrip("+-−±").rstrip("%％").replace(",", "").strip()
            sensitive = page_no in config["financialPages"] and not number_is_public(page_no, m, text, box)
            if page_no != 39 and re.match(r"\s*억", text[m.end():]):
                sensitive = True
            if "%" in m.group() and value in ("75", "25"):
                if not (page_no == 30 and (174 < box.y0 < 194 or box.y0 > 538 and "매출증분" in text)):
                    sensitive = True
            if page_no == 11 and value in ("99.999", "10", "5"):
                sensitive = True
            if page_no == 14 and (value in ("2.50", "2.85", "0.35", "2.54", "0.04", "2.73", "0.23", "1.5", "2.5", "10")):
                sensitive = True
            if page_no == 15 and value in ("450", "4500", "5500", "12"):
                sensitive = True
            if page_no == 18 and value == "30" and "%" in m.group():
                sensitive = True
            if page_no == 40 and (value in ("19.06", "100.92", "40.28", "93.93") or "연결 112.50" in text):
                sensitive = True
            if sensitive:
                add_match(text, chars, *m.span(), "company financial value or private specification")
        # Al purity grade uses an adjacent letter and is intentionally missed by NUMBER.
        if page_no == 11:
            for m in re.finditer(r"\b5N\b", text):
                add_match(text, chars, *m.span(), "private purity grade")
        if page_no == 1 and "NDA 이후" in text:
            add_match(text, chars, 0, len(text), "replace distribution classification")

    records.extend({**r, "text": "[image pixels]"} for r in config["manualRedactions"] if r["page"] == page_no)
    # Overlapping match rules share one mask; do not enlarge masks across adjacent table columns.
    merged = []
    for item in sorted(records, key=lambda r: (r["rect"][1], r["rect"][0])):
        box = fitz.Rect(item["rect"])
        for target in merged:
            other = fitz.Rect(target["rect"])
            if box.intersects(other):
                target["rect"] = list(box | other)
                target["text"] += " | " + item["text"]
                break
        else:
            merged.append(item)
    return merged


def prepare_blur_regions(page, page_no, config, records):
    from PIL import Image, ImageFilter
    import io
    if page_no in config.get("publicPages", []) or page_no in (6,12,23):
        return []
    regions = config.get('blurRegions', {}).get(str(page_no), [])
    if not regions:
        body = [r['rect'] for r in records if r['rect'][1] > 130 and r['rect'][3] < 575]
        if body:
            regions = [[max(30,min(r[0] for r in body)-12), max(130,min(r[1] for r in body)-12),
                        min(813,max(r[2] for r in body)+12),min(565,max(r[3] for r in body)+12)]]
    patches=[]
    for coords in regions:
        box=fitz.Rect(coords)
        pix=page.get_pixmap(matrix=fitz.Matrix(2,2),clip=box,alpha=False)
        im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
        # Irreversible low-resolution raster, then strong blur; no original pixels embedded.
        im=im.resize((max(2,int(box.width/24)),max(2,int(box.height/24))),Image.Resampling.BOX)
        im=im.resize((pix.width,pix.height),Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(18))
        im=Image.blend(im,Image.new('RGB',im.size,(238,243,249)),config.get('blurTintOpacity',.38))
        stream=io.BytesIO();im.save(stream,format='PNG')
        patches.append((list(coords),stream.getvalue()))
    return patches


def disclosure_design(page, patches):
    for coords, data in patches:
        box=fitz.Rect(coords)
        page.insert_image(box,stream=data)
        size=min(38,box.width/9,box.height/4)
        label='CONFIDENTIAL'
        width=fitz.get_text_length(label,fontsize=size,fontname='hebo')
        page.insert_text((box.x0+(box.width-width)/2,box.y0+box.height/2),label,
                         fontname='hebo',fontsize=size,color=(.22,.30,.42))
        if box.height>65:
            page.insert_textbox(fitz.Rect(box.x0,box.y0+box.height/2+14,box.x1,box.y1),
                'NDA 체결 후 제공',fontname='korea',fontsize=10,align=1,color=(.25,.33,.43))
    return [coords for coords,_ in patches]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", required=True)
    parser.add_argument("--preview-dir", required=True)
    parser.add_argument("--edition", required=True)
    parser.add_argument("--audit", required=True)
    args = parser.parse_args()
    config = json.loads(CONFIG.read_text())
    source = ROOT / config["source"]
    if sha(source) != config["sourceSha256"]:
        raise ValueError("Pinned source changed. Review and approve a new disclosure edition first.")
    fitz.TOOLS.set_small_glyph_heights(True)
    doc = fitz.open(source)
    if len(doc) != config["pageCount"]:
        raise ValueError("Unexpected source page count")
    audit = {"sourceSha256": sha(source), "edition": config["edition"], "pages": []}
    for index, page in enumerate(doc):
        records = collect_redactions(page, index + 1, config)
        if index+1 in config.get("publicPages", []):
            records = [r for r in records if r["reason"] in ("replace distribution classification", "Remove contents edition and page count sentence")]
        if index == 0:
            records.append({"rect":[705,542,772,562],"reason":"cover date update","text":"2026. 08."})
        if index == 32:
            records.append({"rect": [29, 67, 322, 96], "reason": "public title without private amount", "text": "private funding amount in title"})
        patches = prepare_blur_regions(page, index+1, config, records)
        for coords, _ in patches:
            records.append({"rect":coords,"reason":"entire confidential region replaced with irreversible blurred raster","text":"region"})
        original_count = len(page.get_text())
        for record in records:
            page.add_redact_annot(record["rect"], fill=False, cross_out=False)
        if records:
            # Blank intersecting image pixels, retain public graph geometry, delete original text.
            page.apply_redactions(images=2, graphics=0, text=0)
        if index == 0:
            page.insert_text((92,106),'PRE-NDA INVESTOR COPY',fontsize=7,color=(.36,.42,.51))
        if index == 32:
            title_x = 30
            for char in "투자 유치 및 자본구조 변화":
                if char != " ":
                    page.insert_text((title_x,89), char, fontname="korea", fontsize=21.75, color=(.06,.09,.16))
                title_x += 5.4 if char == " " else 18.8
        design_regions = disclosure_design(page, patches)
        if index == 0:
            page.insert_text((707,557), config["coverDate"], fontname="hebo", fontsize=13.5, color=(.28,.33,.41))
        footer = "PRE-NDA | CONFIDENTIAL - Selected information withheld"
        if index + 1 in config["trendPages"]:
            footer += " | Confidential regions blurred"
        page.insert_text((39, 587), footer, fontsize=6.2, color=(.36, .42, .51))
        audit["pages"].append({"page": index + 1, "sourceCharacters": original_count,
                               "outputCharacters": len(page.get_text()), "redactions": records,
                               "presentationRegions": design_regions})

    # Build a fresh catalog: no source tags, alternate text, links, widgets, attachments or history.
    clean = fitz.open()
    clean.insert_pdf(doc, links=False, annots=False, widgets=False)
    clean.set_metadata({"title": "TEMSCO - Pre-NDA Investor Review", "author": "TEMSCO",
                        "subject": "Full 40-page edition with selective redaction", "creator": "TEMSCO IR"})
    clean.set_toc([[1, title, i + 1] for i, title in enumerate(config["pageTitles"])])
    pdf = Path(args.pdf)
    pdf.parent.mkdir(parents=True, exist_ok=True)
    clean.save(pdf, garbage=4, clean=True, deflate=True, use_objstms=0)
    clean.close()
    doc.close()
    final = fitz.open(pdf)
    preview_dir = Path(args.preview_dir)
    preview_dir.mkdir(parents=True, exist_ok=True)
    preview = {"pageCount": len(final), "pages": []}
    for i, page in enumerate(final):
        name = f"page-{i + 1:02}.png"
        pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        image = preview_dir / name
        pixmap.save(image)
        preview["pages"].append({"page": i + 1, "title": config["pageTitles"][i],
                                 "url": f"/temsco/pre-nda/editions/{args.edition}/{name}",
                                 "width": pixmap.width, "height": pixmap.height, "sha256": sha(image)})
    (preview_dir / "preview.json").write_text(json.dumps(preview, ensure_ascii=False, indent=2) + "\n")
    audit["pdfSha256"] = sha(pdf)
    audit["pageCount"] = len(final)
    audit["maskCount"] = sum(len(p["redactions"]) for p in audit["pages"])
    audit["relativeGraphGeometryRetained"] = False
    audit["irreversibleRegionBlur"] = True
    audit["annotations"] = sum(len(list(page.annots() or [])) for page in final)
    audit["embeddedFiles"] = final.embfile_count()
    audit["links"] = sum(len(page.get_links()) for page in final)
    audit["sourceUnchanged"] = sha(source) == config["sourceSha256"]
    audit_path = Path(args.audit)
    audit_path.parent.mkdir(parents=True, exist_ok=True)
    audit_path.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({k: v for k, v in audit.items() if k != "pages"}, ensure_ascii=False))


if __name__ == "__main__":
    main()
