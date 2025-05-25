import { Card as MuiCard, CardProps as MuiCardProps, CardContent as MuiCardContent, CardContentProps as MuiCardContentProps } from '@mui/material';
import { FC, ReactNode, useState } from 'react';

export const Card: FC<MuiCardProps> = ({ children, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MuiCard
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
      sx={{
        bgcolor: 'background.paper',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'transform 0.25s ease-out, box-shadow 0.25s ease-out !important',
        '& a': {
          textDecoration: 'none',
          color: 'inherit',
          display: 'block'
        },
        ...props.sx,
        "&:hover": {
          transform: 'translateY(-4px) scale(1.01) !important',
          boxShadow: 4
        }
      }}
    >
      {children}
    </MuiCard>
  );
};

export const CardContent: FC<MuiCardContentProps> = ({ children, ...props }) => {
  return (
    <MuiCardContent
      {...props}
      sx={{
        ...props.sx
      }}
    >
      {children}
    </MuiCardContent>
  );
};
