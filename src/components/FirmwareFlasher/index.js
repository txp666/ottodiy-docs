import React, { useEffect, useMemo, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const ESP_WEB_TOOLS_SCRIPT =
  'https://unpkg.com/esp-web-tools@10/dist/web/install-button.js?module';

const scriptId = 'esp-web-tools-install-button';
let espWebToolsPromise;

const firmwareOptions = [
  {
    version: 'v2.2.6',
    date: '2026-5-18',
    bin: '/files/otto2.2.6.bin',
    manifest: '/files/otto2.2.6-web-flash-manifest.json',
  },
  {
    version: 'v2.0.5',
    date: '2025-12-8',
    bin: '/files/otto2.0.5.bin',
    manifest: '/files/otto2.0.5-web-flash-manifest.json',
  },
  {
    version: 'v2.0.4-2',
    date: '2025-11-17',
    bin: '/files/otto2.0.4-2.bin',
    manifest: '/files/otto2.0.4-2-web-flash-manifest.json',
  },
  {
    version: 'v2.0.4',
    date: '2025-10-31',
    bin: '/files/otto2.0.4.bin',
    manifest: '/files/otto2.0.4-web-flash-manifest.json',
  },
  {
    version: 'v1.4.4',
    date: '2025-6-13',
    bin: '/files/otto1.4.4.bin',
    manifest: '/files/otto1.4.4-web-flash-manifest.json',
  },
  {
    version: 'v1.3.1',
    date: '2025-5-27',
    bin: '/files/otto1.3.1.bin',
    manifest: '/files/otto1.3.1-web-flash-manifest.json',
  },
];

function loadEspWebTools() {
  if (typeof document === 'undefined') {
    return Promise.resolve();
  }

  if (window.customElements?.get('esp-web-install-button')) {
    return Promise.resolve();
  }

  if (!espWebToolsPromise) {
    espWebToolsPromise = new Promise((resolve, reject) => {
      let script = document.getElementById(scriptId);

      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'module';
        script.src = ESP_WEB_TOOLS_SCRIPT;
        document.head.appendChild(script);
      }

      script.addEventListener('load', () => {
        window.customElements.whenDefined('esp-web-install-button').then(resolve);
      });
      script.addEventListener('error', reject);
    });
  }

  return espWebToolsPromise;
}

