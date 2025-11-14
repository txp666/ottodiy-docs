---
id: assembly
title: Assembly Guide
sidebar_position: 4
---

import useBaseUrl from '@docusaurus/useBaseUrl';

export const ImgWithBaseUrl = ({src, alt, width}) => (
<img src={useBaseUrl(src)} alt={alt} width={width ? width : undefined} />
);

# Assembly Guide

## Video

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', background: '#000'}}>
  <iframe 
    src="//player.bilibili.com/player.html?isOutside=true&aid=114563085500433&bvid=BV1dyjhzzExr&cid=30130244949&p=1" 
    scrolling="no" 
    border="0" 
    frameborder="no" 
    framespacing="0" 
    allowfullscreen="true"
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
  />
</div>

## Preparation

Before starting assembly, make sure you have:

1. All necessary parts (refer to [Bill of Materials](/docs/bom))
2. Required tools (diagonal pliers, M2 screwdriver)
3. A clean work surface

## Assembly Steps

### 1. Material Preparation

1. Check that all 3D printed parts are complete
2. Clean support material from printed parts
3. Ensure all holes are clear

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step1.jpg" alt="step1" />
  <div align="center"><em>Figure 1: All materials prepared</em></div>
</p>

### 2. Electronic Component Installation

1. Install servos (**Double row 3-pin on both sides -> outer side connects brown servo wire (negative pole), upper leg lower foot connection method**)
2. Connect speaker
3. Connect battery
4. Flash firmware
5. Turn on switch (initialize servos to initial position -> 90 degrees **ensure servo gears don't change during installation**, arms initially at 45 degrees downward)
6. Remove servo wires, wait for body installation to complete before reconnecting

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step2.jpg" alt="step2" />
  <div align="center"><em>Figure 2: Electronic component installation</em></div>
</p>

### 3. Leg Assembly

**Use the two large screws included with the servo to secure it**

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step3_1.png" alt="step3_1" />
  <div align="center"><em>Figure 3: Assemble leg servo</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step3_2.png" alt="step3_2" />
  <div align="center"><em>Figure 4: Complete leg servo assembly</em></div>
</p>

**Trim servo cross arm: cut the two longer ends by approximately half**

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step3_3.png" alt="step3_3" />
  <div align="center"><em>Figure 5: Trim servo cross arm</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step3_4.png" alt="step3_4" />
  <div align="center"><em>Figure 6: Install cross arm to leg</em></div>
</p>

**Keep leg cylindrical protrusion facing the screen side, leg direction vertically forward (try to avoid pigeon-toed or duck-footed, some may have a slight angle which doesn't affect performance)**

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step3_5.png" alt="step3_5" />
  <div align="center"><em>Figure 7: Secure leg and tighten fixing screws</em></div>
</p>

### 4. Foot Assembly

**Use the shaped arm shown below, install vertically upward, and tighten screws**

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step4_1.png" alt="step4_1" />
  <div align="center"><em>Figure 8: Secure foot servo arm</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step4_2.png" alt="step4_2" />
  <div align="center"><em>Figure 9: Secure foot</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step4_3.png" alt="step4_3" />
  <div align="center"><em>Figure 10: Route foot servo wire through body</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step4_4.png" alt="step4_4" />
  <div align="center"><em>Figure 11: Foot installation</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step4_5.png" alt="step4_5" />
  <div align="center"><em>Figure 12: Install foot servo fixing screws</em></div>
</p>

### 5. Circuit Board Installation

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step5_1.png" alt="step5_1" />
  <div align="center"><em>Figure 13: Secure speaker, there's a slot with wire</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step5_2.png" alt="step5_2" />
  <div align="center"><em>Figure 14: Install servo wires, speaker, battery, antenna</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step5_3.png" alt="step5_3" />
  <div align="center"><em>Figure 15: Install main board</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step5_4.png" alt="step5_4" />
  <div align="center"><em>Figure 16: Ensure screen, Type-C charging port and switch are properly installed</em></div>
</p>

### 6. Head Cover Installation

<p align="center">
  <ImgWithBaseUrl src="/img/assembly/step6_1.png" alt="step6_1" />
  <div align="center"><em>Figure 17: Head cover front side has a protrusion to press down circuit board</em></div>
</p>

## Precautions

- Handle carefully during assembly to avoid damaging parts
- Ensure all screws are tight but don't over-tighten
- Pay attention to servo installation direction

## Common Issues

1. **Servo not moving**

   - Restart
   - Check if wiring is correct
   - Confirm power supply is normal
   - Verify firmware is flashed correctly

2. **Unstable structure**
   - Check if screws are tightened
   - Confirm 3D printed parts are not deformed

## Next Steps

After completing assembly, refer to the [User Manual](/docs/usage) page to learn how to start using your robot.

If you encounter any problems, please check our [FAQ](/docs/faq) or contact technical support.
