// Mock for rehype-stringify ESM module
const rehypeStringify = {
  default: function rehypeStringify(options = {}) {
    return function stringifyTransform(tree, file, done) {
      // Mock HTML stringification
      const stringifyNode = (node) => {
        if (node.type === 'text') {
          return node.value || '';
        }
        
        if (node.type === 'element') {
          const tag = node.tagName || 'div';
          const attrs = Object.entries(node.properties || {})
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
          const attrStr = attrs ? ` ${attrs}` : '';
          
          if (node.children && node.children.length > 0) {
            const children = node.children.map(stringifyNode).join('');
            return `<${tag}${attrStr}>${children}</${tag}>`;
          } else {
            return `<${tag}${attrStr}></${tag}>`;
          }
        }
        
        if (node.type === 'root' && node.children) {
          return node.children.map(stringifyNode).join('');
        }
        
        return '';
      };
      
      const html = stringifyNode(tree);
      
      if (done) {
        done(null, html);
      } else {
        return html;
      }
    };
  }
};

// Support both named and default exports
rehypeStringify.rehypeStringify = rehypeStringify.default;

module.exports = rehypeStringify;
