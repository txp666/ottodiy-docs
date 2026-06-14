import os
import re

import FreeCAD
import Import
import Part

try:
    import ImportGui
except Exception:
    ImportGui = None


SOURCE = "/Users/xiaopeng/Downloads/otto.step"
OUT_DIR = "/Volumes/D/Git/ottodiy-docs/static/files/models"
OUT_FCSTD = os.path.join(OUT_DIR, "otto_grouped.FCStd")
OUT_GLB = os.path.join(OUT_DIR, "otto.glb")
LOG_FILE = "/Volumes/D/Git/ottodiy-docs/static/files/models/freecad_export_otto_glb.log"

GROUPS = (
    "head",
    "body",
    "screen",
    "left_leg",
    "right_leg",
    "left_foot",
    "right_foot",
    "left_hand",
    "right_hand",
)


def log(message):
    with open(LOG_FILE, "a", encoding="utf-8") as fh:
        fh.write(f"{message}\n")
        fh.flush()
    try:
        FreeCAD.Console.PrintMessage(f"{message}\n")
    except Exception:
        pass


def normalize_name(value):
    return re.sub(r"[^a-z0-9]+", "", (value or "").lower())


def classify_by_name(obj):
    key = normalize_name(f"{getattr(obj, 'Label', '')} {getattr(obj, 'Name', '')}")

    if "head" in key:
        return "head"
    if any(token in key for token in ("screen", "lcd", "display")):
        return "screen"
    if any(token in key for token in ("sw1", "body")):
        return "body"
    if "leftfoot" in key:
        return "left_foot"
    if "rightfoot" in key:
        return "right_foot"
    if "leftleg" in key:
        return "left_leg"
    if "rightleg" in key:
        return "right_leg"
    if "leftarm" in key or "lefthand" in key:
        return "left_hand"
    if "rightarm" in key or "righthand" in key:
        return "right_hand"
    return None


def collect_shapes(obj, buckets):
    shape = getattr(obj, "Shape", None)
    if not shape or shape.isNull():
        return
    named_group = classify_by_name(obj)
    log(
        "source "
        f"name={obj.Name} label={obj.Label} type={getattr(obj, 'TypeId', '')} "
        f"shape={shape.ShapeType} named_group={named_group or '-'} "
        f"subshapes={len(getattr(shape, 'SubShapes', []) or [])}"
    )
    if not named_group:
        return
    buckets[named_group].append(shape.copy())


def main():
    with open(LOG_FILE, "w", encoding="utf-8") as fh:
        fh.write("start\n")
    if not os.path.exists(SOURCE):
        raise FileNotFoundError(SOURCE)
    os.makedirs(OUT_DIR, exist_ok=True)

    log(f"opening STEP: {SOURCE}")
    doc = FreeCAD.newDocument("otto_grouped")
    Import.insert(SOURCE, doc.Name)
    doc.recompute()
    log(f"imported objects: {len(doc.Objects)}")

    buckets = {name: [] for name in GROUPS}
    for obj in list(doc.Objects):
        collect_shapes(obj, buckets)
    log("bucket counts: " + ", ".join(f"{k}={len(v)}" for k, v in buckets.items()))

    grouped = []
    for name in GROUPS:
        if not buckets[name]:
            FreeCAD.Console.PrintWarning(f"No shapes classified for {name}\n")
            continue
        feature = doc.addObject("Part::Feature", name)
        feature.Label = name
        feature.Shape = Part.makeCompound(buckets[name])
        try:
            feature.ViewObject.ShapeColor = (0.88, 0.89, 0.9, 1.0)
            feature.ViewObject.DisplayMode = "Shaded"
        except Exception:
            pass
        grouped.append(feature)
        log(f"grouped {name}: {len(buckets[name])} solids")

    for obj in list(doc.Objects):
        if obj not in grouped:
            try:
                doc.removeObject(obj.Name)
            except Exception:
                pass

    doc.recompute()
    log(f"saving FCStd: {OUT_FCSTD}")
    doc.saveAs(OUT_FCSTD)
    log("saved FCStd")

    if ImportGui is None:
        raise RuntimeError("ImportGui is not available; cannot export GLB from this FreeCAD session.")
    log(f"exporting GLB: {OUT_GLB}")
    ImportGui.export(grouped, OUT_GLB)
    log(f"exported GLB: {OUT_GLB}")
    try:
        import sys
        sys.exit(0)
    except Exception:
        pass


try:
    main()
except Exception as exc:
    log(f"ERROR: {type(exc).__name__}: {exc}")
    raise
