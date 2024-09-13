import { memo, useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Container, Card, Grid, Stack, Skeleton } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// redux
import { getMachineLogRecord } from '../../../redux/slices/products/machineErpLogs';
// components
import JsonEditor from '../../../components/CodeMirror/JsonEditor';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import MachineTabContainer from '../util/MachineTabContainer';


function MachineLogsViewForm() {

  const { machineErpLog, isLoading } = useSelector((state) => state.machineErpLogs);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { machineId, id: combinedId } = useParams();
  const [logType, logId] = combinedId.split('_');
  const [logsToShow, setLogsToShow] = useState([]);

  useLayoutEffect(()=>{
    if(machineId && logId){
      dispatch(getMachineLogRecord(machineId, logId, logType))
    }
  },[ dispatch, machineId, logId, logType ])

  useEffect(() => {
    if (machineErpLog) {
      const formattedLog = formatMachineErpLog(machineErpLog);
      setLogsToShow(formattedLog);
    }
  }, [machineErpLog]);

  const formatMachineErpLog = (log) => {
    const { _id, createdIP, updatedIP, __v, ...rest } = log;
    
    const formatted = {
      ...rest,
      customer: log.customer?.name || '',
      machine: log.machine?.name || '',
      createdBy: log.createdBy?.name || '',
      updatedBy: log.updatedBy?.name || '',
    };
  
    return formatted;
  };

  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue="logs" />
      <Card sx={{ p: 2 }}>
        <Grid>
          <ViewFormEditDeleteButtons
            backLink={() => navigate(PATH_MACHINE.machines.logs.root(machineId))}
          />
          <Stack spacing={2} sx={{ p: 1 }}>
            {isLoading ? (
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
            ) : (
              <JsonEditor value={JSON.stringify(logsToShow, null, 2)} readOnly />
            )}
          </Stack>
          <ViewFormAudit defaultValues={machineErpLog} />
        </Grid>
      </Card>
    </Container>
  );
}

export default memo(MachineLogsViewForm)
