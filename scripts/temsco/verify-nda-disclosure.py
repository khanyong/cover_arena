#!/usr/bin/env python3
"""Independent pre-NDA disclosure audit; no application or PDF mutation.

Requires pypdf and the project's Node/TypeScript installation. Examples:
  python3 scripts/temsco/verify-nda-disclosure.py --static-only
  python3 scripts/temsco/verify-nda-disclosure.py --pdf public/temsco/pre-nda/pdf/FILE.pdf

This audit complements visual page review. It cannot prove that arbitrary raster
images or business assertions are suitable for disclosure; report those separately.
"""
import argparse
import hashlib
import json
import re
import subprocess
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SENSITIVE = re.compile(
    r"(?:TemscoV[234]|valuation(?:Data|Model|Inputs|Reinvestment)|financialDisplayData|"
    r"transactionFinancials|acquisitionValue|investorExitModel|source-materials|"
    r"deck-v[234]|TEMSCO-V4-|model-comparison|investor[^\s/]*\.xlsx|"
    r"/Users/|/Volumes/|/private/|file://)", re.I)
VALUE_PATTERNS = [
    ("private valuation figure", r"(?:898[.,]71|637[.,]53|360[.,]67|338[.,]35|41[.,]76|235[.,]10)"),
    ("financial amount or percentage", r"\d[\d,]*(?:\.\d+)?\s*(?:억|조\s*원|원|%)"),
    ("excluded customer identity", r"삼성|Samsung|(?<![A-Za-z])LG(?![A-Za-z])|BOE|비전옥스|Visionox"),
]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def normalize(text):
    return re.sub(r"\s+", "", unicodedata.normalize("NFKC", text))


def static_audit(root, entries, fail):
    """Parse imports with TypeScript, following local aliases and re-exports."""
    js = r"""
const fs=require('fs'), path=require('path'), ts=require('typescript');
const root=process.cwd(), seen=new Set(), edges=[], unresolved=[], dynamic=[];
const cfg=ts.findConfigFile(root,ts.sys.fileExists,'tsconfig.json');
const options=cfg?ts.convertCompilerOptionsFromJson(ts.readConfigFile(cfg,ts.sys.readFile).config.compilerOptions||{},root).options:{};
function visit(file){
 file=path.resolve(file); if(seen.has(file))return; seen.add(file);
 const text=fs.readFileSync(file,'utf8');
 if(!/\.[cm]?[jt]sx?$/.test(file))return;
 const sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);
 function add(spec,kind){
   let found=ts.resolveModuleName(spec,file,options,ts.sys).resolvedModule;
   if(!found&&spec.startsWith('.')){
     const base=path.resolve(path.dirname(file),spec);
     for(const ext of ['', '.ts','.tsx','.js','.jsx','.mjs','.cjs','.json','.css','/index.ts','/index.tsx']){
       if(fs.existsSync(base+ext)&&fs.statSync(base+ext).isFile()){found={resolvedFileName:base+ext};break;}
     }
   }
   if(found&&!found.isExternalLibraryImport&&!found.resolvedFileName.includes('/node_modules/')){
     edges.push({from:path.relative(root,file),specifier:spec,to:path.relative(root,found.resolvedFileName),kind});visit(found.resolvedFileName);
   } else if(spec.startsWith('.')||spec.startsWith('@/'))unresolved.push({file:path.relative(root,file),specifier:spec});
 }
 function walk(n){
   if((ts.isImportDeclaration(n)||ts.isExportDeclaration(n))&&n.moduleSpecifier&&ts.isStringLiteral(n.moduleSpecifier))add(n.moduleSpecifier.text,'static');
   if(ts.isCallExpression(n)&&(n.expression.kind===ts.SyntaxKind.ImportKeyword||(ts.isIdentifier(n.expression)&&n.expression.text==='require'))){
      const a=n.arguments[0];if(a&&ts.isStringLiteral(a))add(a.text,'call');else dynamic.push({file:path.relative(root,file),expression:n.getText(sf)});
   }
   ts.forEachChild(n,walk);
 } walk(sf);
}
for(const file of JSON.parse(process.argv[1]))visit(file);
console.log(JSON.stringify({files:[...seen].map(x=>path.relative(root,x)),edges,unresolved,dynamic}));
"""
    present = [entry for entry in entries if (root / entry).is_file()]
    for entry in set(entries) - set(present):
        fail("missing-entry", entry)
    if not present:
        return {"files": [], "edges": []}
    proc = subprocess.run(["node", "-e", js, json.dumps(present)], cwd=root,
                          capture_output=True, text=True)
    if proc.returncode:
        fail("source-graph-failure", proc.stderr.strip())
        return {"files": [], "edges": []}
    result = json.loads(proc.stdout)
    for item in result["unresolved"]:
        fail("unresolved-local-import", item)
    for item in result["dynamic"]:
        fail("nonliteral-import", item)
    for edge in result["edges"]:
        if SENSITIVE.search(edge["specifier"]) or SENSITIVE.search(edge["to"]):
            fail("private-source-import", edge)
    result["hashes"] = {name: sha(root / name) for name in result["files"]}
    # Keep source scanning specific: NDA policies may legitimately name DCF or EV.
    for name in result["files"]:
        if not name.endswith((".ts", ".tsx", ".js", ".jsx", ".json")):
            continue
        body = (root / name).read_text()
        for label, pattern in VALUE_PATTERNS:
            # Layout components may contain CSS percentages; the approved content
            # module and extracted PDF text must contain no financial quantities.
            if label == "financial amount or percentage" and not name.endswith("pre-nda-content.ts"):
                continue
            matches = sorted(set(re.findall(pattern, body)))
            if matches:
                fail("private-numeric-source", {"file": name, "kind": label, "matches": matches})
        for match in re.finditer(r"(?:fetch|axios\.(?:get|post)|readFileSync|readFile)\s*\(\s*['\"]([^'\"]+)", body):
            if SENSITIVE.search(match.group(1)):
                fail("private-runtime-reference", {"file": name, "reference": match.group(1)})
    return result


