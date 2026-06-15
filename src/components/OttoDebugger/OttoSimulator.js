import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const MODEL_URL = '/files/models/otto.glb';
const DEFAULT_FACE_TEXTURE_URL = '/files/gifs/staticstate.gif';
const DEFAULT_COLORS = {
  head: '#f0f2f5',
  body: '#f0f2f5',
  leftLeg: '#dfe5ee',
  rightLeg: '#dfe5ee',
  leftFoot: '#dfe5ee',
  rightFoot: '#dfe5ee',
  leftArm: '#dfe5ee',
  rightArm: '#dfe5ee',
  background: '#16203a',
};

const HOME = { ll: 90, rl: 90, lf: 90, rf: 90, lh: 45, rh: 135 };
const FACE_DOM_SIZE = 240;
const lerp = (a, b, t) => a + (b - a) * t;
const deg = (v) => THREE.MathUtils.degToRad(v);

const PARTS = ['head', 'body', 'body_no_hands', 'screen', 'leftLeg', 'rightLeg', 'leftFoot', 'rightFoot', 'leftArm', 'rightArm'];
const REQUIRED_NAMED_PARTS = ['head', 'body', 'screen', 'leftLeg', 'rightLeg', 'leftFoot', 'rightFoot', 'leftArm', 'rightArm'];
const NAMED_PARTS = {
  head: 'head',
  body: 'body',
  body_no_hands: 'body_no_hands',
  screen: 'screen',
  left_leg: 'leftLeg',
  right_leg: 'rightLeg',
  left_foot: 'leftFoot',
  right_foot: 'rightFoot',
  left_hand: 'leftArm',
  right_hand: 'rightArm',
};

const MATERIAL_PARAMS = {
  body: new THREE.MeshStandardMaterial({
    color: 0xf0f2f5,
    roughness: 0.62,
    metalness: 0.03,
  }),
  limb: new THREE.MeshStandardMaterial({
    color: 0xdfe5ee,
    roughness: 0.68,
    metalness: 0.02,
  }),
  screen: new THREE.MeshBasicMaterial({
    color: 0x05070d,
    toneMapped: false,
  }),
};

function createMaterial(part) {
  if (part === 'screen') return MATERIAL_PARAMS.screen.clone();
  return (part === 'body' || part === 'body_no_hands' || part === 'head' ? MATERIAL_PARAMS.body : MATERIAL_PARAMS.limb).clone();
}

function normalizeColors(colors = {}) {
  return { ...DEFAULT_COLORS, ...colors };
}

function applyVisualSettings(root, scene, colors = {}) {
  const resolved = normalizeColors(colors);
  scene.background = new THREE.Color(resolved.background);
  root.traverse((object) => {
    if (!object.isMesh || !object.userData.part || !object.material) return;
    const color = resolved[object.userData.colorPart || object.userData.part];
    if (color && object.material.color) object.material.color.set(color);
  });
}

function updateExpressionSource(image, faceTextureUrl) {
  if (!image || !faceTextureUrl || image.dataset.ottoSrc === faceTextureUrl) return;
  image.dataset.ottoSrc = faceTextureUrl;
  image.src = faceTextureUrl;
}

function createFaceOverlay(wrap, faceTextureUrl = DEFAULT_FACE_TEXTURE_URL) {
  if (typeof document === 'undefined') return null;

  const image = document.createElement('img');
  image.alt = '';
  image.dataset.ottoFace = 'overlay';
  image.dataset.ottoSrc = faceTextureUrl;
  image.src = faceTextureUrl;
  image.style.position = 'absolute';
  image.style.left = '0';
  image.style.top = '0';
  image.style.width = `${FACE_DOM_SIZE}px`;
  image.style.height = `${FACE_DOM_SIZE}px`;
  image.style.opacity = '0';
  image.style.objectFit = 'fill';
  image.style.pointerEvents = 'none';
  image.style.transformOrigin = '0 0';
  image.style.zIndex = '2';
  image.style.willChange = 'transform, opacity';
  wrap.appendChild(image);
  return image;
}

