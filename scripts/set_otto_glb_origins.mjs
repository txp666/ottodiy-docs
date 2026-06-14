import fs from 'node:fs';

const inputPath = process.argv[2] || 'static/files/models/otto.glb';
const outputPath = process.argv[3] || inputPath;

const PIVOTS = {
  head: [0, 0, 0],
  body: [0, 0, 0],
  body_no_hands: [0, 0, 0],
  screen: [0, 0, 0],
  left_leg: [0.0255, -0.04, 0],
  right_leg: [-0.0255, -0.04, 0],
  left_foot: [0.025560148, -0.071383223, 0.023999993],
  right_foot: [-0.025667563, -0.071516439, 0.024000015],
  left_hand: [0.050054643, -0.006888803, 0.024999999],
  right_hand: [-0.050259013, -0.006877573, 0.025000003],
};

const COMPONENT_FLOAT = 5126;
const ARRAY_BUFFER = 34962;
const GLB_MAGIC = 0x46546c67;
const JSON_CHUNK = 0x4e4f534a;
const BIN_CHUNK = 0x004e4942;

function align4(value) {
  return (value + 3) & ~3;
}

function readChunk(buffer, offset) {
  const length = buffer.readUInt32LE(offset);
  const type = buffer.readUInt32LE(offset + 4);
  return { length, type, start: offset + 8, end: offset + 8 + length };
}

function getAccessorView(json, accessorIndex) {
  const accessor = json.accessors[accessorIndex];
  if (accessor.componentType !== COMPONENT_FLOAT || accessor.type !== 'VEC3') {
    throw new Error(`Unsupported POSITION accessor ${accessorIndex}`);
  }
  const view = json.bufferViews[accessor.bufferView];
  if (view.target && view.target !== ARRAY_BUFFER) {
    throw new Error(`Unexpected POSITION buffer target ${view.target}`);
  }
  return {
    accessor,
    view,
    byteOffset: (view.byteOffset || 0) + (accessor.byteOffset || 0),
    stride: view.byteStride || 12,
  };
}

function collectMeshNodeIndexes(json, nodeIndex, collected = new Set()) {
  const node = json.nodes[nodeIndex];
  if (!node) return collected;
  if (node.mesh != null) collected.add(nodeIndex);
  for (const childIndex of node.children || []) collectMeshNodeIndexes(json, childIndex, collected);
  return collected;
}

function shiftMeshGeometry(json, bin, nodeIndex, pivot) {
  const node = json.nodes[nodeIndex];
  const mesh = json.meshes[node.mesh];
  if (!mesh) throw new Error(`Missing mesh for node ${node.name || nodeIndex}`);

  for (const primitive of mesh.primitives) {
    const accessorIndex = primitive.attributes.POSITION;
    const { accessor, byteOffset, stride } = getAccessorView(json, accessorIndex);

    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];

    for (let i = 0; i < accessor.count; i += 1) {
      const base = byteOffset + i * stride;
      for (let axis = 0; axis < 3; axis += 1) {
        const value = bin.readFloatLE(base + axis * 4) - pivot[axis];
        bin.writeFloatLE(value, base + axis * 4);
        if (value < min[axis]) min[axis] = value;
        if (value > max[axis]) max[axis] = value;
      }
    }

    accessor.min = min;
    accessor.max = max;
  }
}

const input = fs.readFileSync(inputPath);
if (input.readUInt32LE(0) !== GLB_MAGIC) throw new Error('Input is not a GLB file');

const jsonChunk = readChunk(input, 12);
if (jsonChunk.type !== JSON_CHUNK) throw new Error('Missing JSON chunk');
const binChunk = readChunk(input, jsonChunk.end);
if (binChunk.type !== BIN_CHUNK) throw new Error('Missing BIN chunk');

const jsonText = input.subarray(jsonChunk.start, jsonChunk.end).toString('utf8').trimEnd();
const json = JSON.parse(jsonText);
const bin = Buffer.from(input.subarray(binChunk.start, binChunk.end));

for (const [nodeIndex, node] of json.nodes.entries()) {
  const pivot = PIVOTS[node.name];
  if (!pivot) continue;

  node.translation = pivot;
  delete node.rotation;
  delete node.scale;

  const meshNodeIndexes = collectMeshNodeIndexes(json, nodeIndex);
  for (const meshNodeIndex of meshNodeIndexes) shiftMeshGeometry(json, bin, meshNodeIndex, pivot);

  console.log(`set origin ${nodeIndex}:${node.name} -> ${pivot.join(',')} (${meshNodeIndexes.size} mesh node(s))`);
}

const jsonOut = Buffer.from(JSON.stringify(json), 'utf8');
const jsonPaddedLength = align4(jsonOut.length);
const binPaddedLength = align4(bin.length);
const outputLength = 12 + 8 + jsonPaddedLength + 8 + binPaddedLength;
const output = Buffer.alloc(outputLength, 0);

output.writeUInt32LE(GLB_MAGIC, 0);
output.writeUInt32LE(2, 4);
output.writeUInt32LE(outputLength, 8);

output.writeUInt32LE(jsonPaddedLength, 12);
output.writeUInt32LE(JSON_CHUNK, 16);
jsonOut.copy(output, 20);
output.fill(0x20, 20 + jsonOut.length, 20 + jsonPaddedLength);

const binHeader = 20 + jsonPaddedLength;
output.writeUInt32LE(binPaddedLength, binHeader);
output.writeUInt32LE(BIN_CHUNK, binHeader + 4);
bin.copy(output, binHeader + 8);

fs.writeFileSync(outputPath, output);
