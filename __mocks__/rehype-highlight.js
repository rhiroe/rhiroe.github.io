// Mock for rehype-highlight ESM module
const rehypeHighlight = {
  default: function rehypeHighlight(options = {}) {
    return function highlightTransform(tree, file, done) {
      // Mock syntax highlighting
      const processCodeBlocks = (node) => {
        if (node.type === 'element' && (node.tagName === 'code' || node.tagName === 'pre')) {
          // Add mock highlighting classes
          node.properties = node.properties || {};
          node.properties.className = node.properties.className || [];
          if (!Array.isArray(node.properties.className)) {
            node.properties.className = [node.properties.className];
          }
          node.properties.className.push('hljs', 'highlighted');
        }
        
        if (node.children) {
          node.children.forEach(processCodeBlocks);
        }
      };
      
      processCodeBlocks(tree);
      
      if (done) {
        done(null, tree);
      } else {
        return tree;
      }
    };
  }
};

// Support both named and default exports
rehypeHighlight.rehypeHighlight = rehypeHighlight.default;

module.exports = rehypeHighlight;
