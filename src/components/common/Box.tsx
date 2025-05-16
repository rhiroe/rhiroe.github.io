import { Box as MuiBox, BoxProps } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
} & BoxProps;

export const Box: FC<Props> = ({ children, ...props }) => {
  return <MuiBox {...props}>{children}</MuiBox>;
};