def preservation_audit(root, baseline_path, fail):
    if not baseline_path.is_file():
        fail("baseline-missing", str(baseline_path))
        return {}
    baseline = json.loads(baseline_path.read_text())
    changed = [name for name, old in baseline["fileHashes"].items()
               if not (root / name).is_file() or sha(root / name) != old]
    # Navigation labels/export controls can change without altering the 40 slides.
    content = [name for name in changed if
               (name.startswith("components/TemscoV4/") and not name.endswith("PdfDownloadControls.tsx"))
               or name == "lib/temsco/v4-slide-catalog.ts"
               or name.startswith("public/temsco/v4/technology/")]
    for name in content:
        fail("full-v4-content-changed", name)
    old_pdf = root / baseline["pdf"]["path"]
    if not old_pdf.is_file() or sha(old_pdf) != baseline["pdf"]["sha256"]:
        fail("baseline-full-pdf-modified-or-missing", str(old_pdf))
    return {"baseline": str(baseline_path), "tracked": len(baseline["fileHashes"]),
            "coreContentChanges": content, "otherChangesForReview": [n for n in changed if n not in content],
            "originalPdfUnchanged": old_pdf.is_file() and sha(old_pdf) == baseline["pdf"]["sha256"]}


def pdf_audit(pdf, min_pages, max_pages, allowed_urls, allowlist_path, fail):
    from pypdf import PdfReader
    from pypdf.generic import ContentStream, DictionaryObject, ArrayObject, IndirectObject, TextStringObject, ByteStringObject

    reader = PdfReader(pdf, strict=True)
    if reader.is_encrypted:
        fail("encrypted-pdf-not-inspectable", str(pdf))
    pages = reader.pages
    if not min_pages <= len(pages) <= max_pages:
        fail("unexpected-page-count", {"actual": len(pages), "expected": [min_pages, max_pages]})
    texts = [p.extract_text(extraction_mode="layout") or "" for p in pages]
    urls, strings, images, risky_keys = [], [], [], []
    seen = set()
    forbidden_keys = {"/EmbeddedFiles", "/JavaScript", "/JS", "/OpenAction", "/AA", "/AcroForm", "/AF", "/Collection", "/OCProperties", "/PieceInfo"}
    forbidden_actions = {"/Launch", "/JavaScript", "/SubmitForm", "/ImportData", "/GoToR", "/GoToE", "/Rendition"}

    def walk(obj, location):
        if isinstance(obj, IndirectObject):
            key = (obj.idnum, obj.generation)
            if key in seen:
                return
            seen.add(key)
            obj = obj.get_object()
        if isinstance(obj, (TextStringObject, ByteStringObject)):
            value = str(obj) if not isinstance(obj, bytes) else obj.decode("utf-8", "replace")
            strings.append((location, value))
        if isinstance(obj, DictionaryObject):
            for key in forbidden_keys.intersection(obj.keys()):
                risky_keys.append({"location": location, "key": key})
            if str(obj.get("/S", "")) in forbidden_actions:
                fail("active-pdf-action", {"location": location, "action": str(obj["/S"])})
            if "/URI" in obj:
                value = str(obj["/URI"])
                urls.append(value)
                if not any(value == prefix or value.startswith(prefix.rstrip('/') + '/') for prefix in allowed_urls):
                    fail("nonallowlisted-pdf-url", value)
            if obj.get("/Subtype") == "/Image":
                images.append({"location": location, "width": obj.get("/Width"), "height": obj.get("/Height")})
            # Inspect compressed metadata (XMP), not binary font/image payloads.
            if obj.get("/Type") == "/Metadata" and hasattr(obj, "get_data"):
                strings.append((location + "/decoded", obj.get_data().decode("utf-8", "replace")))
            for key, value in obj.items():
                walk(value, location + "/" + str(key).lstrip('/'))
        elif isinstance(obj, ArrayObject):
            for i, value in enumerate(obj):
                walk(value, f"{location}[{i}]")

    walk(reader.trailer, "trailer")
    # Inspect every xref object, including orphan references not reachable from Root.
    for generation, ids in reader.xref.items():
        if generation == 65535:
            continue
        for object_id in ids:
            if object_id:
                walk(IndirectObject(object_id, generation, reader), f"xref/{object_id}")
    for object_id in reader.xref_objStm:
        walk(IndirectObject(object_id, 0, reader), f"objectStream/{object_id}")
    for item in risky_keys:
        fail("hidden-or-active-pdf-structure", item)
    for i, page in enumerate(pages, 1):
        if not texts[i - 1].strip():
            fail("no-extractable-page-text", i)
        box = page.mediabox
        width, height = float(box.width), float(box.height)
        if abs(width - 841.89) > 3 or abs(height - 595.28) > 3:
            fail("not-a4-landscape", {"page": i, "widthPt": width, "heightPt": height})
        if page.get_contents():
            content = ContentStream(page.get_contents(), reader)
            for operands, operator in content.operations:
                if operator == b"Tr" and operands and int(operands[0]) in (3, 7):
                    fail("invisible-pdf-text-render-mode", {"page": i, "mode": int(operands[0])})
        for annotation in page.get("/Annots", []):
            annotation = annotation.get_object()
            flags = int(annotation.get("/F", 0))
            if flags & (1 | 2 | 32):
                fail("hidden-annotation", {"page": i, "flags": flags})
            if annotation.get("/Subtype") != "/Link":
                fail("nonlink-annotation", {"page": i, "subtype": str(annotation.get("/Subtype"))})
    corpus = [(f"page/{i+1}", text) for i, text in enumerate(texts)] + strings
    for location, text in corpus:
        if SENSITIVE.search(text):
            fail("private-pdf-reference", {"location": location, "match": SENSITIVE.search(text).group(0)})
        for label, pattern in VALUE_PATTERNS:
            if re.search(pattern, text):
                fail("private-pdf-number", {"location": location, "kind": label, "match": re.search(pattern, text).group(0)})
    unknown_numbers = []
    allowlist_strings_checked = 0
    if allowlist_path:
        payload = json.loads(allowlist_path.read_text())
        def leaves(value):
            if isinstance(value, dict):
                return [s for v in value.values() for s in leaves(v)]
            if isinstance(value, list):
                return [s for v in value for s in leaves(v)]
            return [str(value)] if isinstance(value, (str, int, float)) else []
        # Preserve token boundaries: removing whitespace joins separate column
        # labels 01 / 02 / 03 into a fictitious 010203 number.
        permitted = unicodedata.normalize("NFKC", " ".join(leaves(payload)))
        permitted_numbers = set(re.findall(r"\d+(?:[,.]\d+)*", permitted))
        permitted_numbers.update(str(n) for n in range(0, len(pages) + 1))
        permitted_numbers.update(str(n).zfill(2) for n in range(0, len(pages) + 1))
        for i, text in enumerate(texts, 1):
            found = set(re.findall(r"\d+(?:[,.]\d+)*", unicodedata.normalize("NFKC", text)))
            for number in sorted(found - permitted_numbers):
                unknown_numbers.append({"page": i, "number": number})
                fail("number-outside-allowlist", {"page": i, "number": number})
        if isinstance(payload, list) and all(isinstance(s, dict) and "items" in s for s in payload):
            if len(payload) != len(pages):
                fail("allowlist-page-count-mismatch", {"allowlist": len(payload), "pdf": len(pages)})
            for i, (slide, page) in enumerate(zip(payload, pages), 1):
                required = [slide[k] for k in ["title", "section", "subtitle"]]
                for item in slide["items"]:
                    required.extend([item["label"], item["heading"], *item["bullets"]])
                plain = normalize(page.extract_text() or "")
                for value in required:
                    allowlist_strings_checked += 1
                    if normalize(value) not in plain:
                        fail("approved-text-missing-or-wrong-page", {"page": i, "text": value})
    return {"path": str(pdf), "sha256": sha(pdf), "pageCount": len(pages), "pageTexts": texts,
            "metadata": {str(k): str(v) for k, v in (reader.metadata or {}).items()},
            "pdfUrls": sorted(set(urls)), "xrefObjectsInspected": len(seen),
            "imageObjectsForVisualReview": images, "unknownNumbers": unknown_numbers,
            "allowlistStringsChecked": allowlist_strings_checked,
            "allowlistSha256": sha(allowlist_path) if allowlist_path else None,
            "limitations": ["Raster images require visual/OCR review", "Business facts and future-versus-achieved wording require editorial review",
                            "Deny patterns supplement source allowlisting; they are not proof that all confidential facts have been excluded"]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    parser.add_argument("--entry", action="append", default=[])
    parser.add_argument("--baseline", type=Path, default=Path("/private/tmp/temsco-nda-baseline.json"))
    parser.add_argument("--pdf", type=Path)
    parser.add_argument("--static-only", action="store_true")
    parser.add_argument("--allowlist", type=Path, help="JSON export of approved pre-NDA content; checks unexpected numeric content")
    parser.add_argument("--allow-url", action="append", default=[])
    parser.add_argument("--min-pages", type=int, default=12)
    parser.add_argument("--max-pages", type=int, default=14)
    parser.add_argument("--output", type=Path, default=Path("/private/tmp/temsco-nda-disclosure-check.json"))
    args = parser.parse_args()
    errors = []
    def fail(code, detail):
        errors.append({"code": code, "detail": detail})
    entries = args.entry or ["pages/temsco/pre-nda.tsx", "lib/temsco/pre-nda-content.ts"]
    report = {"createdAt": datetime.now(timezone.utc).isoformat(), "scope": "Read-only independent pre-NDA disclosure and V4 preservation audit"}
    report["sourceGraph"] = static_audit(args.root, entries, fail)
    report["preservation"] = preservation_audit(args.root, args.baseline, fail)
    if args.pdf:
        report["pdf"] = pdf_audit(args.pdf, args.min_pages, args.max_pages, args.allow_url, args.allowlist, fail)
    elif not args.static_only:
        fail("pdf-missing", "Provide --pdf, or use --static-only for an explicitly limited check")
    report["errors"] = errors
    report["status"] = "PASS_STATIC_ONLY" if not errors and args.static_only and not args.pdf else "PASS" if not errors else "FAIL"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"status": report["status"], "errors": errors, "report": str(args.output)}, ensure_ascii=False))
    return bool(errors)


if __name__ == "__main__":
    sys.exit(main())
