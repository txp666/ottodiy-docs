---
id: build-guide
title: 源码编译教程
sidebar_position: 7
description: 使用 VS Code 和 ESP-IDF v6.0.2 编译并烧录 Otto Robot 固件。
---

import useBaseUrl from '@docusaurus/useBaseUrl';

export const TutorialImage = ({src, alt, caption}) => (
  <figure style={{textAlign: 'center', margin: '1.5rem 0'}}>
    <img src={useBaseUrl(src)} alt={alt} loading="lazy" />
    <figcaption style={{color: 'var(--ifm-color-emphasis-700)', marginTop: '0.5rem'}}>{caption}</figcaption>
  </figure>
);

# 源码编译教程

本教程介绍如何在 VS Code 中使用 ESP-IDF 编译 Otto Robot 固件，并通过 USB 将固件烧录到 ESP32-S3 主板。

:::tip

如果你只想使用机器人、不需要修改源码，可以直接前往[程序烧录](./downloads)页面在线烧录固件，无需安装开发环境。

:::

## 准备工作

开始前请准备：

- VS Code 或 Cursor，并安装 Espressif 官方 **ESP-IDF** 扩展；
- **ESP-IDF v6.0.2**。项目主线建议使用 v6.0 或以上稳定版本，v6.0.2 为首选版本；
- Git 和一根可传输数据的 USB Type-C 线；
- 已安装电池的 Otto Robot 主板。

下载源码并用编辑器打开项目目录：

```bash
git clone https://github.com/txp666/xiaozhi-esp32.git
cd xiaozhi-esp32
code .
```

首次使用 ESP-IDF 扩展时，先按照扩展提示完成工具链安装，并确认编辑器底部显示正确的 ESP-IDF 版本。

## 1. 选择 ESP32-S3 芯片

点击编辑器底部状态栏中的目标芯片名称，在弹出的列表中选择 `esp32s3`。

<TutorialImage src="/img/build/1.webp" alt="在 VS Code 中选择 esp32s3 目标芯片" caption="图 1：将目标芯片设置为 esp32s3" />

第一次配置项目时，ESP-IDF 会下载依赖并生成构建文件，耗时可能较长。等待配置完成后，点击底部的齿轮按钮打开 **SDK 配置编辑器（menuconfig）**。

<TutorialImage src="/img/build/2.webp" alt="等待 ESP-IDF 完成初始配置并打开 SDK 配置编辑器" caption="图 2：等待初始配置完成后打开 SDK 配置编辑器" />

## 2. 选择 Otto Robot 开发板

在 SDK 配置编辑器中展开 **Xiaozhi Assistant**，找到 **Target Board**。

<TutorialImage src="/img/build/3.webp" alt="在 SDK 配置编辑器中找到 Xiaozhi Assistant 的 Target Board" caption="图 3：找到 Target Board 配置项" />

打开开发板列表并选择 **Otto Robot**。如果列表中没有该选项，请先确认第 1 步选择的是 `esp32s3`。

<TutorialImage src="/img/build/4.webp" alt="在 Target Board 列表中选择 Otto Robot" caption="图 4：选择 Otto Robot 开发板" />

## 3. 启用 WebSocket 服务

在 SDK 配置编辑器顶部搜索 `websocket`，找到 **Component config → HTTP Server → WebSocket server support** 并勾选。某些源码版本会自动启用此选项；如果已经勾选，无需重复修改。

<TutorialImage src="/img/build/5.webp" alt="搜索并启用 HTTP Server 的 WebSocket server support" caption="图 5：启用 WebSocket server support" />

点击右上角的 **保存**，等待配置写入完成。

<TutorialImage src="/img/build/6.webp" alt="保存 ESP-IDF SDK 配置" caption="图 6：保存 SDK 配置" />

## 4. 编译固件

点击编辑器底部的 **生成（Build）** 按钮开始编译。首次编译需要下载组件，时间会比后续编译更长；终端出现构建成功提示后再继续烧录。

<TutorialImage src="/img/build/7.webp" alt="点击 ESP-IDF Build 按钮编译 Otto Robot 固件" caption="图 7：开始编译固件" />

编译产物位于项目的 `build/` 目录。VS Code 的 ESP-IDF 扩展会在烧录时自动写入引导程序、分区表、主程序和资源文件，不要只单独烧录 `xiaozhi.bin`。如需生成一个可分发的合并固件，请参考[程序烧录页面的合并固件命令](./downloads#合并固件命令)。

## 5. 连接设备并选择串口

确认电池已经安装，再使用 USB Type-C 数据线连接 Otto Robot 与电脑，然后从 ESP-IDF 扩展中选择新出现的串口。

:::warning

- 第一次烧录或无法自动进入下载模式时，请按住主板上的 **BOOT** 按钮再打开电源，然后重新尝试烧录。
- 普通版与摄像头版使用同一个固件。摄像头版本应在开机前连接好摄像头，系统会在启动时检测摄像头是否存在。

:::

<TutorialImage src="/img/build/8.webp" alt="编译完成后选择 Otto Robot 的 USB 串口" caption="图 8：连接设备并选择串口" />

## 6. 烧录并查看日志

点击编辑器底部的 **烧录（Flash）** 按钮。

<TutorialImage src="/img/build/9.webp" alt="点击 ESP-IDF Flash 按钮烧录固件" caption="图 9：开始烧录" />

出现烧录方式选择时，选择 **UART**。等待终端显示烧录完成；需要排查启动问题时，可再打开 ESP-IDF 串口监视器查看日志。

<TutorialImage src="/img/build/10.webp" alt="选择 UART 作为 ESP-IDF 烧录方式" caption="图 10：选择 UART 烧录" />

## 常见问题

### 找不到 Otto Robot

确认目标芯片是 `esp32s3`，然后关闭并重新打开 SDK 配置编辑器。

### 编译一直停在下载组件

首次构建需要联网下载依赖。检查网络后重试，并确认 ESP-IDF 扩展使用的是 v6.0 或以上的稳定版本。

### 找不到串口

换用确认支持数据传输的 USB 线和 USB 接口；首次烧录时按住 **BOOT** 再打开电源。Windows 用户还需要确认串口驱动已正确安装。

### 烧录后无法启动

先断电，检查摄像头和其他排线是否插好，再重新上电并查看串口日志。若只是想恢复官方固件，可返回[程序烧录](./downloads)页面重新烧录最新版本。
