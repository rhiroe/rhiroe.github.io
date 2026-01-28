import { Card as MuiCard, CardProps as MuiCardProps, CardContent as MuiCardContent, CardContentProps as MuiCardContentProps } from '@mui/material';
import { FC } from 'react';

export const Card: FC<MuiCardProps> = ({ children, ...props }) => {
  return (
    <MuiCard
      {...props}
      sx={{
        ...props.sx
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
