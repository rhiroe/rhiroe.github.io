// Mock for remark-rehype ESM module
const remarkRehype = {
  default: function remarkRehype() {
    return function rehypeTransform(tree, file, done) {
      // Mock HTML transformation
      const mockHast = {
        type: 'root',
        children: [
          {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [
              {
                type: 'text',
                value: tree.children?.[0]?.children?.[0]?.value || 'Mock HTML content'
              }
            ]
          }
        ]
      };
      
      if (done) {
        done(null, mockHast);
      } else {
        return mockHast;
      }
    };
  }
};

// Support both named and default exports
remarkRehype.remarkRehype = remarkRehype.default;

module.exports = remarkRehype;
