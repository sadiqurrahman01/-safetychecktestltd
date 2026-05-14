from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
gallery = root / "assets" / "gallery"
out = gallery / "gallery-data.js"

image_exts = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

groups = {
    "fence": {
        "folders": ["exterior-after"],
        "title": "Fence Replacement",
        "tag": "After",
        "caption": "New timber fence and improved external boundary."
    },
    "gardenBefore": {
        "folders": ["exterior-before"],
        "title": "Garden Before Works",
        "tag": "Before",
        "caption": "Original rear garden condition before improvement works."
    },
    "patioPrep": {
        "folders": ["exterior-during"],
        "title": "Patio Preparation",
        "tag": "During",
        "caption": "Preparation, sub-base, membrane and slab laying works."
    },
    "concrete": {
        "folders": ["exterior-after"],
        "title": "Patio & Side Access",
        "tag": "After",
        "caption": "Finished patio, concrete and side access works."
    },
    "kitchenRepair": {
        "folders": ["kitchen-before", "kitchen-during"],
        "title": "Kitchen Repair & Preparation",
        "tag": "During",
        "caption": "Backsplash, unit, ceiling, tiling and preparation works."
    },
    "kitchenAfter": {
        "folders": ["kitchen-after"],
        "title": "Finished Kitchen",
        "tag": "After",
        "caption": "Modern finished kitchen with clean tiling, worktops and units."
    },
    "trades": {
        "folders": [
            "trades/electrician",
            "trades/plumber",
            "trades/gas-engineer",
            "trades/pat-testing",
            "trades/painter-decorator",
            "trades/builder",
            "trades"
        ],
        "title": "Real Multi-Trade Team",
        "tag": "Trades",
        "caption": "Real Safety Check Test team and work photos only."
    }
}

def files_for(folder):
    base = gallery / folder
    if not base.exists():
        return []
    return sorted(
        p for p in base.rglob("*")
        if p.is_file() and p.suffix.lower() in image_exts
    )

data = {}
seen = set()

for key, config in groups.items():
    items = []
    for folder in config["folders"]:
        for path in files_for(folder):
            rel = path.relative_to(root).as_posix()
            if rel in seen and key not in ("concrete",):
                continue
            seen.add(rel)

            name = path.stem.replace("-", " ").replace("_", " ").strip().title()
            title = name if name else config["title"]
            items.append({
                "src": rel,
                "title": title,
                "tag": config["tag"],
                "caption": config["caption"],
                "alt": f"Safety Check Test Ltd - {title}"
            })
    data[key] = items

out.write_text(
    "window.SCT_GALLERY_DATA = " + json.dumps(data, indent=2) + ";\n",
    encoding="utf-8"
)

print(f"Gallery data created: {out}")
for key, items in data.items():
    print(f"{key}: {len(items)} images")
