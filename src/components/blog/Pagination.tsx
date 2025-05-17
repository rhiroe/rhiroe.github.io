import { Button, Typography, Grid } from '~/components/common';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    return (
        <Grid container justifyContent="center" spacing={0.5} sx={{ marginTop: '2rem' }}>
            <Button
                variant="outlined"
                size="small"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                sx={{
                    minWidth: '32px',
                    height: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover:not(:disabled)': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:disabled': {
                        opacity: 0.5,
                        cursor: 'not-allowed',
                    }
                }}
            >
                {'<'}
            </Button>
            {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                if (
                    page >= (currentPage === totalPages ? currentPage - 2 : currentPage - 1)
                    && page <= (currentPage === 1 ? currentPage + 2 : currentPage + 1)
                ) {
                    return (
                        <Button
                            key={index}
                            variant={page === currentPage ? "contained" : "outlined"}
                            size="small"
                            onClick={() => onPageChange(page)}
                            sx={{
                                minWidth: '32px',
                                border: `1px solid ${page === currentPage ? 'transparent' : 'rgba(255, 255, 255, 0.3)'}`,
                                color: 'white',
                                transition: 'all 0.3s ease',
                                backgroundColor: page === currentPage ? 'rgba(77, 163, 255, 0.2)' : 'transparent',
                                '&:hover:not(:disabled)': {
                                    borderColor: page === currentPage ? 'transparent' : 'rgba(255, 255, 255, 0.5)',
                                    backgroundColor: page === currentPage ? 'rgba(77, 163, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                                },
                                '&:disabled': {
                                    opacity: 0.5,
                                    cursor: 'not-allowed',
                                }
                            }}
                        >
                            {page}
                        </Button>
                    );
                } else if (page === 1 || page === totalPages) {
                    return (
                        <Button
                            key={index}
                            variant="outlined"
                            size="small"
                            onClick={() => onPageChange(page)}
                            sx={{
                                minWidth: '32px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                '&:hover:not(:disabled)': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '&:disabled': {
                                    opacity: 0.5,
                                    cursor: 'not-allowed',
                                }
                            }}
                        >
                            {page}
                        </Button>
                    );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                        <Typography
                            key={index}
                            sx={{
                                padding: '0 4px',
                                color: 'rgba(255, 255, 255, 0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                height: '32px'
                            }}
                        >
                            ...
                        </Typography>
                    );
                }
                return null;
            })}
            <Button
                variant="outlined"
                size="small"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                sx={{
                    minWidth: '32px',
                    height: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover:not(:disabled)': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:disabled': {
                        opacity: 0.5,
                        cursor: 'not-allowed',
                    }
                }}
            >
                {'>'}
            </Button>
        </Grid>
    );
};