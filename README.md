# eslint-plugin-declguard

> 🛡️ Enforce clean type boundaries in TypeScript code by controlling where types and interfaces can be exported from.

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

This rule prevents exporting TypeScript types and interfaces from files that don't match specified patterns.

### Default Configuration

By default, types can only be exported from:
- Files ending with `.d.ts`
- Types ending with `Props`

### ❌ Disallowed (Default)

```ts
// my-feature.ts
export type User = { id: string };           // ❌
export interface Settings { darkMode: boolean } // ❌
```

### ✅ Allowed (Default)

```ts
// my-feature.ts
export interface ButtonProps { label: string }  // ✅ Ends with Props
export type CardProps = { title: string };      // ✅ Ends with Props
```

```ts
// types.d.ts
export interface User { id: string }           // ✅ In .d.ts file
export type Settings = { darkMode: boolean }   // ✅ In .d.ts file
```

---

## ⚙️ Configuration

You can customize which files and type names are allowed:

```js
// .eslintrc.js
module.exports = {
  rules: {
    'declguard/no-exported-types-outside-dts': ['error', {
      allowedFilePatterns: [
        '*.d.ts',
        '*.types.ts',
        '*.types.tsx',
        'types/*',
        '**/types.ts',
        'src/lib/**/*.ts',        // Allow all types in src/lib
        '!src/lib/vendor/**/*',   // But exclude vendor subdirectory
        'packages/*/types/**/*'   // Types in any package's types folder
      ],
      allowedTypeSuffixes: [
        'Props',
        'Type',
        'Interface',
        'Config'
      ]
    }]
  }
};
```

### Configuration Options

- **`allowedFilePatterns`** (string[]): Array of file patterns where type exports are allowed
  - Supports gitignore-style glob patterns (powered by minimatch)
  - Use `!` prefix for negation/exclusion patterns
  - Patterns can include paths: `src/lib/**/*.ts`, `packages/*/types/*`
  - Default: `['*.d.ts']`

- **`allowedTypeSuffixes`** (string[]): Array of suffixes that allow types to be exported from any file
  - Default: `['Props']`

### Pattern Matching Examples

With the custom configuration above:

```ts
// src/components/Button.types.ts
export interface ButtonStyle { ... }        // ✅ File matches *.types.ts

// src/types/user.ts
export type User = { ... }                  // ✅ File in types/ directory

// src/lib/api/client.ts
export interface ApiClient { ... }          // ✅ Matches src/lib/**/*.ts

// src/lib/vendor/third-party.ts
export type VendorType = { ... }            // ❌ Excluded by !src/lib/vendor/**/*

// packages/ui/types/theme.ts
export interface Theme { ... }              // ✅ Matches packages/*/types/**/*

// src/components/Button.tsx
export type ButtonConfig = { ... }          // ✅ Type ends with Config
export interface ModalInterface { ... }     // ✅ Type ends with Interface

// src/utils/helpers.ts
export type Helper = { ... }                // ❌ Not allowed pattern
```

### Advanced Path-Based Configuration

For projects with complex directory structures, you can use path-based patterns to control where types can be exported:

```js
allowedFilePatterns: [
  // Standard type file patterns
  '*.d.ts',
  '*.types.ts',
  
  // Allow types in specific directories
  'src/shared/**/*.ts',           // All files in shared folder
  'src/api/types/**/*',           // API type definitions
  'packages/*/src/types/**/*',    // Types in monorepo packages
  
  // Exclude certain subdirectories
  'src/lib/**/*.ts',              // Allow in lib folder...
  '!src/lib/generated/**/*',      // ...but not in generated subfolder
  '!src/lib/vendor/**/*',         // ...and not in vendor subfolder
  
  // Match specific file names
  '**/constants.ts',              // Any constants.ts file
  '**/enums.ts',                  // Any enums.ts file
]
```

---

## 🧑‍💻 Development

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

### ✨ Adding New Rules

1. Create a new rule file in `rules/`
2. Use the `createRule` helper from `utils/`
3. Add the rule to `index.ts`
4. Include it in the `recommended` config if appropriate

### 📦 Publishing

The plugin is automatically published to npm when changes are pushed to the main branch via GitHub Actions.

---

MIT © DeclGuard Authors