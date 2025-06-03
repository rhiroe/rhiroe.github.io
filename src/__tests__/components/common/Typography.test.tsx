import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Typography } from '../../../components/common/Typography';

describe('Typography Component', () => {
  test('should render with children text', () => {
    render(<Typography>Sample text</Typography>);
    
    const typography = screen.getByText('Sample text');
    expect(typography).toBeInTheDocument();
  });

  test('should render as h1 when variant is h1', () => {
    render(<Typography variant="h1">Heading 1</Typography>);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Heading 1');
  });

  test('should render as h2 when variant is h2', () => {
    render(<Typography variant="h2">Heading 2</Typography>);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Heading 2');
  });

  test('should apply color prop', () => {
    render(
      <Typography color="primary" data-testid="colored-text">
        Colored text
      </Typography>
    );
    
    const typography = screen.getByTestId('colored-text');
    expect(typography).toBeInTheDocument();
  });

  test('should apply custom className', () => {
    render(
      <Typography className="custom-typography" data-testid="styled-typography">
        Custom styled typography
      </Typography>
    );
    
    const typography = screen.getByTestId('styled-typography');
    expect(typography).toHaveClass('custom-typography');
  });

  test('should render with body1 variant by default', () => {
    render(<Typography data-testid="default-typography">Default text</Typography>);
    
    const typography = screen.getByTestId('default-typography');
    expect(typography).toBeInTheDocument();
    // デフォルトはpタグ
    expect(typography.tagName.toLowerCase()).toBe('p');
  });

  test('should handle align prop', () => {
    render(
      <Typography align="center" data-testid="centered-text">
        Centered text
      </Typography>
    );
    
    const typography = screen.getByTestId('centered-text');
    expect(typography).toBeInTheDocument();
  });

  test('should render with component prop override', () => {
    render(
      <Typography component="span" data-testid="span-typography">
        Span typography
      </Typography>
    );
    
    const typography = screen.getByTestId('span-typography');
    expect(typography.tagName.toLowerCase()).toBe('span');
  });
});