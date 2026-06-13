// Otto 机器人在线调试 / 动作编排 - 协议与数据定义
//
// 通信方式：浏览器通过 WebSocket 直连机器人本地控制服务
//   ws://<机器人IP>:8080/ws
// 消息为 MCP (JSON-RPC 2.0)，机器人同时接受
//   1) {"type":"mcp","payload":{...}}
//   2) 直接的 payload 对象
// 这里统一发送裸 payload（更短、固件已支持）。

export const WS_PORT = 8080;
export const WS_PATH = '/ws';

// 舵机定义，顺序与固件 SERVO_COUNT 索引一致
// LEFT_LEG=0 RIGHT_LEG=1 LEFT_FOOT=2 RIGHT_FOOT=3 LEFT_HAND=4 RIGHT_HAND=5
export const SERVOS = [
  { key: 'll', index: 0, label: '左腿', labelEn: 'Left leg', group: 'leg', hand: false, desc: '垂直轴扭转 · 0°外展 / 90°中立 / 180°内收', descEn: 'Vertical-axis twist · 0° out / 90° center / 180° in' },
  { key: 'rl', index: 1, label: '右腿', labelEn: 'Right leg', group: 'leg', hand: false, desc: '垂直轴扭转 · 0°内收 / 90°中立 / 180°外展', descEn: 'Vertical-axis twist · 0° in / 90° center / 180° out' },
  { key: 'lf', index: 2, label: '左脚', labelEn: 'Left foot', group: 'foot', hand: false, desc: '水平轴翻转 · 0°向上 / 90°水平 / 180°向下', descEn: 'Ankle roll · 0° up / 90° flat / 180° down' },
  { key: 'rf', index: 3, label: '右脚', labelEn: 'Right foot', group: 'foot', hand: false, desc: '水平轴翻转 · 0°向下 / 90°水平 / 180°向上', descEn: 'Ankle roll · 0° down / 90° flat / 180° up' },
  { key: 'lh', index: 4, label: '左手', labelEn: 'Left arm', group: 'hand', hand: true, desc: '上下摆动 · 0°向下 / 90°水平 / 180°向上', descEn: 'Up/down swing · 0° down / 90° level / 180° up' },
  { key: 'rh', index: 5, label: '右手', labelEn: 'Right arm', group: 'hand', hand: true, desc: '上下摆动 · 0°向上 / 90°水平 / 180°向下', descEn: 'Up/down swing · 0° up / 90° level / 180° down' },
];

export const SERVO_KEYS = SERVOS.map((s) => s.key);

// 站立 / 复位的默认姿态（与固件 Home 中的默认值一致）
export const HOME_POSE = { ll: 90, rl: 90, lf: 90, rf: 90, lh: 45, rh: 135 };

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// 预设动作（对应 self.otto.action 工具）
// needs 标记该动作真正会用到的参数，UI 据此显示对应控件
export const ACTIONS = [
  { id: 'walk', label: '行走', labelEn: 'Walk', emoji: '🚶', needs: ['steps', 'speed', 'direction', 'arm_swing'] },
  { id: 'turn', label: '转身', labelEn: 'Turn', emoji: '🔄', needs: ['steps', 'speed', 'direction', 'arm_swing'] },
  { id: 'jump', label: '跳跃', labelEn: 'Jump', emoji: '⬆️', needs: ['steps', 'speed'] },
  { id: 'swing', label: '摇摆', labelEn: 'Swing', emoji: '🎐', needs: ['steps', 'speed', 'amount'] },
  { id: 'moonwalk', label: '太空步', labelEn: 'Moonwalk', emoji: '🕴️', needs: ['steps', 'speed', 'direction', 'amount'] },
  { id: 'bend', label: '弯曲', labelEn: 'Bend', emoji: '🙇', needs: ['steps', 'speed', 'direction'] },
  { id: 'shake_leg', label: '摇腿', labelEn: 'Shake leg', emoji: '🦵', needs: ['steps', 'speed', 'direction'] },
  { id: 'updown', label: '上下', labelEn: 'Up/Down', emoji: '↕️', needs: ['steps', 'speed', 'amount'] },
  { id: 'whirlwind_leg', label: '旋风腿', labelEn: 'Whirlwind', emoji: '🌪️', needs: ['steps', 'speed', 'amount'] },
  { id: 'sit', label: '坐下', labelEn: 'Sit', emoji: '🪑', needs: [] },
  { id: 'showcase', label: '展示', labelEn: 'Showcase', emoji: '✨', needs: [] },
  { id: 'hands_up', label: '举手', labelEn: 'Arms up', emoji: '🙌', hand: true, needs: ['speed', 'direction'] },
  { id: 'hands_down', label: '放手', labelEn: 'Arms down', emoji: '🙆', hand: true, needs: ['speed', 'direction'] },
  { id: 'hand_wave', label: '挥手', labelEn: 'Wave', emoji: '👋', hand: true, needs: ['direction'] },
  { id: 'windmill', label: '大风车', labelEn: 'Windmill', emoji: '🌬️', hand: true, needs: ['steps', 'speed', 'amount'] },
  { id: 'takeoff', label: '起飞', labelEn: 'Takeoff', emoji: '🚀', hand: true, needs: ['steps', 'speed', 'amount'] },
  { id: 'fitness', label: '健身', labelEn: 'Fitness', emoji: '💪', hand: true, needs: ['steps', 'speed', 'amount'] },
  { id: 'greeting', label: '打招呼', labelEn: 'Greet', emoji: '🤗', hand: true, needs: ['direction', 'steps'] },
  { id: 'shy', label: '害羞', labelEn: 'Shy', emoji: '☺️', hand: true, needs: ['direction', 'steps'] },
  { id: 'radio_calisthenics', label: '广播体操', labelEn: 'Calisthenics', emoji: '📻', hand: true, needs: [] },
  { id: 'magic_circle', label: '转圈圈', labelEn: 'Magic circle', emoji: '💞', hand: true, needs: [] },
  { id: 'home', label: '复位', labelEn: 'Home', emoji: '🏠', needs: [] },
];

