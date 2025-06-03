import { render, screen } from '@testing-library/react';
import { Container } from '../../../components/common/Container';

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <div>Test Content</div>
      </Container>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default MUI Container props', () => {
    const { container } = render(
      <Container>
        <div>Test Content</div>
      </Container>
    );
    
    const muiContainer = container.firstChild as HTMLElement;
    expect(muiContainer).toHaveClass('MuiContainer-root');
  });

  it('passes through additional props to MUI Container', () => {
    const { container } = render(
      <Container maxWidth="sm" data-testid="custom-container">
        <div>Test Content</div>
      </Container>
    );
    
    const muiContainer = container.firstChild as HTMLElement;
    expect(muiContainer).toHaveClass('MuiContainer-maxWidthSm');
    expect(muiContainer).toHaveAttribute('data-testid', 'custom-container');
  });

  it('applies custom sx styles', () => {
    const customStyles = {
      backgroundColor: 'red',
      padding: '20px'
    };
    
    const { container } = render(
      <Container sx={customStyles}>
        <div>Test Content</div>
      </Container>
    );
    
    const muiContainer = container.firstChild as HTMLElement;
    expect(muiContainer).toHaveStyle('background-color: rgb(255, 0, 0)');
    expect(muiContainer).toHaveStyle('padding: 20px');
  });

  it('handles different maxWidth values', () => {
    const { container: containerXs } = render(
      <Container maxWidth="xs">
        <div>XS Content</div>
      </Container>
    );
    
    const { container: containerMd } = render(
      <Container maxWidth="md">
        <div>MD Content</div>
      </Container>
    );
    
    const { container: containerLg } = render(
      <Container maxWidth="lg">
        <div>LG Content</div>
      </Container>
    );
    
    expect(containerXs.firstChild).toHaveClass('MuiContainer-maxWidthXs');
    expect(containerMd.firstChild).toHaveClass('MuiContainer-maxWidthMd');
    expect(containerLg.firstChild).toHaveClass('MuiContainer-maxWidthLg');
  });

  it('handles fixed width container', () => {
    const { container } = render(
      <Container fixed>
        <div>Fixed Container</div>
      </Container>
    );
    
    const muiContainer = container.firstChild as HTMLElement;
    expect(muiContainer).toHaveClass('MuiContainer-fixed');
  });

  it('handles disableGutters prop', () => {
    const { container } = render(
      <Container disableGutters>
        <div>No Gutters Container</div>
      </Container>
    );
    
    const muiContainer = container.firstChild as HTMLElement;
    expect(muiContainer).toHaveClass('MuiContainer-disableGutters');
  });

  it('combines custom sx with component structure', () => {
    const customSx = {
      margin: '10px',
      border: '1px solid blue'
    };
    
    const { container } = render(
      <Container sx={customSx} maxWidth="md">
        <div>Combined Props</div>
      </Container>
    );
    
    const muiContainer = container.firstChild as HTMLElement;
    expect(muiContainer).toHaveClass('MuiContainer-maxWidthMd');
    expect(muiContainer).toHaveStyle('margin: 10px');
    expect(muiContainer).toHaveStyle('border: 1px solid blue');
  });
});
