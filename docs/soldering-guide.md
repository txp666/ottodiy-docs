---
sidebar_position: 4
---

import useBaseUrl from '@docusaurus/useBaseUrl';

export const ImgWithBaseUrl = ({src, alt, width}) => (
<img src={useBaseUrl(src)} alt={alt} width={width ? width : undefined} />
);

# 焊接指南

## 焊接辅助工具

  <div style={{width: '100%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/9.png" alt="9" />
    <div><em>9</em></div>
  </div>
  <div style={{width: '100%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/10.png" alt="10" />
    <div><em>10</em></div>
  </div>
## 模块板关键

<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/1.jpg" alt="1" />
    <div><em>1</em></div>
  </div>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/2.jpg" alt="2" />
    <div><em>2</em></div>
  </div>
</div>

<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/3.jpg" alt="3" />
    <div><em>3</em></div>
  </div>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/4.jpg" alt="4" />
    <div><em>4</em></div>
  </div>
</div>

<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/5.jpg" alt="5" />
    <div><em>5</em></div>
  </div>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/6.jpg" alt="6" />
    <div><em>6</em></div>
  </div>
</div>

## 非模块板

<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/7.png" alt="7" />
    <div><em>7</em></div>
  </div>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/8.png" alt="8" />
    <div><em>8</em></div>
  </div>
</div>

- **麦克风**：第 3 引脚 GND 一圈必须焊好，否则发热不稳定，易烧坏。同时不要长时间用风枪吹，先在焊盘上锡，吹化以后迅速放上麦克风
- **功放**：注意方向 +号对应右上角白点
- **ESP32**：底部焊盘最好焊上，涂点锡膏，放在加热台，或者热风枪吹
- **led**：左侧为负极，led 绿色竖线朝左，或者看底部三角形，尖尖朝左，该灯为充电指示灯，不插电池会微微亮

## 所需工具

焊接 Otto 机器人需要以下基本工具：

- **恒温烙铁**：推荐温度可调节的烙铁，设置在 320-350°C
- **焊锡丝**：推荐使用 0.8mm 直径的有铅焊锡（60/40 或 63/37)
- **助焊剂**：有助于焊接顺利进行
- **焊台**：用于固定烙铁
- **吸锡带/吸锡器**：用于修正焊接错误
- **镊子**：用于放置小型元件
- **放大镜/显微镜**：用于检查焊点
- **酒精**：用于清洁 PCB 板
- **热风枪**：用于拆卸元件（可选）

## 焊接后检查

完成所有焊接后，进行以下检查：

1. **目视检查**：检查所有焊点，确保无虚焊、短路
2. **连通性测试**：使用万用表测试关键点的连通性
3. **清洁 PCB**：用酒精清洁 PCB 板上的助焊剂残留
4. **短路检查**：检查电源和地之间是否有短路
5. **功能测试**：插上 USB 线，检查设备是否能正常识别
6. **电压测试**：检查关键测试点的电压是否正常

## 焊接技巧的进阶提示

1. **控制焊接时间**：每个焊点的加热时间不要超过 3-5 秒
2. **保持烙铁头清洁**：定期清理烙铁头，确保良好的热传导
3. **正确的焊接角度**：保持 45 度角接触焊点和元件引脚
4. **足够的热量传递**：确保同时加热焊盘和元件引脚
5. **耐心是关键**：不要急于完成，特别是对于小型元件

## 常见问题

**Q: 为什么我的焊锡不粘在焊盘上？**

A: 可能是焊盘不干净或氧化，尝试使用助焊剂，并确保烙铁温度足够。

**Q: 如何判断焊点质量好坏？**

A: 好的焊点应当光滑有光泽，呈现锥形或火山形，与焊盘和元件引脚充分融合。

**Q: 焊接 ESP32 时引脚太密集怎么办？**

A: 可以使用细尖头烙铁，辅以助焊剂，或考虑使用热风枪配合锡膏焊接。

**Q: 焊接后如何检查是否有短路？**

A: 使用万用表的蜂鸣测试功能，检查相邻引脚之间是否存在意外连接。

**Q: 初学者最容易犯的错误是什么？**

A: 焊锡量控制不当（过多或过少）、加热时间不足或过长、未使用助焊剂。

## 焊接后的下一步

焊接完成后，您可以继续进行：

1. [下载程序](/docs/downloads) - 为您的 Otto 机器人烧录固件
2. [组装教程](/docs/assembly) - 将焊接好的 PCB 组装到 3D 打印外壳中
