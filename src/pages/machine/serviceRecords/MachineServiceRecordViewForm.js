import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, memo, useLayoutEffect, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Container, Card, Chip, Grid, Box, Stack, Typography, TextField, DialogContent, DialogActions, Dialog } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import download from 'downloadjs';
import { PATH_MACHINE, PATH_CRM } from '../../../routes/paths';
// redux
import { deleteMachineServiceRecord,   
  getMachineServiceRecord, 
  resetMachineServiceRecord,
  setSendEmailDialog,
  setPDFViewerDialog,
  setAddFileDialog,
  downloadRecordFile,
  deleteRecordFile,
  setFormActiveStep,
  getMachineServiceRecordCheckItems,
  updateMachineServiceRecord,
  createMachineServiceRecordVersion,
  setCompleteDialog} from '../../../redux/slices/products/machineServiceRecord';
import { getActiveSPContacts, setCardActiveIndex, setIsExpanded } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
import { FORMLABELS } from '../../../constants/default-constants';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormNoteField from '../../../components/ViewForms/ViewFormNoteField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { fDate } from '../../../utils/formatTime';
import CheckedItemValueRow from './CheckedItemValueRow';
import HistoryIcon from '../../../components/Icons/HistoryIcon';
import CurrentIcon from '../../../components/Icons/CurrentIcon';
import SendEmailDialog from '../../../components/Dialog/SendEmailDialog';
import PDFViewerDialog from '../../../components/Dialog/PDFViewerDialog';
import Iconify from '../../../components/iconify';
import MachineTabContainer from '../util/MachineTabContainer';
import { ThumbnailDocButton } from '../../../components/Thumbnails';
import DialogServiceRecordAddFile from '../../../components/Dialog/DialogServiceRecordAddFile';
import { DocumentGalleryItem } from '../../../components/gallery/DocumentGalleryItem';
import ConfirmDialog from '../../../components/confirm-dialog';
import Lightbox from '../../../components/lightbox/Lightbox';
import SkeletonLine from '../../../components/skeleton/SkeletonLine';
import { RHFAutocomplete } from '../../../components/hook-form';
import DialogServiceRecordComplete from '../../../components/Dialog/DialogServiceRecordComplete';

MachineServiceParamViewForm.propTypes = {
  serviceHistoryView: PropTypes.bool,
}

