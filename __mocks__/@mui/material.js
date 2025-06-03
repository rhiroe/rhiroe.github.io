// Mock for @mui/material
const React = require('react');

// Create a mock component factory
const createMockComponent = (name) => {
  const MockComponent = (props) => {
    const { children, ...rest } = props || {};
    return React.createElement('div', {
      'data-testid': name.toLowerCase(),
      ...rest
    }, children);
  };
  MockComponent.displayName = name;
  return MockComponent;
};

// Material-UI components
const Button = createMockComponent('Button');
const Typography = createMockComponent('Typography');
const Box = createMockComponent('Box');
const Container = createMockComponent('Container');
const AppBar = createMockComponent('AppBar');
const Toolbar = createMockComponent('Toolbar');
const Paper = createMockComponent('Paper');
const Card = createMockComponent('Card');
const CardContent = createMockComponent('CardContent');
const List = createMockComponent('List');
const ListItem = createMockComponent('ListItem');
const ListItemText = createMockComponent('ListItemText');
const Chip = createMockComponent('Chip');
const IconButton = createMockComponent('IconButton');
const Menu = createMockComponent('Menu');
const MenuItem = createMockComponent('MenuItem');
const TextField = createMockComponent('TextField');
const Pagination = createMockComponent('Pagination');

// Material-UI styles
const createTheme = jest.fn((options) => ({
  ...options,
  palette: options?.palette || {},
  typography: options?.typography || {},
  spacing: jest.fn((factor) => `${factor * 8}px`),
}));

const ThemeProvider = ({ children, theme }) => {
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

const styled = (component) => (styles) => {
  const StyledComponent = (props) => {
    return React.createElement(component, props);
  };
  StyledComponent.displayName = `Styled(${component.displayName || component.name || 'Component'})`;
  return StyledComponent;
};

// Mock colors
const colors = {
  blue: { 500: '#2196f3' },
  red: { 500: '#f44336' },
  green: { 500: '#4caf50' },
  grey: { 100: '#f5f5f5', 500: '#9e9e9e', 900: '#212121' }
};

module.exports = {
  // Components
  Button,
  Typography,
  Box,
  Container,
  AppBar,
  Toolbar,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Pagination,
  
  // Styles
  createTheme,
  ThemeProvider,
  useTheme,
  styled,
  colors,
  
  // Styles object for /styles import
  styles: {
    createTheme,
    ThemeProvider,
    useTheme,
    styled
  },
  
  // Default export (for default imports)
  default: {
    Button,
    Typography,
    Box,
    Container,
    AppBar,
    Toolbar,
    Paper,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Pagination
  }
};
