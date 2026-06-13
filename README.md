# ottodiy-docs

[闪猫侠 AI 桌面人形机器人](https://ottodiy.tech) 官方技术文档站点源码，基于 [Docusaurus 3](https://docusaurus.io/) 构建，提供中英文双语内容。

## 在线访问

- 中文：https://ottodiy.tech
- English：https://ottodiy.tech/en
- 动作调试 Playground：https://ottodiy.tech/playground

## 本地开发

**环境要求：** Node.js >= 18

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:3000）
npm start

# 构建生产版本
npm run build

# 预览构建结果
npm run serve
```

## 项目结构

```
ottodiy-docs/
├── docs/              # 中文文档（默认语言）
├── i18n/en/           # 英文翻译
├── src/
│   ├── components/    # 自定义组件（固件烧录、动作调试器等）
│   └── pages/         # 自定义页面（首页、Playground 等）
├── static/            # 静态资源与固件 manifest
└── docusaurus.config.js
```

## 文档内容

本站涵盖机器人制作与使用的完整指南，包括：

- 入门教程与零部件清单（BOM）
- 组装、焊接与 PCB 订购指南
- 固件烧录与 AI 集成（小智 AI、涂鸦智能等）
- MCP 服务玩法与常见问题解答

详细产品介绍与功能说明请阅读 [文档首页](https://ottodiy.tech/docs/intro)。

## 贡献

欢迎通过 Pull Request 改进文档或修复问题。编辑 `docs/` 下的 Markdown 文件即可更新中文内容；英文翻译位于 `i18n/en/docusaurus-plugin-content-docs/current/`。

## 相关链接

- 官网：https://ottodiy.tech
- GitHub：https://github.com/txp666/ottodiy-docs
- MCP 服务平台：http://mcp.shanmaotech.cn

## License

见 [LICENSE](./LICENSE) 文件。
