import { Paper as MuiPaper, PaperProps } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
} & PaperProps;

export const Paper: FC<Props> = ({ children, ...props }) => {
  return <MuiPaper elevation={0} {...props}>{children}</MuiPaper>;
};

export const GlassPaper: FC<Props> = ({ children, ...props }) => {
  return (
    <MuiPaper
      elevation={0}
      sx={{
        background: 'background.paper',
        backdropFilter: 'blur(20px)',
        border: 1,
        borderColor: 'divider',
        color: 'text.primary',
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </MuiPaper>
  );
};


 