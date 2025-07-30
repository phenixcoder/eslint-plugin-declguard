import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utils/createRule';

export default createRule({
  name: 'no-exported-types-outside-dts',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow exported types/interfaces outside .d.ts files unless they end in "Props"',
    },
    messages: {
      noExportedType: 'Exported {{ kind }} "{{ name }}" is not allowed outside .d.ts files unless it ends with "Props".',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = context.getFilename();
    if (filename.endsWith('.d.ts')) return {};

    return {
      TSInterfaceDeclaration(node: TSESTree.TSInterfaceDeclaration) {
        if (node.id.name.endsWith('Props')) return;
        const isExported = node.parent?.type === 'ExportNamedDeclaration';
        if (isExported) {
          context.report({
            node: node.id,
            messageId: 'noExportedType',
            data: { kind: 'interface', name: node.id.name },
          });
        }
      },
      TSTypeAliasDeclaration(node: TSESTree.TSTypeAliasDeclaration) {
        if (node.id.name.endsWith('Props')) return;
        const isExported = node.parent?.type === 'ExportNamedDeclaration';
        if (isExported) {
          context.report({
            node: node.id,
            messageId: 'noExportedType',
            data: { kind: 'type', name: node.id.name },
          });
        }
      },
    };
  },
});