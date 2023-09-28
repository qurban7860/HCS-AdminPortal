import { useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {  Card, Grid, Tooltip, Typography, Box, Checkbox } from '@mui/material';
// redux
import { deleteMachineServiceRecord, setAllFlagsFalse, setMachineServiceRecordEditFormVisibility } from '../../../redux/slices/products/machineServiceRecord';
// components
import { useSnackbar } from '../../../components/snackbar';
// import { fDate, fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
// import ViewFormSWitch from '../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import { fDate } from '../../../utils/formatTime';

function MachineServiceParamViewForm() {
  const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
  const { machine } = useSelector((state) => state.machine)

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
      await dispatch(deleteMachineServiceRecord(machine?._id, machineServiceRecord?._id));
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
      recordType:                           machineServiceRecord?.recordType || null,
      serviceRecordConfig:                  machineServiceRecord?.serviceRecordConfig?.docTitle	 || '',
      serviceRecordConfigRecordType:        machineServiceRecord?.serviceRecordConfig?.recordType || '',
      serviceDate:                          machineServiceRecord?.serviceDate || null,
      customer:                             machineServiceRecord?.customer || null, 
      site:                                 machineServiceRecord?.site || null,
      machine:                              machineServiceRecord?.machine || null,
      decoilers:                            machineServiceRecord?.decoilers ,
      technician:                           machineServiceRecord?.technician || null,
      // checkParams:         
      serviceNote:                          machineServiceRecord?.serviceNote || '',
      maintenanceRecommendation:            machineServiceRecord?.maintenanceRecommendation || '',
      suggestedSpares:                      machineServiceRecord?.suggestedSpares || '',
      files:                                machineServiceRecord?.files || [],
      operators:                             machineServiceRecord?.operators || [],
      technicianRemarks:                      machineServiceRecord?.technicianRemarks ||'',
      isActive:                             machineServiceRecord?.isActive,
      createdAt:                            machineServiceRecord?.createdAt || '',
      createdByFullName:                    machineServiceRecord?.createdBy?.name || '',
      createdIP:                            machineServiceRecord?.createdIP || '',
      updatedAt:                            machineServiceRecord?.updatedAt || '',
      updatedByFullName:                    machineServiceRecord?.updatedBy?.name || '',
      updatedIP:                            machineServiceRecord?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ machineServiceRecord]
  );

  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons isActive={defaultValues.isActive}  handleEdit={handleEdit} onDelete={onDelete} backLink={() => dispatch(setAllFlagsFalse())}/>
        <Grid container>
          <ViewFormField sm={6} heading="Customer"  param={`${machine?.customer?.name ? machine?.customer?.name : ''}`} />
          <ViewFormField sm={6} heading="Machine"  param={`${machine.serialNo} ${machine.name ? '-' : ''} ${machine.name ? machine.name : ''}`} />
          <ViewFormField sm={6} heading="Model Category"  param={machine?.machineModel?.category?.name || ''} />
          <ViewFormField sm={6} heading="Machine Model"  param={machine?.machineModel?.name || ''} />
          
          <ViewFormField sm={12} heading="Service Record Configuration" param={`${defaultValues.serviceRecordConfig} ${defaultValues.serviceRecordConfigRecordType ? '-' : ''} ${defaultValues.serviceRecordConfigRecordType ? defaultValues.serviceRecordConfigRecordType : ''}`} />
          <ViewFormField sm={6} heading="Service Date" param={fDate(defaultValues.serviceDate)} />
          <ViewFormField sm={6} heading="Technician"  param={defaultValues?.technician?.name || ''} />
          <ViewFormField sm={12} heading="Technician Remarks" param={defaultValues.technicianRemarks} />
          <ViewFormField sm={12} heading="Decoilers" arrayParam={defaultValues?.decoilers?.map((decoilerMachine) => ({ name: `${decoilerMachine?.serialNo ? decoilerMachine?.serialNo : ''}${decoilerMachine?.name ? '-' : ''}${decoilerMachine?.name ? decoilerMachine?.name : ''}`}))} />
          <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary', m:1.7, pt:1}}>
            Check Items
          </Typography>
          <Grid item md={12} sx={{display:'flex', flexDirection:'column',p:2}}>
            {machineServiceRecord?.serviceRecordConfig?.checkParams?.length > 0 ? (machineServiceRecord?.serviceRecordConfig?.checkParams.map((row, index) =>
              <>
                <Grid key={index}  item md={12} sx={{pb:1}} >
                  <Typography variant="body2" sx={{fontWeight:'bold'}}>{`${index+1}). `} {typeof row?.paramListTitle === 'string' && row?.paramListTitle || ''}{' ( Items: '}{`${row?.paramList?.length}`}{' ) '}</Typography>
                </Grid>
                <Grid  item md={12} sx={{ pb:1}}>
                  {row?.paramList.map((childRow,childIndex) => 
                  (<Box
                      component="form"
                      noValidate
                      autoComplete="off"
                      sx={{padding:'5px 20px', background:(childIndex%2===0?'#f4f6f866':''), 
                      ":hover": {
                        backgroundColor: "#dbdbdb66"
                      }}}
                      rowGap={2}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{ sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' }}
                      >
                      <Typography variant="body2" ><b>{`${childIndex+1}). `}</b>{`${childRow?.name}`}</Typography>
                      <Box sx={{textAlign:'right'}}>
                        {childRow?.inputType === 'Boolean' ? 
                        <Checkbox  checked={
                          machineServiceRecord?.checkParams?.find((element) =>
                          element?.paramListTitle === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramListTitle && element?.serviceParam === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramList[childIndex]?._id
                          )?.value || false
                          } disabled sx={{mr:'auto'}}/> 
                          :
                        <Typography variant="body2" sx={{pr:1.5}}>
                        {machineServiceRecord?.checkParams?.find((element) =>
                          element?.paramListTitle === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramListTitle && element?.serviceParam === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramList[childIndex]?._id
                          )?.value }
                        </Typography> }
                      </Box>
                    </Box>
                  ))}
                </Grid>
              </>
              )) : <ViewFormField /> }
          </Grid>

          {machineServiceRecord?.serviceRecordConfig?.enableNote && <ViewFormField sm={12} heading="Note" param={defaultValues.serviceNote} />}
          {machineServiceRecord?.serviceRecordConfig?.enableMaintenanceRecommendations && <ViewFormField sm={12} heading="Maintenance Recommendation" param={defaultValues.maintenanceRecommendation} />}
          {machineServiceRecord?.serviceRecordConfig?.enableSuggestedSpares && <ViewFormField sm={12} heading="Suggested Spares" param={defaultValues.suggestedSpares} />}
          <ViewFormField sm={12} heading="Operators" arrayParam={defaultValues?.operators?.map((operator) => ({ name: `${operator?.firstName || ''} ${operator?.lastName || ''}`}))} />
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}

export default memo(MachineServiceParamViewForm)
