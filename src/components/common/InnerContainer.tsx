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
        // スマホでの余白を最小化
        px: { xs: 1.5, sm: 3, md: 4 },
        ...props.sx
      }}
    >
      {children}
    </MuiContainer>
  );
};
