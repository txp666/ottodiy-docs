import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import OttoSimulator from './OttoSimulator';
import ActionIcon from './ActionIcon';
import PresetIcon from './PresetIcon';
import { getMessages, pick } from './messages';
import {
  ACTIONS,
  DANCE_PRESETS,
  HOME_POSE,
  SERVOS,
  SERVO_KEYS,
  SERVO_TYPES_FOR_TRIM,
  WS_PATH,
  WS_PORT,
  buildActionPreviewFrames,
  buildSequenceChunks,
  buildSingleMove,
  clamp,
  createMoveFrame,
  createOscFrame,
} from './constants';
import styles from './styles.module.css';

const LS_IP = 'otto-debug-ip';
const LS_CHOREOS = 'otto-debug-choreos';
const LS_SIM_COLORS = 'otto-debug-sim-colors';
const LS_EXPRESSION = 'otto-debug-expression';
const LS_APPEARANCE_OPEN = 'otto-debug-appearance-open';
const LS_GRAVITY = 'otto-debug-gravity';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function readStore(key) {
  if (typeof window === 'undefined') return null;
  try {
    if (window.localStorage) return window.localStorage.getItem(key);
  } catch (e) {}
  try {
    const encodedKey = `${encodeURIComponent(key)}=`;
    const cookie = document.cookie.split('; ').find((item) => item.startsWith(encodedKey));
    return cookie ? decodeURIComponent(cookie.slice(encodedKey.length)) : null;
  } catch (e) {
    return null;
  }
}

function writeStore(key, value) {
  if (typeof window === 'undefined') return;
  try {
    if (window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch (e) {}
  try {
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  } catch (e) {}
}

function removeStore(key) {
  if (typeof window === 'undefined') return;
  try {
    if (window.localStorage) window.localStorage.removeItem(key);
  } catch (e) {}
  try {
    document.cookie = `${encodeURIComponent(key)}=; path=/; max-age=0; SameSite=Lax`;
  } catch (e) {}
}

const DEFAULT_SIM_COLORS = {
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

const COLOR_FIELDS = [
  { key: 'head', label: '头', labelEn: 'Head' },
  { key: 'body', label: '身体', labelEn: 'Body' },
  { key: 'leftLeg', label: '左腿', labelEn: 'Left leg' },
  { key: 'rightLeg', label: '右腿', labelEn: 'Right leg' },
  { key: 'leftFoot', label: '左脚', labelEn: 'Left foot' },
  { key: 'rightFoot', label: '右脚', labelEn: 'Right foot' },
  { key: 'leftArm', label: '左手', labelEn: 'Left arm' },
  { key: 'rightArm', label: '右手', labelEn: 'Right arm' },
  { key: 'background', label: '背景', labelEn: 'Background' },
];

const EXPRESSIONS = [
  { value: 'staticstate', label: '默认', labelEn: 'Default', url: '/files/gifs/staticstate.gif' },
  { value: 'happy', label: '开心', labelEn: 'Happy', url: '/files/gifs/happy.gif' },
  { value: 'sad', label: '悲伤', labelEn: 'Sad', url: '/files/gifs/sad.gif' },
  { value: 'anger', label: '生气', labelEn: 'Angry', url: '/files/gifs/anger.gif' },
  { value: 'scare', label: '害怕', labelEn: 'Scared', url: '/files/gifs/scare.gif' },
  { value: 'buxue', label: '不屑', labelEn: 'Dismissive', url: '/files/gifs/buxue.gif' },
];

const BoltIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ verticalAlign: '-1px' }}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
  </svg>
);

const HandsIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: '-2px' }}>
    <path d="M9 11V5.5a1.1 1.1 0 0 1 2.2 0V11M11.2 11V4.6a1.1 1.1 0 0 1 2.2 0V11M13.4 11V5.4a1.1 1.1 0 0 1 2.2 0V13a5.5 5.5 0 0 1-5.5 5.5c-2.5 0-3.7-1.3-5-3.5" />
  </svg>
);