function quadMatrix3d([p0, p1, p2, p3], width = 1, height = 1) {
  const dx1 = p1.x - p2.x;
  const dy1 = p1.y - p2.y;
  const dx2 = p3.x - p2.x;
  const dy2 = p3.y - p2.y;
  const dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy3 = p0.y - p1.y + p2.y - p3.y;
  let a;
  let b;
  let c;
  let d;
  let e;
  let f;
  let g;
  let h;

  if (Math.abs(dx3) < 1e-6 && Math.abs(dy3) < 1e-6) {
    a = p1.x - p0.x;
    b = p1.y - p0.y;
    c = p3.x - p0.x;
    d = p3.y - p0.y;
    e = p0.x;
    f = p0.y;
    g = 0;
    h = 0;
  } else {
    const det = dx1 * dy2 - dx2 * dy1;
    if (Math.abs(det) < 1e-6) return null;
    g = (dx3 * dy2 - dx2 * dy3) / det;
    h = (dx1 * dy3 - dx3 * dy1) / det;
    a = p1.x - p0.x + g * p1.x;
    b = p1.y - p0.y + g * p1.y;
    c = p3.x - p0.x + h * p3.x;
    d = p3.y - p0.y + h * p3.y;
    e = p0.x;
    f = p0.y;
  }

  return `matrix3d(${[
    a / width, b / width, 0, g / width,
    c / height, d / height, 0, h / height,
    0, 0, 1, 0,
    e, f, 0, 1,
  ].map((value) => Number(value.toFixed(6))).join(',')})`;
}

function updateFaceOverlay(image, screenMesh, camera, renderer) {
  if (!image || !screenMesh || !screenMesh.geometry || !screenMesh.geometry.boundingBox) return;

  screenMesh.updateWorldMatrix(true, false);
  const box = screenMesh.geometry.boundingBox;
  const insetX = (box.max.x - box.min.x) * 0.02;
  const insetY = (box.max.y - box.min.y) * 0.02;
  const z = box.max.z + 0.0008;
  const screenCenter = new THREE.Vector3(
    (box.min.x + box.max.x) / 2,
    (box.min.y + box.max.y) / 2,
    z
  );
  const screenNormal = new THREE.Vector3(0, 0, 1).transformDirection(screenMesh.matrixWorld);
  const toCamera = camera.position.clone().sub(screenMesh.localToWorld(screenCenter.clone())).normalize();
  if (screenNormal.dot(toCamera) <= -0.03) {
    image.style.opacity = '0';
    return;
  }

  const localPoints = [
    new THREE.Vector3(box.min.x + insetX, box.max.y - insetY, z),
    new THREE.Vector3(box.max.x - insetX, box.max.y - insetY, z),
    new THREE.Vector3(box.max.x - insetX, box.min.y + insetY, z),
    new THREE.Vector3(box.min.x + insetX, box.min.y + insetY, z),
  ];
  const canvas = renderer.domElement;
  const projected = localPoints.map((point) => {
    const ndc = screenMesh.localToWorld(point).project(camera);
    return {
      x: ((ndc.x + 1) / 2) * canvas.clientWidth,
      y: ((1 - ndc.y) / 2) * canvas.clientHeight,
      z: ndc.z,
    };
  });

  if (projected.some((point) => point.z < -1 || point.z > 1)) {
    image.style.opacity = '0';
    return;
  }

  const matrix = quadMatrix3d(projected, FACE_DOM_SIZE, FACE_DOM_SIZE);
  if (!matrix) {
    image.style.opacity = '0';
    return;
  }

  image.style.transform = matrix;
  image.style.opacity = '1';
}

const PIVOTS_Z_UP = {
  leftLeg: new THREE.Vector3(-25, 0, -40),
  rightLeg: new THREE.Vector3(25, 0, -40),
  leftFoot: new THREE.Vector3(-36, 0, -65),
  rightFoot: new THREE.Vector3(36, 0, -65),
  leftArm: new THREE.Vector3(-54, -4, -13),
  rightArm: new THREE.Vector3(54, -4, -13),
};

