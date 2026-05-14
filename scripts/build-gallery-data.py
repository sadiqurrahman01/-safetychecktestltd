from pathlib import Path
import json, re
root = Path(__file__).resolve().parents[1]
folders = [
    ("assets/gallery/project-boards", "boards", "Project Board", "project", "after", "Project Board"),
    ("assets/gallery/kitchen-before", "works", "Kitchen Before", "kitchen", "before", "Before"),
    ("assets/gallery/kitchen-during", "works", "Kitchen During", "kitchen", "during", "During"),
    ("assets/gallery/kitchen-after", "works", "Finished Kitchen", "kitchen", "after", "After"),
    ("assets/gallery/exterior-before", "works", "Exterior Before", "exterior", "before", "Before"),
    ("assets/gallery/exterior-during", "works", "Exterior During", "exterior", "during", "During"),
    ("assets/gallery/exterior-after", "works", "Finished Exterior", "exterior", "after", "After"),
    ("assets/gallery/building-refurbishment", "works", "Building Refurbishment", "building", "after", "Building"),
    ("assets/gallery/trades", "trades", "Specialist Trades", "trades", "after", "Trades"),
]
exts={".jpg",".jpeg",".png",".webp",".gif"}
data={"boards":[],"works":[],"trades":[]}
def nice(stem):
    stem=re.sub(r"^\d+[-_ ]*", "", stem)
    stem=stem.replace("-"," ").replace("_"," ").strip()
    return stem.title() or "Project Photo"
for folder,key,prefix,category,stage,label in folders:
    p=root/folder
    p.mkdir(parents=True, exist_ok=True)
    for img in sorted([x for x in p.iterdir() if x.suffix.lower() in exts]):
        data[key].append({
            "src": str(img.relative_to(root)).replace('\\','/'),
            "title": nice(img.stem),
            "category": category,
            "stage": stage,
            "label": label,
            "description": prefix
        })
(root/"gallery-data.js").write_text("window.SCT_GALLERY = " + json.dumps(data, indent=2) + ";\n", encoding="utf-8")
print("Gallery updated:", root/"gallery-data.js")
print("Project boards:", len(data["boards"]))
print("Work photos:", len(data["works"]))
print("Trade photos:", len(data["trades"]))
