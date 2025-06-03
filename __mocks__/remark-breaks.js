// Mock for remark-breaks ESM module
const remarkBreaks = {
  default: function remarkBreaks() {
    return function breaksTransform(tree, file, done) {
      // Mock line break processing
      const processBreaks = (node) => {
        if (node.type === 'text' && typeof node.value === 'string') {
          // Convert line breaks to hard breaks (mock behavior)
          node.value = node.value.replace(/\n/g, '\n');
        }
        
        if (node.children) {
          node.children.forEach(processBreaks);
        }
      };
      
      processBreaks(tree);
      
      if (done) {
        done(null, tree);
      } else {
        return tree;
      }
    };
  }
};

// Support both named and default exports
remarkBreaks.remarkBreaks = remarkBreaks.default;

module.exports = remarkBreaks;
