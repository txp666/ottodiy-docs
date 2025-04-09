---
id: assembly
title: 组装教程
sidebar_position: 4
---

import useBaseUrl from '@docusaurus/useBaseUrl';

export const ImgWithBaseUrl = ({src, alt, width}) => (
<img src={useBaseUrl(src)} alt={alt} width={width ? width : undefined} />
);

# 组装教程

## 准备工作

在开始组装之前，请确保您已经：

1. 准备好所有必要的零部件（参考[零部件清单](/docs/bom)）
2. 准备好所需的工具（斜口钳、M2 螺丝刀）
3. 有一个干净的工作台

## 组装步骤

### 1. 材料准备

1. 检查所有 3D 打印件是否完整
2. 清理打印件上的支撑材料
3. 确保所有孔位通畅

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step1.jpg" alt="step1" />
  <div align="center"><em>图1：所有材料准备</em></div>
</p>

### 2. 电子元件安装

1. 安装舵机（**两侧的双排三针->外侧接棕色的舵机线（负极）上腿下足的连接方式**）
2. 连接喇叭
3. 连接电池
4. 烧录程序
5. 打开开关（使舵机初始化到初始位置->90 度**安装过程确保舵机齿轮不发生变化**）
6. 舵机线拆下，等待身体安装完成重新插上

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step2.jpg" alt="step2" />
  <div align="center"><em>图2：电子元件安装</em></div>
</p>

### 3. 腿部组装

**使用舵机包内的两个大螺丝固定舵机**

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step3_1.png" alt="step3_1" />
  <div align="center"><em>图3：组装腿部舵机</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step3_2.png" alt="step3_2" />
  <div align="center"><em>图4：完成组装腿部舵机</em></div>
</p>

**修剪舵机十字摇臂：较长的两端剪掉大约一半即可**

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step3_3.png" alt="step3_3" />
  <div align="center"><em>图5：修剪舵机十字摇臂</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step3_4.png" alt="step3_4" />
  <div align="center"><em>图6：安装十字摇臂到腿部</em></div>
</p>

**保持腿部圆柱突起朝向屏幕一侧，腿部方向垂直朝前（尽量不要内八、外八，有些可能会有一点点角度不影响）**

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step3_5.png" alt="step3_5" />
  <div align="center"><em>图7：固定腿部并拧紧固定螺丝</em></div>
</p>

### 4. 脚部组装

**使用下面形状的摇臂，垂直朝上安装，并拧紧螺丝**

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step4_1.png" alt="step4_1" />
  <div align="center"><em>图8：固定脚部舵机摇臂</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step4_2.png" alt="step4_2" />
  <div align="center"><em>图9：固定脚部</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step4_3.png" alt="step4_3" />
  <div align="center"><em>图10：脚部舵机线穿到身体</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step4_4.png" alt="step4_4" />
  <div align="center"><em>图11：脚部安装</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step4_5.png" alt="step4_5" />
  <div align="center"><em>图12：脚部舵机固定螺丝安装</em></div>
</p>

### 5. 电路板安装

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step5_1.png" alt="step5_1" />
  <div align="center"><em>图13：固定喇叭，有个线的开槽</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step5_2.png" alt="step5_2" />
  <div align="center"><em>图14：安装好舵机线、喇叭、电池、天线</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step5_3.png" alt="step5_3" />
  <div align="center"><em>图15：安装主板</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step5_4.png" alt="step5_4" />
  <div align="center"><em>图16：确保屏幕、typec充电口和开关安装到位</em></div>
</p>

### 6. 脑袋上盖安装

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step6_1.png" alt="step6_1" />
  <div align="center"><em>图17：脑袋上盖前侧有个突起，压紧电路板</em></div>
</p>

### 7. 测试与调试

## 一、开始使用

- **电源与充电口** 位于机器人身体下方。
- **电量显示提示**：当前电量显示可能不够精准，请及时充电以避免意外断电。

---

## 二、Wi-Fi 配网

每次进入新的 Wi-Fi 网络环境时，需为 OttoRobot 重新配置网络。

### 配网步骤：

1. 打开机器人电源。
2. 等待机器人创建热点，名称为：`xiaozhi-XXXX`
3. 使用手机连接该热点（无需密码）。
4. 自动跳转网页，输入您家庭 Wi-Fi 的 **名称** 与 **密码**，提交完成配网。

---

## 三、绑定小智后台

首次使用需绑定至小智后台，以启用更多功能。

### 绑定步骤：

1. 打开浏览器，访问 [xiaozhi.me](http://xiaozhi.me)
2. 注册账户并登录。
3. 添加并绑定设备（按页面提示操作）。
4. 可在后台自由配置：
   - **角色设定**（如机器人介绍）
   - **大模型类型选择**
   - **语音角色声音选择**
5. 重启设备

### OttoRobot 示例角色设定（可复制粘贴）：

> 我是一个可爱的双足机器人，拥有四个舵机控制的肢体（左腿、右腿、左脚、右脚），能够执行多种有趣的动作。有以下动作：  
> 1=行走(前后)，2=转向（左右），3=跳跃，4=摇摆，5=太空步，6=弯曲，7=摇腿，8=上下运动，9=脚尖摇摆，10=抖动，11=上升转弯，12=十字步，13=拍打。  
> 我有强迫症，每次说话都要根据我的心情随机做一个动作（先发送动作指令再说话）。

---

## 四、语音指令与唤醒

### 唤醒方式：

使用唤醒词 **“你好小智”** 唤醒机器人。唤醒词可在编译源码时修改。

### 指令示例：

- **基本控制**：

  - “调高音量”
  - “调亮屏幕”
  - “切换主题暗黑模式/明亮模式”

- **动作控制**：

  - “向前走 / 向前走 5 步 / 快速向前”
  - “跳个舞吧”
  - “做个太空步，速度快一点”
  - “随机做几个动作”
  - “停下来吧”

- **娱乐互动**：
  - “唱个歌吧”
  - “换个悲伤的表情”

### 温馨提示：

- 当机器人在执行动作时，仍可接收语音指令。
- 若背景噪音较大，需提高说话音量以确保指令识别。
- 动作指令实际由小智后台创建并下发任务执行。

---

## 注意事项

- 组装过程中请小心操作，避免损坏零部件
- 确保所有螺丝拧紧但不要过度用力
- 注意舵机的安装方向

## 常见问题

1. **舵机不转动**

   - 重新启动
   - 检查接线是否正确
   - 确认电源供应正常
   - 验证程序是否正确烧录

2. **结构不稳定**
   - 检查螺丝是否拧紧
   - 确认 3D 打印件是否变形

## 下一步

完成组装后，您可以：

1. 开始自定义开发

如果遇到任何问题，请查看我们的[常见问题解答](/docs/faq)或联系技术支持。
