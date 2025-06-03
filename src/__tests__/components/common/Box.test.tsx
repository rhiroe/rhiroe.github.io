import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Box } from '../../../components/common/Box';

describe('Box Component', () => {
  test('should render with children text', () => {
    render(<Box>Test content</Box>);
    
    const box = screen.getByText('Test content');
    expect(box).toBeInTheDocument();
  });

  test('should accept and apply MUI Box props', () => {
    render(
      <Box 
        data-testid="test-box"
        sx={{ 
          padding: 2, 
          margin: 1,
          backgroundColor: 'primary.main' 
        }}
      >
        Styled Box
      </Box>
    );
    
    const box = screen.getByTestId('test-box');
    expect(box).toBeInTheDocument();
    expect(box).toHaveTextContent('Styled Box');
  });

  test('should render with complex children', () => {
    render(
      <Box>
        <div>Child 1</div>
        <span>Child 2</span>
      </Box>
    );
    
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  test('should apply custom className when provided', () => {
    render(
      <Box className="custom-box-class" data-testid="styled-box">
        Custom styled box
      </Box>
    );
    
    const box = screen.getByTestId('styled-box');
    expect(box).toHaveClass('custom-box-class');
  });

  test('should handle component prop', () => {
    render(
      <Box component="section" data-testid="section-box">
        Section content
      </Box>
    );
    
    const section = screen.getByTestId('section-box');
    expect(section).toBeInTheDocument();
    expect(section.tagName.toLowerCase()).toBe('section');
  });
});