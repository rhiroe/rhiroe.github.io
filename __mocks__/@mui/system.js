// Mock for @mui/system
const React = require('react');

const Box = (props) => {
  const { children, ...rest } = props || {};
  return React.createElement('div', {
    'data-testid': 'box',
    ...rest
  }, children);
};

const styled = (component) => (styles) => {
  const StyledComponent = (props) => {
    return React.createElement(component, props);
  };
  StyledComponent.displayName = `Styled(${component.displayName || component.name || 'Component'})`;
  return StyledComponent;
};

module.exports = {
  Box,
  styled,
  default: {
    Box,
    styled
  }
};
