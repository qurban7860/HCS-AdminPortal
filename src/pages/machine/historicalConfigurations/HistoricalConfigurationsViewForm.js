import { useMemo, memo, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Container, Card, Grid, Stack, Skeleton } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// redux
import { getHistoricalConfigurationRecord} from '../../../redux/slices/products/historicalConfiguration';
// components
import JsonEditor from '../../../components/CodeMirror/JsonEditor';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { fDate } from '../../../utils/formatTime';
import MachineTabContainer from '../util/MachineTabContainer';

function HistoricalConfigurationsViewForm() {

  const { historicalConfiguration, isLoading } = useSelector((state) => state.historicalConfiguration);
  const navigate = useNavigate();
  const { machineId, id } = useParams();
  const dispatch = useDispatch();

  useLayoutEffect(()=>{
    dispatch(getHistoricalConfigurationRecord(machineId, id))
  },[ dispatch, machineId, id ])

  const defaultValues = useMemo(
    () => ({
      backupDate:                           historicalConfiguration?.backupDate,
      isActive:                             historicalConfiguration?.isActive,
      isManufacture:                        historicalConfiguration?.isManufacture, 
      createdAt:                            historicalConfiguration?.createdAt || '',
      createdByFullName:                    historicalConfiguration?.createdBy?.name || '',
      createdIP:                            historicalConfiguration?.createdIP || '',
      updatedAt:                            historicalConfiguration?.updatedAt || '',
      updatedByFullName:                    historicalConfiguration?.updatedBy?.name || '',
      updatedIP:                            historicalConfiguration?.updatedIP || '',
    }),
    [ historicalConfiguration ]
  );
  
  return (
    <Container maxWidth={false} >
    <MachineTabContainer currentTabValue='ini' />
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons 
          isActive={defaultValues?.isActive} 
          isManufacture={defaultValues?.isManufacture} 
          backLink={()=> navigate(PATH_MACHINE.machines.ini.root(machineId))} 
        />
        <ViewFormField sm={12} heading='Backup Date' param={fDate(defaultValues?.backupDate)} />
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
            :  <JsonEditor  value={JSON.stringify( historicalConfiguration?.configuration, null, 2 )} readOnly />  
            }
        </Stack>
          <ViewFormAudit  defaultValues={defaultValues} />
      </Grid>
    </Card>
    </Container>
  );
}

export default memo(HistoricalConfigurationsViewForm)
