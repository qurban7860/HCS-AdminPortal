import PropTypes from 'prop-types';
import { useMemo, memo, useLayoutEffect, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Container, Card, Chip, Grid, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
  completeServiceRecord,
  setFormActiveStep,
  getMachineServiceRecordCheckItems} from '../../../redux/slices/products/machineServiceRecord';
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
import { ThumbnailDocButton } from '../../../components/Thumbnails';
import DialogServiceRecordAddFile from '../../../components/Dialog/DialogServiceRecordAddFile';
import { DocumentGalleryItem } from '../../../components/gallery/DocumentGalleryItem';
import ConfirmDialog from '../../../components/confirm-dialog';
import Lightbox from '../../../components/lightbox/Lightbox';

MachineServiceParamViewForm.propTypes = {
  serviceHistoryView: PropTypes.bool,
}

function MachineServiceParamViewForm( {serviceHistoryView} ) {

  const { machineServiceRecord, machineServiceRecordCheckItems, isLoading, pdfViewerDialog, sendEmailDialog } = useSelector((state) => state.machineServiceRecord);
  const { machine } = useSelector((state) => state.machine)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { machineId, serviceId, id } = useParams();

  useLayoutEffect(()=>{
    if(machineId && id ){
      dispatch(setAddFileDialog(false));
      dispatch(getMachineServiceRecord(machineId, id));
      dispatch(getMachineServiceRecordCheckItems(machineId, id));
    }
    dispatch(setPDFViewerDialog(false))
    dispatch(setSendEmailDialog(false))
    return ()=>{
      dispatch(resetMachineServiceRecord());
    }
  },[ dispatch, machineId, id ])

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
    await navigate(PATH_MACHINE.machines.serviceRecords.edit(machineId, id))
  };

  const handleServiceRecordHistory = () =>  navigate(PATH_MACHINE.machines.serviceRecords.history.root(
    machineId, serviceHistoryView ? serviceId : machineServiceRecord?.serviceId 
  ));

  const handleCurrentServiceRecord = () => navigate(PATH_MACHINE.machines.serviceRecords.view( machineId, machineServiceRecord?.currentVersion?._id ));

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

  const handleBackLink = ()=>{
    if(serviceHistoryView && serviceId ){
      navigate(PATH_MACHINE.machines.serviceRecords.history.root(machineId, serviceId))
    }else{
      navigate(PATH_MACHINE.machines.serviceRecords.root(machineId))
    }
  }
  
  useEffect(() => {
    if (machineServiceRecord?.files) {
        const updatedFiles = machineServiceRecord?.files?.map(file => ({
          ...file,
          src: `data:${file?.fileType};base64,${file?.thumbnail}`,
          thumbnail: `data:${file?.fileType};base64,${file?.thumbnail}`
        }));
        setSlides(updatedFiles);
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
      enqueueSnackbar('File Archived successfully!');
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

  const { 
    reset, 
    handleSubmit, 
    formState: { isSubmitting } 
  } = useForm(); // or any other hook providing these methods


  const [completeConfirm, setCompleteConfirm] = useState(false);
  
  const handleCompleteConfirm = () => {
    setCompleteConfirm(!completeConfirm);
  }

  const onSubmitComplete = async() => {
    try {
      await dispatch(completeServiceRecord(machineId, id));
      enqueueSnackbar('Service Record Completed Successfully!');
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Service Record Completion failed!', { variant: `error` });
    }
  }

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
          backLink={handleBackLink}
          handleSendPDFEmail={!machineServiceRecord?.isHistory && machineServiceRecord?._id && handleSendEmail}
          handleViewPDF={!machineServiceRecord?.isHistory && machineServiceRecord?._id && handlePDFViewer}
          handleCompleteMSR={!machineServiceRecord?.isHistory && handleCompleteConfirm}
        />
        
        <Grid container>
          <FormLabel content={FORMLABELS.KEYDETAILS} />
          
          <ViewFormField isLoading={isLoading} variant='h4' sm={3} heading="Service Date" param={fDate(defaultValues.serviceDate)} />
          <ViewFormField isLoading={isLoading} variant='h4' sm={6} heading="Service Record Configuration" param={`${defaultValues.serviceRecordConfig} ${defaultValues.serviceRecordConfigRecordType ? '-' : ''} ${defaultValues.serviceRecordConfigRecordType ? defaultValues.serviceRecordConfigRecordType : ''}`} />
          <ViewFormField isLoading={isLoading} variant='h4' sm={3} heading="Version No" node={
            <>{defaultValues?.versionNo}{machineServiceRecord?.isHistory && <CurrentIcon callFunction={handleCurrentServiceRecord} />}
              {!machineServiceRecord?.isHistory && (machineServiceRecord?.currentVersion?.versionNo || defaultValues?.versionNo) > 1 &&  machineServiceRecord?.serviceId && <HistoryIcon callFunction={handleServiceRecordHistory} /> }
            </>  
          } />
          
          <ViewFormField isLoading={isLoading} sm={12} heading="Decoilers" arrayParam={defaultValues?.decoilers?.map((decoilerMachine) => ({ name: `${decoilerMachine?.serialNo ? decoilerMachine?.serialNo : ''}${decoilerMachine?.name ? '-' : ''}${decoilerMachine?.name ? decoilerMachine?.name : ''}`}))} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Technician"  param={defaultValues?.technician?.name || ''} />
          <ViewFormNoteField sm={12} heading="Technician Notes" param={defaultValues.technicianNotes} />
          <FormLabel content='Images' />
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
          <FormLabel content={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />
          {defaultValues.textBeforeCheckItems && <ViewFormNoteField sm={12}  param={defaultValues.textBeforeCheckItems} />}
          {machineServiceRecordCheckItems?.checkItemLists?.length > 0 && 
            <Grid item md={12} sx={{  overflowWrap: 'break-word' }}>
              <Grid item md={12} sx={{display:'flex', flexDirection:'column'}}>
                {machineServiceRecordCheckItems?.checkItemLists?.length > 0 ? 
                (machineServiceRecordCheckItems?.checkItemLists.map((row, index) =>
                        <ReadableCollapsibleCheckedItemRow machineId serviceId value={row} index={index} />
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
      <DialogServiceRecordAddFile />
      <ConfirmDialog open={completeConfirm} onClose={handleCompleteConfirm}
        title='Are you sure you want to complete?' 
        content="Email will be sent to your reporting contact?" 
        action={
          <LoadingButton loading={isSubmitting} variant='contained' onClick={handleSubmit(onSubmitComplete)}>Complete</LoadingButton>
        }
      />
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