const PIVOTS_Y_UP = {
  leftLeg: new THREE.Vector3(25.5, -40, 0),
  rightLeg: new THREE.Vector3(-25.5, -40, 0),
  leftFoot: new THREE.Vector3(36, -65, 0),
  rightFoot: new THREE.Vector3(-36, -65, 0),
  leftArm: new THREE.Vector3(54, -13, -4),
  rightArm: new THREE.Vector3(-54, -13, -4),
};

const normalizeName = (name = '') => name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

function getPose(anim) {
  if (!anim.dur) {
    anim.cur = { ...anim.to };
    return anim.cur;
  }
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const t = Math.min(1, Math.max(0, (now - anim.start) / anim.dur));
  const eased = t * t * (3 - 2 * t);
  anim.cur = {
    ll: lerp(anim.from.ll, anim.to.ll, eased),
    rl: lerp(anim.from.rl, anim.to.rl, eased),
    lf: lerp(anim.from.lf, anim.to.lf, eased),
    rf: lerp(anim.from.rf, anim.to.rf, eased),
    lh: lerp(anim.from.lh, anim.to.lh, eased),
    rh: lerp(anim.from.rh, anim.to.rh, eased),
  };
  return anim.cur;
}

function classifyPart(v) {
  const side = v.x < 0 ? 'left' : 'right';
  if (v.z < -66 && Math.abs(v.x) > 12) return `${side}Foot`;
  if (v.z < -39 && Math.abs(v.x) > 8 && Math.abs(v.x) < 44) return `${side}Leg`;
  if (Math.abs(v.x) > 38 && v.z > -62) return `${side}Arm`;
  return 'body';
}

function splitModelByServoParts(model) {
  const buckets = PARTS.reduce((acc, part) => {
    acc[part] = { positions: [], normals: [] };
    return acc;
  }, {});
  const bounds = new THREE.Box3();
  let triangleCount = 0;

  model.updateWorldMatrix(true, true);
  model.traverse((mesh) => {
    if (!mesh.isMesh || !mesh.geometry) return;

    const geometry = mesh.geometry;
    const posAttr = geometry.getAttribute('position');
    const normalAttr = geometry.getAttribute('normal');
    if (!posAttr) return;

    const index = geometry.index;
    const src = {
      position: posAttr.array,
      normal: normalAttr && normalAttr.array,
    };
    const matrix = mesh.matrixWorld;
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix);
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const n = new THREE.Vector3();
    const centroid = new THREE.Vector3();

    const read = (vertexIndex, target) => {
      const p = vertexIndex * 3;
      target.set(src.position[p], src.position[p + 1], src.position[p + 2]).applyMatrix4(matrix);
      bounds.expandByPoint(target);
    };

    const writeTriangle = (i0, i1, i2) => {
      read(i0, a);
      read(i1, b);
      read(i2, c);
      centroid.copy(a).add(b).add(c).multiplyScalar(1 / 3);
      const part = classifyPart(centroid);
      const dst = buckets[part];
      [a, b, c].forEach((v) => dst.positions.push(v.x, v.y, v.z));
      if (src.normal) {
        [i0, i1, i2].forEach((i) => {
          const p = i * 3;
          n.set(src.normal[p], src.normal[p + 1], src.normal[p + 2]).applyMatrix3(normalMatrix).normalize();
          dst.normals.push(n.x, n.y, n.z);
        });
      }
      triangleCount += 1;
    };

    if (index) {
      for (let i = 0; i < index.count; i += 3) {
        writeTriangle(index.getX(i), index.getX(i + 1), index.getX(i + 2));
      }
    } else {
      for (let i = 0; i < posAttr.count; i += 3) writeTriangle(i, i + 1, i + 2);
    }
  });

  const meshes = {};
  PARTS.forEach((part) => {
    const bucket = buckets[part];
    if (!bucket.positions.length) return;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(bucket.positions, 3));
    if (bucket.normals.length === bucket.positions.length) {
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(bucket.normals, 3));
    } else {
      geometry.computeVertexNormals();
    }
    geometry.computeBoundingBox();
    meshes[part] = new THREE.Mesh(geometry, createMaterial(part));
    meshes[part].userData.part = part;
    meshes[part].castShadow = true;
    meshes[part].receiveShadow = true;
  });

  return { bounds, meshes, triangleCount };
}

