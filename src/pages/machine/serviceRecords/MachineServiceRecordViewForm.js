import PropTypes from 'prop-types';
import React, { useMemo, memo, useLayoutEffect, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import b64toBlob from 'b64-to-blob';
// @mui
import { Container, Card, Chip, Grid, Box, Stack, Dialog, DialogTitle, Divider, Button, Typography } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import download from 'downloadjs';
import { PATH_MACHINE, PATH_CRM } from '../../../routes/paths';
// redux
import { deleteMachineServiceRecord,   
  getMachineServiceRecord, 
  resetMachineServiceRecord,
  setSendEmailDialog,
  setPDFViewerDialog,
  setAddFileDialog,
  setAddReportDocsDialog,
  downloadRecordFile,
  deleteRecordFile,
  setFormActiveStep,
  getMachineServiceRecordCheckItems,
  resetCheckItemValues,
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
import { useAuthContext } from '../../../auth/useAuthContext';
import Lightbox from '../../../components/lightbox/Lightbox';
import SkeletonLine from '../../../components/skeleton/SkeletonLine';
import DialogServiceRecordComplete from '../../../components/Dialog/DialogServiceRecordComplete';
import SkeletonPDF from '../../../components/skeleton/SkeletonPDF';
import IconButtonTooltip from '../../../components/Icons/IconButtonTooltip';

MachineServiceParamViewForm.propTypes = {
  serviceHistoryView: PropTypes.bool,
}

function MachineServiceParamViewForm( {serviceHistoryView} ) {
  
  const { machineServiceRecord, machineServiceRecordCheckItems, isLoadingCheckItems, isLoading, pdfViewerDialog, sendEmailDialog } = useSelector((state) => state.machineServiceRecord);
  const { machine } = useSelector((state) => state.machine)
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { machineId, serviceId, id } = useParams();
  const { user } = useAuthContext();
  const [selectedImage, setSelectedImage] = useState(-1);
  const [slides, setSlides] = useState([]);

  const [selectedReportingImage, setSelectedReportingImage] = useState(-1);
  const [slidesReporting, setSlidesReporting] = useState([]);

  useLayoutEffect(()=>{
    if(machineId && id ){
      dispatch(setAddFileDialog(false));
      dispatch(getMachineServiceRecord(machineId, id));
    }
    dispatch(setPDFViewerDialog(false));
    dispatch(setSendEmailDialog(false));
    return ()=>{
      dispatch(resetMachineServiceRecord());
    }
  },[ dispatch, machineId, id])

  useEffect(()=>{
    if( machineId && id && !pdfViewerDialog ){
      dispatch(getMachineServiceRecordCheckItems( machineId, id ));
    }
    return ()=> dispatch(resetCheckItemValues())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch, machineId, id ] )

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
      versionNo:                            machineServiceRecord?.versionNo || 1, 
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
      approvalStatus:                       machineServiceRecord?.currentApprovalStatus || '',
      approvalLog:                          machineServiceRecord?.approval?.approvalLogs || '',
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
    await dispatch(setPDFViewerDialog(true))
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
        key={operator?._id}
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

    if ( machineServiceRecord?.files && Array.isArray( machineServiceRecord?.files ) ) {
      const updatedSildes = machineServiceRecord?.files
      ?.filter(file => file?.fileType && file.fileType.startsWith("image"))
      ?.map((file) => ({
        ...file,
        src: `data:${file?.fileType};base64,${file?.thumbnail}`,
        thumbnail: `data:${file?.fileType};base64,${file?.thumbnail}`,
      }));
      setSlides(updatedSildes);
    }

    if ( machineServiceRecord?.reportDocs && Array.isArray( machineServiceRecord?.reportDocs ) ) {
      const updatedSildes = machineServiceRecord?.reportDocs
      ?.filter(file => file?.fileType && file.fileType.startsWith("image"))
      ?.map((file) => ({
        ...file,
        src: `data:${file?.fileType};base64,${file?.thumbnail}`,
        thumbnail: `data:${file?.fileType};base64,${file?.thumbnail}`,
      }));
      setSlidesReporting(updatedSildes);
    }

    if (machineServiceRecord.status === 'DRAFT') {
      setRecordStatus({ label: 'Complete', value: 'SUBMITTED' });
    } else if (machineServiceRecord.status === 'SUBMITTED') {
      setRecordStatus({ label: 'Approve', value: 'APPROVED' });
    }
  }, [machineServiceRecord]);


  const regEx = /^[^2]*/;

  const handleAddFileDialog = ()=>{
    dispatch(setAddFileDialog(true));
  }

  const handleAddReportDocsDialog = ()=>{
    dispatch(setAddReportDocsDialog(true));
  }

  const handleOpenLightbox = async (index) => {
    setSelectedImage(index);
    const file = slides[index];
    try {
      const response = await dispatch(downloadRecordFile(machineId, serviceId, file?._id));
      if (regEx.test(response.status)) {
        const updatedItems = [
          ...slides.slice(0, index),
          {
            ...slides[index],
            src: `data:image/png;base64, ${response.data}`,
            isLoaded: true,
          },
          ...slides.slice(index + 1),
        ];
        setSlides(updatedItems);
      }
    } catch (error) {
      console.error('Error loading full file:', error);
    }
  };

  const handleOpenReportingLightbox = async (index) => {
    setSelectedReportingImage(index);
    const file = slidesReporting[index];
    try {
      if(!file.isLoaded){
        const response = await dispatch(downloadRecordFile(machineId, serviceId, file?._id));
        if (regEx.test(response.status)) {
          const updatedItems = [
            ...slidesReporting.slice(0, index),
            {
              ...slidesReporting[index],
              src: `data:image/png;base64, ${response.data}`,
              isLoaded: true,
            },
            ...slidesReporting.slice(index + 1),
          ];
          setSlidesReporting(updatedItems);
        }
      }
    } catch (error) {
      console.error('Error loading full file:', error);
    }
  };

  const serviceRecordApprovalData = {
    status: machineServiceRecord?.currentApprovalStatus,
    currentApprovalLogs: machineServiceRecord?.approval?.approvalLogs,
    currentApprovingContacts: machineServiceRecord?.approval?.approvingContacts,
    completeHistory: machineServiceRecord?.completeEvaluationHistory,
  }

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
    if(!machineServiceRecord?.approval?.approvingContacts?.length > 0){
      dispatch(getActiveSPContacts());
    }
  }

  const [pdf, setPDF] = useState(null);
  const [PDFName, setPDFName] = useState('');
  const [AttachedPDFViewerDialog, setAttachedPDFViewerDialog] = useState(false);

  const handleOpenFile = async (fileId, _fileName, fileExtension) => {
    setPDFName(`${_fileName}.${fileExtension}`);
    setAttachedPDFViewerDialog(true);
    setPDF(null);
    try {
      const response = await dispatch(downloadRecordFile(machineId, serviceId, fileId));
      if (regEx.test(response.status)) {
        const blob = b64toBlob(encodeURI(response.data), 'application/pdf')
        const url = URL.createObjectURL(blob);
        setPDF(url);
      } else {
        enqueueSnackbar(response.statusText, { variant: 'error' });
      }
    } catch (error) {
      setAttachedPDFViewerDialog(false);
      if (error.message) {
        enqueueSnackbar(error.message, { variant: 'error' });
      } else {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
      }
    }
  };

  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue='serviceRecords' />
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons
          isLoading={isLoading}
          isActive={defaultValues.isActive}
          disableEditButton={
            machine?.isArchived ||
            machine?.status?.slug === 'transferred' ||
            machineServiceRecord.currentApprovalStatus === 'APPROVED'
          }
          disableDeleteButton={
            machine?.isArchived ||
            machine?.status?.slug === 'transferred' ||
            machineServiceRecord.currentApprovalStatus === 'APPROVED'
          }
          skeletonIcon={isLoading && !machineServiceRecord?._id}
          handleEdit={ 
            !machine?.isArchived && 
            !machineServiceRecord?.isHistory && 
            machineServiceRecord?._id && handleEdit
          }
          onDelete={
            !machine?.isArchived &&
            !machineServiceRecord?.isHistory &&
            machineServiceRecord?.status === 'DRAFT' &&
            machineServiceRecord?._id
              ? onDelete
              : null
          }
          backLink={handleBackLink}
          handleSendPDFEmail={ !machine?.isArchived && !machineServiceRecord?.isHistory && machineServiceRecord?._id && handleSendEmail}
          handleViewPDF={!machineServiceRecord?.isHistory && machineServiceRecord?._id && handlePDFViewer}
          
          handleCompleteMSR={
            !machine?.isArchived &&
            machineServiceRecord?.isActive &&
            !machineServiceRecord?.isHistory &&
            machineServiceRecord?.status === 'SUBMITTED' &&
            machineServiceRecord?.currentVersion?._id === machineServiceRecord?._id &&
            machineServiceRecord?.currentApprovalStatus !== 'APPROVED' &&
            machineServiceRecord?.approval?.approvingContacts?.length < 1 &&
            handleCompleteConfirm || undefined
          }

          serviceRecordStatus={
            ((machineServiceRecord.isActive &&
              !machineServiceRecord?.isHistory &&
              machineServiceRecord?.status === 'SUBMITTED' &&
              machineServiceRecord?.currentVersion?._id === machineServiceRecord?._id &&
              machineServiceRecord?.approval?.approvingContacts?.length > 0) ||
              machineServiceRecord?.completeEvaluationHistory?.totalLogsCount > 0) ?
            serviceRecordApprovalData : null
          }
        />
        
        <Grid container>
          <FormLabel content={FORMLABELS.KEYDETAILS} />
          <ViewFormField isLoading={isLoading} variant='h4' sm={2} heading="Service Date" 
            param={fDate(defaultValues.serviceDate)} />
          <ViewFormField isLoading={isLoading} variant='h4' sm={6} heading="Service Record Configuration" 
            param={`${defaultValues.serviceRecordConfig} ${defaultValues.serviceRecordConfigRecordType ? '-' : ''} ${defaultValues.serviceRecordConfigRecordType ? defaultValues.serviceRecordConfigRecordType : ''}`} />
          <ViewFormField
              isLoading={isLoading}
              variant="h4"
              sm={2}
              heading="Version No"
              node={
                <>
                  {defaultValues?.versionNo}
                  {(machineServiceRecord?.isHistory ||
                    machineServiceRecord?.status === 'DRAFT') && (
                    <CurrentIcon callFunction={handleCurrentServiceRecord} />
                  )}
                  {!machineServiceRecord?.isHistory &&
                    machineServiceRecord?.currentVersion?.versionNo > 1 &&
                    machineServiceRecord?.serviceId && (
                      <HistoryIcon callFunction={handleServiceRecordHistory} />
                  )}
                </>
              }
            />
          <ViewFormField isLoading={isLoading} variant='h4' sm={2} heading="Status" 
            node={ <>
              <Typography variant='h4' sx={{mr: 1,
                color: (
                  machineServiceRecord?.currentApprovalStatus === 'REJECTED' && 'red' || 
                  machineServiceRecord?.currentApprovalStatus === 'APPROVED' && 'green'
                ) || 'inherit'
                }}
              >
                {machineServiceRecord?.currentApprovalStatus === "PENDING" ? machineServiceRecord?.status : machineServiceRecord?.currentApprovalStatus}
              </Typography> 
              {
                !machine?.isArchived &&
                machineServiceRecord?.isActive &&
                !machineServiceRecord?.isHistory &&
                machineServiceRecord?.status === 'SUBMITTED' &&
                machineServiceRecord?.currentVersion?._id === machineServiceRecord?._id &&
                machineServiceRecord?.currentApprovalStatus !== 'APPROVED' &&
                machineServiceRecord?.approval?.approvingContacts?.length < 1 &&
                <IconButtonTooltip title='Request Approval' icon="streamline:send-email-solid" onClick={handleCompleteConfirm} /> 
              }
              { Array.isArray(machineServiceRecord?.approval?.approvingContacts) &&
                machineServiceRecord?.approval?.approvingContacts?.length > 0 &&
                machineServiceRecord?.approval?.approvingContacts?.find(( c => c === user.contact)) && 
                machineServiceRecord?.currentApprovalStatus !== 'APPROVED' &&
              <IconButtonTooltip title='Approve / Reject' icon="mdi:stamper" onClick={handleCompleteConfirm} /> }
            </>
            }
          />

          {(machineServiceRecord?.currentApprovalStatus !== "PENDING" && machineServiceRecord?.approval?.approvalLogs?.length > 0) ? (              
            <ViewFormField isLoading={isLoading} sm={12}
              heading={`${machineServiceRecord?.currentApprovalStatus === "REJECTED" ? "Rejection" : "Approval"} Comments`}
              srEvaluationComment={ machineServiceRecord?.approval?.approvalLogs?.length > 0 }
            />
          ) : null}
          <ViewFormField
            isLoading={isLoading}
            sm={12}
            heading="Decoilers"
            chipDialogArrayParam={defaultValues?.decoilers?.map(( decoilerMachine ) => (
              <Chip 
                key={decoilerMachine?._id}
                sx={{ m:0.2 }} 
                deleteIcon={<Iconify icon="fluent:open-12-regular"/>}
                onDelete={()=> {
                  window.open(PATH_MACHINE.machines.view(decoilerMachine?._id), '_blank');
                }}
                label={`${decoilerMachine?.serialNo || ''} ${decoilerMachine?.name  ? '-' : '' } ${decoilerMachine?.name || ''} `} 
              />
            ))} 
          />
          <ViewFormField isLoading={isLoading} sm={4} heading="Technician"  param={`${defaultValues?.technician?.firstName || ''} ${defaultValues?.technician?.lastName || ''} `} />
          <ViewFormNoteField sm={12} heading="Technician Notes" param={defaultValues.technicianNotes} />
          { machineServiceRecord?.reportDocs?.length > 0 && !machineServiceRecord?.isHistory && 
          <>
            <FormLabel content='Reporting Documents' />
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
              {slidesReporting?.map((file, _index) => (
                <DocumentGalleryItem isLoading={isLoading} key={file?._id} image={file} 
                  onOpenLightbox={()=> handleOpenReportingLightbox(_index)}
                  onDownloadFile={()=> handleDownloadRecordFile(file._id, file?.name, file?.extension)}
                  onDeleteFile={()=> handleDeleteRecordFile(file._id)}
                  isArchived={ machine?.isArchived }
                  toolbar
                />
              ))}
              {machineServiceRecord?.reportDocs?.map((file, _index) => !file.fileType.startsWith("image") && (
                <DocumentGalleryItem isLoading={isLoading} key={file?._id} image={file} 
                  onOpenFile={()=> handleOpenFile(file._id, file?.name, file?.extension)}
                  onDownloadFile={()=> handleDownloadRecordFile(file._id, file?.name, file?.extension)}
                  onDeleteFile={()=> handleDeleteRecordFile(file._id)}
                  isArchived={ machine?.isArchived }
                  toolbar
                />
              ))}
              {!machineServiceRecord?.isHistory && machineServiceRecord?.status === 'DRAFT' && <ThumbnailDocButton onClick={handleAddReportDocsDialog}/>}
            </Box>
          </>}
          <FormLabel content={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />
          {defaultValues.textBeforeCheckItems && <ViewFormNoteField sm={12}  param={defaultValues.textBeforeCheckItems} />}
          {!isLoadingCheckItems ? 
            <Grid item md={12} sx={{  overflowWrap: 'break-word' }}>
              <Grid item md={12} sx={{display:'flex', flexDirection:'column'}}>
              {machineServiceRecordCheckItems?.checkItemLists?.map((row, index) => (
                <CheckedItemValueRow
                  machineId={machineId}
                  serviceId={machineServiceRecord._id}
                  value={row}
                  index={index}
                  key={row._id}
                />
              ))}
              </Grid>
            </Grid>
            :
            <Stack
              my={1} py={2} spacing={2}
              sx={{
                width: '100%',
                borderRadius: '10px',
                border: (theme) => `1px solid ${theme.palette.grey[400]}`,
              }}
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonLine key={index} />
              ))}
            </Stack>
          }
          
          {defaultValues.textAfterCheckItems && <ViewFormNoteField sm={12}  param={defaultValues.textAfterCheckItems} />}

          {machineServiceRecord?.serviceRecordConfig?.enableNote && <ViewFormNoteField sm={12} heading={`${machineServiceRecord?.serviceRecordConfig?.recordType?.charAt(0).toUpperCase()||''}${machineServiceRecord?.serviceRecordConfig?.recordType?.slice(1).toLowerCase()||''} Note`} param={defaultValues.serviceNote} />}
          {machineServiceRecord?.serviceRecordConfig?.enableMaintenanceRecommendations && <ViewFormNoteField sm={12} heading="Recommendation Note" param={defaultValues.recommendationNote} />}
          {machineServiceRecord?.serviceRecordConfig?.enableSuggestedSpares && <ViewFormNoteField sm={12} heading="Suggested Spares" param={defaultValues.suggestedSpares} />}
          <ViewFormNoteField sm={12} heading="Internal Note" param={defaultValues.internalNote} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Operators" chipDialogArrayParam={operators} />
          <ViewFormNoteField sm={12} heading="Operator Notes" param={defaultValues.operatorNotes} />
          {machineServiceRecord?.files?.length > 0 && !machineServiceRecord?.isHistory && 
          <FormLabel content='Documents / Images' />
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
            <DocumentGalleryItem isLoading={isLoading} key={file?._id} image={file} 
              onOpenLightbox={()=> handleOpenLightbox(_index)}
              onDownloadFile={()=> handleDownloadRecordFile(file._id, file?.name, file?.extension)}
              onDeleteFile={()=> handleDeleteRecordFile(file._id)}
              isArchived={ machine?.isArchived }
              toolbar
            />
          ))}

          {machineServiceRecord?.files?.map((file, _index) => !file.fileType.startsWith("image") && (
              <DocumentGalleryItem isLoading={isLoading} key={file?._id} image={file} 
                onOpenFile={()=> handleOpenFile(file._id, file?.name, file?.extension)}
                onDownloadFile={()=> handleDownloadRecordFile(file._id, file?.name, file?.extension)}
                onDeleteFile={()=> handleDeleteRecordFile(file._id)}
                isArchived={ machine?.isArchived }
                toolbar
              />
            ))}

          {!machineServiceRecord?.isHistory && machineServiceRecord?.status === 'DRAFT' && <ThumbnailDocButton onClick={handleAddFileDialog}/>}
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
        close={()=> setSelectedImage(-1)}
        onGetCurrentIndex={handleOpenLightbox}
        disabledTotal
        disabledDownload
        disabledSlideshow
      />

      <Lightbox
        index={selectedReportingImage}
        slides={slidesReporting}
        open={selectedReportingImage>=0}
        close={()=> setSelectedReportingImage(-1)}
        onGetCurrentIndex={handleOpenReportingLightbox}
        disabledTotal
        disabledDownload
        disabledSlideshow
      />

      {AttachedPDFViewerDialog && (
        <Dialog fullScreen open={AttachedPDFViewerDialog} onClose={()=> setAttachedPDFViewerDialog(false)}>
          <DialogTitle variant='h3' sx={{pb:1, pt:2, display:'flex', justifyContent:'space-between'}}>
              PDF View
                <Button variant='outlined' onClick={()=> setAttachedPDFViewerDialog(false)}>Close</Button>
          </DialogTitle>
          <Divider variant='fullWidth' />
            {pdf?(
                <iframe title={PDFName} src={pdf} style={{paddingBottom:10}} width='100%' height='842px'/>
              ):(
                <SkeletonPDF />
              )}
        </Dialog>
      )}
  </Container>
  );
}

export default memo(MachineServiceParamViewForm)
