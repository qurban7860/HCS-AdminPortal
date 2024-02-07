import { useEffect } from 'react';
import { Container, Grid, Card, CardHeader, CardContent } from '@mui/material';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import { getMachineLatLongData } from '../../redux/slices/products/machine';
import { useDispatch, useSelector } from '../../redux/store';
import { Cover } from '../../components/Defaults/Cover';
import GoogleMaps from '../../assets/GoogleMaps';
import FormLabel from '../../components/DocumentForms/FormLabel';

// ----------------------------------------------------------------------

export default function Reports() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMachineLatLongData());
  }, [dispatch]);

  const { machineLatLongCoordinates } = useSelector((state) => state.machine);

  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
        }}
      >
        <Cover name="Sites Map" icon="material-symbols:list-alt-outline" />
      </Card>
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
