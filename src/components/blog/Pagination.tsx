import { Button, Typography, Box } from '~/components/common';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    // レスポンシブなボタンスタイル
    const getResponsiveButtonStyle = (isActive: boolean) => ({
        minWidth: { xs: '32px', sm: '40px' },
        height: { xs: '32px', sm: '40px' },
        borderRadius: 2,
        borderColor: isActive ? 'transparent' : 'divider',
        color: isActive ? 'primary.contrastText' : 'text.secondary',
        bgcolor: isActive ? 'primary.main' : 'transparent',
        fontWeight: isActive ? 600 : 400,
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
        transition: 'all 0.2s ease',
        boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
        '&:hover:not(:disabled)': {
            borderColor: isActive ? 'transparent' : 'primary.main',
            bgcolor: isActive ? 'primary.dark' : 'action.hover',
            color: isActive ? 'primary.contrastText' : 'text.primary',
            transform: 'translateY(-1px)',
            boxShadow: isActive 
                ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
                : '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
    });

    // 前へ・次へボタンのスタイル
    const getNavButtonStyle = () => ({
        minWidth: { xs: '32px', sm: '40px' },
        height: { xs: '32px', sm: '40px' },
        borderRadius: 2,
        borderColor: 'divider',
        color: 'text.secondary',
        bgcolor: 'transparent',
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
        fontWeight: 500,
        transition: 'all 0.2s ease',
        '&:hover:not(:disabled)': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
            color: 'text.primary',
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
        '&:disabled': {
            opacity: 0.3,
            borderColor: 'divider',
            color: 'text.disabled',
            cursor: 'not-allowed',
        }
    });

    // 省略記号のレスポンシブスタイル
    const ellipsisStyle = {
        minWidth: { xs: '24px', sm: '32px' },
        height: { xs: '32px', sm: '40px' },
        color: 'text.secondary',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
        fontWeight: 400,
        opacity: 0.6,
    };

    // ページネーションのボタンを生成する関数
    const generatePageButtons = () => {
        const buttons = [];
        
        // モバイルでは5ページ以下で全表示（デスクトップでは7ページ以下）
        const maxPagesForFullDisplay = 5;
        
        if (totalPages <= maxPagesForFullDisplay) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(
                    <Button
                        key={i}
                        variant={i === currentPage ? "contained" : "outlined"}
                        size="small"
                        onClick={() => onPageChange(i)}
                        sx={getResponsiveButtonStyle(i === currentPage)}
                    >
                        {i}
                    </Button>
                );
            }
            return buttons;
        }
        
        // 6ページ以上の場合のスマートロジック（モバイル対応）
        
        // 常に最初のページを表示
        buttons.push(
            <Button
                key={1}
                variant={1 === currentPage ? "contained" : "outlined"}
                size="small"
                onClick={() => onPageChange(1)}
                sx={getResponsiveButtonStyle(1 === currentPage)}
            >
                1
            </Button>
        );
        
        // モバイルでは現在のページ ±1 の範囲で表示
        const range = 1;
        let startPage = Math.max(2, currentPage - range);
        const endPage = Math.min(totalPages - 1, currentPage + range);
        
        // 左側の省略記号が必要か
        if (startPage > 2) {
            buttons.push(
                <Typography key="ellipsis-left" sx={ellipsisStyle}>
                    ...
                </Typography>
            );
        } else {
            // 省略記号が不要な場合は2ページ目から表示
            startPage = 2;
        }
        
        // 中央部分のページボタン
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button
                    key={i}
                    variant={i === currentPage ? "contained" : "outlined"}
                    size="small"
                    onClick={() => onPageChange(i)}
                    sx={getResponsiveButtonStyle(i === currentPage)}
                >
                    {i}
                </Button>
            );
        }
        
        // 右側の省略記号が必要か
        if (endPage < totalPages - 1) {
            buttons.push(
                <Typography key="ellipsis-right" sx={ellipsisStyle}>
                    ...
                </Typography>
            );
        }
        
        // 常に最後のページを表示（ただし1ページと重複しない場合のみ）
        if (totalPages > 1) {
            buttons.push(
                <Button
                    key={totalPages}
                    variant={totalPages === currentPage ? "contained" : "outlined"}
                    size="small"
                    onClick={() => onPageChange(totalPages)}
                    sx={getResponsiveButtonStyle(totalPages === currentPage)}
                >
                    {totalPages}
                </Button>
            );
        }
        
        return buttons;
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1 },
                mt: 4,
                mb: 3,
                pt: 1, // ホバーアニメーション用の上部スペースを確保
                flexWrap: 'nowrap', // 改行を防ぐ
                overflowX: 'auto', // 必要に応じて横スクロール
                px: 1,
                '&::-webkit-scrollbar': {
                    display: 'none', // スクロールバーを隠す
                },
                scrollbarWidth: 'none', // Firefox用
            }}
        >
            {/* 前へボタン */}
            <Button
                variant="outlined"
                size="small"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                sx={getNavButtonStyle()}
            >
                {'<'}
            </Button>

            {/* ページボタン群 */}
            {generatePageButtons()}

            {/* 次へボタン */}
            <Button
                variant="outlined"
                size="small"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                sx={getNavButtonStyle()}
            >
                {'>'}
            </Button>
        </Box>
    );
};
