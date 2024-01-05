// @mui
import { Stack, Skeleton, Grid, Card, CardContent } from '@mui/material';
import { useScreenSize } from '../../hooks/useResponsive';

// ----------------------------------------------------------------------

export default function SkeletonGallery() {
  
  const xsScreen = useScreenSize('xs');
  const smScreen = useScreenSize('sm');
  const mdScreen = useScreenSize('md');
  const lgScreen = useScreenSize('lg');
  const xlScreen = useScreenSize('xl');

  let repeat = 5;
  
  if(xsScreen) repeat=1;
  if(smScreen) repeat=2;
  if(mdScreen) repeat=3;
  if(lgScreen) repeat=4;
  if(xlScreen) repeat=6;

  return (
    Array.from(new Array(repeat)).map((_, index) => (
      <Card sx={{ cursor: 'pointer', position: 'relative' }}>
        <Skeleton sx={{ height: 170 }} animation="wave" variant="rectangular" />
        <CardContent>
          <Skeleton animation="wave" height={15} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={15} width="80%" />
        </CardContent>
      </Card>
    ))
  );
}
