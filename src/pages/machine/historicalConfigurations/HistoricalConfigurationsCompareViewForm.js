import { memo, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Container, Card, Grid, Stack, Skeleton } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// redux
import { getHistoricalConfigurationRecord, getHistoricalConfigurationRecord2 } from '../../../redux/slices/products/historicalConfiguration';
// components
import JsonEditor from '../../../components/CodeMirror/JsonEditorMerge';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import MachineTabContainer from '../util/MachineTabContainer';

function HistoricalConfigurationsViewForm() {

  const { historicalConfiguration, historicalConfiguration2, isLoading } = useSelector((state) => state.historicalConfiguration);
  const navigate = useNavigate();
  const { machineId, id1, id2 } = useParams();
  const dispatch = useDispatch();
  
  useLayoutEffect(()=>{
    if(machineId && id1 && id2){
      dispatch(getHistoricalConfigurationRecord(machineId, id1 ))
      dispatch(getHistoricalConfigurationRecord2(machineId, id2 ))
    }
  },[ dispatch, machineId, id1, id2 ])

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='ini' />
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons
          backLink={()=> navigate(PATH_MACHINE.machines.ini.root(machineId))} 
        />
        <Stack spacing={2} >
          {isLoading ? 
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
          </>
           :  <JsonEditor  value={ historicalConfiguration } modifiedValue={ historicalConfiguration2 } readOnly />  
           }
        </Stack>

      </Grid>
    </Card>
    </Container>
  );
}

export default memo(HistoricalConfigurationsViewForm)
