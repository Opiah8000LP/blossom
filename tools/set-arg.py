#!/usr/bin/env python3
"""
Put your ARG link (Google Drive, anything) into every file that carries the whisper.

  python3 tools/set-arg.py "https://drive.google.com/..."
  python3 tools/set-arg.py "https://new-link" --old "https://old-link"     # change it later

It edits: index.html, llms.txt, robots.txt, js/content.js
The message text itself is plain text in those files, so you can rewrite it by hand too.
"""
import sys, pathlib

PLACEHOLDER = "PASTE_DRIVE_LINK_HERE"
FILES = ["index.html", "llms.txt", "robots.txt", "js/content.js"]

def main(argv):
    if len(argv) < 2 or argv[1].startswith("-"):
        print(__doc__); return 1
    new = argv[1]
    old = PLACEHOLDER
    if "--old" in argv:
        old = argv[argv.index("--old") + 1]
    root = pathlib.Path(__file__).resolve().parent.parent
    total = 0
    for name in FILES:
        p = root / name
        if not p.exists():
            print("skip (missing):", name); continue
        text = p.read_text(encoding="utf-8")
        n = text.count(old)
        if n:
            p.write_text(text.replace(old, new), encoding="utf-8")
        print(f"{name}: {n} replaced")
        total += n
    if total == 0:
        print("Nothing to replace. If you already set a link, pass it with --old.")
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv))
