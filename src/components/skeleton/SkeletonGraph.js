// @mui
import { Stack, Skeleton, Grid } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonGraph({ ...other }) {
  return (
    <Stack {...other} sx={{p:5}}>
        <Stack spacing={1} direction="row" justifyContent='space-between' alignItems="center">
            {[...Array(30)].map((_, index) => (
            <Stack spacing={3} direction="column" alignItems="center">
              <Skeleton variant="rectangular" animation='pulse' width={20} height={75} sx={{borderRadius: 1, flexShrink: 0 }} />
              <Skeleton variant="rectangular" animation='pulse' width={20} height={300} sx={{borderRadius: 1, flexShrink: 0 }} />
              <Skeleton variant="rectangular" animation='pulse' width={20} height={20} sx={{borderRadius: 1, flexShrink: 0 }} />
            </Stack>
            ))}
        </Stack>
    </Stack>
  );
}
