import PropTypes from 'prop-types';
// @mui
import { Stack, Skeleton } from '@mui/material';

SkeletonViewFormField.propTypes = {
  variant: PropTypes.string,
};

export default function SkeletonViewFormField({ variant }) {
  return (
    <Stack spacing={1} direction="row" alignItems="center" sx={{ py: 0.5, pl:0, pr:5 }}>
      <Stack spacing={variant?1.6:0.5} sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" sx={{ height: 9 }} />
        <Skeleton variant="text" sx={{ height: 6 }} />
      </Stack>
    </Stack>
  );
}
