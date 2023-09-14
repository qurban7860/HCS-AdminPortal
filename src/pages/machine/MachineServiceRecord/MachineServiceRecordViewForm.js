import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// @mui
import {  Card, Grid, Tooltip } from '@mui/material';
// redux
import { deleteMachineServiceRecord, setAllFlagsFalse, setMachineServiceRecordEditFormVisibility } from '../../../redux/slices/products/machineServiceRecord';
// paths
// import { PATH_MACHINE, PATH_SETTING } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// import { fDate, fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
// import ViewFormSWitch from '../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function MachineServiceParamViewForm() {
  const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);

  // const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
      await dispatch(deleteMachineServiceRecord(machineServiceRecord?._id));
      dispatch(setAllFlagsFalse());
      enqueueSnackbar('Machine Service Record deleted Successfully!');
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async () => {
    dispatch(setMachineServiceRecordEditFormVisibility(true))
  };

  const defaultValues = useMemo(
    () => ({
      recordType:                 machineServiceRecord?.recordType || null,
      serviceRecordConfig:        machineServiceRecord?.serviceRecordConfig || null,
      serviceDate:                machineServiceRecord?.serviceDate || null,
      customer:                   machineServiceRecord?.customer || null, 
      site:                       machineServiceRecord?.site || null,
      machine:                    machineServiceRecord?.machine || null,
      decoiler:                   machineServiceRecord?.decoiler || null,
      technician:                 machineServiceRecord?.technician || null,
      // checkParams:
      serviceNote:                machineServiceRecord?.serviceNote || '',
      maintenanceRecommendation:  machineServiceRecord?.maintenanceRecommendation || '',
      suggestedSpares:            machineServiceRecord?.suggestedSpares || '',
      files:                      machineServiceRecord?.files || [],
      operator:                   machineServiceRecord?.operator || null,
      operatorRemarks:            machineServiceRecord?.operatorRemarks ||'',
      isActive:                   machineServiceRecord?.isActive,
      createdAt:                  machineServiceRecord?.createdAt || '',
      createdByFullName:          machineServiceRecord?.createdBy?.name || '',
      createdIP:                  machineServiceRecord?.createdIP || '',
      updatedAt:                  machineServiceRecord?.updatedAt || '',
      updatedByFullName:          machineServiceRecord?.updatedBy?.name || '',
      updatedIP:                  machineServiceRecord?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ machineServiceRecord]
  );
  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons handleEdit={handleEdit} onDelete={onDelete} />
        <Grid sm={12} display="flex">
          <Tooltip>
            <ViewFormField isActive={defaultValues.isActive} isRequired={defaultValues.isRequired}/>
          </Tooltip>
        </Grid>
        <Grid container>
          <ViewFormField sm={6} heading="Name" param={defaultValues.name} />
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}
