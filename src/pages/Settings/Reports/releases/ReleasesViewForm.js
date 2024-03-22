import { useMemo, useEffect } from 'react';
// @mui
import { Card, Grid, Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
// hooks
import { useSelector, useDispatch } from 'react-redux';
import { PATH_SETTING } from '../../../../routes/paths';
import { Cover } from '../../../../components/Defaults/Cover';
import { fDate } from '../../../../utils/formatTime';
import { getRelease } from '../../../../redux/slices/reports/releases';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';

export default function ReleasesViewForm() {
  
  const { release, isLoading } = useSelector((state) => state.releases);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(()=>{
    dispatch(getRelease(id));
  },[ dispatch, id ])

  const defaultValues = useMemo(
    () => ({
      name:         release?.name|| '',  
      startDate:    release?.startDate || '', 
      releaseDate:  release?.releaseDate || '',
      description:  release?.description || '', 
      released:     release?.released,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [release]
  );
  
  return (
    <Container maxWidth={false}>
      <Card sx={{mb: 3, height: 160, position: 'relative'}}>
        <Cover name="Release" icon="ph:users-light" generalSettings />
      </Card>
      <Grid item md={12} mt={2}>
        <Card sx={{ p: 2 }}>
        <ViewFormEditDeleteButtons  
          backLink={() => navigate(PATH_SETTING.releases.list)}
          isReleased={defaultValues?.released}
          settingPage
        />
          <Grid container sx={{mt:2}}>
            <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues.name} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Release Date" param={fDate(defaultValues.releaseDate)} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Start Date" param={fDate(defaultValues.startDate)} />
            <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues.description} />
          </Grid>
        </Card>
      </Grid>
    </Container>
  );
}