function addPivot(parent, mesh, pivot) {
  const group = new THREE.Group();
  const parentPivot = parent.userData && parent.userData.sourcePivot;
  group.position.copy(parentPivot ? pivot.clone().sub(parentPivot) : pivot);
  group.userData.sourcePivot = pivot.clone();
  mesh.position.copy(pivot).multiplyScalar(-1);
  group.add(mesh);
  parent.add(group);
  return group;
}

function countTriangles(mesh) {
  let total = 0;
  mesh.traverse((object) => {
    const geometry = object.geometry;
    if (!object.isMesh || !geometry) return;
    total += geometry.index ? geometry.index.count / 3 : geometry.getAttribute('position').count / 3;
  });
  return total;
}

function makePartObject(node, part) {
  node.updateWorldMatrix(true, true);
  const group = new THREE.Group();
  group.name = part;
  const colorPart = part === 'body_no_hands' ? 'body' : part;
  let meshIndex = 0;

  node.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;
    let geometry = child.geometry.clone();
    if (geometry.index) geometry = geometry.toNonIndexed();

    Object.keys(geometry.attributes).forEach((name) => {
      if (name !== 'position' && name !== 'normal') geometry.deleteAttribute(name);
    });

    geometry.applyMatrix4(child.matrixWorld);
    if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    const mesh = new THREE.Mesh(geometry, createMaterial(part));
    mesh.name = child.name || `${part}_${meshIndex + 1}`;
    mesh.userData.part = part;
    mesh.userData.colorPart = colorPart;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    meshIndex += 1;
  });

  return meshIndex ? group : null;
}

function findFirstMesh(object) {
  let found = null;
  object.traverse((child) => {
    if (!found && child.isMesh) found = child;
  });
  return found;
}

function buildNamedArticulatedOtto(model) {
  const namedNodes = {};

  model.updateWorldMatrix(true, true);
  model.traverse((object) => {
    const part = NAMED_PARTS[normalizeName(object.name)];
    if (part && !namedNodes[part]) namedNodes[part] = object;
  });

  if (!REQUIRED_NAMED_PARTS.every((part) => namedNodes[part])) return null;

  const meshes = {};
  const bounds = new THREE.Box3();
  let triangleCount = 0;

  PARTS.forEach((part) => {
    if (!namedNodes[part]) return;
    const mesh = makePartObject(namedNodes[part], part);
    if (!mesh) return;
    meshes[part] = mesh;
    bounds.expandByObject(mesh);
    triangleCount += countTriangles(mesh);
  });

  if (!REQUIRED_NAMED_PARTS.every((part) => meshes[part])) return null;

  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const unitScale = Math.max(size.x, size.y, size.z) < 10 ? 0.001 : 1;
  const screenMesh = findFirstMesh(meshes.screen);
  if (!screenMesh) return null;
  const screenBounds = screenMesh.geometry.boundingBox.clone();
  const pivots = {};
  ['leftLeg', 'rightLeg', 'leftFoot', 'rightFoot', 'leftArm', 'rightArm'].forEach((part) => {
    const origin = namedNodes[part].getWorldPosition(new THREE.Vector3());
    pivots[part] = origin.lengthSq() > 1e-12 ? origin : PIVOTS_Y_UP[part].clone().multiplyScalar(unitScale);
  });
  const rig = new THREE.Group();
  const joints = {};

  if (meshes.head) rig.add(meshes.head);
  if (meshes.body) rig.add(meshes.body);
  if (meshes.body_no_hands) rig.add(meshes.body_no_hands);
  if (meshes.screen) rig.add(meshes.screen);
  joints.leftLeg = addPivot(rig, meshes.leftLeg, pivots.leftLeg);
  joints.rightLeg = addPivot(rig, meshes.rightLeg, pivots.rightLeg);
  joints.leftFoot = addPivot(joints.leftLeg, meshes.leftFoot, pivots.leftFoot);
  joints.rightFoot = addPivot(joints.rightLeg, meshes.rightFoot, pivots.rightFoot);
  joints.leftArm = addPivot(rig, meshes.leftArm, pivots.leftArm);
  joints.rightArm = addPivot(rig, meshes.rightArm, pivots.rightArm);
  joints.body = meshes.body;
  joints.bodyNoHands = meshes.body_no_hands;

  rig.position.sub(center);
  return {
    rig,
    joints,
    center,
    size,
    partTriangles: PARTS.reduce((acc, part) => {
      acc[part] = meshes[part] ? countTriangles(meshes[part]) : 0;
      return acc;
    }, {}),
    triangleCount,
    coordinateSystem: 'y-up',
    rootRotation: new THREE.Euler(0, 0, 0),
    source: 'named-glb',
    pivots,
    screenBounds,
    screenMesh,
  };
}

