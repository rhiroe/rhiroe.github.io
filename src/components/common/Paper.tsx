import { Paper as MuiPaper, PaperProps } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
} & PaperProps;

export const Paper: FC<Props> = ({ children, ...props }) => {
  return <MuiPaper elevation={0} {...props}>{children}</MuiPaper>;
};

export const DarkPaper: FC<Props> = ({ children, ...props }) => {
  return <
    MuiPaper
    elevation={0}
    sx={{
      background: 'transparent',
      color: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      ...props.sx,
    }}
    {...props}
  >
    {children}
  </MuiPaper>;
};


 