import fs from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const inputPath = process.argv[2] || 'static/files/models/otto.glb';
const outputPath = process.argv[3] || 'static/files/models/otto.glb';

if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    async readAsArrayBuffer(blob) {
      this.result = await blob.arrayBuffer();
      if (this.onloadend) this.onloadend();
    }

    async readAsDataURL(blob) {
      const buffer = Buffer.from(await blob.arrayBuffer());
      this.result = `data:${blob.type || 'application/octet-stream'};base64,${buffer.toString('base64')}`;
      if (this.onloadend) this.onloadend();
    }
  };
}

const PARTS = [
  'head',
  'body',
  'body_no_hands',
  'screen',
  'left_leg',
  'right_leg',
  'left_foot',
  'right_foot',
  'left_hand',
  'right_hand',
];

const normalizeName = (name = '') => name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

function classifyName(name) {
  const normalized = normalizeName(name);
  if (normalized.includes('bodyarm') || normalized.includes('boot')) return 'body';
  if (
    normalized.startsWith('body_no_hands__')
    || normalized.includes('body_no_hands')
    || normalized.includes('body_noarms')
    || normalized.includes('bodynohands')
    || normalized.includes('body_2')
    || normalized.startsWith('body__body')
    || normalized === 'body'
  ) return 'body_no_hands';
  if (normalized.startsWith('body__')) return 'body';
  for (const part of PARTS) {
    if (normalized === part || normalized.startsWith(`${part}__`)) return part;
  }
  if (normalized.includes('lcd') || normalized.includes('screen') || normalized.includes('display')) return 'screen';
  if (normalized.includes('head')) return 'head';
  if (normalized.includes('leftfoot')) return 'left_foot';
  if (normalized.includes('rightfoot')) return 'right_foot';
  if (normalized.includes('leftleg')) return 'left_leg';
  if (normalized.includes('rightleg')) return 'right_leg';
  if (normalized.includes('leftarm') || normalized.includes('lefthand')) return 'left_hand';
  if (normalized.includes('rightarm') || normalized.includes('righthand')) return 'right_hand';
  if (normalized.includes('body')) return 'body';
  return null;
}

function uniqueMeshName(part, sourceName, counts) {
  const stem = normalizeName(sourceName).replace(/^_+|_+$/g, '') || 'part';
  const base = stem.startsWith(`${part}__`) ? stem : `${part}__${stem}`;
  counts[base] = (counts[base] || 0) + 1;
  return `${base}__${String(counts[base]).padStart(2, '0')}`;
}

function sourceKeyForName(name) {
  const normalized = normalizeName(name);
  return normalized
    .replace(/_\d+_\d+$/, '')
    .replace(/_\d+$/, '');
}

function sourceNameForMesh(mesh) {
  let current = mesh;
  while (current) {
    const normalized = normalizeName(current.name);
    if (normalized && !PARTS.includes(normalized)) return current.name;
    current = current.parent;
  }
  return mesh.name;
}

function cloneWorldGeometry(mesh) {
  let geometry = mesh.geometry.clone();
  if (geometry.index) geometry = geometry.toNonIndexed();

  Object.keys(geometry.attributes).forEach((attribute) => {
    if (attribute !== 'position' && attribute !== 'normal') geometry.deleteAttribute(attribute);
  });

  mesh.updateWorldMatrix(true, false);
  geometry.applyMatrix4(mesh.matrixWorld);
  if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function materialForPart(part) {
  return new THREE.MeshStandardMaterial({
    color: part === 'screen' ? 0x05070d : 0xf0f2f5,
    roughness: part === 'screen' ? 0.5 : 0.62,
    metalness: 0.03,
  });
}

function mergedMeshFromSource(source, name) {
  const geometries = source.meshes.map(cloneWorldGeometry);
  const geometry = geometries.length === 1 ? geometries[0] : mergeGeometries(geometries, false);
  if (!geometry) throw new Error(`Failed to merge source mesh ${name}`);
  if (geometries.length > 1) geometries.forEach((item) => item.dispose());
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  const clone = new THREE.Mesh(geometry, materialForPart(source.part));
  clone.name = name;
  clone.userData.part = source.part;
  return clone;
}

const input = fs.readFileSync(inputPath);
const arrayBuffer = input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength);
const gltf = await new Promise((resolve, reject) => new GLTFLoader().parse(arrayBuffer, '', resolve, reject));

const scene = new THREE.Scene();
scene.name = 'otto_grouped_parts';
const groups = Object.fromEntries(PARTS.map((part) => {
  const group = new THREE.Group();
  group.name = part;
  scene.add(group);
  return [part, group];
}));
const counts = {};
const sources = new Map();

gltf.scene.updateWorldMatrix(true, true);
gltf.scene.traverse((object) => {
  if (!object.isMesh || !object.geometry) return;
  const sourceName = sourceNameForMesh(object);
  const part = classifyName(sourceName) || classifyName(object.name);
  if (!part) {
    console.warn(`skipping unclassified mesh: ${object.name}`);
    return;
  }
  const sourceKey = `${part}:${sourceKeyForName(sourceName)}`;
  if (!sources.has(sourceKey)) sources.set(sourceKey, { part, sourceName, meshes: [] });
  sources.get(sourceKey).meshes.push(object);
});

for (const source of sources.values()) {
  const mesh = mergedMeshFromSource(source, uniqueMeshName(source.part, source.sourceName, counts));
  groups[source.part].add(mesh);
}

const requiredParts = PARTS.filter((part) => part !== 'body_no_hands');
const missing = requiredParts.filter((part) => groups[part].children.length === 0);
if (missing.length) {
  throw new Error(`Missing required part groups: ${missing.join(', ')}`);
}

const result = await new Promise((resolve, reject) => {
  new GLTFExporter().parse(
    scene,
    resolve,
    reject,
    {
      binary: true,
      forcePowerOfTwoTextures: false,
      includeCustomExtensions: false,
      trs: true,
    }
  );
});

fs.writeFileSync(outputPath, Buffer.from(result));
for (const part of PARTS) console.log(`${part}: ${groups[part].children.length} mesh(es)`);
console.log(`optimized ${inputPath} -> ${outputPath}`);
