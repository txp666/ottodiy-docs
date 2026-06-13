import React from 'react';

// 动作预设专属线性插画（24×24 · currentColor 描边 · 圆角），与 DANCE_PRESETS 一一对应。

const PATHS = {
  // 招呼三连 —— 挥动的手掌 + 摆动弧
  'wave-hello': (
    <>
      <path d="M8.5 12.5V6a1.1 1.1 0 0 1 2.2 0v5M10.7 11V4.8a1.1 1.1 0 0 1 2.2 0V11M12.9 11V5.6a1.1 1.1 0 0 1 2.2 0V13a5.5 5.5 0 0 1-5.5 5.5c-2.5 0-3.8-1.3-5.1-3.5l-.8-1.5a1.15 1.15 0 0 1 1.9-1.2l1.9 2.2" />
      <path d="M18.4 4.2c1.1 1.1 1.1 3.1 0 4.3M20.4 3c1.6 1.7 1.6 5 0 6.7" />
    </>
  ),
  // 左右摇摆 —— 倾斜的机身 + 左右摆动弧
  'side-sway': (
    <>
      <rect x="8.5" y="6.5" width="7" height="7" rx="2" transform="rotate(-9 12 10)" />
      <path d="M5 17a5 5 0 0 1 1-3.2M19 17a5 5 0 0 0-1-3.2" />
      <path d="M5 17l-.5-1.9M5 17l1.9-.5M19 17l.5-1.9M19 17l-1.9-.5" />
    </>
  ),
  // 腿部波浪 —— 正弦波 + 地面线
  'leg-wave': (
    <>
      <path d="M3 12c2-4.5 4-4.5 6 0s4 4.5 6 0 4-4.5 6 0" />
      <path d="M3 18h18" />
    </>
  ),
  // 机械舞 —— 跳舞的小机器人（一臂上一臂下）
  'robot-dance': (
    <>
      <rect x="9" y="3.5" width="6" height="5" rx="1.2" />
      <circle cx="11" cy="6" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="13" cy="6" r="0.5" fill="currentColor" stroke="none" />
      <path d="M12 8.5v6" />
      <path d="M12 10l-3-1.6-1 2M12 10l3 1.6 1-2" />
      <path d="M12 14.5l-2.6 2 .5 2.4M12 14.5l2.6 2-.5 2.4" />
    </>
  ),
  // 开心蹦跳 —— 笑脸 + 两侧上跳箭头
  'happy-bounce': (
    <>
      <circle cx="12" cy="9" r="4.6" />
      <circle cx="10.3" cy="8.2" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="13.7" cy="8.2" r="0.7" fill="currentColor" stroke="none" />
      <path d="M9.8 10.6c1.3 1.2 3.1 1.2 4.4 0" />
      <path d="M5 16.5l2-2 2 2M15 16.5l2-2 2 2" />
      <path d="M4.5 19.5h4M15.5 19.5h4" />
    </>
  ),
};

export default function PresetIcon({ id, size = 26 }) {
  const body = PATHS[id] || PATHS['robot-dance'];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {body}
    </svg>
  );
}
