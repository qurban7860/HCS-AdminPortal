// @mui
import { Skeleton, Card } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonGallery() {
  return (
      <Card sx={{ cursor: 'pointer', position: 'relative' }}>
        <Skeleton animation="wave" height={115} variant="rectangular" />
        <Skeleton animation="wave" height={15} width="90%" sx={{margin:1}}   />
      </Card>
  );
}
