# Otto GLB export workflow

This project uses the real STEP model and keeps each animated part as a named GLB mesh.

## Required output meshes

The final `static/files/models/otto.glb` must contain these top-level meshes:

- `head`
- `body`
- `screen`
- `left_leg`
- `right_leg`
- `left_foot`
- `right_foot`
- `left_hand`
- `right_hand`

`screen` is a real mesh from the STEP file. The web simulator aligns a GIF expression overlay to this mesh, so do not merge it back into `body`.

## Default pivots

After FreeCAD export, run the origin script. It writes these mesh origins into the GLB:

```js
{
  head: [0, 0, 0],
  body: [0, 0, 0],
  screen: [0, 0, 0],
  left_leg: [0.0255, -0.04, 0],
  right_leg: [-0.0255, -0.04, 0],
  left_foot: [0.036, -0.065, 0],
  right_foot: [-0.036, -0.065, 0],
  left_hand: [0.054, -0.013, -0.004],
  right_hand: [-0.054, -0.013, -0.004]
}
```

These coordinates are in the current FreeCAD/GLB Y-up model space.

## Export steps

Run from the repository root:

```bash
/Applications/FreeCAD.app/Contents/MacOS/FreeCAD scripts/freecad_export_otto_glb.py
node scripts/optimize_otto_glb.mjs static/files/models/otto.glb static/files/models/otto.glb
node scripts/set_otto_glb_origins.mjs static/files/models/otto.glb static/files/models/otto.glb
npm run build
```

The FreeCAD script imports `/Users/xiaopeng/Downloads/otto.step`, groups the STEP objects by their labels, saves `static/files/models/otto_grouped.FCStd`, and exports `static/files/models/otto.glb`.

If FreeCAD remains open after export, confirm the log contains:

```text
exported GLB: /Volumes/D/Git/ottodiy-docs/static/files/models/otto.glb
```

Then the GLB can still be processed by the two Node scripts above.

## Verification

Check the final mesh list:

```bash
node -e "const fs=require('fs'); const b=fs.readFileSync('static/files/models/otto.glb'); const len=b.readUInt32LE(12); const json=JSON.parse(b.subarray(20,20+len).toString('utf8').trim()); json.nodes.forEach((n,i)=>{if(n.mesh!==undefined) console.log(i, n.name, JSON.stringify(n.translation||[0,0,0]));});"
```

Then open `http://127.0.0.1:3000/playground` and verify the canvas reports `data-otto-status="loaded"` and `data-otto-parts` includes all required part names.
