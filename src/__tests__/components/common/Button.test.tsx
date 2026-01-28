import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../../../components/common/Button';

describe('Button Component', () => {
  test('should render with children text', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('should accept and apply additional props', () => {
    render(
      <Button variant="contained" color="primary" disabled>
        Test Button
      </Button>
    );
    
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    
    const button = screen.getByRole('button', { name: /clickable/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('should render with complex children', () => {
    render(
      <Button>
        <span>Complex</span> Content
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Complex Content');
  });

  test('should apply custom className when provided', () => {
    render(<Button className="custom-class">Styled Button</Button>);
    
    const button = screen.getByRole('button', { name: /styled button/i });
    expect(button).toHaveClass('custom-class');
  });
});
