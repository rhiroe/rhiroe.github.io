import { render, screen, fireEvent } from '@testing-library/react';
import { Chip } from '../../../components/common/Chip';

// Mock Material-UI icons
jest.mock('@mui/icons-material/AccountCircle', () => {
  return function MockAccountCircleIcon() {
    return <div data-testid="account-circle-icon">AccountCircle</div>;
  };
});

jest.mock('@mui/icons-material/Cancel', () => {
  return function MockCancelIcon() {
    return <div data-testid="cancel-icon">Cancel</div>;
  };
});

const MockAccountCircleIcon = () => <div data-testid="account-circle-icon">AccountCircle</div>;
const MockCancelIcon = () => <div data-testid="cancel-icon">Cancel</div>;

describe('Chip', () => {
  it('renders with label correctly', () => {
    render(<Chip label="Test Chip" />);
    
    expect(screen.getByText('Test Chip')).toBeInTheDocument();
  });

  it('applies default MUI Chip classes', () => {
    const { container } = render(<Chip label="Default Chip" />);
    
    const chipElement = container.firstChild as HTMLElement;
    expect(chipElement).toHaveClass('MuiChip-root');
  });

  it('handles different variants correctly', () => {
    const { rerender, container } = render(<Chip label="Filled" variant="filled" />);
    
    let chipElement = container.firstChild as HTMLElement;
    expect(chipElement).toHaveClass('MuiChip-filled');
    
    rerender(<Chip label="Outlined" variant="outlined" />);
    chipElement = container.firstChild as HTMLElement;
    expect(chipElement).toHaveClass('MuiChip-outlined');
  });

  it('handles different sizes correctly', () => {
    const { rerender, container } = render(<Chip label="Small" size="small" />);
    
    let chipElement = container.firstChild as HTMLElement;
    expect(chipElement).toHaveClass('MuiChip-sizeSmall');
    
    rerender(<Chip label="Medium" size="medium" />);
    chipElement = container.firstChild as HTMLElement;
    expect(chipElement).toHaveClass('MuiChip-sizeMedium');
  });

  it('handles different colors correctly', () => {
    const { rerender, container } = render(<Chip label="Primary" color="primary" />);
    
    let chipElement = container.firstChild as HTMLElement;
    expect(chipElement).toHaveClass('MuiChip-colorPrimary');
    
    rerender(<Chip label="Secondary" color="secondary" />);
    chipElement = container.firstChild as HTMLElement;
    expect(chipElement).toHaveClass('MuiChip-colorSecondary');
    
    rerender(<Chip label="Success" color="success" />);
    chipElement = container.firstChild as HTMLElement;
    expect(chipElement).toHaveClass('MuiChip-colorSuccess');
    
    rerender(<Chip label="Error" color="error" />);
    chipElement = container.firstChild as HTMLElement;
    expect(chipElement).toHaveClass('MuiChip-colorError');
  });

  it('renders with avatar correctly', () => {
    render(
      <Chip 
        label="Avatar Chip" 
        avatar={<MockAccountCircleIcon />}
      />
    );
    
    expect(screen.getByText('Avatar Chip')).toBeInTheDocument();
    expect(screen.getByTestId('account-circle-icon')).toBeInTheDocument();
  });

  it('handles clickable chip correctly', () => {
    const handleClick = jest.fn();
    
    render(
      <Chip 
        label="Clickable Chip" 
        onClick={handleClick}
        clickable
      />
    );
    
    const chipElement = screen.getByText('Clickable Chip').closest('.MuiChip-root');
    expect(chipElement).toHaveClass('MuiChip-clickable');
    
    fireEvent.click(chipElement!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles deletable chip correctly', () => {
    const handleDelete = jest.fn();
    
    render(
      <Chip 
        label="Deletable Chip" 
        onDelete={handleDelete}
      />
    );
    
    expect(screen.getByText('Deletable Chip')).toBeInTheDocument();
    
    // Find the delete button by its SVG element
    const deleteIcon = screen.getByTestId('CancelIcon');
    expect(deleteIcon).toBeInTheDocument();
    
    // Click on the delete icon
    fireEvent.click(deleteIcon);
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it('renders with custom delete icon', () => {
    const handleDelete = jest.fn();
    
    render(
      <Chip 
        label="Custom Delete Icon" 
        onDelete={handleDelete}
        deleteIcon={<MockCancelIcon />}
      />
    );
    
    expect(screen.getByText('Custom Delete Icon')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-icon')).toBeInTheDocument();
  });

  it('applies custom sx styles', () => {
    const customStyles = {
      backgroundColor: 'rgb(255, 0, 255)',
      color: 'rgb(255, 255, 255)'
    };
    
    const { container } = render(
      <Chip 
        label="Styled Chip" 
        sx={customStyles}
      />
    );
    
    const chipElement = container.firstChild as HTMLElement;
    expect(chipElement).toHaveStyle('background-color: rgb(255, 0, 255)');
    expect(chipElement).toHaveStyle('color: rgb(255, 255, 255)');
  });

  it('handles disabled state correctly', () => {
    const { container } = render(
      <Chip 
        label="Disabled Chip" 
        disabled
      />
    );
    
    const chipElement = container.firstChild as HTMLElement;
    // MUI uses 'Mui-disabled' class for disabled state
    expect(chipElement).toHaveClass('Mui-disabled');
  });

  it('passes through all props to MUI Chip', () => {
    const { container } = render(
      <Chip 
        label="Custom Chip"
        data-testid="custom-chip"
        className="custom-class"
        id="custom-id"
      />
    );
    
    const chipElement = container.firstChild as HTMLElement;
    expect(chipElement).toHaveAttribute('data-testid', 'custom-chip');
    expect(chipElement).toHaveClass('custom-class');
    expect(chipElement).toHaveAttribute('id', 'custom-id');
  });

  it('handles component prop correctly', () => {
    const { container } = render(
      <Chip 
        label="Link Chip"
        component="a"
        href="https://example.com"
      />
    );
    
    const chipElement = container.firstChild as HTMLElement;
    expect(chipElement.tagName.toLowerCase()).toBe('a');
    expect(chipElement).toHaveAttribute('href', 'https://example.com');
  });

  it('handles keyboard events on clickable chip', () => {
    const handleClick = jest.fn();
    
    render(
      <Chip 
        label="Keyboard Chip" 
        onClick={handleClick}
        clickable
      />
    );
    
    const chipElement = screen.getByText('Keyboard Chip').closest('.MuiChip-root');
    
    fireEvent.keyDown(chipElement!, { key: 'Enter', code: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    // Note: Space key behavior may depend on MUI implementation
    // For now, we'll just test Enter key
  });

  it('renders without crashing with minimal props', () => {
    const { container } = render(<Chip label="Simple" />);
    
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('Simple')).toBeInTheDocument();
  });
});
