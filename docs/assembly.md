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
5. 打开开关（使舵机初始化到初始位置->90 度**安装过程确保舵机齿轮不发生变化**,手臂初始为向下 45 度）
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

完成组装后，请参考[使用说明](/docs/usage)页面了解如何开始使用您的机器人。

如果遇到任何问题，请查看我们的[常见问题解答](/docs/faq)或联系技术支持。
