import React from 'react';

// 自绘线性图标集（24×24 网格 · currentColor 描边 · 圆角），与内置动作一一对应。
// 统一风格，随明暗主题自适应，无第三方依赖。

const PATHS = {
  // 行走 —— 行走的小人
  walk: (
    <>
      <circle cx="13" cy="4.5" r="2" />
      <path d="M13 6.5v6M13 12.5l3 5M13 12.5l-3 5M13 9l-3 1.5M13 9l3.5-3" />
    </>
  ),
  // 转身 —— 顺时针环形箭头
  turn: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 3.5V8h-4.5" />
    </>
  ),
  // 跳跃 —— 上箭头 + 地面弧
  jump: (
    <>
      <path d="M12 4v9" />
      <path d="M8 8l4-4 4 4" />
      <path d="M5 18c2.5 1.6 11.5 1.6 14 0" />
    </>
  ),
  // 摇摆 —— 钟摆
  swing: (
    <>
      <path d="M12 4v7" />
      <circle cx="12" cy="14.5" r="3" />
      <path d="M6.5 5.5c1.4 1 1.4 3 0 4M17.5 5.5c-1.4 1-1.4 3 0 4" />
    </>
  ),
  // 太空步 —— 向后双箭头
  moonwalk: (
    <>
      <path d="M13 5l-6 7 6 7M19 5l-6 7 6 7" />
    </>
  ),
  // 弯曲 —— 弯折箭头
  bend: (
    <>
      <path d="M6 4v6a7 7 0 0 0 7 7h5" />
      <path d="M15 13.5l3.5 3.5L15 20.5" />
    </>
  ),
  // 摇腿 —— 腿 + 摆动弧
  shake_leg: (
    <>
      <path d="M9 4v9l-2.5 6M9 13l3 6" />
      <path d="M15 8.5c1.6 1.1 1.6 3.4 0 4.5M18 7c2 1.5 2 5 0 6.5" />
    </>
  ),
  // 上下 —— 上下双箭头
  updown: (
    <>
      <path d="M12 4v16" />
      <path d="M8 8l4-4 4 4M8 16l4 4 4-4" />
    </>
  ),
  // 旋风腿 —— 龙卷风
  whirlwind_leg: (
    <>
      <path d="M5 6h14M7 10h10M9.5 14h7M12 18h3" />
    </>
  ),
  // 坐下 —— 椅子
  sit: (
    <>
      <path d="M8 4v10M8 14h8M8 11h8M16 11v6M8 14v3" />
    </>
  ),
  // 展示 —— 双闪光
  showcase: (
    <>
      <path d="M11 4l1.7 4 4 1.7-4 1.7L11 15.4 9.3 11.4l-4-1.7 4-1.7z" />
      <path d="M17.5 14.5l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8z" />
    </>
  ),
  // 举手 —— 两个上箭头
  hands_up: (
    <>
      <path d="M7 15V8M5 10l2-2 2 2M17 15V8M15 10l2-2 2 2" />
    </>
  ),
  // 放手 —— 两个下箭头
  hands_down: (
    <>
      <path d="M7 8v7M5 13l2 2 2-2M17 8v7M15 13l2 2 2-2" />
    </>
  ),
  // 挥手 —— 手掌 + 摆动弧
  hand_wave: (
    <>
      <path d="M9 12V6.5a1.1 1.1 0 0 1 2.2 0V11M11.2 11V5a1.1 1.1 0 0 1 2.2 0v6M13.4 11V6a1.1 1.1 0 0 1 2.2 0v7a5.5 5.5 0 0 1-5.5 5.5c-2.6 0-3.8-1.4-5.1-3.6l-.9-1.7a1.2 1.2 0 0 1 2-1.3L9 13.5" />
      <path d="M18 4.5c1.2 1.2 1.2 3.3 0 4.5" />
    </>
  ),
  // 大风车 —— 四叶风车
  windmill: (
    <>
      <path d="M12 12V4a4 4 0 0 1 0 8M12 12h8a4 4 0 0 1-8 0M12 12v8a4 4 0 0 1 0-8M12 12H4a4 4 0 0 1 8 0" />
    </>
  ),
  // 起飞 —— 火箭
  takeoff: (
    <>
      <path d="M12 3c3 2 4.5 5 4.5 9l-1.8 2.5h-5.4L7.5 12C7.5 8 9 5 12 3z" />
      <circle cx="12" cy="9" r="1.6" />
      <path d="M9.6 15l-2 4M14.4 15l2 4" />
    </>
  ),
  // 健身 —— 哑铃
  fitness: (
    <>
      <path d="M5 9v6M8 6.5v11M8 12h8M16 6.5v11M19 9v6" />
    </>
  ),
  // 打招呼 —— 抬单手的小人
  greeting: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v7M12 14l-3 5M12 14l3 5M12 9.5l-3 1.5M12 9.5l4-4" />
    </>
  ),
  // 害羞 —— 带腮红的脸
  shy: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M9 10.5h.01M15 10.5h.01" />
      <path d="M9.5 15c1.4 1.1 3.6 1.1 5 0" />
      <path d="M6.6 13c.7.5 1.5.5 2.2 0M15.2 13c.7.5 1.5.5 2.2 0" />
    </>
  ),
  // 广播体操 —— 广播声波
  radio_calisthenics: (
    <>
      <circle cx="12" cy="12" r="1.6" />
      <path d="M9 9a4.3 4.3 0 0 0 0 6M15 9a4.3 4.3 0 0 1 0 6" />
      <path d="M6.5 6.5a8 8 0 0 0 0 11M17.5 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  // 转圈圈 —— 环绕箭头 + 爱心
  magic_circle: (
    <>
      <path d="M4.5 11a7.5 7.5 0 0 1 12.5-4.5M19.5 13a7.5 7.5 0 0 1-12.5 4.5" />
      <path d="M17 3.5l.6 2.8 2.8-.6M7 20.5l-.6-2.8-2.8.6" />
      <path d="M12 14.6l-1.8-1.8a1.25 1.25 0 0 1 1.8-1.7 1.25 1.25 0 0 1 1.8 1.7z" />
    </>
  ),
  // 复位 —— 房子
  home: (
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 9.8V19h12V9.8" />
      <path d="M10 19v-5h4v5" />
    </>
  ),
};

export default function ActionIcon({ id, size = 22 }) {
  const body = PATHS[id] || PATHS.home;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {body}
    </svg>
  );
}
