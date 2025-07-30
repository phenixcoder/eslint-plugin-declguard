# eslint-plugin-declguard

> 🛡️ Enforce clean type boundaries in TypeScript code: disallow exported `type`/`interface` declarations in `.ts` or `.tsx` files unless they end in `Props`.

---

## 📦 Installation

```bash
npm install --save-dev eslint-plugin-declguard
```

---

## 🔧 Usage

In your ESLint config:

```js
module.exports = {
  plugins: ['declguard'],
  rules: {
    'declguard/no-exported-types-outside-dts': 'error',
  },
};
```

Or use the recommended preset:

```js
module.exports = {
  extends: ['plugin:declguard/recommended']
};
```

---

## ✅ Rule: `no-exported-types-outside-dts`

### ❌ Disallowed

```ts
// my-feature.ts
export type User = { id: string };           // ❌
export interface Settings { darkMode: boolean } // ❌
```

### ✅ Allowed

```ts
// my-feature.ts
export interface ButtonProps { label: string }  // ✅
export type CardProps = { title: string };      // ✅
```

```ts
// types.d.ts
export interface User { id: string }           // ✅
export type Settings = { darkMode: boolean }   // ✅
```

---

## 🧑‍💻 Developers

Want to contribute or extend this plugin?

### 📁 Project Structure

```
eslint-plugin-declguard/
├── rules/                         # ESLint rule definitions
│   └── no-exported-types-outside-dts.ts
├── utils/                         # Shared utilities (e.g., createRule)
│   └── createRule.ts
├── index.ts                       # Plugin entry point
├── package.json
└── tsconfig.json
```

### 🚀 Commands

* `npm run build` — Compile TypeScript to `dist/`
* `npm run lint` — Lint the plugin source

### ✨ Add a Rule

1. Create a new rule file in `rules/`
2. Use the `createRule` helper from `@typescript-eslint/utils`
3. Add the rule to `index.ts`
4. Include it in the `recommended` config if appropriate

### 🧪 Testing (optional setup)

Use [`@typescript-eslint/rule-tester`](https://typescript-eslint.io/packages/rule-tester) for unit testing rules. Ask if you’d like a test harness preconfigured.

### 📦 Publishing

```bash
npm version patch # or minor/major
npm publish --access public
```

---

MIT © DeclGuard Authors
