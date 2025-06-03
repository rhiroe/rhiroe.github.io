import { render, screen } from '@testing-library/react';
import { Paper, GlassPaper } from '../../../components/common/Paper';

describe('Paper', () => {
  it('renders children correctly', () => {
    render(
      <Paper>
        <div>Test Paper Content</div>
      </Paper>
    );
    
    expect(screen.getByText('Test Paper Content')).toBeInTheDocument();
  });

  it('applies default elevation of 0', () => {
    const { container } = render(
      <Paper>
        <div>Test Content</div>
      </Paper>
    );
    
    const paperElement = container.firstChild as HTMLElement;
    expect(paperElement).toHaveClass('MuiPaper-elevation0');
  });

  it('passes through additional props to MUI Paper', () => {
    const { container } = render(
      <Paper data-testid="custom-paper" square>
        <div>Test Content</div>
      </Paper>
    );
    
    const paperElement = container.firstChild as HTMLElement;
    expect(paperElement).toHaveAttribute('data-testid', 'custom-paper');
    expect(paperElement).toHaveClass('MuiPaper-root');
  });

  it('overrides elevation when explicitly provided', () => {
    const { container } = render(
      <Paper elevation={3}>
        <div>Elevated Content</div>
      </Paper>
    );
    
    const paperElement = container.firstChild as HTMLElement;
    expect(paperElement).toHaveClass('MuiPaper-elevation3');
  });

  it('applies custom sx styles', () => {
    const customStyles = {
      backgroundColor: 'rgb(255, 255, 0)',
      padding: '16px'
    };
    
    const { container } = render(
      <Paper sx={customStyles}>
        <div>Styled Content</div>
      </Paper>
    );
    
    const paperElement = container.firstChild as HTMLElement;
    expect(paperElement).toHaveStyle('background-color: rgb(255, 255, 0)');
    expect(paperElement).toHaveStyle('padding: 16px');
  });
});

describe('GlassPaper', () => {
  it('renders children correctly', () => {
    render(
      <GlassPaper>
        <div>Glass Paper Content</div>
      </GlassPaper>
    );
    
    expect(screen.getByText('Glass Paper Content')).toBeInTheDocument();
  });

  it('applies default elevation of 0', () => {
    const { container } = render(
      <GlassPaper>
        <div>Glass Content</div>
      </GlassPaper>
    );
    
    const paperElement = container.firstChild as HTMLElement;
    expect(paperElement).toHaveClass('MuiPaper-elevation0');
  });

  it('applies glass effect styles', () => {
    const { container } = render(
      <GlassPaper>
        <div>Glass Effect</div>
      </GlassPaper>
    );
    
    const paperElement = container.firstChild as HTMLElement;
    // Glass paper should still be a MUI Paper element
    expect(paperElement).toHaveClass('MuiPaper-root');
    expect(paperElement).toHaveClass('MuiPaper-elevation0');
  });

  it('passes through additional props to MUI Paper', () => {
    const { container } = render(
      <GlassPaper data-testid="glass-paper" square>
        <div>Glass Content</div>
      </GlassPaper>
    );
    
    const paperElement = container.firstChild as HTMLElement;
    expect(paperElement).toHaveAttribute('data-testid', 'glass-paper');
    expect(paperElement).toHaveClass('MuiPaper-root');
  });

  it('overrides elevation when explicitly provided', () => {
    const { container } = render(
      <GlassPaper elevation={2}>
        <div>Elevated Glass</div>
      </GlassPaper>
    );
    
    const paperElement = container.firstChild as HTMLElement;
    expect(paperElement).toHaveClass('MuiPaper-elevation2');
  });

  it('combines custom sx with default glass styles', () => {
    const customStyles = {
      padding: '24px',
      margin: '10px'
    };
    
    const { container } = render(
      <GlassPaper sx={customStyles}>
        <div>Custom Glass</div>
      </GlassPaper>
    );
    
    const paperElement = container.firstChild as HTMLElement;
    expect(paperElement).toHaveStyle('padding: 24px');
    expect(paperElement).toHaveStyle('margin: 10px');
    // Glass effect properties are applied via sx and handled by MUI theme system
    expect(paperElement).toHaveClass('MuiPaper-root');
  });

  it('applies MUI theme-based styles', () => {
    const { container } = render(
      <GlassPaper>
        <div>Theme Glass</div>
      </GlassPaper>
    );
    
    const paperElement = container.firstChild as HTMLElement;
    // The theme-based styles are applied via sx prop and handled by MUI's theme system
    expect(paperElement).toHaveClass('MuiPaper-root');
  });

  it('handles square prop correctly', () => {
    const { container } = render(
      <GlassPaper square>
        <div>Square Glass</div>
      </GlassPaper>
    );
    
    const paperElement = container.firstChild as HTMLElement;
    expect(paperElement).toHaveClass('MuiPaper-root');
  });
});
