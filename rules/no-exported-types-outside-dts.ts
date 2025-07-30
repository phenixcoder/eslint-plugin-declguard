import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utils/createRule';
import { minimatch } from 'minimatch';
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
            description: 'Array of file patterns where type exports are allowed (supports gitignore-style patterns)',
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
    
    // Normalize the filename to use forward slashes for consistent matching
    const normalizedFilename = filename.replace(/\\/g, '/');
    
    // Separate positive and negative patterns
    const positivePatterns = allowedFilePatterns.filter(p => !p.startsWith('!'));
    const negativePatterns = allowedFilePatterns.filter(p => p.startsWith('!')).map(p => p.slice(1));
    
    // Check if current file matches any allowed pattern
    const isFileAllowed = () => {
      // First check if it matches any positive pattern
      const matchesPositive = positivePatterns.some(pattern => {
        // Try matching against the full path
        if (minimatch(normalizedFilename, pattern)) {
          return true;
        }
        // Also try matching against just the basename for patterns like "*.d.ts"
        if (!pattern.includes('/') && minimatch(path.basename(normalizedFilename), pattern)) {
          return true;
        }
        return false;
      });
      
      if (!matchesPositive) {
        return false;
      }
      
      // Then check if it's excluded by any negative pattern
      const matchesNegative = negativePatterns.some(pattern => {
        if (minimatch(normalizedFilename, pattern)) {
          return true;
        }
        // Also try matching against just the basename
        if (!pattern.includes('/') && minimatch(path.basename(normalizedFilename), pattern)) {
          return true;
        }
        return false;
      });
      
      return !matchesNegative;
    };
    
    if (isFileAllowed()) return {};
    
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
              patterns: positivePatterns.join(', '),
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
              patterns: positivePatterns.join(', '),
            },
          });
        }
      },
    };
  },
});