function MachineServiceParamViewForm( {serviceHistoryView} ) {

  const { machineServiceRecord, machineServiceRecordCheckItems, isLoadingCheckItems, isLoading, pdfViewerDialog, sendEmailDialog } = useSelector((state) => state.machineServiceRecord);
  const { machine } = useSelector((state) => state.machine)
  const { activeContacts, activeSpContacts } = useSelector((state) => state.contact);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { machineId, serviceId, id } = useParams();

  useLayoutEffect(()=>{
    if(machineId && id ){
      dispatch(setAddFileDialog(false));
      dispatch(getMachineServiceRecord(machineId, id));
    }
    dispatch(setPDFViewerDialog(false));
    dispatch(setSendEmailDialog(false));
    dispatch(getActiveSPContacts());
    return ()=>{
      dispatch(resetMachineServiceRecord());
    }
  },[ dispatch, machineId, id])

  useEffect(()=>{
    if(machineServiceRecord?._id){
      dispatch(getMachineServiceRecordCheckItems(machineId, machineServiceRecord?._id));
    }
  },[dispatch, machineId, machineServiceRecord])

  const onDelete = async () => {
    try {
      await dispatch(deleteMachineServiceRecord(machineId, id, machineServiceRecord?.status ));
      await enqueueSnackbar('Machine Service Record Archived Successfully!');
      await navigate(PATH_MACHINE.machines.serviceRecords.root(machineId))
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async() => {
    await dispatch(setFormActiveStep(0));
    if(machineServiceRecord?.status==="SUBMITTED"){
      try {
        const srecord = await dispatch(createMachineServiceRecordVersion(machineId, id));
        if(srecord){
          await navigate(PATH_MACHINE.machines.serviceRecords.edit(machineId, srecord?._id))
        }
      } catch (error) {
        enqueueSnackbar('Version creation failed', { variant: `error` });
        console.error(error);
      }
      
    }else{
      await navigate(PATH_MACHINE.machines.serviceRecords.edit(machineId, id))
    }
  };

  const handleServiceRecordHistory = () =>  {
    navigate(PATH_MACHINE.machines.serviceRecords.history.root(
      machineId, serviceHistoryView ? serviceId : machineServiceRecord?.serviceId 
    ))
  }

  const handleCurrentServiceRecord = () => {
    navigate(PATH_MACHINE.machines.serviceRecords.view( machineId, machineServiceRecord?.currentVersion?._id ))
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
      status:                               machineServiceRecord?.status,
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

  const handleBackLink = ()=>{
    if(serviceHistoryView && serviceId ){
      navigate(PATH_MACHINE.machines.serviceRecords.history.root(machineId, serviceId))
    }else{
      navigate(PATH_MACHINE.machines.serviceRecords.root(machineId))
    }
  }
  
  const [recordStatus, setRecordStatus]= useState(null);

  useEffect(() => {
    if (machineServiceRecord?.files) {
        const updatedFiles = machineServiceRecord?.files?.map(file => ({
          ...file,
          src: `data:${file?.fileType};base64,${file?.thumbnail}`,
          thumbnail: `data:${file?.fileType};base64,${file?.thumbnail}`
        }));
        setSlides(updatedFiles);
    }
    if(machineServiceRecord.status==="DRAFT"){
      setRecordStatus({label:'Complete', value:'SUBMITTED'});
    }else if(machineServiceRecord.status==="SUBMITTED"){
      setRecordStatus({label:'Approve', value:'APPROVED'});
    }
    
  }, [machineServiceRecord]);


  const regEx = /^[^2]*/;
  const [selectedImage, setSelectedImage] = useState(-1);
  const [slides, setSlides] = useState([]);

  const handleAddFileDialog = ()=>{
    dispatch(setAddFileDialog(true));
  }

  const handleOpenLightbox = async (index) => {
    setSelectedImage(index);
    const image = slides[index];

    if(!image?.isLoaded && image?.fileType?.startsWith('image')){
      try {
        const response = await dispatch(downloadRecordFile(machineId, serviceId, image?._id));
        if (regEx.test(response.status)) {
          // Update the image property in the imagesLightbox array
          const updatedSlides = [
            ...slides.slice(0, index), // copies slides before the updated slide
            {
              ...slides[index],
              src: `data:image/png;base64, ${response.data}`,
              isLoaded: true,
            },
            ...slides.slice(index + 1), // copies slides after the updated slide
          ];

          // Update the state with the new array
          setSlides(updatedSlides);
        }
      } catch (error) {
        console.error('Error loading full file:', error);
      }
    }
  };

  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };

  const handleDeleteRecordFile = async (fileId) => {
    try {
      await dispatch(deleteRecordFile(machineId, machineServiceRecord?.serviceId, fileId));
      await dispatch(getMachineServiceRecord(machineId, id))
      enqueueSnackbar('File deleted successfully!');
    } catch (err) {
      console.log(err);
      enqueueSnackbar('File Deletion failed!', { variant: `error` });
    }
  };

  const handleDownloadRecordFile = (fileId, name, extension) => {
    dispatch(downloadRecordFile(machineId, serviceId, fileId))
      .then((res) => {
        if (regEx.test(res.status)) {
          download(atob(res.data), `${name}.${extension}`, { type: extension });
          enqueueSnackbar(res.statusText);
        } else {
          enqueueSnackbar(res.statusText, { variant: `error` });
        }
      })
      .catch((err) => {
        if (err.Message) {
          enqueueSnackbar(err.Message, { variant: `error` });
        } else if (err.message) {
          enqueueSnackbar(err.message, { variant: `error` });
        } else {
          enqueueSnackbar('Something went wrong!', { variant: `error` });
        }
      });
  };
  
  const handleCompleteConfirm = () => {
    dispatch(setCompleteDialog(true))
  }

  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue='serviceRecords' />
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons isLoading={isLoading} isActive={defaultValues.isActive}  
          disableEditButton={machine?.status?.slug==='transferred'}
          disableDeleteButton={machine?.status?.slug==='transferred'}
          skeletonIcon={ isLoading && !machineServiceRecord?._id }
          handleEdit={!machineServiceRecord?.isHistory && machineServiceRecord?._id && handleEdit} 
          onDelete={!machineServiceRecord?.isHistory && machineServiceRecord?.status==="DRAFT" && machineServiceRecord?._id && onDelete} 
          backLink={handleBackLink}
          handleSendPDFEmail={!machineServiceRecord?.isHistory && machineServiceRecord?._id && handleSendEmail}
          handleViewPDF={!machineServiceRecord?.isHistory && machineServiceRecord?._id && handlePDFViewer}
          // handleCompleteMSR={machineServiceRecord.isActive && !machineServiceRecord?.isHistory &&  machineServiceRecord?.status!=="APPROVED" && handleCompleteConfirm}
          serviceRecordStatus={recordStatus?.label}
        />
        
        <Grid container>
          <FormLabel content={FORMLABELS.KEYDETAILS} />
          
          <ViewFormField isLoading={isLoading} variant='h4' sm={2} heading="Service Date" param={fDate(defaultValues.serviceDate)} />
          <ViewFormField isLoading={isLoading} variant='h4' sm={6} heading="Service Record Configuration" param={`${defaultValues.serviceRecordConfig} ${defaultValues.serviceRecordConfigRecordType ? '-' : ''} ${defaultValues.serviceRecordConfigRecordType ? defaultValues.serviceRecordConfigRecordType : ''}`} />
          <ViewFormField isLoading={isLoading} variant='h4' sm={2} heading="Status" param={defaultValues.status} />
          <ViewFormField isLoading={isLoading} variant='h4' sm={2} heading="Version No" node={
            <>{defaultValues?.versionNo}{(machineServiceRecord?.isHistory || machineServiceRecord?.status==="DRAFT") && <CurrentIcon callFunction={handleCurrentServiceRecord} />}
              {!machineServiceRecord?.isHistory && machineServiceRecord?.currentVersion?.versionNo > 1 &&  machineServiceRecord?.serviceId && <HistoryIcon callFunction={handleServiceRecordHistory} /> }
            </>  
          } />
          
          <ViewFormField isLoading={isLoading} sm={12} heading="Decoilers" arrayParam={defaultValues?.decoilers?.map((decoilerMachine) => ({ name: `${decoilerMachine?.serialNo ? decoilerMachine?.serialNo : ''}${decoilerMachine?.name ? '-' : ''}${decoilerMachine?.name ? decoilerMachine?.name : ''}`}))} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Technician"  param={defaultValues?.technician?.name || ''} />
          <ViewFormNoteField sm={12} heading="Technician Notes" param={defaultValues.technicianNotes} />
          <FormLabel content={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />
          {defaultValues.textBeforeCheckItems && <ViewFormNoteField sm={12}  param={defaultValues.textBeforeCheckItems} />}
          {!isLoadingCheckItems? 
            <Grid item md={12} sx={{  overflowWrap: 'break-word' }}>
              <Grid item md={12} sx={{display:'flex', flexDirection:'column'}}>
                {machineServiceRecordCheckItems?.checkItemLists?.map((row, index) =>
                  <CheckedItemValueRow machineId serviceId={machineServiceRecord._id} value={row} index={index} />
                )}
              </Grid>
            </Grid>
            :
            <Stack my={1} py={2} spacing={2} sx={{width:'100%', borderRadius:'10px', border:(theme)=> `1px solid ${theme.palette.grey[400]}`}}>
              {Array.from({ length: 8 }).map((_, index) => (<SkeletonLine key={index} />))}
            </Stack>
          }
          
          {defaultValues.textAfterCheckItems && <ViewFormNoteField sm={12}  param={defaultValues.textAfterCheckItems} />}

          {machineServiceRecord?.serviceRecordConfig?.enableNote && <ViewFormNoteField sm={12} heading={`${machineServiceRecord?.serviceRecordConfig?.recordType?.charAt(0).toUpperCase()||''}${machineServiceRecord?.serviceRecordConfig?.recordType?.slice(1).toLowerCase()||''} Note`} param={defaultValues.serviceNote} />}
          {machineServiceRecord?.serviceRecordConfig?.enableMaintenanceRecommendations && <ViewFormNoteField sm={12} heading="Recommendation Note" param={defaultValues.recommendationNote} />}
          {machineServiceRecord?.serviceRecordConfig?.enableSuggestedSpares && <ViewFormNoteField sm={12} heading="Suggested Spares" param={defaultValues.suggestedSpares} />}
          <ViewFormNoteField sm={12} heading="Internal Note" param={defaultValues.internalNote} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Operators" chipDialogArrayParam={operators} />
          <ViewFormNoteField sm={12} heading="Operator Notes" param={defaultValues.operatorNotes} />
          {slides.length>0 && !machineServiceRecord?.isHistory && 
          <FormLabel content='Images' />
          }
          <Box
            sx={{my:1, width:'100%'}}
            gap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(5, 1fr)',
              lg: 'repeat(6, 1fr)',
              xl: 'repeat(8, 1fr)',
            }}
          >
          {slides?.map((file, _index) => (
            <DocumentGalleryItem isLoading={isLoading} key={file?.id} image={file} 
              onOpenLightbox={()=> handleOpenLightbox(_index)}
              onDownloadFile={()=> handleDownloadRecordFile(file._id, file?.name, file?.extension)}
              onDeleteFile={()=> handleDeleteRecordFile(file._id)}
              toolbar
            />
          ))}

          {!machineServiceRecord?.isHistory && <ThumbnailDocButton onClick={handleAddFileDialog}/>}
        </Box>
          
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
      {pdfViewerDialog && <PDFViewerDialog machineServiceRecord={machineServiceRecord} />}
      {sendEmailDialog && <SendEmailDialog machineServiceRecord={machineServiceRecord} fileName={fileName}/>}
      <DialogServiceRecordAddFile />
      <DialogServiceRecordComplete recordStatus={recordStatus}/>
    </Card>
    <Lightbox
          index={selectedImage}
          slides={slides}
          open={selectedImage>=0}
          close={handleCloseLightbox}
          onGetCurrentIndex={handleOpenLightbox}
          disabledTotal
          disabledDownload
          disabledSlideshow
        />
  </Container>
  );
}

export default memo(MachineServiceParamViewForm)