export const SERVO_TYPES_FOR_TRIM = [
  { value: 'left_leg', label: '左腿', labelEn: 'Left leg' },
  { value: 'right_leg', label: '右腿', labelEn: 'Right leg' },
  { value: 'left_foot', label: '左脚', labelEn: 'Left foot' },
  { value: 'right_foot', label: '右脚', labelEn: 'Right foot' },
  { value: 'left_hand', label: '左手', labelEn: 'Left arm' },
  { value: 'right_hand', label: '右手', labelEn: 'Right arm' },
];

// 创建一个空的“移动”关键帧
export function createMoveFrame(pose = HOME_POSE, opts = {}) {
  return {
    id: Math.random().toString(36).slice(2, 9),
    type: 'move',
    pose: { ...pose },
    // 哪些舵机参与本帧（未参与的舵机保持上一帧位置）
    enabled: opts.enabled || { ll: true, rl: true, lf: true, rf: true, lh: false, rh: false },
    v: opts.v ?? 600, // 移动时长 ms (100-3000)
    d: opts.d ?? 200, // 动作后延迟 ms
  };
}

// 创建一个空的“振荡”关键帧
export function createOscFrame() {
  return {
    id: Math.random().toString(36).slice(2, 9),
    type: 'osc',
    amplitude: { ll: 0, rl: 0, lf: 0, rf: 0, lh: 0, rh: 0 }, // 10-90 有效
    center: { ll: 90, rl: 90, lf: 90, rf: 90, lh: 90, rh: 90 }, // 0-180
    phase: { ll: 0, rl: 0, lf: 0, rf: 0, lh: 0, rh: 0 }, // 角度
    p: 500, // 周期 ms (100-3000)
    c: 4.0, // 周期数 (0.1-20)
    d: 0,
  };
}

// 将编排好的关键帧数组转换为固件需要的紧凑 JSON 序列。
// 因为固件单条消息缓冲区为 512 字节，这里会按长度自动分片，
// 返回多个 sequence 字符串，依次发送即可（固件会自动排队执行）。
export function buildSequenceChunks(frames, { maxLen = 420 } = {}) {
  const chunks = [];
  let current = [];

  const frameToObj = (frame) => {
    if (frame.type === 'osc') {
      const osc = {};
      const amp = {};
      const off = {};
      const ph = {};
      SERVO_KEYS.forEach((k) => {
        if (frame.amplitude[k] >= 10) {
          amp[k] = clamp(Math.round(frame.amplitude[k]), 10, 90);
          off[k] = clamp(Math.round(frame.center[k]), 0, 180);
          if (frame.phase[k]) ph[k] = Math.round(frame.phase[k]);
        }
      });
      if (Object.keys(amp).length) osc.a = amp;
      if (Object.keys(off).length) osc.o = off;
      if (Object.keys(ph).length) osc.ph = ph;
      osc.p = clamp(Math.round(frame.p), 100, 3000);
      osc.c = Math.round(clamp(frame.c, 0.1, 20) * 10) / 10;
      const obj = { osc };
      if (frame.d > 0) obj.d = Math.round(frame.d);
      return obj;
    }
    const s = {};
    SERVO_KEYS.forEach((k) => {
      if (frame.enabled[k]) s[k] = clamp(Math.round(frame.pose[k]), 0, 180);
    });
    const obj = { s, v: clamp(Math.round(frame.v), 100, 3000) };
    if (frame.d > 0) obj.d = Math.round(frame.d);
    return obj;
  };

  const flush = () => {
    if (current.length) {
      chunks.push(JSON.stringify({ a: current }));
      current = [];
    }
  };

  frames.forEach((frame) => {
    const obj = frameToObj(frame);
    const candidate = JSON.stringify({ a: [...current, obj] });
    if (candidate.length > maxLen && current.length) {
      flush();
    }
    current.push(obj);
  });
  flush();

  return chunks;
}

