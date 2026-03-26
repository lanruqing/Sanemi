# 🌪️ Project Sanemi (不死川实弥)
**High-Fidelity Transmission Dashboard | Braun Industrial Design Style**

Sanemi 是一个基于 **Hono** (后端) 和 **React** (前端) 的轻量级 Transmission 远程管理面板。它将《鬼灭之刃》风柱的迅猛感与迪特·拉姆斯（Dieter Rams）的博朗工业美学（Braun Design）完美融合。

---

## 🎨 视觉规范 (Visual Identity)

在开发 UI 组件时，必须严格遵守以下 **Braun x Sanemi** 色卡及设计原则：

### 1. 核心色值 (Color Palette)

| 颜色角色 | 十六进制 (HEX) | RGB 数值 | 建议用途 |
| :--- | :--- | :--- | :--- |
| **Braun Chassis** | `#EBEBEB` | `(235, 235, 235)` | 整个 App 的大背景，模拟工业外壳 |
| **Surface** | `#F5F5F5` | `(245, 245, 245)` | 卡片背景、输入框背景 |
| **Sanemi Wind** | `#8AA68A` | `(138, 166, 138)` | **核心色**。进度条、活跃状态、风之呼吸 |
| **Industrial Line**| `#C0C0C0` | `(192, 192, 192)` | 边框、分割线、精密刻度线 |
| **Braun Orange** | `#FF4500` | `(255, 69, 0)` | 重点按键（添加/停止）、警告、开关点缀 |
| **Text Primary** | `#202020` | `(32, 32, 32)` | 主文字，高对比度，清晰易读 |
| **Text Muted** | `#707070` | `(112, 112, 112)` | ETA、文件大小等次要信息 |

### 2. 设计原则 (Design Principles)

* **几何感**：禁止使用大圆角，统一使用微圆角 (`borderRadius: 2px`)。
* **工业线条**：列表项之间不使用模糊投影，使用 `0.5px` 的 `#C0C0C0` 实线分割。
* **功能至上**：进度条设计为贯穿式直线，不留呼吸间距，模拟物理设备的刻度感。
* **排版**：优先使用 `Inter` 或 `Helvetica` 字体，保持视觉的干练与专业。

---

## 🛠️ 技术架构 (Technical Stack)

* **Monorepo 结构**:
    * `/UI`: Vite + React + TypeScript + Tailwind CSS + Shadcn UI
    * `/Backend`: Hono + Node-server (运行于 3000 端口)
* **核心逻辑**:
    * 后端作为 RPC 代理，负责处理 Transmission 的 `409 Session ID` 冲突逻辑。
    * 前端通过 `x-target-url` 和 `x-target-auth` Header 传递目标服务器信息。

---

## 🚀 启动指令 (Execution)

在项目根目录下执行：

1.  **安装依赖**: `npm install` (利用 Workspace 自动安装 UI 和 Backend 的所有依赖)
2.  **开发模式**: `npm run dev` (同时启动前端与后端服务器)

---

## 📜 开发备忘 (AI Context)

如果你是协助开发的 AI 助手，请遵循以下指令：

1.  **代码风格**：保持简洁，优先使用函数式组件和 Hooks。
2.  **样式实现**：使用 Tailwind CSS。在实现 UI 时参考上述色卡，确保符合博朗风格的拟物感。
3.  **交互逻辑**：状态切换需果断，模仿物理设备的机械反馈感。
4.  **命名规范**：代码内部逻辑可引用“风之呼吸”术语，但 UI 呈现需保持博朗的冷静与克制。

---
*Sanemi is breathing... 🌪️*