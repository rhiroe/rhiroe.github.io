import { Button as MuiButton, ButtonProps } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
} & ButtonProps;

export const Button: FC<Props> = ({ children, ...props }) => {
  return <MuiButton {...props}>{children}</MuiButton>;
};