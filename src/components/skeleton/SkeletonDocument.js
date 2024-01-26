// @mui
import { Stack, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonDocument() {
  return (
      <Stack spacing={2} >
        {[...Array(30)].map((_, index) => (
          <Skeleton variant="text" animation='pulse' width="100%" height={10} />
        ))}
      </Stack>
  );
}
