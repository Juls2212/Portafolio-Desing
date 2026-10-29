# Skills inventory (read-only inspection)

Inspected (re-checked at Phase 1 closure) on 2026-10-28 by reading skill definitions, `skills-lock.json` and `~/.claude/plugins/installed_plugins.json`. **No skill was invoked or installed by Phase 1.** Names are exactly as installed; invoke with `/<name>` or the Skill tool using the same string.

## Found: plugins (installed by the user with `/plugin` before Phase 1)

| Installed name | Invocation | Description (from its own definition) |
| --- | --- | --- |
| `frontend-design:frontend-design` (Anthropic, v1.1.1) | `/frontend-design:frontend-design` | Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. |
| `impeccable:impeccable` (v4.8.0) | `/impeccable:impeccable` | Design, redesign, critique, audit, polish and harden frontend interfaces: UX review, typography, color, motion, copy, accessibility. |
| `taste-skill:design-taste-frontend` (v2.1.5) | `/taste-skill:design-taste-frontend` | "tasteskill v2", anti-slop art direction for websites, with a real-browser inspector and a look-and-fix loop. |

See "Impeccable hook" below for the automatic hook this plugin registers.

## Found: Emil Kowalski's collection (project `.claude/skills/`, source `emilkowalski/skills`)

| Installed name | Invocation | Description |
| --- | --- | --- |
| `animate` | `/animate` | Build an animation from scratch, deciding in the order that makes it feel right. |
| `animate-expo` | `/animate-expo` | Animations in React Native / Expo with Reanimated and Gesture Handler. |
| `animation-performance` | `/animation-performance` | Keep web animations inside the frame budget; find the cause of dropped frames. |
| `animation-vocabulary` | `/animation-vocabulary` | Turn a vague description of a motion effect into its exact term. |
| `apple-design` | `/apple-design` | Apple's approach to interface design and fluid physical motion, for the web. |
| `ask-sonner` | `/ask-sonner` | Guide to the Sonner React toast library. |
| `break-ui` | `/break-ui` | Stress-test UI with worst-case data behind a demo toggle. |
| `emil-design-eng` | `/emil-design-eng` | Emil Kowalski's philosophy on UI polish, component design and animation decisions. |
| `find-animation-opportunities` | `/find-animation-opportunities` | Read-only search for places that should animate, with exact values. |
| `improve-animations` | `/improve-animations` | Read-only motion audit producing prioritized implementation plans. |
| `mobile-native` | `/mobile-native` | CSS and meta-tag fixes that make a web app feel native on a phone. |
| `pick-ui-library` | `/pick-ui-library` | Pick a library for a frontend task from a curated list. Explicit invocation only. |
| `prototype` | `/prototype` | Build several different versions of a UI piece behind a visual picker. Explicit invocation only. |
| `remove-animations` | `/remove-animations` | Find and remove animations the interface does not need. |
| `review-animations` | `/review-animations` | Review animation code against a high craft bar. |
| `write-swift` | `/write-swift` | Modern Swift (concurrency, value types, Swift Testing). Not relevant to this project. |

Emil skills are installed at `.agents/skills/<name>/` and linked into `.claude/skills/<name>` (listed in `skills-lock.json`, source `emilkowalski/skills`). All 16 exist on disk.

`review-animations`, `pick-ui-library` and `prototype` have `disable-model-invocation: true` in their frontmatter. That is why they were missing from the model's skill list: they are installed, but only the user can run them by typing `/review-animations`, `/pick-ui-library` or `/prototype`. The model cannot invoke them on its own. If they do not autocomplete in the prompt, start a new Claude Code session in this folder (project skills load at session start); the same applies after any `.claude/skills` change. I could not verify autocomplete from inside this session.

## Impeccable hook

Configured in the plugin, not in project settings: `~/.claude/plugins/cache/impeccable/impeccable/4.8.0/hooks/hooks.json`. Three hooks run `skills/impeccable/scripts/impeccable hook`: `SessionStart` ("Preparing build session"), `PostToolUse` on `Edit|Write` ("Checking UI changes"), and `Stop` ("Design deep pass", 30 s timeout).

Observed behavior: after each write it returns text to the model ("scanned <file>, no deterministic design-quality issues found"); no project file was modified by it, and `git status` shows only intended changes. The launcher also downloaded and verified a native binary to `~/.impeccable/bin/0.1.18/impeccable.exe` and keeps state under `~/.impeccable/hook-claims/` (outside the project). The binary's internals are not readable, so "read-only" is an observation, not a guarantee.

Limiting it: plugin hooks cannot be edited per hook from project settings as far as verified here. Options are `/plugin` to disable the `impeccable` plugin, or `disableAllHooks` in settings (disables every hook). Check `/hooks` for what is active. Configuration was not changed.

## Intended but NOT found

None. All four intended sources (Frontend Design, Impeccable, Taste Skill, Emil Kowalski's collection) are present. Installed does not mean approved for use: see `WORKFLOW.md`.
