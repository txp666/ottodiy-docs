---
sidebar_position: 4
---

import useBaseUrl from '@docusaurus/useBaseUrl';

export const ImgWithBaseUrl = ({src, alt, width}) => (
<img src={useBaseUrl(src)} alt={alt} width={width ? width : undefined} />
);

# Soldering Guide

## Soldering Auxiliary Tools

  <div style={{width: '100%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/9.png" alt="9" />
    <div><em>Figure 9</em></div>
  </div>
  <div style={{width: '100%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/10.png" alt="10" />
    <div><em>Figure 10</em></div>
  </div>

## Module Board Key Points

<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/1.jpg" alt="1" />
    <div><em>Figure 1</em></div>
  </div>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/2.jpg" alt="2" />
    <div><em>Figure 2</em></div>
  </div>
</div>

<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/3.jpg" alt="3" />
    <div><em>Figure 3</em></div>
  </div>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/4.jpg" alt="4" />
    <div><em>Figure 4</em></div>
  </div>
</div>

<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/5.jpg" alt="5" />
    <div><em>Figure 5</em></div>
  </div>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/6.jpg" alt="6" />
    <div><em>Figure 6</em></div>
  </div>
</div>

## Non-Module Board

<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/7.png" alt="7" />
    <div><em>Figure 7</em></div>
  </div>
  <div style={{width: '48%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/8.png" alt="8" />
    <div><em>Figure 8</em></div>
  </div>
</div>

- **Microphone**: Pin 3 GND ring must be soldered well, otherwise it will heat up unstably and easily burn out. Do not use hot air for a long time, apply solder to the pad first, then quickly place the microphone after melting. Refer to the manual for soldering temperature:
  <div style={{width: '100%', textAlign: 'center'}}>
    <ImgWithBaseUrl src="/img/Soldering/11.png" alt="11" />
    <div><em>Figure 11</em></div>
  </div>
- **Amplifier**: Pay attention to direction, + sign corresponds to the white dot in the upper right corner
- **ESP32**: Bottom pads are best soldered, apply solder paste, place on heating platform, or blow with hot air gun
- **LED**: Left side is negative pole, LED green line faces left, or look at the bottom triangle, the tip points left. This light is the charging indicator, it will slightly light up even without battery

## Required Tools

The following basic tools are needed to solder the Otto robot:

- **Temperature-Controlled Soldering Iron**: Recommended adjustable iron, set to 320-350°C
- **Solder Wire**: Recommended 0.8mm diameter leaded solder (60/40 or 63/37)
- **Flux**: Helps with smooth soldering
- **Soldering Station**: For securing the iron
- **Desoldering Braid/Pump**: For correcting soldering mistakes
- **Tweezers**: For placing small components
- **Magnifier/Microscope**: For inspecting solder joints
- **Alcohol**: For cleaning PCB
- **Hot Air Gun**: For removing components (optional)

## Post-Soldering Inspection

After completing all soldering, perform the following checks:

1. **Visual Inspection**: Check all solder joints for cold solder or short circuits
2. **Continuity Test**: Use a multimeter to test continuity at key points
3. **Clean PCB**: Clean flux residue on the PCB with alcohol
4. **Short Circuit Check**: Check for shorts between power and ground
5. **Function Test**: Plug in USB cable, check if device is recognized properly
6. **Voltage Test**: Check if voltage at key test points is normal

## Advanced Soldering Tips

1. **Control Soldering Time**: Heating time for each joint should not exceed 3-5 seconds
2. **Keep Iron Tip Clean**: Regularly clean the iron tip for good heat conduction
3. **Correct Soldering Angle**: Maintain a 45-degree angle when touching the pad and component pin
4. **Adequate Heat Transfer**: Ensure simultaneous heating of both pad and component pin
5. **Patience is Key**: Don't rush, especially with small components

## Common Questions

**Q: Why doesn't my solder stick to the pad?**

A: The pad may be dirty or oxidized, try using flux and ensure the iron temperature is sufficient.

**Q: How to judge the quality of a solder joint?**

A: A good solder joint should be smooth and shiny, conical or volcanic in shape, and fully fused with the pad and component pin.

**Q: What to do when ESP32 pins are too densely packed?**

A: Use a fine-tip iron with flux, or consider using hot air with solder paste.

**Q: How to check for short circuits after soldering?**

A: Use the multimeter's continuity test function to check if there are unexpected connections between adjacent pins.

**Q: What are the most common beginner mistakes?**

A: Poor solder amount control (too much or too little), insufficient or excessive heating time, not using flux.

## Next Steps After Soldering

After completing soldering, you can proceed with:

1. [Downloads](/docs/downloads) - Flash firmware to your Otto robot
2. [Assembly Guide](/docs/assembly) - Assemble the soldered PCB into the 3D printed shell
