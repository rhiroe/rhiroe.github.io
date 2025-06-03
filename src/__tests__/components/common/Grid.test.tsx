import { render, screen } from '@testing-library/react';
import { Grid } from '../../../components/common/Grid';

describe('Grid', () => {
  it('renders children correctly', () => {
    render(
      <Grid>
        <div>Grid Content</div>
      </Grid>
    );
    
    expect(screen.getByText('Grid Content')).toBeInTheDocument();
  });

  it('applies default MUI Grid classes', () => {
    const { container } = render(
      <Grid>
        <div>Test Content</div>
      </Grid>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('MuiGrid-root');
  });

  it('passes through all props to MUI Grid', () => {
    const { container } = render(
      <Grid 
        container 
        spacing={2} 
        data-testid="custom-grid"
        direction="column"
      >
        <div>Test Content</div>
      </Grid>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveAttribute('data-testid', 'custom-grid');
    expect(gridElement).toHaveClass('MuiGrid-container');
    expect(gridElement).toHaveClass('MuiGrid-direction-xs-column');
  });

  it('handles Grid v2 responsive sizing', () => {
    const { container } = render(
      <Grid size={12}>
        <div>Grid Item</div>
      </Grid>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('MuiGrid-root');
    expect(gridElement).toBeInTheDocument();
  });

  it('handles container with spacing correctly', () => {
    const { container } = render(
      <Grid container spacing={3}>
        <Grid size={6}>
          <div>Item 1</div>
        </Grid>
        <Grid size={6}>
          <div>Item 2</div>
        </Grid>
      </Grid>
    );
    
    const containerElement = container.firstChild as HTMLElement;
    expect(containerElement).toHaveClass('MuiGrid-container');
    expect(containerElement).toBeInTheDocument();
  });

  it('applies custom sx styles', () => {
    const customStyles = {
      backgroundColor: 'rgb(255, 0, 255)',
      padding: '16px'
    };
    
    const { container } = render(
      <Grid sx={customStyles}>
        <div>Styled Grid</div>
      </Grid>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveStyle('background-color: rgb(255, 0, 255)');
    expect(gridElement).toHaveStyle('padding: 16px');
  });

  it('handles Grid v2 responsive object sizing', () => {
    const { container } = render(
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <div>Responsive Grid</div>
      </Grid>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('MuiGrid-root');
    expect(gridElement).toBeInTheDocument();
  });

  it('handles component prop correctly', () => {
    const { container } = render(
      <Grid component="section">
        <div>Section Grid</div>
      </Grid>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement.tagName.toLowerCase()).toBe('section');
    expect(gridElement).toHaveClass('MuiGrid-root');
  });

  it('handles direction prop for different screen sizes', () => {
    const { container } = render(
      <Grid 
        container 
        direction={{ xs: 'column', sm: 'row' }}
      >
        <div>Directional Grid</div>
      </Grid>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('MuiGrid-direction-xs-column');
    expect(gridElement).toHaveClass('MuiGrid-direction-sm-row');
  });

  it('handles offset prop in Grid v2', () => {
    const { container } = render(
      <Grid offset={2} size={8}>
        <div>Offset Grid</div>
      </Grid>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('MuiGrid-root');
    expect(gridElement).toBeInTheDocument();
  });
});
