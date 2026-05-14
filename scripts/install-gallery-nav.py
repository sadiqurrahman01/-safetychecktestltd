from pathlib import Path
root = Path(__file__).resolve().parents[1]
for path in root.glob("*.html"):
    text = path.read_text(encoding="utf-8", errors="ignore")
    if path.name != "gallery.html" and "gallery.html" not in text:
        patterns = [
            ('<a href="index.html#about">About</a>', '<a href="gallery.html">Gallery</a>\n      <a href="index.html#about">About</a>'),
            ('<a href="#about">About</a>', '<a href="gallery.html">Gallery</a>\n      <a href="#about">About</a>'),
            ('<a href="about.html">About</a>', '<a href="gallery.html">Gallery</a>\n      <a href="about.html">About</a>'),
            ('<a href="index.html#contact">Contact</a>', '<a href="gallery.html">Gallery</a>\n      <a href="index.html#contact">Contact</a>'),
            ('<a href="#contact">Contact</a>', '<a href="gallery.html">Gallery</a>\n      <a href="#contact">Contact</a>'),
            ('<a href="contact.html">Contact</a>', '<a href="gallery.html">Gallery</a>\n      <a href="contact.html">Contact</a>'),
        ]
        new = text
        for old, rep in patterns:
            if old in new:
                new = new.replace(old, rep, 1)
                break
        if new != text:
            path.write_text(new, encoding="utf-8")
            print("Updated nav:", path.name)
