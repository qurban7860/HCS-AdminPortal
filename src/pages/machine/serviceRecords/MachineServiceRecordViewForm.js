import { useMemo, memo, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Container, Card, Chip, Grid } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE, PATH_CRM } from '../../../routes/paths';
// redux
import { deleteMachineServiceRecord,   
  getMachineServiceRecord, 
  setSendEmailDialog,
  setPDFViewerDialog} from '../../../redux/slices/products/machineServiceRecord';
import { setCardActiveIndex, setIsExpanded } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
import { FORMLABELS } from '../../../constants/default-constants';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormNoteField from '../../../components/ViewForms/ViewFormNoteField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { fDate } from '../../../utils/formatTime';
import ReadableCollapsibleCheckedItemRow from './ReadableCollapsibleCheckedItemRow';
import HistoryIcon from '../../../components/Icons/HistoryIcon';
import CurrentIcon from '../../../components/Icons/CurrentIcon';
import SendEmailDialog from '../../../components/Dialog/SendEmailDialog';
import PDFViewerDialog from '../../../components/Dialog/PDFViewerDialog';
import Iconify from '../../../components/iconify';
import MachineTabContainer from '../util/MachineTabContainer';

function MachineServiceParamViewForm() {

  const { machineServiceRecord, isLoading, pdfViewerDialog, sendEmailDialog } = useSelector((state) => state.machineServiceRecord);
  const { machine } = useSelector((state) => state.machine)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { machineId, id } = useParams();

  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(()=>{
    if(machineId && id ){
      dispatch(getMachineServiceRecord(machineId, id));
    }
    dispatch(setPDFViewerDialog(false))
    dispatch(setSendEmailDialog(false))
  },[ dispatch, machineId, id ])

  const onDelete = async () => {
    try {
      await dispatch(deleteMachineServiceRecord(machineId, id));
      await enqueueSnackbar('Machine Service Record deleted Successfully!');
      await navigate(PATH_MACHINE.machines.serviceRecords.root(machineId))
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async () => navigate(PATH_MACHINE.machines.serviceRecords.edit(machineId, id));
  const handleServiceRecordHistory = async () => navigate(PATH_MACHINE.machines.serviceRecords.history(machineId, machineServiceRecord?.serviceId));

  const handleCurrentServiceRecord = async() => {
    try{
      await dispatch(getMachineServiceRecord(machineId , machineServiceRecord?.currentVersion?._id))
    }catch(error){
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  }

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

  const handleSendEmail = async() => {
      dispatch(setSendEmailDialog(true))
  }

  const handlePDFViewer = async() => {
    dispatch(setPDFViewerDialog(true))
  }

  const fileName = `${defaultValues?.serviceDate?.substring(0,10).replaceAll('-','')}_${defaultValues?.serviceRecordConfigRecordType}_${defaultValues?.versionNo}.pdf`

  const handleContactView = async (contactId) => {
    await dispatch(setCardActiveIndex(contactId));
    await dispatch(setIsExpanded(true));
    await navigate(PATH_CRM.customers.contacts.view(machine?.customer?._id,contactId))
  };

  const handleContactViewInNewPage = async (contactId) => {
    await dispatch(setCardActiveIndex(contactId));
    await dispatch(setIsExpanded(true));
    await window.open(PATH_CRM.customers.contacts.view(machine?.customer?._id, contactId), '_blank');
  };

  const operators = defaultValues?.operators?.map((operator, index) => (  
    <Chip 
        onClick={() => handleContactView(operator?._id)} 
        sx={{m:0.2}}
        deleteIcon={<Iconify icon="fluent:open-12-regular"/>}
        onDelete={()=> handleContactViewInNewPage(operator?._id)}
        label={`${operator?.firstName || ''} ${operator?.lastName || ''}`} 
      />
  ));

  
  
  return (
    <Container maxWidth={false} >
          <MachineTabContainer currentTabValue='serviceRecords' />
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons isLoading={isLoading} isActive={defaultValues.isActive}  
          disableEditButton={machine?.status?.slug==='transferred'}
          disableDeleteButton={machine?.status?.slug==='transferred'}
          skeletonIcon={ isLoading && !machineServiceRecord?._id }
          handleEdit={!machineServiceRecord?.isHistory && machineServiceRecord?._id && handleEdit} 
          onDelete={!machineServiceRecord?.isHistory && machineServiceRecord?._id && onDelete} 
          backLink={() => navigate(PATH_MACHINE.machines.serviceRecords.root(machineId))}
          handleSendPDFEmail={!machineServiceRecord?.isHistory && machineServiceRecord?._id && handleSendEmail}
          handleViewPDF={!machineServiceRecord?.isHistory && machineServiceRecord?._id && handlePDFViewer}
        />
        
        <Grid container>
          <FormLabel content={FORMLABELS.KEYDETAILS} />
          
          <ViewFormField isLoading={isLoading} variant='h4' sm={3} heading="Service Date" param={fDate(defaultValues.serviceDate)} />
          <ViewFormField isLoading={isLoading} variant='h4' sm={6} heading="Service Record Configuration" param={`${defaultValues.serviceRecordConfig} ${defaultValues.serviceRecordConfigRecordType ? '-' : ''} ${defaultValues.serviceRecordConfigRecordType ? defaultValues.serviceRecordConfigRecordType : ''}`} />
          <ViewFormField isLoading={isLoading} variant='h4' sm={3} heading="Version No" node={
            <>{defaultValues?.versionNo}{machineServiceRecord?.isHistory && <CurrentIcon callFunction={handleCurrentServiceRecord} />}
              {!machineServiceRecord?.isHistory && (machineServiceRecord?.currentVersion?.versionNo || defaultValues?.versionNo) > 1 && <HistoryIcon callFunction={handleServiceRecordHistory} /> }
            </>  
          } />
          
          <ViewFormField isLoading={isLoading} sm={12} heading="Decoilers" arrayParam={defaultValues?.decoilers?.map((decoilerMachine) => ({ name: `${decoilerMachine?.serialNo ? decoilerMachine?.serialNo : ''}${decoilerMachine?.name ? '-' : ''}${decoilerMachine?.name ? decoilerMachine?.name : ''}`}))} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Technician"  param={defaultValues?.technician?.name || ''} />
          <ViewFormNoteField sm={12} heading="Technician Notes" param={defaultValues.technicianNotes} />


          <FormLabel content={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />
          {defaultValues.textBeforeCheckItems && <ViewFormNoteField sm={12}  param={defaultValues.textBeforeCheckItems} />}
          {machineServiceRecord?.serviceRecordConfig?.checkItemLists?.length > 0 && 
            <Grid item md={12} sx={{  overflowWrap: 'break-word' }}>
              <Grid item md={12} sx={{display:'flex', flexDirection:'column'}}>
                {machineServiceRecord?.serviceRecordConfig?.checkItemLists?.length > 0 ? 
                (machineServiceRecord?.serviceRecordConfig?.checkItemLists.map((row, index) =>
                        <ReadableCollapsibleCheckedItemRow value={row} index={index} />
                  )) : <ViewFormField isLoading={isLoading} /> }
              </Grid>
            </Grid>
          }
          
          {defaultValues.textAfterCheckItems && <ViewFormNoteField sm={12}  param={defaultValues.textAfterCheckItems} />}

          {machineServiceRecord?.serviceRecordConfig?.enableNote && <ViewFormNoteField sm={12} heading={`${machineServiceRecord?.serviceRecordConfig?.recordType?.charAt(0).toUpperCase()||''}${machineServiceRecord?.serviceRecordConfig?.recordType?.slice(1).toLowerCase()||''} Note`} param={defaultValues.serviceNote} />}
          {machineServiceRecord?.serviceRecordConfig?.enableMaintenanceRecommendations && <ViewFormNoteField sm={12} heading="Recommendation Note" param={defaultValues.recommendationNote} />}
          {machineServiceRecord?.serviceRecordConfig?.enableSuggestedSpares && <ViewFormNoteField sm={12} heading="Suggested Spares" param={defaultValues.suggestedSpares} />}
          <ViewFormNoteField sm={12} heading="Internal Note" param={defaultValues.internalNote} />
          
          <ViewFormField isLoading={isLoading} sm={12} heading="Operators" chipDialogArrayParam={operators} />
            
          {/* <ViewFormField isLoading={isLoading} sm={12} heading="Operators" arrayParam={defaultValues?.operators?.map((operator) => ({ name: `${operator?.firstName || ''} ${operator?.lastName || ''}`}))} /> */}
          <ViewFormNoteField sm={12} heading="Operator Notes" param={defaultValues.operatorNotes} />
          
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
      {pdfViewerDialog && <PDFViewerDialog machineServiceRecord={machineServiceRecord} />}
      {sendEmailDialog && <SendEmailDialog machineServiceRecord={machineServiceRecord} fileName={fileName}/>}
    </Card>
  </Container>
  );
}

export default memo(MachineServiceParamViewForm)
