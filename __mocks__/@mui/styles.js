// Mock for @mui/styles
const createTheme = jest.fn((options) => ({
  ...options,
  palette: options?.palette || {},
  typography: options?.typography || {},
  spacing: jest.fn((factor) => `${factor * 8}px`),
}));

const ThemeProvider = ({ children, theme }) => {
  const React = require('react');
  return React.createElement('div', { 'data-theme': 'mocked' }, children);
};

const useTheme = () => ({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#fff', paper: '#fff' },
    text: { primary: '#000', secondary: '#666' }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif'
  },
  spacing: (factor) => `${factor * 8}px`
});

const makeStyles = () => () => ({});
const withStyles = () => (component) => component;

module.exports = {
  createTheme,
  ThemeProvider,
  useTheme,
  makeStyles,
  withStyles,
  default: {
    createTheme,
    ThemeProvider,
    useTheme,
    makeStyles,
    withStyles
  }
};
