import { Chip as MuiChip, ChipProps } from '@mui/material';
import { FC } from 'react';

type Props = ChipProps;

export const Chip: FC<Props> = (props) => {
  return <MuiChip {...props} />;
};