function buildSplitArticulatedOtto(model) {
  const { bounds, meshes, triangleCount } = splitModelByServoParts(model);
  const center = bounds.getCenter(new THREE.Vector3());
  const rig = new THREE.Group();
  const joints = {};

  if (meshes.body) rig.add(meshes.body);
  joints.leftLeg = meshes.leftLeg && addPivot(rig, meshes.leftLeg, PIVOTS_Z_UP.leftLeg);
  joints.rightLeg = meshes.rightLeg && addPivot(rig, meshes.rightLeg, PIVOTS_Z_UP.rightLeg);
  joints.leftFoot = meshes.leftFoot && addPivot(joints.leftLeg || rig, meshes.leftFoot, PIVOTS_Z_UP.leftFoot);
  joints.rightFoot = meshes.rightFoot && addPivot(joints.rightLeg || rig, meshes.rightFoot, PIVOTS_Z_UP.rightFoot);
  joints.leftArm = meshes.leftArm && addPivot(rig, meshes.leftArm, PIVOTS_Z_UP.leftArm);
  joints.rightArm = meshes.rightArm && addPivot(rig, meshes.rightArm, PIVOTS_Z_UP.rightArm);

  rig.position.sub(center);
  return {
    rig,
    joints,
    center,
    size: bounds.getSize(new THREE.Vector3()),
    partTriangles: PARTS.reduce((acc, part) => {
      acc[part] = meshes[part] ? countTriangles(meshes[part]) : 0;
      return acc;
    }, {}),
    triangleCount,
    coordinateSystem: 'z-up',
    rootRotation: new THREE.Euler(-Math.PI / 2, 0, 0),
    source: 'spatial-fallback',
  };
}

function buildArticulatedOtto(model) {
  return buildNamedArticulatedOtto(model) || buildSplitArticulatedOtto(model);
}

function disposeSourceScene(model) {
  model.traverse((object) => {
    if (!object.isMesh) return;
    if (object.geometry) object.geometry.dispose();
    if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
    else if (object.material) object.material.dispose();
  });
}

