import noExportedTypesOutsideDts from './rules/no-exported-types-outside-dts';

export = {
  rules: {
    'no-exported-types-outside-dts': noExportedTypesOutsideDts,
  },
  configs: {
    recommended: {
      plugins: ['declguard'],
      rules: {
        'declguard/no-exported-types-outside-dts': 'error',
      },
    },
  },
};