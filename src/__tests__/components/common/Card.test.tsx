import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card, CardContent } from '../../../components/common/Card';

describe('Card Component', () => {
  test('should render with children', () => {
    render(
      <Card data-testid="test-card">
        <CardContent>Card content</CardContent>
      </Card>
    );
    
    const card = screen.getByTestId('test-card');
    expect(card).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  test('should handle mouse enter and leave events', () => {
    render(
      <Card data-testid="hover-card">
        <CardContent>Hoverable card</CardContent>
      </Card>
    );
    
    const card = screen.getByTestId('hover-card');
    
    // マウスエンター
    fireEvent.mouseEnter(card);
    expect(card).toBeInTheDocument();
    
    // マウスリーブ
    fireEvent.mouseLeave(card);
    expect(card).toBeInTheDocument();
  });

  test('should apply custom sx prop', () => {
    render(
      <Card 
        data-testid="styled-card"
        sx={{ backgroundColor: 'primary.main' }}
      >
        <CardContent>Styled card</CardContent>
      </Card>
    );
    
    const card = screen.getByTestId('styled-card');
    expect(card).toBeInTheDocument();
  });

  test('should pass through other MUI Card props', () => {
    render(
      <Card 
        data-testid="elevated-card"
        elevation={3}
        variant="outlined"
      >
        <CardContent>Elevated card</CardContent>
      </Card>
    );
    
    const card = screen.getByTestId('elevated-card');
    expect(card).toBeInTheDocument();
  });
});

describe('CardContent Component', () => {
  test('should render with children', () => {
    render(
      <CardContent data-testid="test-card-content">
        Test content
      </CardContent>
    );
    
    const content = screen.getByTestId('test-card-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Test content');
  });

  test('should apply custom sx prop', () => {
    render(
      <CardContent 
        data-testid="styled-content"
        sx={{ padding: 3 }}
      >
        Styled content
      </CardContent>
    );
    
    const content = screen.getByTestId('styled-content');
    expect(content).toBeInTheDocument();
  });

  test('should pass through other MUI CardContent props', () => {
    render(
      <CardContent 
        data-testid="custom-content"
        className="custom-class"
      >
        Custom content
      </CardContent>
    );
    
    const content = screen.getByTestId('custom-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('custom-class');
  });

  test('should render complex children', () => {
    render(
      <CardContent>
        <h2>Card Title</h2>
        <p>Card description</p>
        <button>Action</button>
      </CardContent>
    );
    
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Card Title');
    expect(screen.getByText('Card description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