export default function OttoDebugger({ lang = 'zh' }) {
  const t = useMemo(() => getMessages(lang), [lang]);

  const [ip, setIp] = useState('192.168.4.1');
  const [status, setStatus] = useState('disconnected');
  const [serverInfo, setServerInfo] = useState(null);
  const [isSecure, setIsSecure] = useState(false);
  const [hasHands, setHasHands] = useState(true);
  const [simColors, setSimColors] = useState(DEFAULT_SIM_COLORS);
  const [expression, setExpression] = useState('staticstate');
  const [appearanceOpen, setAppearanceOpen] = useState(true);
  const [gravityEnabled, setGravityEnabled] = useState(true);

  const [pose, setPose] = useState({ ...HOME_POSE });
  const [transitionMs, setTransitionMs] = useState(150);
  const [simMotion, setSimMotion] = useState({ yaw: 0, active: false });
  const [liveMode, setLiveMode] = useState(false);

  const [params, setParams] = useState({ steps: 3, speed: 700, direction: 1, amount: 30, arm_swing: 50 });

  const [trimServo, setTrimServo] = useState('left_leg');
  const [trims, setTrims] = useState(null);

  const [frames, setFrames] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [loopPlay, setLoopPlay] = useState(false);

  const [battery, setBattery] = useState(null);
  const [robotStatus, setRobotStatus] = useState(null);
  const [log, setLog] = useState([]);
  const [savedNames, setSavedNames] = useState([]);
  const [driveMode, setDriveMode] = useState(false);
  const [tab, setTab] = useState('choreo');

  const wsRef = useRef(null);
  const idRef = useRef(1);
  const pendingRef = useRef({});
  const liveThrottleRef = useRef(0);
  const playAbortRef = useRef(false);
  const storageReadyRef = useRef(false);

  const addLog = useCallback((dir, text) => {
    setLog((prev) => [...prev, { t: Date.now(), dir, text }].slice(-200));
  }, []);

  useEffect(() => {
    setIsSecure(typeof window !== 'undefined' && window.location.protocol === 'https:');
    try {
      const saved = readStore(LS_IP);
      if (saved) setIp(saved);
      const savedColors = JSON.parse(readStore(LS_SIM_COLORS) || 'null');
      if (savedColors && typeof savedColors === 'object') setSimColors({ ...DEFAULT_SIM_COLORS, ...savedColors });
      const savedExpression = readStore(LS_EXPRESSION);
      if (EXPRESSIONS.some((item) => item.value === savedExpression)) setExpression(savedExpression);
      const savedAppearanceOpen = readStore(LS_APPEARANCE_OPEN);
      if (savedAppearanceOpen === '0' || savedAppearanceOpen === '1') setAppearanceOpen(savedAppearanceOpen === '1');
      const savedGravity = readStore(LS_GRAVITY);
      if (savedGravity === '0' || savedGravity === '1') setGravityEnabled(savedGravity === '1');
      refreshSavedNames();
    } catch (e) {}
    storageReadyRef.current = true;
    return () => {
      playAbortRef.current = true;
      if (wsRef.current) wsRef.current.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!storageReadyRef.current) return;
    writeStore(LS_SIM_COLORS, JSON.stringify(simColors));
  }, [simColors]);

  useEffect(() => {
    if (!storageReadyRef.current) return;
    writeStore(LS_EXPRESSION, expression);
  }, [expression]);

  useEffect(() => {
    if (!storageReadyRef.current) return;
    writeStore(LS_APPEARANCE_OPEN, appearanceOpen ? '1' : '0');
  }, [appearanceOpen]);

  useEffect(() => {
    if (!storageReadyRef.current) return;
    writeStore(LS_GRAVITY, gravityEnabled ? '1' : '0');
  }, [gravityEnabled]);

  const refreshSavedNames = () => {
    try {
      const data = JSON.parse(readStore(LS_CHOREOS) || '{}');
      setSavedNames(Object.keys(data));
    } catch (e) {
      setSavedNames([]);
    }
  };

  const updateSimColor = (key, value) => {
    setSimColors((prev) => {
      const next = { ...prev, [key]: value };
      return next;
    });
  };

  const resetSimColors = () => {
    setSimColors(DEFAULT_SIM_COLORS);
    removeStore(LS_SIM_COLORS);
  };

  const updateExpression = (value) => {
    setExpression(value);
  };

  const connect = useCallback(() => {
    if (wsRef.current) {
      try { wsRef.current.close(); } catch (e) {}
    }
    const url = `ws://${ip}:${WS_PORT}${WS_PATH}`;
    setStatus('connecting');
    addLog('sys', t.logConnecting(url));
    writeStore(LS_IP, ip);

    let ws;
    try {
      ws = new WebSocket(url);
    } catch (e) {
      setStatus('error');
      addLog('err', t.logCreateFail(e.message));
      return;
    }
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
      addLog('sys', t.logConnected);
      send('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'otto-web-debugger', version: '1.0' } }, 'init');
      setTimeout(() => callTool('self.otto.get_trims', {}, 'trims'), 200);
      setTimeout(() => callTool('self.battery.get_level', {}, 'battery'), 400);
    };
    ws.onclose = () => {
      setStatus((s) => (s === 'error' ? s : 'disconnected'));
      addLog('sys', t.logClosed);
    };
    ws.onerror = () => {
      setStatus('error');
      addLog('err', t.logError);
    };
    ws.onmessage = (evt) => {
      addLog('in', evt.data);
      handleResponse(evt.data);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ip, addLog, t]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      try { wsRef.current.close(); } catch (e) {}
      wsRef.current = null;
    }
    setStatus('disconnected');
  }, []);

  const send = useCallback((method, params2, purpose) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return null;
    const id = idRef.current++;
    pendingRef.current[id] = purpose || method;
    const str = JSON.stringify({ jsonrpc: '2.0', id, method, params: params2 || {} });
    ws.send(str);
    addLog('out', str);
    return id;
  }, [addLog]);

  const callTool = useCallback((name, args, purpose) => {
    return send('tools/call', { name, arguments: args || {} }, purpose || name);
  }, [send]);

  const handleResponse = useCallback((raw) => {
    let data;
    try { data = JSON.parse(raw); } catch (e) { return; }
    const purpose = data.id != null ? pendingRef.current[data.id] : null;
    if (data.id != null) delete pendingRef.current[data.id];

    if (purpose === 'init' && data.result && data.result.serverInfo) {
      setServerInfo(data.result.serverInfo);
      return;
    }
    const text = data.result && data.result.content && data.result.content[0] && data.result.content[0].text;
    if (purpose === 'trims' && text) {
      try { setTrims(JSON.parse(text)); } catch (e) {}
    } else if (purpose === 'battery' && text) {
      try { setBattery(JSON.parse(text)); } catch (e) {}
    } else if (purpose === 'status' && text) {
      setRobotStatus(text);
    }
  }, []);

  const connected = status === 'connected';

  const sendLivePose = useCallback((nextPose) => {
    if (!connected || !liveMode) return;
    const now = Date.now();
    if (now - liveThrottleRef.current < 120) return;
    liveThrottleRef.current = now;
    callTool('self.otto.servo_sequences', { sequence: buildSingleMove(nextPose, 250) }, 'live');
  }, [connected, liveMode, callTool]);

  const updateServo = useCallback((key, value) => {
    setTransitionMs(80);
    setPose((prev) => {
      const next = { ...prev, [key]: clamp(value, 0, 180) };
      sendLivePose(next);
      return next;
    });
  }, [sendLivePose]);

  const resetPose = () => {
    setTransitionMs(300);
    setSimMotion({ yaw: 0, active: false });
    setPose({ ...HOME_POSE });
    if (connected) callTool('self.otto.action', { action: 'home' }, 'home');
  };

  const mirrorPose = () => {
    setTransitionMs(200);
    setPose((prev) => ({
      ll: 180 - prev.rl, rl: 180 - prev.ll,
      lf: 180 - prev.rf, rf: 180 - prev.lf,
      lh: 180 - prev.rh, rh: 180 - prev.lh,
    }));
  };

  const randomPose = () => {
    setTransitionMs(250);
    const r = () => 60 + Math.round(Math.random() * 60);
    setPose({ ll: r(), rl: r(), lf: r(), rf: r(), lh: hasHands ? r() : 45, rh: hasHands ? r() : 135 });
  };

  const runAction = useCallback((action) => {
    if (!connected) { addLog('err', t.logNeedConnect); return; }
    callTool('self.otto.action', { action, ...params }, action);
  }, [connected, params, callTool, addLog, t]);

  const stopAll = () => connected && callTool('self.otto.stop', {}, 'stop');
  const queryStatus = () => connected && callTool('self.otto.get_status', {}, 'status');

  const applyTrim = (value) => {
    if (!connected) return;
    callTool('self.otto.set_trim', { servo_type: trimServo, trim_value: clamp(value, -50, 50) }, 'set_trim');
    setTimeout(() => callTool('self.otto.get_trims', {}, 'trims'), 600);
  };

  const resetTrims = () => {
    if (!connected) return;
    if (!window.confirm(t.resetTrimsConfirm)) return;
    SERVO_TYPES_FOR_TRIM.forEach((s, i) => {
      setTimeout(() => callTool('self.otto.set_trim', { servo_type: s.value, trim_value: 0 }, 'set_trim'), i * 120);
    });
    setTrims(SERVO_TYPES_FOR_TRIM.reduce((acc, s) => ({ ...acc, [s.value]: 0 }), {}));
    setTimeout(() => callTool('self.otto.get_trims', {}, 'trims'), SERVO_TYPES_FOR_TRIM.length * 120 + 400);
    setTimeout(() => callTool('self.otto.action', { action: 'home' }, 'home'), SERVO_TYPES_FOR_TRIM.length * 120 + 200);
  };

  const selectedFrame = useMemo(() => frames.find((f) => f.id === selectedId) || null, [frames, selectedId]);

  const addMoveFrame = () => {
    const f = createMoveFrame(pose, { enabled: { ll: true, rl: true, lf: true, rf: true, lh: hasHands, rh: hasHands } });
    setFrames((prev) => [...prev, f]);
    setSelectedId(f.id);
  };
  const addOscFrame = () => {
    const f = createOscFrame();
    setFrames((prev) => [...prev, f]);
    setSelectedId(f.id);
  };
  const updateFrame = (id, patch) => setFrames((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const deleteFrame = (id) => {
    setFrames((prev) => prev.filter((f) => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  };
  const duplicateFrame = (id) => setFrames((prev) => {
    const idx = prev.findIndex((f) => f.id === id);
    if (idx < 0) return prev;
    const copy = { ...prev[idx], id: Math.random().toString(36).slice(2, 9) };
    const next = [...prev];
    next.splice(idx + 1, 0, copy);
    return next;
  });
  const moveFrame = (id, dir) => setFrames((prev) => {
    const idx = prev.findIndex((f) => f.id === id);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= prev.length) return prev;
    const next = [...prev];
    [next[idx], next[j]] = [next[j], next[idx]];
    return next;
  });

  const playFramesLocal = useCallback(async (sourceFrames, shouldLoop = false) => {
    if (!sourceFrames.length || playing) return;
    setPlaying(true);
    playAbortRef.current = false;
    let cur = { ...pose };
    let motion = { yaw: 0, active: true };
    setSimMotion(motion);
    do {
      for (const f of sourceFrames) {
        if (playAbortRef.current) break;
        if (f.type === 'move') {
          const target = { ...cur };
          SERVO_KEYS.forEach((k) => { if (f.enabled[k]) target[k] = f.pose[k]; });
          setTransitionMs(f.v);
          setPose({ ...target });
          cur = target;
          await sleep(f.v + (f.d || 0));
        } else {
          const start = Date.now();
          const dur = f.p * f.c;
          let lastTick = start;
          setTransitionMs(0);
          while (Date.now() - start < dur && !playAbortRef.current) {
            const now = Date.now();
            const tt = (now - start) / f.p;
            const tickMs = Math.max(0, now - lastTick);
            lastTick = now;
            const next = { ...cur };
            SERVO_KEYS.forEach((k) => {
              if (f.amplitude[k] >= 10) {
                const ph = (f.phase[k] || 0) * Math.PI / 180;
                next[k] = clamp(Math.round(f.center[k] + f.amplitude[k] * Math.sin(2 * Math.PI * tt + ph)), 0, 180);
              } else if (f.previewActive && f.previewActive[k]) {
                next[k] = clamp(Math.round(f.center[k]), 0, 180);
              }
            });
            setPose(next);
            if (f.previewMotion) {
              motion = {
                ...motion,
                yaw: motion.yaw + (f.previewMotion.yawDegPerCycle || 0) * (tickMs / f.p),
                active: true,
              };
              setSimMotion(motion);
            }
            await sleep(30);
          }
          SERVO_KEYS.forEach((k) => {
            if (f.amplitude[k] >= 10 || (f.previewActive && f.previewActive[k])) cur[k] = f.center[k];
          });
          setPose({ ...cur });
          if (f.d) await sleep(f.d);
        }
      }
    } while (shouldLoop && !playAbortRef.current);
    setSimMotion((prev) => ({ ...prev, active: false }));
    setPlaying(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, pose]);

  const playLocal = useCallback(() => playFramesLocal(frames, loopPlay), [frames, loopPlay, playFramesLocal]);

  const stopLocal = () => { playAbortRef.current = true; setSimMotion((prev) => ({ ...prev, active: false })); setPlaying(false); };

  const previewAction = useCallback((action) => {
    const previewFrames = buildActionPreviewFrames(action, params, hasHands);
    playFramesLocal(previewFrames, false);
  }, [params, hasHands, playFramesLocal]);

  const sendChoreography = useCallback(async () => {
    if (!connected) { addLog('err', t.logNeedConnect); return; }
    if (!frames.length) return;
    const chunks = buildSequenceChunks(frames);
    addLog('sys', t.logSendSeq(frames.length, chunks.length));
    for (const chunk of chunks) {
      callTool('self.otto.servo_sequences', { sequence: chunk }, 'seq');
      await sleep(120);
    }
    setTimeout(() => callTool('self.otto.action', { action: 'home' }, 'home'), 200);
  }, [connected, frames, callTool, addLog, t]);

  const loadDance = (preset) => {
    setFrames(preset.build());
    setSelectedId(null);
    setTab('choreo');
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(frames, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `otto-choreo-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const importJson = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (Array.isArray(data)) { setFrames(data); setSelectedId(null); }
      } catch (err) { addLog('err', t.logImportFail); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };
  const saveNamed = () => {
    const name = window.prompt(t.promptSaveName);
    if (!name) return;
    try {
      const data = JSON.parse(readStore(LS_CHOREOS) || '{}');
      data[name] = frames;
      writeStore(LS_CHOREOS, JSON.stringify(data));
      refreshSavedNames();
    } catch (e) {}
  };
  const loadNamed = (name) => {
    try {
      const data = JSON.parse(readStore(LS_CHOREOS) || '{}');
      if (data[name]) { setFrames(data[name]); setSelectedId(null); }
    } catch (e) {}
  };
  const deleteNamed = (name) => {
    try {
      const data = JSON.parse(readStore(LS_CHOREOS) || '{}');
      delete data[name];
      writeStore(LS_CHOREOS, JSON.stringify(data));
      refreshSavedNames();
    } catch (e) {}
  };

  const seqPreview = useMemo(() => (frames.length ? buildSequenceChunks(frames) : []), [frames]);

  useEffect(() => {
    if (!driveMode) return;
    const onKey = (e) => {
      if (!connected) return;
      const map = {
        w: () => callTool('self.otto.action', { action: 'walk', steps: 2, speed: params.speed, direction: 1, arm_swing: params.arm_swing }, 'walk'),
        s: () => callTool('self.otto.action', { action: 'walk', steps: 2, speed: params.speed, direction: -1, arm_swing: params.arm_swing }, 'walk'),
        a: () => callTool('self.otto.action', { action: 'turn', steps: 2, speed: params.speed, direction: 1, arm_swing: params.arm_swing }, 'turn'),
        d: () => callTool('self.otto.action', { action: 'turn', steps: 2, speed: params.speed, direction: -1, arm_swing: params.arm_swing }, 'turn'),
        j: () => callTool('self.otto.action', { action: 'jump', steps: 1, speed: params.speed }, 'jump'),
        h: () => callTool('self.otto.action', { action: 'home' }, 'home'),
        ' ': () => callTool('self.otto.stop', {}, 'stop'),
      };
      const fn = map[e.key.toLowerCase()];
      if (fn) { e.preventDefault(); fn(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [driveMode, connected, params, callTool]);

  const statusMeta = {
    disconnected: { label: t.statusDisconnected, cls: styles.dotGray },
    connecting: { label: t.statusConnecting, cls: styles.dotYellow },
    connected: { label: t.statusConnected, cls: styles.dotGreen },
    error: { label: t.statusError, cls: styles.dotRed },
  }[status];

  return (
    <div className={styles.app}>
      {isSecure && <div className={styles.warn}>{t.mixedContent}</div>}

      <div className={styles.topbar}>
        <div className={styles.connRow}>
          <span className={`${styles.dot} ${statusMeta.cls}`} />
          <span className={styles.connLabel}>{statusMeta.label}</span>
          <input
            className={styles.ipInput}
            value={ip}
            placeholder={t.ipPlaceholder}
            onChange={(e) => setIp(e.target.value.trim())}
            disabled={connected || status === 'connecting'}
          />
          {connected ? (
            <button className={styles.btnDanger} onClick={disconnect}>{t.disconnect}</button>
          ) : (
            <button className={styles.btnPrimary} onClick={connect} disabled={status === 'connecting' || !ip}>{t.connect}</button>
          )}
          {serverInfo && <span className={styles.fw}>{serverInfo.name} · {serverInfo.version}</span>}
          {battery && <span className={styles.fw}>{battery.level}%{battery.charging && <> <BoltIcon /></>}</span>}
        </div>
        <div className={styles.hint}>{t.serviceHint}</div>
      </div>

      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.simCard}>
            <div className={styles.simStage}>
              <OttoSimulator
                pose={pose}
                hasHands={hasHands}
                transitionMs={transitionMs}
                colors={simColors}
                faceTextureUrl={(EXPRESSIONS.find((item) => item.value === expression) || EXPRESSIONS[0]).url}
                gravityEnabled={gravityEnabled}
                motion={simMotion}
              />
            </div>
            <div className={styles.simBar}>
              <label className={styles.check}>
                <input type="checkbox" checked={hasHands} onChange={(e) => setHasHands(e.target.checked)} /> {t.withHands}
              </label>
              <label className={styles.check}>
                <input type="checkbox" checked={gravityEnabled} onChange={(e) => setGravityEnabled(e.target.checked)} /> {t.gravitySim}
              </label>
              <label className={`${styles.check} ${styles.liveCheck}`}>
                <input type="checkbox" checked={liveMode} onChange={(e) => setLiveMode(e.target.checked)} /> {t.liveSync}
              </label>
              <div className={styles.simBtns}>
                <button className={styles.btnGhost} onClick={mirrorPose}>{t.mirror}</button>
                <button className={styles.btnGhost} onClick={randomPose}>{t.random}</button>
                <button className={styles.btnGhost} onClick={resetPose}>{t.reset}</button>
              </div>
            </div>
          </div>

          <details
            className={styles.appearanceCard}
            open={appearanceOpen}
            onToggle={(e) => setAppearanceOpen(e.currentTarget.open)}
          >
            <summary className={styles.cardTitle}>
              <span>{t.appearanceTitle}</span>
              <button className={styles.btnGhostSm} onClick={(e) => { e.preventDefault(); resetSimColors(); }}>{t.reset}</button>
            </summary>
            <div className={styles.colorGrid}>
              <label className={`${styles.colorField} ${styles.expressionField}`}>
                <span>{t.expressionLabel}</span>
                <select value={expression} onChange={(e) => updateExpression(e.target.value)}>
                  {EXPRESSIONS.map((item) => (
                    <option key={item.value} value={item.value}>{pick(lang, item.label, item.labelEn)}</option>
                  ))}
                </select>
              </label>
              {COLOR_FIELDS.map((field) => (
                <label key={field.key} className={styles.colorField}>
                  <span>{pick(lang, field.label, field.labelEn)}</span>
                  <input
                    type="color"
                    value={simColors[field.key]}
                    onChange={(e) => updateSimColor(field.key, e.target.value)}
                    aria-label={pick(lang, field.label, field.labelEn)}
                  />
                </label>
              ))}
            </div>
            <div className={styles.saveHint}>{t.appearanceSavedHint}</div>
          </details>

          <div className={styles.servoCard}>
            <div className={styles.cardTitle}>{t.servos}</div>
            {SERVOS.filter((s) => hasHands || !s.hand).map((s) => (
              <div key={s.key} className={styles.servoRow}>
                <div className={styles.servoHead}>
                  <span className={styles.servoLabel}>{pick(lang, s.label, s.labelEn)} <code>{s.key}</code></span>
                  <span className={styles.servoVal}>{pose[s.key]}°</span>
                </div>
                <input
                  type="range" min="0" max="180" value={pose[s.key]}
                  disabled={playing}
                  onChange={(e) => updateServo(s.key, Number(e.target.value))}
                  className={styles.slider}
                />
                <div className={styles.servoDesc}>{pick(lang, s.desc, s.descEn)}</div>
              </div>
            ))}
            <div className={styles.driveBox}>
              <label className={styles.check}>
                <input type="checkbox" checked={driveMode} onChange={(e) => setDriveMode(e.target.checked)} /> {t.keyboardDrive}
              </label>
              {driveMode && <span className={styles.driveHint}>{t.driveHint}</span>}
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.tabs}>
            <button className={tab === 'choreo' ? styles.tabActive : styles.tab} onClick={() => setTab('choreo')}>{t.tabChoreo}</button>
            <button className={tab === 'presets' ? styles.tabActive : styles.tab} onClick={() => setTab('presets')}>{t.tabPresets}</button>
            <button className={tab === 'calib' ? styles.tabActive : styles.tab} onClick={() => setTab('calib')}>{t.tabCalib}</button>
          </div>

          {tab === 'presets' && (
            <div className={styles.panel}>
              <div className={styles.paramGrid}>
                {[
                  { k: 'steps', label: t.pSteps, min: 1, max: 100 },
                  { k: 'speed', label: t.pSpeed, min: 100, max: 3000 },
                  { k: 'amount', label: t.pAmount, min: 0, max: 170 },
                  { k: 'arm_swing', label: t.pArmSwing, min: 0, max: 170 },
                ].map((c) => (
                  <label key={c.k} className={styles.paramField}>
                    <span>{c.label}</span>
                    <input type="number" min={c.min} max={c.max} value={params[c.k]}
                      onChange={(e) => setParams((p) => ({ ...p, [c.k]: clamp(Number(e.target.value), c.min, c.max) }))} />
                  </label>
                ))}
                <label className={styles.paramField}>
                  <span>{t.pDirection}</span>
                  <select value={params.direction} onChange={(e) => setParams((p) => ({ ...p, direction: Number(e.target.value) }))}>
                    <option value={1}>{t.dirFwd}</option>
                    <option value={-1}>{t.dirBack}</option>
                    <option value={0}>{t.dirBoth}</option>
                  </select>
                </label>
              </div>
              <div className={styles.actionGrid}>
                {ACTIONS.filter((a) => hasHands || !a.hand).map((a) => (
                  <div key={a.id} className={styles.actionCard}>
                    <button className={styles.actionPreviewBtn} disabled={playing} onClick={() => previewAction(a.id)}>
                      <span className={styles.actionIcon}><ActionIcon id={a.id} /></span>
                      <span>{pick(lang, a.label, a.labelEn)}</span>
                    </button>
                    <button className={styles.actionRunBtn} disabled={!connected} onClick={() => runAction(a.id)}>{t.sendRobot}</button>
                  </div>
                ))}
              </div>
              <div className={styles.quickRow}>
                <button className={styles.btnGhost} disabled={!playing} onClick={stopLocal}>{t.stopPreview}</button>
                <button className={styles.btnDanger} disabled={!connected} onClick={stopAll}>{t.stopReset}</button>
                <button className={styles.btnGhost} disabled={!connected} onClick={queryStatus}>{t.queryStatus}</button>
                {robotStatus && <span className={styles.fw}>{t.statusLabel}: {robotStatus}</span>}
              </div>

              <div className={styles.cardTitle} style={{ marginTop: 18 }}>{t.presetLib}</div>
              <div className={styles.danceGrid}>
                {DANCE_PRESETS.map((d) => (
                  <div key={d.id} className={styles.danceCard}>
                    <div className={styles.danceHead}>
                      <span className={styles.danceIcon}><PresetIcon id={d.id} /></span>
                      <span className={styles.danceName}>{pick(lang, d.name, d.nameEn)}{d.needsHands && <span className={styles.handsBadge}><HandsIcon /></span>}</span>
                    </div>
                    <div className={styles.danceDesc}>{pick(lang, d.desc, d.descEn)}</div>
                    <button className={styles.btnGhost} onClick={() => loadDance(d)}>{t.loadPreset}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'calib' && (
            <div className={styles.panel}>
              <div className={styles.cardTitle}>{t.trimTitle}</div>
              <p className={styles.muted}>{t.trimIntro}</p>
              <div className={styles.calibRow}>
                <select value={trimServo} onChange={(e) => setTrimServo(e.target.value)}>
                  {SERVO_TYPES_FOR_TRIM.map((s) => <option key={s.value} value={s.value}>{pick(lang, s.label, s.labelEn)}</option>)}
                </select>
                <input type="range" min="-50" max="50"
                  value={trims ? (trims[trimServo] ?? 0) : 0}
                  disabled={!connected}
                  onChange={(e) => setTrims((prev) => ({ ...(prev || {}), [trimServo]: Number(e.target.value) }))}
                  onMouseUp={(e) => applyTrim(Number(e.target.value))}
                  onTouchEnd={(e) => applyTrim(Number(e.target.value))}
                  className={styles.slider} />
                <span className={styles.servoVal}>{trims ? (trims[trimServo] ?? 0) : 0}°</span>
              </div>
              <div className={styles.quickRow}>
                <button className={styles.btnGhost} disabled={!connected} onClick={() => callTool('self.otto.get_trims', {}, 'trims')}>{t.readTrims}</button>
                <button className={styles.btnDanger} disabled={!connected} onClick={resetTrims}>{t.resetTrims}</button>
              </div>
              {trims && (
                <div className={styles.trimGrid}>
                  {SERVO_TYPES_FOR_TRIM.map((s) => (
                    <div key={s.value} className={styles.trimItem}><span>{pick(lang, s.label, s.labelEn)}</span><b>{trims[s.value] ?? 0}°</b></div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'choreo' && (
            <div className={styles.panel}>
              <div className={styles.choreoToolbar}>
                <button className={styles.btnPrimary} onClick={addMoveFrame}>{t.addMove}</button>
                <button className={styles.btnGhost} onClick={addOscFrame}>{t.addOsc}</button>
                {playing ? (
                  <button className={styles.btnDanger} onClick={stopLocal}>{t.stopPreview}</button>
                ) : (
                  <button className={styles.btnGhost} onClick={playLocal} disabled={!frames.length}>{t.preview}</button>
                )}
                <label className={styles.check}><input type="checkbox" checked={loopPlay} onChange={(e) => setLoopPlay(e.target.checked)} /> {t.loop}</label>
                <button className={styles.btnPrimary} onClick={sendChoreography} disabled={!connected || !frames.length}>{t.sendRobot}</button>
              </div>

              <div className={styles.timeline}>
                {frames.length === 0 && <div className={styles.empty}>{t.emptyTimeline}</div>}
                {frames.map((f, i) => (
                  <div key={f.id} className={`${styles.frame} ${selectedId === f.id ? styles.frameSel : ''} ${f.type === 'osc' ? styles.frameOsc : ''}`} onClick={() => setSelectedId(f.id)}>
                    <div className={styles.frameIdx}>{i + 1}</div>
                    <div className={styles.frameBody}>
                      <div className={styles.frameType}>{f.type === 'osc' ? t.frameOsc : t.frameMove}</div>
                      <div className={styles.frameMeta}>
                        {f.type === 'osc'
                          ? `${t.period} ${f.p}ms ×${f.c} · ${t.delay} ${f.d}ms`
                          : `${SERVO_KEYS.filter((k) => f.enabled[k]).map((k) => `${k}${f.pose[k]}`).join(' ')} · ${f.v}ms · ${t.delay} ${f.d}ms`}
                      </div>
                    </div>
                    <div className={styles.frameOps}>
                      <button onClick={(e) => { e.stopPropagation(); moveFrame(f.id, -1); }}>↑</button>
                      <button onClick={(e) => { e.stopPropagation(); moveFrame(f.id, 1); }}>↓</button>
                      <button onClick={(e) => { e.stopPropagation(); duplicateFrame(f.id); }}>⧉</button>
                      <button onClick={(e) => { e.stopPropagation(); deleteFrame(f.id); }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedFrame && <FrameEditor frame={selectedFrame} hasHands={hasHands} onChange={(patch) => updateFrame(selectedFrame.id, patch)} pose={pose} t={t} lang={lang} />}

              <div className={styles.ioRow}>
                <button className={styles.btnGhost} onClick={saveNamed} disabled={!frames.length}>{t.save}</button>
                <button className={styles.btnGhost} onClick={exportJson} disabled={!frames.length}>{t.exportJson}</button>
                <label className={styles.btnGhost} style={{ cursor: 'pointer' }}>
                  {t.importJson}<input type="file" accept="application/json" hidden onChange={importJson} />
                </label>
                <button className={styles.btnGhost} onClick={() => { setFrames([]); setSelectedId(null); }} disabled={!frames.length}>{t.clear}</button>
              </div>
              {savedNames.length > 0 && (
                <div className={styles.savedRow}>
                  <span className={styles.muted}>{t.saved}:</span>
                  {savedNames.map((n) => (
                    <span key={n} className={styles.savedChip}>
                      <button onClick={() => loadNamed(n)}>{n}</button>
                      <button className={styles.chipX} onClick={() => deleteNamed(n)}>✕</button>
                    </span>
                  ))}
                </div>
              )}

              {seqPreview.length > 0 && (
                <details className={styles.preview}>
                  <summary>{t.seqPreview} · {seqPreview.length}{t.seqPreviewNote}</summary>
                  {seqPreview.map((c, i) => <pre key={i} className={styles.code}>{c}</pre>)}
                </details>
              )}
            </div>
          )}
        </div>
      </div>

      <details className={styles.console} open>
        <summary>{t.console} ({log.length})<button className={styles.clearLog} onClick={(e) => { e.preventDefault(); setLog([]); }}>{t.clear}</button></summary>
        <div className={styles.logBox}>
          {log.length === 0 && <div className={styles.muted}>{t.noMessages}</div>}
          {log.slice().reverse().map((l, i) => (
            <div key={i} className={`${styles.logLine} ${styles['log_' + l.dir]}`}>
              <span className={styles.logTime}>{new Date(l.t).toLocaleTimeString()}</span>
              <span className={styles.logDir}>{({ out: '→', in: '←', err: '✕', sys: '·' })[l.dir]}</span>
              <span className={styles.logText}>{l.text}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

function FrameEditor({ frame, hasHands, onChange, pose, t, lang }) {
  const servos = SERVOS.filter((s) => hasHands || !s.hand);
  if (frame.type === 'osc') {
    return (
      <div className={styles.editor}>
        <div className={styles.cardTitle}>{t.oscTitle}</div>
        <p className={styles.muted}>{t.oscIntro}</p>
        {servos.map((s) => (
          <div key={s.key} className={styles.oscRow}>
            <span className={styles.oscName}>{pick(lang, s.label, s.labelEn)} <code>{s.key}</code></span>
            <label>{t.amplitude}<input type="number" min="0" max="90" value={frame.amplitude[s.key]} onChange={(e) => onChange({ amplitude: { ...frame.amplitude, [s.key]: clamp(Number(e.target.value), 0, 90) } })} /></label>
            <label>{t.center}<input type="number" min="0" max="180" value={frame.center[s.key]} onChange={(e) => onChange({ center: { ...frame.center, [s.key]: clamp(Number(e.target.value), 0, 180) } })} /></label>
            <label>{t.phase}<input type="number" min="0" max="360" value={frame.phase[s.key]} onChange={(e) => onChange({ phase: { ...frame.phase, [s.key]: clamp(Number(e.target.value), 0, 360) } })} /></label>
          </div>
        ))}
        <div className={styles.editRow}>
          <label>{t.period} (ms)<input type="number" min="100" max="3000" value={frame.p} onChange={(e) => onChange({ p: clamp(Number(e.target.value), 100, 3000) })} /></label>
          <label>{t.cycles}<input type="number" min="0.1" max="20" step="0.1" value={frame.c} onChange={(e) => onChange({ c: clamp(Number(e.target.value), 0.1, 20) })} /></label>
          <label>{t.endDelay} (ms)<input type="number" min="0" max="5000" value={frame.d} onChange={(e) => onChange({ d: Math.max(0, Number(e.target.value)) })} /></label>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.editor}>
      <div className={styles.cardTitle}>{t.moveTitle}
        <button className={styles.btnGhostSm} onClick={() => onChange({ pose: { ...pose } })}>{t.grabPose}</button>
      </div>
      <div className={styles.editServos}>
        {servos.map((s) => (
          <div key={s.key} className={styles.editServo}>
            <label className={styles.check}>
              <input type="checkbox" checked={!!frame.enabled[s.key]} onChange={(e) => onChange({ enabled: { ...frame.enabled, [s.key]: e.target.checked } })} />
              {pick(lang, s.label, s.labelEn)}
            </label>
            <input type="number" min="0" max="180" value={frame.pose[s.key]} disabled={!frame.enabled[s.key]}
              onChange={(e) => onChange({ pose: { ...frame.pose, [s.key]: clamp(Number(e.target.value), 0, 180) } })} />
          </div>
        ))}
      </div>
      <div className={styles.editRow}>
        <label>{t.moveDuration} (ms)<input type="number" min="100" max="3000" value={frame.v} onChange={(e) => onChange({ v: clamp(Number(e.target.value), 100, 3000) })} /></label>
        <label>{t.endDelay} (ms)<input type="number" min="0" max="5000" value={frame.d} onChange={(e) => onChange({ d: Math.max(0, Number(e.target.value)) })} /></label>
      </div>
    </div>
  );
}