// 单帧（实时拖动舵机）转换为一次 servo_sequences 调用的字符串
export function buildSingleMove(pose, v = 400) {
  const s = {};
  SERVO_KEYS.forEach((k) => {
    s[k] = clamp(Math.round(pose[k]), 0, 180);
  });
  return JSON.stringify({ a: [{ s, v: clamp(Math.round(v), 100, 3000) }] });
}

// 趣味：内置舞蹈/动作编排预设库（纯关键帧，可本地预览，也可一键发送）
export const DANCE_PRESETS = [
  {
    id: 'wave-hello',
    name: '招呼三连',
    nameEn: 'Wave hello',
    desc: '抬双手 → 左右挥手 → 放下',
    descEn: 'Raise arms, wave, lower',
    needsHands: true,
    build: () => [
      createMoveFrame({ ...HOME_POSE, lh: 170, rh: 10 }, { enabled: { lh: true, rh: true }, v: 500, d: 150 }),
      createMoveFrame({ ...HOME_POSE, lh: 120, rh: 60 }, { enabled: { lh: true, rh: true }, v: 300, d: 120 }),
      createMoveFrame({ ...HOME_POSE, lh: 170, rh: 10 }, { enabled: { lh: true, rh: true }, v: 300, d: 120 }),
      createMoveFrame({ ...HOME_POSE, lh: 120, rh: 60 }, { enabled: { lh: true, rh: true }, v: 300, d: 120 }),
      createMoveFrame({ ...HOME_POSE, lh: 45, rh: 135 }, { enabled: { lh: true, rh: true }, v: 500, d: 0 }),
    ],
  },
  {
    id: 'side-sway',
    name: '左右摇摆',
    nameEn: 'Side sway',
    desc: '脚踝交替翻转，身体跟着摇',
    descEn: 'Ankles roll in turn, body sways',
    needsHands: false,
    build: () => {
      const f = createOscFrame();
      f.amplitude = { ...f.amplitude, lf: 25, rf: 25 };
      f.center = { ...f.center, lf: 90, rf: 90 };
      f.phase = { ...f.phase, rf: 180 };
      f.p = 500;
      f.c = 6;
      return [f];
    },
  },
  {
    id: 'leg-wave',
    name: '腿部波浪',
    nameEn: 'Leg wave',
    desc: '双腿相位差振荡，呈波浪感',
    descEn: 'Legs oscillate out of phase',
    needsHands: false,
    build: () => {
      const f = createOscFrame();
      f.amplitude = { ...f.amplitude, ll: 20, rl: 20 };
      f.center = { ...f.center, ll: 90, rl: 90, lf: 90, rf: 90 };
      f.phase = { ...f.phase, rl: 180 };
      f.p = 600;
      f.c = 4;
      return [f];
    },
  },
  {
    id: 'robot-dance',
    name: '机械舞',
    nameEn: 'Robot dance',
    desc: '手臂卡点上下，配合点头脚步',
    descEn: 'Arms hit the beat with footwork',
    needsHands: true,
    build: () => [
      createMoveFrame({ ...HOME_POSE, lh: 160, rh: 135 }, { enabled: { lh: true, rh: true }, v: 200, d: 150 }),
      createMoveFrame({ ...HOME_POSE, lh: 45, rh: 20 }, { enabled: { lh: true, rh: true }, v: 200, d: 150 }),
      createMoveFrame({ ...HOME_POSE, lf: 70, rf: 110 }, { enabled: { lf: true, rf: true }, v: 200, d: 150 }),
      createMoveFrame({ ...HOME_POSE, lf: 110, rf: 70 }, { enabled: { lf: true, rf: true }, v: 200, d: 150 }),
      createMoveFrame({ ...HOME_POSE, lh: 160, rh: 20 }, { enabled: { lh: true, rh: true }, v: 200, d: 200 }),
      createMoveFrame({ ...HOME_POSE }, { enabled: { ll: true, rl: true, lf: true, rf: true, lh: true, rh: true }, v: 400, d: 0 }),
    ],
  },
  {
    id: 'happy-bounce',
    name: '开心蹦跳',
    nameEn: 'Happy bounce',
    desc: '双脚同步上下 + 举手庆祝',
    descEn: 'Feet bounce while arms cheer',
    needsHands: true,
    build: () => {
      const osc = createOscFrame();
      osc.amplitude = { ...osc.amplitude, lh: 30, rh: 30 };
      osc.center = { ...osc.center, lh: 140, rh: 40 };
      osc.p = 350;
      osc.c = 6;
      return [
        createMoveFrame({ ...HOME_POSE, lf: 70, rf: 110 }, { enabled: { lf: true, rf: true }, v: 250, d: 100 }),
        createMoveFrame({ ...HOME_POSE, lf: 110, rf: 70 }, { enabled: { lf: true, rf: true }, v: 250, d: 100 }),
        osc,
        createMoveFrame({ ...HOME_POSE }, { enabled: { lh: true, rh: true }, v: 400, d: 0 }),
      ];
    },
  },
];