export default function FirmwareFlasher({
  locale = 'zh',
  defaultVersion = 'v2.2.6',
  firmwareVersion,
}) {
  const initialVersion = firmwareVersion || defaultVersion;
  const [selectedVersion, setSelectedVersion] = useState(initialVersion);
  const [supportState, setSupportState] = useState('checking');
  const [installerState, setInstallerState] = useState('loading');
  const selectedFirmware =
    firmwareOptions.find((firmware) => firmware.version === selectedVersion) ||
    firmwareOptions[0];
  const manifestUrl = useBaseUrl(selectedFirmware.manifest);
  const downloadUrl = useBaseUrl(selectedFirmware.bin);

  const copy = useMemo(() => {
    if (locale === 'en') {
      return {
        eyebrow: 'Online flashing',
        title: `One-click flash ${selectedFirmware.version}`,
        description:
          'Connect Otto to this computer with USB, click the flash button, then choose the local serial port in the browser prompt.',
        firmwareLabel: 'Firmware version',
        released: 'Released',
        download: 'Download selected firmware',
        flashButton: 'Start online flashing',
        installerLoading: 'Loading online flashing tool...',
        installerUnavailable:
          'The online flashing tool could not be loaded. Check the network connection or use the firmware download link.',
        requirements:
          'Use Chrome or Edge on HTTPS or localhost. Hold BOOT while powering on if this is the first flash.',
        supported: 'Ready. The browser will ask you to select a serial port.',
        insecure:
          'Online flashing requires HTTPS or localhost. Open this page from the published site or a local dev server.',
        unsupported:
          'This browser does not support Web Serial. Please use Chrome or Edge on desktop, or use ESPTool manually.',
        notAllowed:
          'Serial access is blocked by this page or browser policy. Try Chrome/Edge on the published HTTPS site.',
        loading: 'Checking browser support...',
      };
    }

    return {
      eyebrow: '在线烧录',
      title: `一键烧录 ${selectedFirmware.version}`,
      description:
        '用 USB 把 Otto 连接到这台电脑，点击烧录按钮后，在浏览器弹窗里选择本机串口即可写入固件。',
      firmwareLabel: '固件版本',
      released: '发布日期',
      download: '下载所选固件',
      flashButton: '开始在线烧录',
      installerLoading: '正在加载在线烧录工具...',
      installerUnavailable: '在线烧录工具加载失败。请检查网络连接，或先下载固件后手动烧录。',
      requirements:
        '请使用 Chrome 或 Edge，并通过 HTTPS 或 localhost 打开本页。首次烧录时，请按住 BOOT 再打开电源。',
      supported: '已就绪。浏览器会请求选择本地串口。',
      insecure: '在线烧录需要 HTTPS 或 localhost。请从正式网站或本地开发服务器打开本页。',
      unsupported: '当前浏览器不支持 Web Serial。请在电脑端使用 Chrome/Edge，或改用 ESPTool 手动烧录。',
      notAllowed: '当前页面或浏览器策略禁止串口访问。请使用电脑端 Chrome/Edge 打开 HTTPS 正式网站。',
      loading: '正在检查浏览器支持...',
    };
  }, [locale, selectedFirmware.version]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    if (!window.isSecureContext) {
      setSupportState('insecure');
      setInstallerState('blocked');
      return;
    }

    const hasSerial = 'serial' in navigator;
    setSupportState(hasSerial ? 'supported' : 'unsupported');

    if (!hasSerial) {
      setInstallerState('blocked');
      return;
    }

    loadEspWebTools()
      .then(() => setInstallerState('ready'))
      .catch(() => setInstallerState('error'));
  }, []);

  const statusText =
    installerState === 'error'
      ? copy.installerUnavailable
      : installerState === 'loading' && supportState === 'supported'
        ? copy.installerLoading
        : supportState === 'checking'
      ? copy.loading
      : supportState === 'supported'
        ? copy.supported
        : supportState === 'insecure'
          ? copy.insecure
          : copy.unsupported;

  return (
    <section className={styles.wrapper} aria-labelledby="online-flasher-title">
      <div className={styles.header}>
        <span className={styles.eyebrow}>{copy.eyebrow}</span>
        <h2 id="online-flasher-title" className={styles.title}>
          {copy.title}
        </h2>
        <p className={styles.description}>{copy.description}</p>
      </div>

      <div className={styles.selectorRow}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>{copy.firmwareLabel}</span>
          <select
            className={styles.select}
            value={selectedFirmware.version}
            onChange={(event) => setSelectedVersion(event.target.value)}>
            {firmwareOptions.map((firmware) => (
              <option key={firmware.version} value={firmware.version}>
                {firmware.version} · {firmware.date}
              </option>
            ))}
          </select>
        </label>
        <a className={styles.downloadLink} href={downloadUrl}>
          {copy.download}
        </a>
      </div>

      <div className={styles.actions}>
        {installerState === 'ready' ? (
          <esp-web-install-button
            key={selectedFirmware.version}
            manifest={manifestUrl}>
            <button slot="activate" className="button button--primary">
              {copy.flashButton}
            </button>
            <span slot="unsupported">{copy.unsupported}</span>
            <span slot="not-allowed">{copy.notAllowed}</span>
          </esp-web-install-button>
        ) : (
          <button className="button button--primary" type="button" disabled>
            {copy.flashButton}
          </button>
        )}
        <p className={styles.status}>{statusText}</p>
      </div>

      <p className={styles.requirements}>{copy.requirements}</p>
    </section>
  );
}
