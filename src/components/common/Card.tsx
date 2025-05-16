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
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        opacity: 0,
        animation: 'fadeSlideIn 0.6s ease-out forwards',
        transition: 'transform 0.25s ease-out, box-shadow 0.25s ease-out, background-color 0.25s ease-out !important', // トランジションを少し速く、よりスムーズに
        ...props.sx,
        "&:hover": {
          transform: 'translateY(-4px) scale(1.01) !important',
          boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.40) !important',
          backgroundColor: 'rgba(40, 50, 65, 0.6) !important',
        },
        "&:nth-child(2)": {
          animationDelay: '0.15s'
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
        color: 'rgba(230, 230, 230, 0.9)',
        ...props.sx
      }}
    >
      {children}
    </MuiCardContent>
  );
};
