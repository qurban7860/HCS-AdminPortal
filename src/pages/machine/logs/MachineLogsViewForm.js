import { memo, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Container, Card, Grid, Stack, Skeleton } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// redux
import { getMachineErpLogRecord } from '../../../redux/slices/products/machineErpLogs';
// components
import JsonEditor from '../../../components/CodeMirror/JsonEditor';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import MachineTabContainer from '../util/MachineTabContainer';


function MachineLogsViewForm() {

  const { machineErpLog, isLoading } = useSelector((state) => state.machineErpLogs);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { machineId, id } = useParams();

  useLayoutEffect(()=>{
    if(machineId && id){
      dispatch(getMachineErpLogRecord(machineId, id))
    }
  },[ dispatch, machineId, id ])

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='logs' />
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons backLink={()=> navigate(PATH_MACHINE.machines.logs.root(machineId))} />
        <Stack spacing={2} sx={{p:1}}>
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
            :  <JsonEditor  value={JSON.stringify( machineErpLog, null, 2 )} readOnly />  
            }
        </Stack>
          <ViewFormAudit  defaultValues={machineErpLog} />
      </Grid>
    </Card>
  </Container>
  );
}

export default memo(MachineLogsViewForm)
