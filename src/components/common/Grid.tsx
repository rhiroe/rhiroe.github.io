import React from 'react';
import { Grid as MuiGrid, GridProps as MuiGridProps } from '@mui/material';

export const Grid: React.FC<MuiGridProps> = (props) => {
  return <MuiGrid {...props} />;
};