function applyPose(joints, pose, hasHands, coordinateSystem = 'z-up') {
  const isYUp = coordinateSystem === 'y-up';
  const blenderZAxis = isYUp ? 'y' : 'z';
  if (joints.body) joints.body.visible = hasHands || !joints.bodyNoHands;
  if (joints.bodyNoHands) joints.bodyNoHands.visible = !hasHands;
  if (joints.leftLeg) joints.leftLeg.rotation[blenderZAxis] = deg((90 - pose.ll) * 0.45);
  if (joints.rightLeg) joints.rightLeg.rotation[blenderZAxis] = deg((90 - pose.rl) * 0.45);
  if (joints.leftFoot) joints.leftFoot.rotation[isYUp ? 'z' : 'y'] = deg((90 - pose.lf) * 0.7);
  if (joints.rightFoot) joints.rightFoot.rotation[isYUp ? 'z' : 'y'] = deg((90 - pose.rf) * 0.7);
  if (joints.leftArm) {
    joints.leftArm.visible = hasHands;
    joints.leftArm.rotation[isYUp ? 'z' : 'y'] = deg((pose.lh - HOME.lh) * 0.9);
  }
  if (joints.rightArm) {
    joints.rightArm.visible = hasHands;
    joints.rightArm.rotation[isYUp ? 'z' : 'y'] = deg((pose.rh - HOME.rh) * 0.9);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getGravityTargets(pose, enabled) {
  if (!enabled) return { lift: 0, roll: 0, pitch: 0, support: 'none' };

  const leftFoot = pose.lf - 90;
  const rightFoot = pose.rf - 90;
  const leftLeg = pose.ll - 90;
  const rightLeg = pose.rl - 90;
  const footSpread = Math.abs(leftFoot) + Math.abs(rightFoot);
  const leftFootLift = clamp(leftFoot / 70, -1, 1);
  const rightFootLift = clamp(-rightFoot / 70, -1, 1);
  const leftHandSupport = clamp((85 - pose.lh) / 55, 0, 1);
  const rightHandSupport = clamp((pose.rh - 95) / 55, 0, 1);
  const fallSide = clamp((leftFootLift - rightFootLift) * 0.9 + (leftLeg - rightLeg) / 130, -1, 1);
  const supportingHand = fallSide > 0 ? leftHandSupport : rightHandSupport;
  const supported = Math.abs(fallSide) > 0.16 && supportingHand > 0.35;
  const maxRoll = supported ? 15 : 24;
  const rollDeg = clamp(fallSide * 20 + (leftFoot - rightFoot) * 0.028 + (leftLeg - rightLeg) * 0.018, -maxRoll, maxRoll);
  const supportCompression = supported ? supportingHand * Math.min(0.06, Math.abs(fallSide) * 0.045) : 0;

  return {
    lift: clamp(Math.abs(leftFoot - rightFoot) * 0.0008 - footSpread * 0.00055 - supportCompression, -0.12, 0.16),
    roll: deg(rollDeg),
    pitch: deg(clamp((leftLeg + rightLeg) * 0.02 + (leftFoot + rightFoot) * 0.018, -6, 6)),
    support: supported ? (fallSide > 0 ? 'leftHand' : 'rightHand') : 'none',
  };
}

function updateGravityGroup(group, state, pose, enabled) {
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const dt = Math.min(0.05, Math.max(0.001, (now - state.last) / 1000 || 0.016));
  state.last = now;

  const target = getGravityTargets(pose, enabled);
  const spring = enabled ? 22 : 28;
  const damping = enabled ? 8.5 : 10;
  state.vLift += (target.lift - state.lift) * spring * dt;
  state.vLift *= Math.exp(-damping * dt);
  state.lift += state.vLift;

  const ease = 1 - Math.exp(-(enabled ? 10 : 14) * dt);
  state.roll = lerp(state.roll, target.roll, ease);
  state.pitch = lerp(state.pitch, target.pitch, ease);

  group.position.y = state.lift;
  group.rotation.x = state.pitch;
  group.rotation.z = state.roll;
  return target;
}

export default function OttoSimulator({
  pose,
  hasHands = true,
  transitionMs = 0,
  blink = true,
  colors = DEFAULT_COLORS,
  faceTextureUrl = DEFAULT_FACE_TEXTURE_URL,
  gravityEnabled = false,
  motion = null,
}) {
  const wrapRef = useRef(null);
  const animRef = useRef({ from: { ...HOME }, to: { ...HOME }, start: 0, dur: 0, cur: { ...HOME } });
  const handsRef = useRef(hasHands);
  const colorsRef = useRef(normalizeColors(colors));
  const faceTextureUrlRef = useRef(faceTextureUrl);
  const gravityEnabledRef = useRef(gravityEnabled);
  const motionRef = useRef(motion || { yaw: 0, active: false });

  useEffect(() => {
    const a = animRef.current;
    a.from = { ...a.cur };
    a.to = { ...(pose || HOME) };
    a.start = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    a.dur = Math.max(0, transitionMs);
  }, [pose, transitionMs]);

  useEffect(() => {
    handsRef.current = hasHands;
  }, [hasHands]);

  useEffect(() => {
    colorsRef.current = normalizeColors(colors);
  }, [colors]);

  useEffect(() => {
    faceTextureUrlRef.current = faceTextureUrl || DEFAULT_FACE_TEXTURE_URL;
  }, [faceTextureUrl]);

  useEffect(() => {
    gravityEnabledRef.current = gravityEnabled;
  }, [gravityEnabled]);

  useEffect(() => {
    motionRef.current = motion || { yaw: 0, active: false };
  }, [motion]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let W = wrap.clientWidth || 300;
    let H = wrap.clientHeight || 280;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    wrap.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.dataset.ottoStatus = 'booting';

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 2000);

    // 灯光
    scene.add(new THREE.HemisphereLight(0xffffff, 0x3a4a66, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(4, 8, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xbfd4ff, 0.6);
    fill.position.set(-5, 2, -3);
    scene.add(fill);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1;
    controls.maxDistance = 100;

    const gravityGroup = new THREE.Group();
    scene.add(gravityGroup);
    const root = new THREE.Group();
    gravityGroup.add(root);
    let joints = null;
    let coordinateSystem = 'z-up';
    let ground = null;
    let screenMesh = null;
    const gravityState = { lift: 0, vLift: 0, roll: 0, pitch: 0, last: typeof performance !== 'undefined' ? performance.now() : Date.now() };
    const expressionImage = createFaceOverlay(wrap, faceTextureUrlRef.current);

    const loader = new GLTFLoader();
    const abort = new AbortController();
    const loadModel = async () => {
      try {
        window.__ottoDbg = { loaded: false, loading: true, url: MODEL_URL };
        renderer.domElement.dataset.ottoStatus = 'loading';
        const timeout = window.setTimeout(() => abort.abort(), 15000);
        const response = await fetch(MODEL_URL, { signal: abort.signal, cache: 'no-store' });
        window.clearTimeout(timeout);
        if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
        const buffer = await response.arrayBuffer();
        window.__ottoDbg = { loaded: false, loading: true, fetchedBytes: buffer.byteLength, url: MODEL_URL };
        renderer.domElement.dataset.ottoBytes = String(buffer.byteLength);
        const gltf = await new Promise((resolve, reject) => {
          loader.parse(buffer, '', resolve, reject);
        });
        const articulated = buildArticulatedOtto(gltf.scene);
        disposeSourceScene(gltf.scene);
        joints = articulated.joints;
        coordinateSystem = articulated.coordinateSystem;
        root.rotation.copy(articulated.rootRotation);

        const size = articulated.size;
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 3.9 / maxDim;
        root.scale.setScalar(scale);
        screenMesh = articulated.screenMesh || null;
        root.add(articulated.rig);
        applyVisualSettings(root, scene, colorsRef.current);
        applyPose(joints, animRef.current.cur, handsRef.current, coordinateSystem);

        const wbox = new THREE.Box3().setFromObject(root);
        const wsize = wbox.getSize(new THREE.Vector3());
        const wcenter = wbox.getCenter(new THREE.Vector3());

        ground = new THREE.Mesh(
          new THREE.PlaneGeometry(20, 20),
          new THREE.ShadowMaterial({ opacity: 0.18 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(wcenter.x, wbox.min.y, wcenter.z);
        ground.receiveShadow = true;
        scene.add(ground);

        const dist = Math.max(wsize.x, wsize.y, wsize.z) * 1.42;
        camera.position.set(wcenter.x, wcenter.y + dist * 0.18, wcenter.z + dist);
        controls.target.copy(wcenter);
        controls.update();

        window.__ottoDbg = {
          loaded: true,
          meshCount: PARTS.filter((part) => articulated.partTriangles[part] > 0).length,
          triangleCount: articulated.triangleCount,
          partTriangles: articulated.partTriangles,
          rawSize: size.toArray(),
          wsize: wsize.toArray(),
          wcenter: wcenter.toArray(),
          camPos: camera.position.toArray(),
          source: articulated.source,
          coordinateSystem,
          expression: screenMesh ? faceTextureUrlRef.current : null,
          pivots: articulated.pivots && Object.fromEntries(
            Object.entries(articulated.pivots).map(([keyName, value]) => [keyName, value.toArray()])
          ),
        };
        renderer.domElement.dataset.ottoStatus = 'loaded';
        renderer.domElement.dataset.ottoParts = JSON.stringify(articulated.partTriangles);
        if (articulated.pivots) {
          renderer.domElement.dataset.ottoPivots = JSON.stringify(
            Object.fromEntries(Object.entries(articulated.pivots).map(([keyName, value]) => [keyName, value.toArray()]))
          );
        }
      } catch (err) {
        if (abort.signal.aborted) return;
        window.__ottoDbg = { loaded: false, error: String(err && err.message || err) };
        renderer.domElement.dataset.ottoStatus = 'error';
        renderer.domElement.dataset.ottoError = String(err && err.message || err);
        console.error('[OttoSimulator] 模型加载失败', err);
      }
    };
    loadModel();

    let raf = 0;
    const render = () => {
      if (joints) {
        const currentPose = getPose(animRef.current);
        applyPose(joints, currentPose, handsRef.current, coordinateSystem);
        const gravityTarget = updateGravityGroup(gravityGroup, gravityState, currentPose, gravityEnabledRef.current);
        const currentMotion = motionRef.current || { yaw: 0, active: false };
        gravityGroup.rotation.y = deg(currentMotion.yaw || 0);
        applyVisualSettings(root, scene, colorsRef.current);
        renderer.domElement.dataset.ottoPose = [
          Math.round(currentPose.ll),
          Math.round(currentPose.rl),
          Math.round(currentPose.lf),
          Math.round(currentPose.rf),
          Math.round(currentPose.lh),
          Math.round(currentPose.rh),
        ].join(',');
        renderer.domElement.dataset.ottoGravity = gravityEnabledRef.current ? 'on' : 'off';
        renderer.domElement.dataset.ottoGravityState = [
          gravityState.lift.toFixed(3),
          THREE.MathUtils.radToDeg(gravityState.roll).toFixed(2),
          THREE.MathUtils.radToDeg(gravityState.pitch).toFixed(2),
          gravityTarget.lift.toFixed(3),
          gravityTarget.support,
        ].join(',');
        renderer.domElement.dataset.ottoMotion = [
          (currentMotion.yaw || 0).toFixed(1),
          currentMotion.active ? '1' : '0',
        ].join(',');
        renderer.domElement.dataset.ottoHands = handsRef.current ? 'on' : 'off';
        renderer.domElement.dataset.ottoBody = handsRef.current || !joints.bodyNoHands ? 'body' : 'body_no_hands';
      }
      updateExpressionSource(expressionImage, faceTextureUrlRef.current);
      controls.update();
      renderer.render(scene, camera);
      updateFaceOverlay(expressionImage, screenMesh, camera, renderer);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onResize = () => {
      W = wrap.clientWidth || 300;
      H = wrap.clientHeight || 280;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      abort.abort();
      ro.disconnect();
      controls.dispose();
      root.traverse((o) => {
        if (o.isMesh) {
          o.geometry.dispose();
          const disposeMaterial = (m) => {
            if (m.map) m.map.dispose();
            m.dispose();
          };
          if (Array.isArray(o.material)) o.material.forEach(disposeMaterial);
          else if (o.material) disposeMaterial(o.material);
        }
      });
      if (ground) {
        ground.geometry.dispose();
        ground.material.dispose();
      }
      if (expressionImage && expressionImage.parentNode) expressionImage.parentNode.removeChild(expressionImage);
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={wrapRef} style={{ width: '100%', height: '100%', position: 'relative' }} />;
}
