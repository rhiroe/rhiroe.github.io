import { Container as MuiContainer, ContainerProps } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
} & ContainerProps;

export const Container: FC<Props> = ({ children, ...props }) => {
  return (
    <MuiContainer
      {...props}
      sx={{
        ...props.sx
      }}
    >
      {children}
    </MuiContainer>
  );
};
