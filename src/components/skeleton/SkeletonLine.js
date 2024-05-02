// @mui
import { TableRow, TableCell, Skeleton, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonLine({ ...other }) {
  return (
          <Stack spacing={2} direction="row" sx={{px:2, py:1}} justifyContent='space-between' alignItems="center">
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width={160} height={20} />
            <Skeleton variant="text" width={160} height={20} />
            <Skeleton variant="text" width={160} height={20} />
            <Skeleton variant="text" width={160} height={20} />
          </Stack>
  );
}
