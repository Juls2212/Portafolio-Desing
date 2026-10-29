"""Throwaway helper: decode the Claude Design "bundled page" prototype.

Usage:
    python -I scripts/dev/extract-prototype.py <bundled.html> <out_dir>

Writes <out_dir>/template.html (the real HTML + CSS + x-dc script) and
<out_dir>/assets/<uuid>.<ext> for every manifest entry, plus ids.json mapping
ext_resources ids (e.g. ic_react) to asset files. Not part of the app.
"""
import base64, gzip, json, re, sys
from pathlib import Path

EXT = {"image/svg+xml": "svg", "font/woff2": "woff2", "application/javascript": "js",
       "text/javascript": "js", "image/png": "png", "image/jpeg": "jpg"}


def block(html, name):
    m = re.search(r'<script type="__bundler/%s"[^>]*>(.*?)</script>' % name, html, re.S)
    return m.group(1).strip() if m else None


def main(src, out):
    html = Path(src).read_text(encoding="utf8")
    out = Path(out)
    (out / "assets").mkdir(parents=True, exist_ok=True)
    (out / "template.html").write_text(json.loads(block(html, "template")), encoding="utf8")
    manifest = json.loads(block(html, "manifest"))
    files = {}
    for uid, e in manifest.items():
        data = base64.b64decode(e["data"])
        if e.get("compressed"):
            data = gzip.decompress(data)
        name = f"{uid}.{EXT.get(e.get('mime'), 'bin')}"
        (out / "assets" / name).write_bytes(data)
        files[uid] = name
    ext = json.loads(block(html, "ext_resources") or "[]")
    ids = {}
    items = ext if isinstance(ext, list) else [{"id": k, "uuid": v} for k, v in ext.items()]
    for it in items:
        ids[it.get("id")] = files.get(it.get("uuid"), it.get("uuid"))
    (out / "ids.json").write_text(json.dumps(ids, indent=2), encoding="utf8")
    print(f"template + {len(files)} assets -> {out}")


if __name__ == "__main__":
    main(*sys.argv[1:3])
