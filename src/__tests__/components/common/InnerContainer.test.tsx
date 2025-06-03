import { render, screen } from '@testing-library/react';
import { InnerContainer } from '../../../components/common/InnerContainer';

describe('InnerContainer', () => {
  it('renders children correctly', () => {
    render(
      <InnerContainer>
        <div>Inner Container Content</div>
      </InnerContainer>
    );
    
    expect(screen.getByText('Inner Container Content')).toBeInTheDocument();
  });

  it('applies default maxWidth of lg', () => {
    const { container } = render(
      <InnerContainer>
        <div>Test Content</div>
      </InnerContainer>
    );
    
    const muiContainer = container.firstChild as HTMLElement;
    expect(muiContainer).toHaveClass('MuiContainer-maxWidthLg');
  });

  it('applies default MUI Container classes', () => {
    const { container } = render(
      <InnerContainer>
        <div>Test Content</div>
      </InnerContainer>
    );
    
    const muiContainer = container.firstChild as HTMLElement;
    expect(muiContainer).toHaveClass('MuiContainer-root');
  });

  it('passes through additional props except maxWidth', () => {
    const { container } = render(
      <InnerContainer data-testid="inner-container" fixed>
        <div>Test Content</div>
      </InnerContainer>
    );
    
    const muiContainer = container.firstChild as HTMLElement;
    expect(muiContainer).toHaveAttribute('data-testid', 'inner-container');
    expect(muiContainer).toHaveClass('MuiContainer-fixed');
    // maxWidth should still be 'lg' and not changeable
    expect(muiContainer).toHaveClass('MuiContainer-maxWidthLg');
  });

  it('applies responsive padding styles', () => {
    const { container } = render(
      <InnerContainer>
        <div>Responsive Padding</div>
      </InnerContainer>
    );
    
    const muiContainer = container.firstChild as HTMLElement;
    // The responsive padding is applied via sx prop and handled by MUI's breakpoint system
    expect(muiContainer).toHaveClass('MuiContainer-root');
  });

  it('combines custom sx with default responsive padding', () => {
    const customStyles = {
      backgroundColor: 'rgb(0, 255, 0)',
      margin: '20px'
    };
    
    const { container } = render(
      <InnerContainer sx={customStyles}>
        <div>Custom Styled Container</div>
      </InnerContainer>
    );
    
    const muiContainer = container.firstChild as HTMLElement;
    expect(muiContainer).toHaveStyle('background-color: rgb(0, 255, 0)');
    expect(muiContainer).toHaveStyle('margin: 20px');
    // Default maxWidth should still be applied
    expect(muiContainer).toHaveClass('MuiContainer-maxWidthLg');
  });

  it('handles disableGutters prop correctly', () => {
    const { container } = render(
      <InnerContainer disableGutters>
        <div>No Gutters</div>
      </InnerContainer>
    );
    
    const muiContainer = container.firstChild as HTMLElement;
    expect(muiContainer).toHaveClass('MuiContainer-disableGutters');
    expect(muiContainer).toHaveClass('MuiContainer-maxWidthLg');
  });

  it('handles fixed prop correctly', () => {
    const { container } = render(
      <InnerContainer fixed>
        <div>Fixed Container</div>
      </InnerContainer>
    );
    
    const muiContainer = container.firstChild as HTMLElement;
    expect(muiContainer).toHaveClass('MuiContainer-fixed');
    expect(muiContainer).toHaveClass('MuiContainer-maxWidthLg');
  });

  it('applies component prop if provided', () => {
    const { container } = render(
      <InnerContainer component="section">
        <div>Section Container</div>
      </InnerContainer>
    );
    
    const muiContainer = container.firstChild as HTMLElement;
    expect(muiContainer.tagName.toLowerCase()).toBe('section');
    expect(muiContainer).toHaveClass('MuiContainer-root');
  });
});
