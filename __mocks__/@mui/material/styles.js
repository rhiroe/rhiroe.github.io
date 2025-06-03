// Mock for @mui/material/styles
const React = require('react');

const createTheme = jest.fn((options = {}) => ({
  ...options,
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    ...options.palette
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    ...options.typography
  },
  spacing: jest.fn((factor) => `${factor * 8}px`),
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 }
  },
  components: {}
}));

const responsiveFontSizes = jest.fn((theme) => theme);

const ThemeProvider = ({ theme, children }) => 
  React.createElement('div', { 'data-testid': 'theme-provider' }, children);

const useTheme = jest.fn(() => createTheme());

const styled = jest.fn(() => (component) => {
  const StyledComponent = (props) => 
    React.createElement(component, props);
  StyledComponent.displayName = 'StyledComponent';
  return StyledComponent;
});

module.exports = {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
  useTheme,
  styled
};
