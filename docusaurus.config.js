// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'OttoDIY机器人',
  tagline: '开源otto机器人技术文档与分享',
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
        title: 'OttoDIY',
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
            to: '/docs/bom', 
            position: 'left',
            label: 'Bom清单',
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
                label: 'QQ群(暂无）',
                href: '#',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: '项目分享',
                to: '/blog',
              },
              {
                label: 'GitHub 小智',
                href: 'https://github.com/78/xiaozhi-esp32',
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
