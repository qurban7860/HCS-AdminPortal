import { useMemo, useEffect } from 'react';
// @mui
import { Card, Grid, Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
// hooks
import { useSelector, useDispatch } from 'react-redux';
import { PATH_SETTING } from '../../../../routes/paths';
import { Cover } from '../../../../components/Defaults/Cover';
import { fDate } from '../../../../utils/formatTime';
import { getPm2Log } from '../../../../redux/slices/logs/pm2Logs';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';

export default function Pm2LogsViewForm() {
  
  const { pm2Log, isLoading } = useSelector((state) => state.pm2Logs);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(()=>{
    dispatch(getPm2Log(id));
  },[ dispatch, id ])

  const defaultValues = useMemo(
    () => ({
      name:         pm2Log || '',
    }),
    [ pm2Log ]
  );
  
  return (
    <Container maxWidth={false}>
      <Card sx={{mb: 3, height: 160, position: 'relative'}}>
        <Cover name="PM2 Log" generalSettings />
      </Card>
      <Grid item md={12} mt={2}>
        <Card sx={{ p: 2 }}>
        <ViewFormEditDeleteButtons  
          backLink={() => navigate(PATH_SETTING.logs.pm2.root)}
          settingPage
        />
          <Grid container sx={{mt:2}}>
            <ViewFormField isLoading={isLoading} sm={12} heading="Name" param={defaultValues.name} />
          </Grid>
        </Card>
      </Grid>
    </Container>
  );
}
