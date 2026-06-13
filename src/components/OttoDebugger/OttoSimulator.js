import React from 'react';

// 2D 前视 Otto 仿真，外观参照真实 OttoClaw 实拍：
//   白色 3D 打印大圆角方盒机身 · 头顶两根细长小天线 · 正面方形 LCD 屏(弯笑眼+微笑+粉脸蛋)
//   两条带爪夹的手臂 · 白色腿 + 单侧外伸脚板（腿+脚呈 L 形）
//
// 关节运动（与真实机械结构一致）：
//   腿/髋舵机(ll,rl)：舵机【竖直】安装，绕【垂直轴】内外扭转(yaw / 转向)。
//       整条腿一起绕垂直轴转向（前视表现为透视收窄 + 轻微转角），脚掌随腿一起转。
//   脚/踝舵机(lf,rf)：舵机【水平】安装，绕【水平轴】翻转(roll)，脚掌像跷跷板左右倾斜。
//   左手：drawn 向下，rot = lh（顺时针，180=举过头顶）；右手：rot = rh-180

const ANKLE_K = 0.7;

export default function OttoSimulator({ pose, hasHands = true, transitionMs = 0, blink = true }) {
  const p = pose || {};
  const ll = p.ll ?? 90;
  const rl = p.rl ?? 90;
  const lf = p.lf ?? 90;
  const rf = p.rf ?? 90;
  const lh = p.lh ?? 45;
  const rh = p.rh ?? 135;

  const leftArmRot = lh;
  const rightArmRot = rh - 180;

  const tr = transitionMs > 0 ? { transition: `transform ${transitionMs}ms linear` } : undefined;

  const LHIP = { x: 104, y: 186 };
  const RHIP = { x: 136, y: 186 };
  const ANKLE_Y = 230;
  const LSH = { x: 66, y: 112 };
  const RSH = { x: 174, y: 112 };

  // 整条腿绕髋部垂直轴扭转；脚掌在腿坐标系内再做踝翻转
  const Leg = ({ hip, yawServo, rollServo, mirror }) => {
    const ax = hip.x;
    const ay = ANKLE_Y;
    const yawDeg = yawServo - 90;
    const sx = Math.max(0.2, Math.cos((yawDeg * Math.PI) / 180)); // 垂直轴扭转 → 透视收窄
    const turn = (mirror ? -1 : 1) * yawDeg * 0.18; // 轻微转角指示内/外方向
    const roll = (rollServo - 90) * ANKLE_K; // 踝水平轴翻转
    const legT =
      `rotate(${turn} ${ax} ${hip.y}) ` +
      `translate(${ax} 0) scale(${sx} 1) translate(${-ax} 0)`;
    return (
      <g>
        {/* 髋部舵机块（固定在身体上） */}
        <rect x={ax - 12} y={hip.y - 8} width="24" height="20" rx="5" fill="#e7ecf3" stroke="#c2cad8" strokeWidth="1.5" />
        {/* 整条腿（含脚）绕垂直轴扭转 */}
        <g style={tr} transform={legT}>
          {/* 腿柱 */}
          <rect x={ax - 11} y={hip.y + 6} width="22" height={ay - hip.y - 6} rx="6" fill="url(#oc-white)" stroke="#c2cad8" strokeWidth="1.5" />
          {/* 踝 + 脚掌（踝翻转）——脚板从腿的脚跟处单侧外伸，与腿构成 L 形 */}
          <g style={tr} transform={`rotate(${roll} ${ax} ${ay})`}>
            {(() => {
              const dir = mirror ? 1 : -1; // 脚掌朝外侧伸出
              const FL = 30; // 脚掌长度
              const heel = 6; // 脚跟微小外延
              const x0 = ax - dir * heel;
              const x1 = ax + dir * FL;
              const fx = Math.min(x0, x1);
              const fw = Math.abs(x1 - x0);
              return (
                <>
                  {/* 踝关节支架（位于脚跟正上方） */}
                  <rect x={ax - 9} y={ay - 4} width="18" height="13" rx="3" fill="#e7ecf3" stroke="#c2cad8" strokeWidth="1.5" />
                  {/* L 形脚板 */}
                  <rect x={fx} y={ay + 8} width={fw} height="12" rx="4" fill="url(#oc-white)" stroke="#c2cad8" strokeWidth="1.5" />
                  <rect x={fx + 3} y={ay + 6} width={fw - 6} height="5" rx="2.5" fill="#dde3ec" />
                </>
              );
            })()}
          </g>
        </g>
      </g>
    );
  };

  return (
    <svg viewBox="0 0 240 290" width="100%" height="100%" role="img" aria-label="Otto 机器人姿态预览">
      <defs>
        <linearGradient id="oc-white" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e7ecf3" />
        </linearGradient>
        <linearGradient id="oc-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10182b" />
          <stop offset="100%" stopColor="#0a0f1e" />
        </linearGradient>
      </defs>

      {/* 地面阴影 */}
      <ellipse cx="120" cy="272" rx="80" ry="10" fill="rgba(0,0,0,0.12)" />

      {/* ===== 腿 + 脚 ===== */}
      <Leg hip={LHIP} yawServo={ll} rollServo={lf} mirror={false} />
      <Leg hip={RHIP} yawServo={rl} rollServo={rf} mirror={true} />

      {/* ===== 手臂（带爪夹）===== */}
      {hasHands && (
        <>
          <g style={tr} transform={`rotate(${leftArmRot} ${LSH.x} ${LSH.y})`}>
            <rect x={LSH.x - 9} y={LSH.y - 10} width="18" height="20" rx="5" fill="#e7ecf3" stroke="#c2cad8" strokeWidth="1.5" />
            <rect x={LSH.x - 8} y={LSH.y + 6} width="16" height="40" rx="6" fill="url(#oc-white)" stroke="#c2cad8" strokeWidth="1.5" />
            <path d={`M${LSH.x - 7} ${LSH.y + 44} q-8 8 -3 16`} fill="none" stroke="#c2cad8" strokeWidth="4.5" strokeLinecap="round" />
            <path d={`M${LSH.x + 7} ${LSH.y + 44} q8 8 3 16`} fill="none" stroke="#c2cad8" strokeWidth="4.5" strokeLinecap="round" />
          </g>
          <g style={tr} transform={`rotate(${rightArmRot} ${RSH.x} ${RSH.y})`}>
            <rect x={RSH.x - 9} y={RSH.y - 10} width="18" height="20" rx="5" fill="#e7ecf3" stroke="#c2cad8" strokeWidth="1.5" />
            <rect x={RSH.x - 8} y={RSH.y + 6} width="16" height="40" rx="6" fill="url(#oc-white)" stroke="#c2cad8" strokeWidth="1.5" />
            <path d={`M${RSH.x - 7} ${RSH.y + 44} q-8 8 -3 16`} fill="none" stroke="#c2cad8" strokeWidth="4.5" strokeLinecap="round" />
            <path d={`M${RSH.x + 7} ${RSH.y + 44} q8 8 3 16`} fill="none" stroke="#c2cad8" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        </>
      )}

      {/* ===== 头顶细长小天线 ===== */}
      <g fill="url(#oc-white)" stroke="#c2cad8" strokeWidth="1.2">
        <path d="M112 64 L96 26 L101 25 L116 62 Z" />
        <path d="M128 64 L144 26 L139 25 L124 62 Z" />
      </g>

      {/* ===== 机身（大圆角方盒）===== */}
      <rect x="64" y="58" width="112" height="130" rx="20" fill="url(#oc-white)" stroke="#c2cad8" strokeWidth="2" />
      {/* 顶盖接缝 */}
      <path d="M70 84 Q120 90 170 84" fill="none" stroke="#d3dae4" strokeWidth="1.5" />
      {/* 侧面螺丝 */}
      <circle cx="72" cy="112" r="2.4" fill="#aab4c4" />
      <circle cx="168" cy="112" r="2.4" fill="#aab4c4" />

      {/* ===== LCD 屏 ===== */}
      <rect x="86" y="96" width="68" height="64" rx="9" fill="url(#oc-screen)" stroke="#06080f" strokeWidth="2" />
      {/* 弯笑眼（青色） */}
      <g fill="none" stroke="#63e6ff" strokeWidth="4" strokeLinecap="round">
        <path d="M99 120 Q106 110 113 120">
          {blink && <animate attributeName="d" values="M99 120 Q106 110 113 120;M99 120 Q106 110 113 120;M99 118 Q106 120 113 118;M99 120 Q106 110 113 120" dur="4.5s" keyTimes="0;0.9;0.95;1" repeatCount="indefinite" />}
        </path>
        <path d="M127 120 Q134 110 141 120">
          {blink && <animate attributeName="d" values="M127 120 Q134 110 141 120;M127 120 Q134 110 141 120;M127 118 Q134 120 141 118;M127 120 Q134 110 141 120" dur="4.5s" keyTimes="0;0.9;0.95;1" repeatCount="indefinite" />}
        </path>
      </g>
      {/* 微笑 */}
      <path d="M108 138 Q120 150 132 138" fill="none" stroke="#63e6ff" strokeWidth="3.5" strokeLinecap="round" />
      {/* 粉脸蛋 */}
      <g fill="#ff7e9b" opacity="0.9">
        <ellipse cx="97" cy="135" rx="4.5" ry="3" />
        <ellipse cx="143" cy="135" rx="4.5" ry="3" />
      </g>
    </svg>
  );
}
