// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '桌面AI人形机器人开源生态',
  tagline: '技术文档与分享',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://ottodiy.tech',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'txp666', // Usually your GitHub org/user name.
  projectName: 'ottodiy-docs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/txp666/ottodiy-docs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/txp666/ottodiy-docs/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/ottodiy-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: '闪猫科技Tenengla™️',
        logo: {
          alt: 'OttoDIY Logo',
          src: 'img/favicon.ico',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: '开始制作',
          },
          {
            to: '/docs/pcb-order', 
            position: 'left',
            label: 'PCB下单',
          },
          {
            to: '/docs/bom', 
            position: 'left',
            label: 'Bom清单',
          },
          {
            to: '/docs/soldering-guide', 
            position: 'left',
            label: '焊接指南',
          },
          {
            to: '/docs/downloads',
            position: 'left',
            label: '程序下载',
          },
          {
            to: '/docs/assembly', 
            position: 'left',
            label: '组装教程',
          },
          {
            to: '/docs/usage',
            position: 'left',
            label: '使用说明',
          },
          {
            href: 'https://github.com/txp666/ottodiy-docs',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://mall.bilibili.com/neul-next/detailuniversal/detail.html?isMerchant=1&page=detailuniversal_detail&saleType=0&itemsId=12340590&loadingShow=1&noTitleBar=1&msource=merchant_share',
            label: '购买套件',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '文档',
            items: [
              {
                label: '开始制作',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: '社区',
            items: [
              {
                label: 'B站',
                href: 'https://b23.tv/7BLN9j1',
              },
              {
                label: 'QQ群',
                href: 'https://qm.qq.com/q/lvXglQWimm',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: '店铺',
                href: 'https://mall.bilibili.com/neul-next/index.html?page=up-store_home&noTitleBar=1&msource=shop_share&merchantId=10624032&share_source=&share_medium=android&bbid=EB6B5C19-D944-6898-9668-A75A1D8313A713936infoc&ts=1746514066719',
              },
              {
                label: 'GitHub 小智',
                href: 'https://github.com/txp666/xiaozhi-esp32',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} OttoDIY.tech`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['arduino', 'cpp'],
      },
    }),
};

export default config;
