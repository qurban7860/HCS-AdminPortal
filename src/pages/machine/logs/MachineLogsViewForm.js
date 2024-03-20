import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {  Card, Grid, Stack, Skeleton } from '@mui/material';
import JsonEditor from '../../../components/CodeMirror/JsonEditor';
// redux
import { setMachineErpLogListViewFormVisibility } from '../../../redux/slices/products/machineErpLogs';
// components
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';


function MachineLogsViewForm() {

  const { machineErpLog, isLoading } = useSelector((state) => state.machineErpLogs);
  const dispatch = useDispatch();

  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons backLink={()=> dispatch(setMachineErpLogListViewFormVisibility(true))} />
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
  );
}

export default memo(MachineLogsViewForm)
