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

const namedParts = {
  head: 'head',
  body: 'body',
  screen: 'screen',
  left_leg: 'left_leg',
  right_leg: 'right_leg',
  left_foot: 'left_foot',
  right_foot: 'right_foot',
  left_hand: 'left_hand',
  right_hand: 'right_hand',
};

const normalizeName = (name = '') => name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

function findNamedNodes(scene) {
  const found = {};
  scene.traverse((object) => {
    const part = namedParts[normalizeName(object.name)];
    if (part && !found[part]) found[part] = object;
  });
  return found;
}

function mergeNodeGeometry(node) {
  const geometries = [];
  node.updateWorldMatrix(true, true);

  node.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;
    let geometry = child.geometry.clone();
    if (geometry.index) geometry = geometry.toNonIndexed();

    Object.keys(geometry.attributes).forEach((name) => {
      if (name !== 'position' && name !== 'normal') geometry.deleteAttribute(name);
    });

    geometry.applyMatrix4(child.matrixWorld);
    if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
    geometries.push(geometry);
  });

  if (!geometries.length) return null;
  const merged = geometries.length === 1 ? geometries[0] : mergeGeometries(geometries, false);
  if (geometries.length > 1) geometries.forEach((geometry) => geometry.dispose());
  if (!merged) return null;
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  return merged;
}

const input = fs.readFileSync(inputPath);
const arrayBuffer = input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength);
const gltf = await new Promise((resolve, reject) => new GLTFLoader().parse(arrayBuffer, '', resolve, reject));
const nodes = findNamedNodes(gltf.scene);

const missing = Object.values(namedParts).filter((part) => !nodes[part]);
if (missing.length) {
  throw new Error(`Missing required part nodes: ${missing.join(', ')}`);
}

const scene = new THREE.Scene();
scene.name = 'otto_grouped';
const material = new THREE.MeshStandardMaterial({
  color: 0xf0f2f5,
  roughness: 0.62,
  metalness: 0.03,
});

for (const part of Object.values(namedParts)) {
  const geometry = mergeNodeGeometry(nodes[part]);
  if (!geometry) throw new Error(`No geometry found for ${part}`);
  const mesh = new THREE.Mesh(geometry, material.clone());
  mesh.name = part;
  scene.add(mesh);
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
      trs: false,
    }
  );
});

fs.writeFileSync(outputPath, Buffer.from(result));
console.log(`optimized ${inputPath} -> ${outputPath}`);
