import { Container as MuiContainer, ContainerProps } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
} & Omit<ContainerProps, 'maxWidth'>;

export const InnerContainer: FC<Props> = ({ children, ...props }) => {
  return (
    <MuiContainer
      maxWidth="lg"
      {...props}
      sx={{
        width: '100%',
        bgcolor: 'common.black',
        ...props.sx
      }}
    >
      {children}
    </MuiContainer>
  );
};