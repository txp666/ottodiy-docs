---
id: downloads
title: Firmware Flashing
sidebar_position: 5
---

import useBaseUrl from '@docusaurus/useBaseUrl';

export const ImgWithBaseUrl = ({src, alt, width}) => (
<img src={useBaseUrl(src)} alt={alt} width={width ? width : undefined} />
);

# Firmware Flashing

Here you can find all program files and source code links related to the Otto DIY robot.

## Source Code Repositories

### ESP32+AI Version Source Code

- **GitHub Repository**: [Xiaozhi ESP32 AI Robot Source Code](https://github.com/txp666/xiaozhi-esp32)
- **Features**: Includes all features such as Wi-Fi connection, voice recognition, AI dialogue
- **For**: Users interested in development and customization

### Original Arduino Source Code

- **GitHub Repository**: [Otto DIY Original Arduino Source Code](https://github.com/OttoDIY/OttoDIYLib)
- **Features**: Basic movement, expression, and sound functions
- **For**: Arduino version Otto DIY

## Firmware Downloads

### ESP32+AI Version Firmware

| Version | Release Date | Feature Description                                                                                                                 | Download Link                |
| ------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| v2.0.4  | 2025-10-31   | Updated to Xiaozhi 2.0.4 with added fixed actions and AI custom programmed actions, see MCP tools in [User Manual](/docs/usage#五动作) for details | [2.0.4](/files/otto2.0.4.bin) |
| v1.4.4  | 2025-6-13    | Added initial position calibration, "Dialogue: calibrate left foot to 10 degrees/-10 degrees"                                      | [1.4.4](/files/otto1.4.4.bin) |
| v1.4.3  | 2025-6-13    | fix(ota): Fixed OTA upgrade crash bug                                                                                               | 1.4.3                        |
| v1.4.2  | 2025-6-5     | 1. Code standardization<br/>2. Fixed theme switching bug                                                                            | 1.4.2                        |
| v1.4.0  | 2025-6-5     | 1. Updated to Xiaozhi 1.7.0<br/>2. MCP protocol control robot actions<br/>3. GIF expressions inherit lcdDisplay, Otto-specific theme | 1.4.0                        |
| v1.3.1  | 2025-5-27    | 1. Added task priority to prevent listening state action slowdown<br/>2. Action task resident, no detach to solve "jerking" bug, but increases power consumption<br/>3. Home restoration 500 | [1.3.1](/files/otto1.3.1.bin) |
| v1.2    | 2025-4-26    | Added arm function code                                                                                                             | 1.2                          |
| v1.1    | 2025-4-23    | Updated to Xiaozhi 1.6.0, fixed sudden "paralysis" bug                                                                              | 1.1                          |
| v1.0    | 2025-4-9     | Initial version with basic movement and voice control features                                                                      | 1.0                          |

**Download the latest firmware, compatible with all circuit board versions**

### Flashing Tools

- **ESP32 Flash Download Tool**: [Download Link](https://www.espressif.com.cn/sites/default/files/tools/flash_download_tool_3.9.5.zip)
  - For Windows systems
- **ESPTool (Command Line)**: `pip install esptool`
  - For Linux, macOS, and Windows

### Merge Firmware Command

If you need to merge firmware yourself, use the following command:

```bash
esptool.py --chip esp32s3 merge_bin -o merged-flash.bin --flash_mode dio --flash_size 16MB 0x0 build/bootloader/bootloader.bin 0x100000 build/xiaozhi.bin 0x8000 build/partition_table/partition-table.bin 0xd000 build/ota_data_initial.bin 0x10000 build/srmodels/srmodels.bin
```

## Flashing Guide

<span style={{color: 'red'}}><strong>Make sure the battery is installed before flashing!!!!!!!!</strong></span>

1. Download the latest firmware file (.bin)
2. Download and install the flashing tool
3. Connect Otto to computer via USB (<span style={{color: 'red'}}><strong>Note: If ESP32 is being flashed for the first time, you need to hold the BOOT button before turning on the switch!!!!!!!!</strong></span>)
4. Launch the flashing tool and select the correct COM port
5. Set flashing parameters as follows:
   - Baud Rate: 921600
   - Flash Address: 0x0
   - Select the downloaded firmware file
6. Click "Start" to flash
7. <span style={{color: 'red'}}><strong>After flashing is complete, restart the board!!!!!!!!</strong></span>

<p align="center">
  <ImgWithBaseUrl src="/img/download1.png" alt="download1" />
  <div align="center"><em>Figure 1: Select ESP32S3, serial port</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/download2.png" alt="download2" />
  <div align="center"><em>Figure 2: Select program, COM, start download</em></div>
</p>

## FAQ

1. **What to do if flashing fails?**

   - Check USB connection
   - Hold the BOOT button on the board while flashing
   - Try reducing baud rate to 115200

2. **Firmware compatibility issues?**

   - Confirm you are using the recommended ESP32 model
   - Check if peripheral hardware matches the reference design

## Acknowledgments to the Following Open Source Projects:

- [OttoDIYLib](https://github.com/OttoDIY/OttoDIYLib)
- [xiaozhi-esp32](https://github.com/78/xiaozhi-esp32)
- [OTTO_ESP32](https://github.com/txp666/OTTO_ESP32)
- [Peak](https://github.com/peng-zhihui/Peak)
- [ElectronBot-Peripheral](https://github.com/maker-community/ElectronBot-Peripheral/tree/main)
