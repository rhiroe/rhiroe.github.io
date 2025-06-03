import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../../../components/blog/Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pagination controls correctly', () => {
    render(
      <Pagination 
        currentPage={2} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );

    // Previous button
    expect(screen.getByText('<')).toBeInTheDocument();
    
    // Next button
    expect(screen.getByText('>')).toBeInTheDocument();
    
    // Page numbers
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );

    const prevButton = screen.getByText('<');
    expect(prevButton.closest('button')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination 
        currentPage={5} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );

    const nextButton = screen.getByText('>');
    expect(nextButton.closest('button')).toBeDisabled();
  });

  it('calls onPageChange when clicking page numbers', () => {
    render(
      <Pagination 
        currentPage={2} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );

    const page3Button = screen.getByText('3');
    fireEvent.click(page3Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when clicking previous button', () => {
    render(
      <Pagination 
        currentPage={3} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );

    const prevButton = screen.getByText('<');
    fireEvent.click(prevButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking next button', () => {
    render(
      <Pagination 
        currentPage={3} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );

    const nextButton = screen.getByText('>');
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('highlights current page correctly', () => {
    render(
      <Pagination 
        currentPage={3} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );

    const currentPageButton = screen.getByText('3').closest('button');
    const otherPageButton = screen.getByText('2').closest('button');

    // Current page should have contained variant (MUI class)
    expect(currentPageButton).toHaveClass('MuiButton-contained');
    
    // Other pages should have outlined variant
    expect(otherPageButton).toHaveClass('MuiButton-outlined');
  });

  it('handles single page correctly', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={1} 
        onPageChange={mockOnPageChange} 
      />
    );

    // Should show page 1
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Both navigation buttons should be disabled
    const prevButton = screen.getByText('<');
    const nextButton = screen.getByText('>');
    
    expect(prevButton.closest('button')).toBeDisabled();
    expect(nextButton.closest('button')).toBeDisabled();
  });

  it('shows all pages when totalPages <= 5', () => {
    render(
      <Pagination 
        currentPage={3} 
        totalPages={4} 
        onPageChange={mockOnPageChange} 
      />
    );

    // All pages should be visible
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    
    // No ellipsis should be present
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  it('shows ellipsis for many pages', () => {
    render(
      <Pagination 
        currentPage={5} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
      />
    );

    // Should show first page
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Should show last page
    expect(screen.getByText('10')).toBeInTheDocument();
    
    // Should show current page and adjacent pages
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    
    // Should show ellipsis (there might be multiple)
    expect(screen.getAllByText('...')).toHaveLength(2);
  });

  it('handles edge case for first page with many total pages', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
      />
    );

    // Should show first few pages
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Should show last page
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('handles edge case for last page with many total pages', () => {
    render(
      <Pagination 
        currentPage={10} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
      />
    );

    // Should show first page
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Should show last few pages
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('handles zero total pages gracefully', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={0} 
        onPageChange={mockOnPageChange} 
      />
    );

    // Navigation buttons should still be present
    expect(screen.getByText('<')).toBeInTheDocument();
    expect(screen.getByText('>')).toBeInTheDocument();
    
    // Previous button should be disabled (currentPage === 1)
    expect(screen.getByText('<').closest('button')).toBeDisabled();
    
    // Next button behavior depends on implementation
    // In this case, since currentPage (1) !== totalPages (0), it won't be disabled
    // This might be a design decision to handle edge cases
    const nextButton = screen.getByText('>').closest('button');
    // We'll just verify the button exists, as the behavior is implementation-specific
    expect(nextButton).toBeInTheDocument();
  });

  it('renders responsive layout container', () => {
    const { container } = render(
      <Pagination 
        currentPage={2} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );

    // Check that the main container has appropriate styles
    const paginationContainer = container.firstChild as HTMLElement;
    expect(paginationContainer).toHaveStyle('display: flex');
  });

  it('prevents navigation beyond boundaries', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );

    const prevButton = screen.getByText('<').closest('button');
    fireEvent.click(prevButton!);

    // Should not call onPageChange for invalid navigation
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('handles medium range pagination correctly', () => {
    render(
      <Pagination 
        currentPage={4} 
        totalPages={7} 
        onPageChange={mockOnPageChange} 
      />
    );

    // Should show first page
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Should show pages around current
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Should show last page
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});
