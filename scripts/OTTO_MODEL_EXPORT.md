# Otto GLB export workflow

This project uses the real STEP model and keeps every exported STEP part as its own GLB mesh.
Animated robot sections are represented as named parent nodes; each parent contains one or more
part meshes.

## Required output nodes

The final `static/files/models/otto.glb` must contain these top-level parent nodes:

- `head`
- `body`
- `body_no_hands`
- `screen`
- `left_leg`
- `right_leg`
- `left_foot`
- `right_foot`
- `left_hand`
- `right_hand`

The meshes below these nodes are intentionally not merged. For example, `left_hand` may contain
both the arm and grip as separate child meshes.

`body` is the version used when arm servos are enabled. In the current STEP this is the `bodyarm`
part, plus `boot`. `body_no_hands` is the body variant used when arm servos are disabled; in the
current STEP this is the plain `body` / `body (2)` part. The simulator switches both the visible
arms and the body variant from the "Arm servos" checkbox.

`screen` is a real mesh from the STEP file. The web simulator aligns a GIF expression overlay to this mesh, so do not merge it back into `body`.

## Default pivots

After FreeCAD export, run the origin script. It writes these mesh origins into the GLB:

```js
{
  head: [0, 0, 0],
  body: [0, 0, 0],
  body_no_hands: [0, 0, 0],
  screen: [0, 0, 0],
  left_leg: [0.0255, -0.04, 0],
  right_leg: [-0.0255, -0.04, 0],
  left_foot: [0.025560148, -0.071383223, 0.023999993],
  right_foot: [-0.025667563, -0.071516439, 0.024000015],
  left_hand: [0.050054643, -0.006888803, 0.024999999],
  right_hand: [-0.050259013, -0.006877573, 0.025000003]
}
```

These coordinates are in the current FreeCAD/GLB Y-up model space. The foot and hand pivots were
measured from the Blender-adjusted mesh origins in `static/files/models/otto.glb` on 2026-06-15.

## Export steps

Run from the repository root:

```bash
/Applications/FreeCAD.app/Contents/MacOS/FreeCAD scripts/freecad_export_otto_glb.py
node scripts/optimize_otto_glb.mjs static/files/models/otto.glb static/files/models/otto.glb
node scripts/set_otto_glb_origins.mjs static/files/models/otto.glb static/files/models/otto.glb
npm run build
```

The FreeCAD script imports `/Users/xiaopeng/Downloads/otto.step`, classifies each STEP object by
its label, saves `static/files/models/otto_grouped.FCStd`, and exports each classified object as an
individual GLB mesh. The Node optimize step then organizes those meshes under the required parent
nodes without merging them.

If FreeCAD remains open after export, confirm the log contains:

```text
exported GLB: /Volumes/D/Git/ottodiy-docs/static/files/models/otto.glb
```

Then the GLB can still be processed by the two Node scripts above.

## Verification

Check the final node/mesh list:

```bash
node -e "const fs=require('fs'); const b=fs.readFileSync('static/files/models/otto.glb'); const len=b.readUInt32LE(12); const json=JSON.parse(b.subarray(20,20+len).toString('utf8').trim()); json.nodes.forEach((n,i)=>console.log(i, n.name, n.mesh!==undefined?'mesh':'node', JSON.stringify(n.translation||[0,0,0])));"
```

Then open `http://127.0.0.1:3000/playground` and verify the canvas reports `data-otto-status="loaded"` and `data-otto-parts` includes all required part names.
