import { Paper as MuiPaper, PaperProps } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
} & PaperProps;

export const Paper: FC<Props> = ({ children, ...props }) => {
  return <MuiPaper {...props}>{children}</MuiPaper>;
};