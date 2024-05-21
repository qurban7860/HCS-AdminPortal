import { useEffect } from 'react';
import { Container, Grid, Card } from '@mui/material';
import { getMachineLatLongData } from '../../../../redux/slices/products/machine';
import { useDispatch, useSelector } from '../../../../redux/store';
import { Cover } from '../../../../components/Defaults/Cover';
import GoogleMaps from '../../../../assets/GoogleMaps';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function Reports() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMachineLatLongData());
  }, [dispatch]);

  const { machineLatLongCoordinates } = useSelector((state) => state.machine);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer><Cover name="Sites Map"/></StyledCardContainer>
      <Grid container spacing={3}>
        <Grid item sm={12} xs={12}>
          <Card>
            <GoogleMaps machinesSites={machineLatLongCoordinates} mapHeight={600} />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
