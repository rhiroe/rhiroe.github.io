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
        padding: '0 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        ...props.sx
      }}
    >
      {children}
    </MuiContainer>
  );
};