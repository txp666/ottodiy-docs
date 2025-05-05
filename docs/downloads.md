---
id: downloads
title: 程序烧录
sidebar_position: 5
---

import useBaseUrl from '@docusaurus/useBaseUrl';

export const ImgWithBaseUrl = ({src, alt, width}) => (
<img src={useBaseUrl(src)} alt={alt} width={width ? width : undefined} />
);

# 程序烧录

在这里，您可以找到 Otto DIY 机器人相关的所有程序文件和源代码链接。

## 源代码仓库

### ESP32+AI 版本源代码

- **GitHub 仓库**：[小智 ESP32 AI 机器人源码](https://github.com/txp666/xiaozhi-esp32)
- **功能**：包含 Wi-Fi 连接、语音识别、AI 对话等全部功能
- **适用**：对开发和定制有兴趣的用户

### 原版 Arduino 源代码

- **GitHub 仓库**：[Otto DIY 原版 Arduino 源码](https://github.com/OttoDIY/OttoDIYLib)
- **功能**：基础运动、表情和声音功能
- **适用**：Arduino 版本 Otto DIY

## 固件下载

### ESP32+AI 版本固件

| 版本 | 发布日期  | 功能描述                              | 下载链接                       |
| ---- | --------- | ------------------------------------- | ------------------------------ |
| v1.0 | 2025-4-9  | 初始版本，包含基本动作和语音控制功能  | 1.0                            |
| v1.1 | 2025-4-23 | 更新到小智 1.6.0，另修复突然"瘫痪"bug | 1.1                            |
| v1.2 | 2025-4-26 | 增加手臂功能代码                      | [1.2](/files/merged-flash.bin) |

**下载最新固件即可，兼容所有版本电路板**

### 烧录工具

- **ESP32 Flash Download Tool**：[下载链接](https://www.espressif.com.cn/sites/default/files/tools/flash_download_tool_3.9.5.zip)
  - 适用于 Windows 系统
- **ESPTool (命令行)**：`pip install esptool`
  - 适用于 Linux、macOS 和 Windows

### 合并固件命令

如果需要自己合并固件，可以使用以下命令：

```bash
esptool.py --chip esp32s3 merge_bin -o merged-flash.bin --flash_mode dio --flash_size 16MB 0x0 build/bootloader/bootloader.bin 0x100000 build/xiaozhi.bin 0x8000 build/partition_table/partition-table.bin 0xd000 build/ota_data_initial.bin 0x10000 build/srmodels/srmodels.bin
```

## 烧录指南

<span style={{color: 'red'}}><strong>烧录前确保电池已经安装！！！！！！！！！！！</strong></span>

1. 下载最新版本的固件文件（.bin）
2. 下载并安装烧录工具
3. 将 Otto 通过 USB 连接到电脑（<span style={{color: 'red'}}><strong>注意，如果 ESP32 是第一次烧录程序，打开开关前需要按住 BOOT 按钮！！！！！！！！</strong></span>）
4. 启动烧录工具，选择正确的 COM 端口
5. 按照以下参数设置烧录：
   - 波特率：921600
   - 烧录地址：0x0
   - 选择下载的固件文件
6. 点击"开始"进行烧录
7. <span style={{color: 'red'}}><strong>烧录完成后，重启主板！！！！！！！</strong></span>
<p align="center">
  <ImgWithBaseUrl src="/img/download1.png" alt="download1" />
  <div align="center"><em>图1：选择ESP32S3,串口</em></div>
</p>
<p align="center">
  <ImgWithBaseUrl src="/img/download2.png" alt="download2" />
  <div align="center"><em>图2：选择程序，COM,开始下载</em></div>
</p>

## 常见问题解答

1. **烧录失败怎么办？**

   - 检查 USB 连接
   - 在烧录时按住 主板 上的 BOOT 按钮
   - 尝试降低波特率到 115200

2. **固件有兼容性问题？**

   - 确认您使用的是推荐的 ESP32 型号
   - 检查周边硬件是否与参考设计一致

## 鸣谢以下开源项目：

- [OttoDIYLib](https://github.com/OttoDIY/OttoDIYLib)
- [xiaozhi-esp32](https://github.com/78/xiaozhi-esp32)
- [OTTO_ESP32](https://github.com/txp666/OTTO_ESP32)
- [Peak](https://github.com/peng-zhihui/Peak)
- [ElectronBot-Peripheral](https://github.com/maker-community/ElectronBot-Peripheral/tree/main)
