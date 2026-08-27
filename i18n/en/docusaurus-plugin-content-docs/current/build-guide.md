---
id: build-guide
title: Source Build Guide
sidebar_position: 7
description: Build and flash the Otto Robot firmware with VS Code and ESP-IDF v6.0.2.
---

import useBaseUrl from '@docusaurus/useBaseUrl';

export const TutorialImage = ({src, alt, caption}) => (
  <figure style={{textAlign: 'center', margin: '1.5rem 0'}}>
    <img src={useBaseUrl(src)} alt={alt} loading="lazy" />
    <figcaption style={{color: 'var(--ifm-color-emphasis-700)', marginTop: '0.5rem'}}>{caption}</figcaption>
  </figure>
);

# Source Build Guide

This guide explains how to build the Otto Robot firmware with ESP-IDF in VS Code and flash it to the ESP32-S3 board over USB.

:::tip

If you only want to use the robot and do not need to modify its source code, use the online flasher on the [Firmware Flashing](./downloads) page instead. No development environment is required.

:::

## Prerequisites

Prepare the following:

- VS Code or Cursor with Espressif's official **ESP-IDF** extension;
- **ESP-IDF v6.0.2**. The main branch requires a stable v6.0 or later release, with v6.0.2 preferred;
- Git and a USB Type-C cable that supports data transfer;
- An Otto Robot board with its battery installed.

Clone the source and open the project directory:

```bash
git clone https://github.com/txp666/xiaozhi-esp32.git
cd xiaozhi-esp32
code .
```

On first use, complete the ESP-IDF toolchain setup requested by the extension and confirm that the intended ESP-IDF version appears in the editor status bar.

## 1. Select the ESP32-S3 target

Click the target name in the bottom status bar and select `esp32s3` from the list.

<TutorialImage src="/img/build/1.webp" alt="Selecting esp32s3 as the target in VS Code" caption="Figure 1: Set the target to esp32s3" />

The first project configuration can take longer because ESP-IDF downloads dependencies and generates build files. Once configuration finishes, click the gear icon in the bottom bar to open the **SDK Configuration Editor (menuconfig)**.

<TutorialImage src="/img/build/2.webp" alt="Waiting for initial ESP-IDF configuration and opening the SDK Configuration Editor" caption="Figure 2: Open the SDK Configuration Editor after setup completes" />

## 2. Select the Otto Robot board

In the SDK Configuration Editor, expand **Xiaozhi Assistant** and locate **Target Board**.

<TutorialImage src="/img/build/3.webp" alt="Locating Target Board under Xiaozhi Assistant" caption="Figure 3: Locate the Target Board setting" />

Open the board list and select **Otto Robot**. If it is missing, verify that `esp32s3` was selected in step 1.

<TutorialImage src="/img/build/4.webp" alt="Selecting Otto Robot from the Target Board list" caption="Figure 4: Select the Otto Robot board" />

## 3. Enable WebSocket support

Search for `websocket` in the SDK Configuration Editor. Enable **Component config → HTTP Server → WebSocket server support**. Some source revisions enable it automatically; if it is already selected, leave it enabled.

<TutorialImage src="/img/build/5.webp" alt="Enabling HTTP Server WebSocket server support" caption="Figure 5: Enable WebSocket server support" />

Click **Save** in the upper-right corner and wait for the configuration to be written.

<TutorialImage src="/img/build/6.webp" alt="Saving the ESP-IDF SDK configuration" caption="Figure 6: Save the SDK configuration" />

## 4. Build the firmware

Click **Build** in the bottom bar. The first build takes longer because it may download additional components. Continue only after the terminal reports a successful build.

<TutorialImage src="/img/build/7.webp" alt="Building the Otto Robot firmware with the ESP-IDF Build button" caption="Figure 7: Build the firmware" />

Build artifacts are written to `build/`. When flashing, the ESP-IDF extension writes the bootloader, partition table, application, and assets automatically; do not flash only `xiaozhi.bin`. To produce one distributable image, see the [merge command on the Firmware Flashing page](./downloads#merge-firmware-command).

## 5. Connect the board and select its port

Make sure the battery is installed. Connect the Otto Robot to the computer with a USB Type-C data cable, then select the newly detected serial port in the ESP-IDF extension.

:::warning

- For the first flash, or if the board cannot enter download mode automatically, hold **BOOT** while switching on the board and try again.
- The standard and camera models use the same firmware. Connect the camera before powering on a camera model because the firmware detects it during startup.

:::

<TutorialImage src="/img/build/8.webp" alt="Selecting the Otto Robot USB serial port after building" caption="Figure 8: Connect the board and select its serial port" />

## 6. Flash and inspect the log

Click **Flash** in the bottom bar.

<TutorialImage src="/img/build/9.webp" alt="Clicking the ESP-IDF Flash button" caption="Figure 9: Start flashing" />

When prompted for a flash method, select **UART**. Wait until the terminal reports completion. Open the ESP-IDF serial monitor if you need to inspect its startup log.

<TutorialImage src="/img/build/10.webp" alt="Selecting UART as the ESP-IDF flash method" caption="Figure 10: Select UART flashing" />

## Troubleshooting

### Otto Robot is not listed

Confirm that the target is `esp32s3`, then close and reopen the SDK Configuration Editor.

### The build is stuck downloading components

The first build requires network access to download dependencies. Check the connection and retry, and verify that the ESP-IDF extension uses a stable v6.0 or later release.

### No serial port appears

Try a known data-capable USB cable and another USB port. For the first flash, hold **BOOT** while switching on the board. Windows users should also verify that the serial driver is installed.

### The board does not boot after flashing

Power it off, check the camera and other ribbon cables, then power it on again and inspect the serial log. To restore a released firmware, use the latest image on the [Firmware Flashing](./downloads) page.
