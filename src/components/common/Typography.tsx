import { Typography as MuiTypography, TypographyProps } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
} & TypographyProps;

export const Typography: FC<Props> = ({ children, ...props }) => {
  return <MuiTypography {...props}>{children}</MuiTypography>;
};