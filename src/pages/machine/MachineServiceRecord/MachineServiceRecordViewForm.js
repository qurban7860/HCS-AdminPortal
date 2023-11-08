import { useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {  Card, Grid, Tooltip, Typography, Box, Checkbox } from '@mui/material';
// redux
import { deleteMachineServiceRecord, setAllFlagsFalse, setMachineServiceRecordEditFormVisibility } from '../../../redux/slices/products/machineServiceRecord';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormHeading from '../../components/DocumentForms/FormHeading';
import { FORMLABELS } from '../../../constants/default-constants';
// import { fDate, fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
// import ViewFormSWitch from '../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormHistoricalPopover from '../../components/ViewForms/ViewFormHistoricalPopover';

import { fDate } from '../../../utils/formatTime';
import ReadableCollapsibleCheckedItemRow from './ReadableCollapsibleCheckedItemRow';


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
      customer:                             machineServiceRecord?.customer || null, 
      site:                                 machineServiceRecord?.site || null,
      machine:                              machineServiceRecord?.machine || null,
      recordType:                           machineServiceRecord?.recordType || null,
      serviceRecordConfig:                  machineServiceRecord?.serviceRecordConfig?.docTitle	 || '',
      serviceRecordConfigRecordType:        machineServiceRecord?.serviceRecordConfig?.recordType || '',
      serviceDate:                          machineServiceRecord?.serviceDate || null,
      versionNo:                            machineServiceRecord?.versionNo || null, 
      decoilers:                            machineServiceRecord?.decoilers ,
      technician:                           machineServiceRecord?.technician || null,
      textBeforeCheckItems:                 machineServiceRecord?.textBeforeCheckItems || '',
      textAfterCheckItems:                  machineServiceRecord?.textAfterCheckItems || '',
      // checkParams:         
      headerLeftText:                       machineServiceRecord?.serviceRecordConfig?.header?.leftText || '',
      headerCenterText:                     machineServiceRecord?.serviceRecordConfig?.header?.centerText || '',
      headerRightText:                      machineServiceRecord?.serviceRecordConfig?.header?.rightText || '',
      footerLeftText:                       machineServiceRecord?.serviceRecordConfig?.footer?.leftText || '', 
      footerCenterText:                     machineServiceRecord?.serviceRecordConfig?.footer?.centerText || '',
      footerRightText:                      machineServiceRecord?.serviceRecordConfig?.footer?.rightText || '',
      internalComments:                     machineServiceRecord?.internalComments || '',
      serviceNote:                          machineServiceRecord?.serviceNote || '',
      recommendationNote:                   machineServiceRecord?.recommendationNote || '',
      suggestedSpares:                      machineServiceRecord?.suggestedSpares || '',
      internalNote:                         machineServiceRecord?.internalNote || '',
      files:                                machineServiceRecord?.files || [],
      operators:                            machineServiceRecord?.operators || [],
      operatorNotes:                        machineServiceRecord?.operatorNotes || '',
      technicianNotes:                      machineServiceRecord?.technicianNotes ||'',
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
        <ViewFormEditDeleteButtons isActive={defaultValues.isActive}  
          disableEditButton={machine?.status?.slug==='transferred'}
          disableDeleteButton={machine?.status?.slug==='transferred'}
          handleEdit={handleEdit} onDelete={onDelete} backLink={() => dispatch(setAllFlagsFalse())}
        />
        
        <Grid container>
          <ViewFormField sm={6} heading="Customer"  param={`${machine?.customer?.name ? machine?.customer?.name : ''}`} />
          <ViewFormField sm={6} heading="Machine"  param={`${machine.serialNo} ${machine.name ? '-' : ''} ${machine.name ? machine.name : ''}`} />
          <ViewFormField sm={6} heading="Model Category"  param={machine?.machineModel?.category?.name || ''} />
          <ViewFormField sm={6} heading="Machine Model"  param={machine?.machineModel?.name || ''} />
          <ViewFormField sm={12} heading="Decoilers" arrayParam={defaultValues?.decoilers?.map((decoilerMachine) => ({ name: `${decoilerMachine?.serialNo ? decoilerMachine?.serialNo : ''}${decoilerMachine?.name ? '-' : ''}${decoilerMachine?.name ? decoilerMachine?.name : ''}`}))} />
          
          <ViewFormField sm={12} heading="Service Record Configuration" param={`${defaultValues.serviceRecordConfig} ${defaultValues.serviceRecordConfigRecordType ? '-' : ''} ${defaultValues.serviceRecordConfigRecordType ? defaultValues.serviceRecordConfigRecordType : ''}`} />
          
          <ViewFormField sm={6} heading="Service Date" param={fDate(defaultValues.serviceDate)} />
          <ViewFormField sm={6} heading="Version No" param={defaultValues?.versionNo} />
          
          <ViewFormField sm={6} heading="Technician"  param={defaultValues?.technician?.name || ''} />
          <ViewFormField sm={12} heading="Technician Notes" param={defaultValues.technicianNotes} />

          <ViewFormField sm={12} heading="Text Before Check Items" param={defaultValues.textBeforeCheckItems} />

          {machineServiceRecord?.serviceRecordConfig?.checkItemLists?.length > 0 && 
          <Grid item md={12} sx={{ px: 2, py: 1, overflowWrap: 'break-word' }}>
          <FormHeading heading={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />

          <Grid item md={12} sx={{display:'flex', flexDirection:'column'}}>
            {machineServiceRecord?.serviceRecordConfig?.checkItemLists?.length > 0 ? 
            (machineServiceRecord?.serviceRecordConfig?.checkItemLists.map((row, index) =>
                    <ReadableCollapsibleCheckedItemRow value={row} index={index} />
              )) : <ViewFormField /> }
          </Grid>
          </Grid>}
          
          <ViewFormField sm={12} heading="Text After Check Items" param={defaultValues.textAfterCheckItems} />

          <Grid item md={12} >
            <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary', m:1.7 }}>
              Header
            </Typography>
          </Grid>
          <Grid container>
            <ViewFormField sm={4}   param={defaultValues?.headerLeftText} />
            <ViewFormField sm={4}   param={defaultValues?.headerCenterText} />
            <ViewFormField sm={4}   param={defaultValues?.headerRightText} />
          </Grid>

          <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary', m:1.7 }}>
            Footer
          </Typography>
          <Grid container>
            <ViewFormField sm={4} param={defaultValues?.footerLeftText} />
            <ViewFormField sm={4} param={defaultValues?.footerCenterText} />
            <ViewFormField sm={4} param={defaultValues?.footerRightText} />
          </Grid>

          <ViewFormField sm={12} heading="Internal Comments" param={defaultValues.internalComments} />
          {machineServiceRecord?.serviceRecordConfig?.enableNote && <ViewFormField sm={12} heading="Service Note" param={defaultValues.serviceNote} />}

          {machineServiceRecord?.serviceRecordConfig?.enableMaintenanceRecommendations && <ViewFormField sm={12} heading="Recommendation Note" param={defaultValues.recommendationNote} />}
          {machineServiceRecord?.serviceRecordConfig?.enableSuggestedSpares && <ViewFormField sm={12} heading="Suggested Spares" param={defaultValues.suggestedSpares} />}
          <ViewFormField sm={12} heading="Internal Note" param={defaultValues.internalNote} />
          
          <ViewFormField sm={12} heading="Operators" arrayParam={defaultValues?.operators?.map((operator) => ({ name: `${operator?.firstName || ''} ${operator?.lastName || ''}`}))} />
          <ViewFormField sm={12} heading="Operator Notes" param={defaultValues.operatorNotes} />
          
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}

export default memo(MachineServiceParamViewForm)
