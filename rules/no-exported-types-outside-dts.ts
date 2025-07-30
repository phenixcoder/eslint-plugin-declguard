import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utils/createRule';
import * as path from 'path';

type Options = [{
  allowedFilePatterns?: string[];
  allowedTypeSuffixes?: string[];
}];

type MessageIds = 'noExportedType';

export default createRule<Options, MessageIds>({
  name: 'no-exported-types-outside-dts',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow exported types/interfaces outside specified file patterns',
    },
    messages: {
      noExportedType: 'Exported {{ kind }} "{{ name }}" is not allowed in this file. Allowed patterns: {{ patterns }}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedFilePatterns: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Array of file patterns where type exports are allowed (e.g., "*.d.ts", "*.types.ts")',
          },
          allowedTypeSuffixes: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Array of type name suffixes that are allowed to be exported (e.g., "Props", "Type")',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{
    allowedFilePatterns: ['*.d.ts'],
    allowedTypeSuffixes: ['Props'],
  }],
  create(context, [options]) {
    const filename = context.getFilename();
    const allowedFilePatterns = options.allowedFilePatterns || ['*.d.ts'];
    const allowedTypeSuffixes = options.allowedTypeSuffixes || ['Props'];
    
    // Check if current file matches any allowed pattern
    const isFileAllowed = allowedFilePatterns.some(pattern => {
      // Convert glob-like pattern to regex
      const regexPattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');
      
      const regex = new RegExp(`${regexPattern}$`);
      return regex.test(filename) || regex.test(path.basename(filename));
    });
    
    if (isFileAllowed) return {};
    
    // Check if type name ends with any allowed suffix
    const isTypeAllowed = (typeName: string): boolean => {
      return allowedTypeSuffixes.some(suffix => typeName.endsWith(suffix));
    };

    return {
      TSInterfaceDeclaration(node: TSESTree.TSInterfaceDeclaration) {
        if (isTypeAllowed(node.id.name)) return;
        const isExported = node.parent?.type === 'ExportNamedDeclaration';
        if (isExported) {
          context.report({
            node: node.id,
            messageId: 'noExportedType',
            data: { 
              kind: 'interface', 
              name: node.id.name,
              patterns: allowedFilePatterns.join(', '),
            },
          });
        }
      },
      TSTypeAliasDeclaration(node: TSESTree.TSTypeAliasDeclaration) {
        if (isTypeAllowed(node.id.name)) return;
        const isExported = node.parent?.type === 'ExportNamedDeclaration';
        if (isExported) {
          context.report({
            node: node.id,
            messageId: 'noExportedType',
            data: { 
              kind: 'type', 
              name: node.id.name,
              patterns: allowedFilePatterns.join(', '),
            },
          });
        }
      },
    };
  },
});