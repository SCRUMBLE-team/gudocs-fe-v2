# 구독 관리 서비스

## 프로젝트 개요

**다양한 구독 서비스(OTT, 음악 스트리밍, 클라우드 등)를 한곳에서 통합 관리**하고,
월 구독 지출과 결제일을 확인할 수 있는 **웹뷰 기반 대시보드 시스템**.

### 핵심 목적

- **통합 관리 편의성** — 여러 플랫폼에 흩어진 구독 정보를 단일 인터페이스에서 관리
- **지출 가시성 확보** — 월별 총액 및 카테고리별 비율로 불필요한 지출 파악
- **결제 사고 방지** — 결제일 사전 알림으로 원치 않는 자동 결제 예방

### **📂 디렉토리명**

- 케밥케이스(kebab-case) 사용

### 스타일링

<!-- ASTRYX:START -->

Astryx v0.1.6 · 149 components
CLI: run every command as `npx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in your app entry e.g. main.tsx) — without these, components render unstyled:
import "@astryxdesign/core/reset.css";
import "@astryxdesign/core/astryx.css";

WORKFLOW — discover, don't guess. Before writing UI:

1. `astryx build "<idea>"` — START HERE: returns a kit (closest [page] + [block]s + [component]s). No args = full playbook.
2. `astryx template <name> [--skeleton]` — scaffold the [page]/[block]s it named, or study their layout. Templates are reference code.
3. `astryx component <Name>` — props + examples for every component you use.

RULES:

- No <div> — components do all layout/spacing. Full page → AppShell; sidebar nav → SideNav.
- Frame first: pick the shell (AppShell / Layout+LayoutPanel) and budget regions in px BEFORE writing content (`astryx docs layout`).
- Dense data = rows (Table, List/Item) edge-to-edge — never Card-wrapped list items. Card = dashboard widgets, galleries, settings groups only.
- Status → StatusDot/Token; Badge only for counts and enumerated states, never decoration.
- Custom styling: component props first; else Tailwind utilities backed by tokens (bg-surface, text-primary, rounded-lg) via tailwind-theme.css. No raw hex/px.
- Tokens for every value (`astryx docs tokens`). Brand/accent via `astryx theme` — never override --color-\* in :root.

MORE CLI:
search "<query>" find any component / hook / doc / template / block
component --list 149 components by category
template --list page + block recipes
docs <topic> color, elevation, icons, illustrations, layout, migration, motion, principles, shape, spacing, styling, theme, tokens, typography
swizzle <Name> eject component source for deep customization
upgrade --apply run after any @astryxdesign/core bump

<!-- ASTRYX:END -->
