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
import { deleteMachineServiceReport,   
  getMachineServiceReport, 
  resetMachineServiceReport,
  setSendEmailDialog,
  setPDFViewerDialog,
  setAddFileDialog,
  setAddReportDocsDialog,
  downloadReportFile,
  deleteReportFile,
  setFormActiveStep,
  getMachineServiceReportCheckItems,
  resetCheckItemValues,
  setCompleteDialog} from '../../../redux/slices/products/machineServiceReport';
import { getActiveSPContacts, setCardActiveIndex, setIsExpanded } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
import { FORMLABELS } from '../../../constants/default-constants';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { fDate } from '../../../utils/formatTime';
import CheckedItemValueRow from './CheckedItemValueRow';
import SendEmailDialog from '../../../components/Dialog/SendEmailDialog';
import PDFViewerDialog from '../../../components/Dialog/PDFViewerDialog';
import Iconify from '../../../components/iconify';
import MachineTabContainer from '../util/MachineTabContainer';
import { ThumbnailDocButton } from '../../../components/Thumbnails';
import DialogServiceReportAddFile from '../../../components/Dialog/DialogServiceReportAddFile';
import { DocumentGalleryItem } from '../../../components/gallery/DocumentGalleryItem';
import { useAuthContext } from '../../../auth/useAuthContext';
import Lightbox from '../../../components/lightbox/Lightbox';
import SkeletonLine from '../../../components/skeleton/SkeletonLine';
import DialogServiceReportComplete from '../../../components/Dialog/DialogServiceReportComplete';
import SkeletonPDF from '../../../components/skeleton/SkeletonPDF';
import IconButtonTooltip from '../../../components/Icons/IconButtonTooltip';
import ServiceReportsFormComments from '../../../components/machineServiceReports/ServiceReportsFormComments';
import ReportStatusButton from './ReportStatusButton';
import ViewHistory from './ViewHistory';

function MachineServiceReportViewForm( ) {
  
  const { machineServiceReport, machineServiceReportCheckItems, isLoadingCheckItems, isLoading, pdfViewerDialog, sendEmailDialog } = useSelector((state) => state.machineServiceReport);
  const { machine } = useSelector((state) => state.machine)
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { machineId, primaryServiceReportId, id } = useParams();
  const { user, userId } = useAuthContext();
  const [selectedImage, setSelectedImage] = useState(-1);
  const [slides, setSlides] = useState([]);

  const [selectedReportingImage, setSelectedReportingImage] = useState(-1);
  const [slidesReporting, setSlidesReporting] = useState([]);

  useLayoutEffect(()=>{
    if(machineId && id ){
      dispatch(setAddFileDialog(false));
      dispatch(getMachineServiceReport(machineId, id));
    }
    dispatch(setPDFViewerDialog(false));
    dispatch(setSendEmailDialog(false));
    return ()=>{
      dispatch(resetMachineServiceReport());
    }
  },[ dispatch, machineId, id])

  useEffect(()=>{
    if( machineId && id && !pdfViewerDialog ){
      dispatch(getMachineServiceReportCheckItems( machineId, id ));
    }
    return ()=> dispatch(resetCheckItemValues())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch, machineId, id ] )

  const onDelete = async () => {
    try {
      await dispatch(deleteMachineServiceReport(machineId, id, machineServiceReport?.status?._id ));
      await enqueueSnackbar('Machine Service Report Archived Successfully!');
      await navigate(PATH_MACHINE.machines.serviceReports.root(machineId))
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async() => {
    await dispatch(setFormActiveStep(0));
    await navigate(PATH_MACHINE.machines.serviceReports.edit(machineId, id))
  };

  const defaultValues = useMemo(
    () => ({
      customer:                             machineServiceReport?.customer || null, 
      site:                                 machineServiceReport?.site || null,
      machine:                              machineServiceReport?.machine || null,
      reportType:                           machineServiceReport?.reportType || null,
      serviceReportUID:                     machineServiceReport?.serviceReportUID || "",
      serviceReportTemplate:                machineServiceReport?.serviceReportTemplate?.reportTitle	 || '',
      serviceReportTemplateReportType:      machineServiceReport?.serviceReportTemplate?.reportType || '',
      serviceDate:                          machineServiceReport?.serviceDate || null,
      decoilers:                            machineServiceReport?.decoilers ,
      technician:                           machineServiceReport?.technician || null,
      // checkParams:         
      headerLeftText:                       machineServiceReport?.serviceReportTemplate?.header?.leftText || '',
      headerCenterText:                     machineServiceReport?.serviceReportTemplate?.header?.centerText || '',
      headerRightText:                      machineServiceReport?.serviceReportTemplate?.header?.rightText || '',
      footerLeftText:                       machineServiceReport?.serviceReportTemplate?.footer?.leftText || '', 
      footerCenterText:                     machineServiceReport?.serviceReportTemplate?.footer?.centerText || '',
      footerRightText:                      machineServiceReport?.serviceReportTemplate?.footer?.rightText || '',
      textBeforeCheckItems:                 machineServiceReport?.textBeforeCheckItems || [],
      textAfterCheckItems:                  machineServiceReport?.textAfterCheckItems || [],
      internalComments:                     machineServiceReport?.internalComments || [],
      serviceNote:                          machineServiceReport?.serviceNote || [],
      recommendationNote:                   machineServiceReport?.recommendationNote || [],
      suggestedSpares:                      machineServiceReport?.suggestedSpares || [],
      internalNote:                         machineServiceReport?.internalNote || [],
      operatorNotes:                        machineServiceReport?.operatorNotes || [],
      technicianNotes:                      machineServiceReport?.technicianNotes ||[],
      files:                                machineServiceReport?.files || [],
      operators:                            machineServiceReport?.operators || [],
      isActive:                             machineServiceReport?.isActive,
      status:                               machineServiceReport?.status?.name || "",
      approvalStatus:                       machineServiceReport?.currentApprovalStatus || '',
      approvalLog:                          machineServiceReport?.approval?.approvalLogs || '',
      createdAt:                            machineServiceReport?.createdAt || '',
      createdByFullName:                    machineServiceReport?.createdBy?.name || '',
      createdIP:                            machineServiceReport?.createdIP || '',
      updatedAt:                            machineServiceReport?.updatedAt || '',
      updatedByFullName:                    machineServiceReport?.updatedBy?.name || '',
      updatedIP:                            machineServiceReport?.updatedIP || '',

    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ machineServiceReport]
  );
  const handleSendEmail = async() => {
      dispatch(setSendEmailDialog(true))
  }

  const handlePDFViewer = async() => {
    await dispatch(setPDFViewerDialog(true))
  }

  const fileName = `${defaultValues?.serviceDate?.substring(0,10).replaceAll('-','')}_${defaultValues?.serviceReportTemplateReportType}.pdf`

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
    navigate(PATH_MACHINE.machines.serviceReports.root(machineId))
  }
  
  const [reportStatus, setReportStatus]= useState(null);

  useEffect(() => {

    if ( machineServiceReport?.files && Array.isArray( machineServiceReport?.files ) ) {
      const updatedSildes = machineServiceReport?.files
      ?.filter(file => file?.fileType && file.fileType.startsWith("image"))
      ?.map((file) => ({
        ...file,
        src: `data:${file?.fileType};base64,${file?.thumbnail}`,
        thumbnail: `data:${file?.fileType};base64,${file?.thumbnail}`,
      }));
      setSlides(updatedSildes);
    }

    if ( machineServiceReport?.reportDocs && Array.isArray( machineServiceReport?.reportDocs ) ) {
      const updatedSildes = machineServiceReport?.reportDocs
      ?.filter(file => file?.fileType && file.fileType.startsWith("image"))
      ?.map((file) => ({
        ...file,
        src: `data:${file?.fileType};base64,${file?.thumbnail}`,
        thumbnail: `data:${file?.fileType};base64,${file?.thumbnail}`,
      }));
      setSlidesReporting(updatedSildes);
    }

    if (machineServiceReport?.status?.name?.toUpperCase() === 'DRAFT') {
      setReportStatus({ label: 'Complete', value: 'SUBMITTED' });
    } else if (machineServiceReport?.status?.name?.toUpperCase() === 'SUBMITTED') {
      setReportStatus({ label: 'Approve', value: 'APPROVED' });
    }
  }, [machineServiceReport]);


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
      const response = await dispatch(downloadReportFile(machineId, primaryServiceReportId, file?._id));
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
        const response = await dispatch(downloadReportFile(machineId, primaryServiceReportId, file?._id));
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

  const serviceReportApprovalData = {
    status: machineServiceReport?.currentApprovalStatus,
    currentApprovalLogs: machineServiceReport?.approval?.approvalLogs,
    currentApprovingContacts: machineServiceReport?.approval?.approvingContacts,
    completeHistory: machineServiceReport?.completeEvaluationHistory,
  }

  const handleDeleteReportFile = async (fileId) => {
    try {
      await dispatch(deleteReportFile(machineId, machineServiceReport?.primaryServiceReportId, fileId));
      await dispatch(getMachineServiceReport(machineId, id))
      enqueueSnackbar('File deleted successfully!');
    } catch (err) {
      console.log(err);
      enqueueSnackbar('File Deletion failed!', { variant: `error` });
    }
  };

  const handleDownloadReportFile = (fileId, name, extension) => {
    dispatch(downloadReportFile(machineId, primaryServiceReportId, fileId))
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
    if(!machineServiceReport?.approval?.approvingContacts?.length > 0){
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
      const response = await dispatch(downloadReportFile(machineId, primaryServiceReportId, fileId));
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

  console.log(" ServiceReport?.status : ",machineServiceReport?.status?.type?.toLowerCase())

  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue='serviceReports' />
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons
          isLoading={isLoading}
          isActive={defaultValues.isActive}
          disableEditButton={
            machine?.isArchived ||
            machine?.status?.slug === 'transferred' ||
            machineServiceReport.currentApprovalStatus === 'APPROVED'
          }
          disableDeleteButton={
            machine?.isArchived ||
            machine?.status?.slug === 'transferred' ||
            machineServiceReport.currentApprovalStatus === 'APPROVED'
          }
          skeletonIcon={isLoading || !machineServiceReport?._id}
          handleEdit={ 
            !machine?.isArchived && 
            machineServiceReport?.status?.type?.toLowerCase() === 'draft' &&
            machineServiceReport?._id && handleEdit
          }
          onDelete={
            !machine?.isArchived &&
            // machineServiceReport?.status?.name?.toUpperCase() === 'DRAFT' &&
            machineServiceReport?._id
              ? onDelete
              : null
          }
          backLink={handleBackLink}
          handleSendPDFEmail={ !machine?.isArchived && machineServiceReport?._id && handleSendEmail}
          handleViewPDF={ !machine?.isArchived && machineServiceReport?._id && handlePDFViewer}
          
          handleCompleteMSR={
            !machine?.isArchived &&
            machineServiceReport?.isActive &&
            machineServiceReport?.status?.name?.toUpperCase() === 'SUBMITTED' &&
            machineServiceReport?.currentApprovalStatus !== 'APPROVED' &&
            machineServiceReport?.approval?.approvingContacts?.length < 1 &&
            handleCompleteConfirm || undefined
          }

          serviceReportStatus={
            ((machineServiceReport.isActive &&
              machineServiceReport?.status?.name?.toUpperCase() === 'SUBMITTED' &&
              machineServiceReport?.approval?.approvingContacts?.length > 0) ||
              machineServiceReport?.completeEvaluationHistory?.totalLogsCount > 0) ?
            serviceReportApprovalData : null
          }
        />
        
        <Grid container>
          <FormLabel content={FORMLABELS.KEYDETAILS} />
          <ViewFormField isLoading={isLoading} variant='h4' sm={4} heading="Service Date" 
            param={fDate(defaultValues.serviceDate)} />


          <ViewFormField
              isLoading={isLoading}
              variant="h4"
              sm={4}
              heading="Service ID"
              param={ defaultValues.serviceReportUID }
            />
          <ViewFormField isLoading={isLoading} variant='h4' sm={4} heading="Status" 
            node={ <>
              <Typography variant='h4' sx={{mr: 1,
                color: (
                  machineServiceReport?.currentApprovalStatus === 'REJECTED' && 'red' || 
                  machineServiceReport?.currentApprovalStatus === 'APPROVED' && 'green'
                ) || 'inherit'
                }}
              >
                {machineServiceReport?.currentApprovalStatus === "PENDING" ? ( machineServiceReport?.status?.name && <ReportStatusButton machineID={ machineId } iconButton reportID={ id } status={ machineServiceReport?.status } />) || "" : machineServiceReport?.currentApprovalStatus}
              </Typography> 
              {
                !machine?.isArchived &&
                machineServiceReport?.isActive &&
                machineServiceReport?.status?.type?.toLowerCase() === 'done' &&
                machineServiceReport?.currentApprovalStatus !== 'APPROVED' &&
                machineServiceReport?.approval?.approvingContacts?.length < 1 &&
                <IconButtonTooltip title='Request Approval' icon="mdi:email-seal" onClick={handleCompleteConfirm} /> 
              }
              { Array.isArray(machineServiceReport?.approval?.approvingContacts) &&
                machineServiceReport?.approval?.approvingContacts?.length > 0 &&
                machineServiceReport?.approval?.approvingContacts?.find(( c => c === user.contact)) && 
                machineServiceReport?.currentApprovalStatus !== 'APPROVED' &&
              <IconButtonTooltip title='Approve / Reject' icon="mdi:list-status" onClick={handleCompleteConfirm} /> }
            </>
            }
          />

          <ViewFormField 
            isLoading={isLoading} 
            variant='h4' 
            sm={6} 
            heading="Service Report Template" 
            param={`${defaultValues.serviceReportTemplate} ${defaultValues.serviceReportTemplateReportType ? '-' : ''} ${defaultValues.serviceReportTemplateReportType ? defaultValues.serviceReportTemplateReportType : ''}`}
          />

          {(machineServiceReport?.currentApprovalStatus !== "PENDING" && machineServiceReport?.approval?.approvalLogs?.length > 0) ? (              
            <ViewFormField isLoading={isLoading} sm={12}
              heading={`${machineServiceReport?.currentApprovalStatus === "REJECTED" ? "Rejection" : "Approval"} Comments`}
              srEvaluationComment={ machineServiceReport?.approval?.approvalLogs?.length > 0 }
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
          {/* <ViewFormField isLoading={isLoading} sm={4} heading="Technician"  param={`${defaultValues?.technician?.firstName || ''} ${defaultValues?.technician?.lastName || ''} `} /> */}
          <ViewHistory isLoading={isLoading} title="Technician Notes" historicalData={defaultValues.technicianNotes} />

          { machineServiceReport?.reportDocs?.length > 0 &&
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
                  onDownloadFile={()=> handleDownloadReportFile(file._id, file?.name, file?.extension)}
                  onDeleteFile={()=> handleDeleteReportFile(file._id)}
                  isArchived={ machine?.isArchived }
                  toolbar
                />
              ))}
              {machineServiceReport?.reportDocs?.map((file, _index) => !file.fileType.startsWith("image") && (
                <DocumentGalleryItem isLoading={isLoading} key={file?._id} image={file} 
                  onOpenFile={()=> handleOpenFile(file._id, file?.name, file?.extension)}
                  onDownloadFile={()=> handleDownloadReportFile(file._id, file?.name, file?.extension)}
                  onDeleteFile={()=> handleDeleteReportFile(file._id)}
                  isArchived={ machine?.isArchived }
                  toolbar
                />
              ))}
              { machineServiceReport?.status?.name?.toUpperCase() === 'DRAFT' && <ThumbnailDocButton onClick={handleAddReportDocsDialog}/> }
            </Box>
          </>}
          <FormLabel content={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />
          {defaultValues.textBeforeCheckItems && <ViewHistory isLoading={isLoading}  historicalData={defaultValues.textBeforeCheckItems} />}
          {!isLoadingCheckItems ? 
            <Grid item md={12} sx={{ overflowWrap: 'break-word' }}>
              <Grid item md={12} sx={{display:'flex', flexDirection:'column'}}>
              {machineServiceReportCheckItems?.checkItemLists?.map((row, index) => (
                <CheckedItemValueRow
                  machineId={machineId}
                  primaryServiceReportId={machineServiceReport?.primaryServiceReportId	}
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
          
          {defaultValues.textAfterCheckItems && <ViewHistory isLoading={isLoading}  historicalData={defaultValues.textAfterCheckItems} />}

          {machineServiceReport?.serviceReportTemplate?.enableNote && <ViewHistory isLoading={isLoading} title={`${machineServiceReport?.serviceReportTemplate?.reportType?.charAt(0).toUpperCase()||''}${machineServiceReport?.serviceReportTemplate?.reportType?.slice(1).toLowerCase()||''} Note`} historicalData={defaultValues.serviceNote} />}
          {machineServiceReport?.serviceReportTemplate?.enableMaintenanceRecommendations && <ViewHistory isLoading={isLoading} title="Recommendation Note" historicalData={defaultValues.recommendationNote} />}
          {machineServiceReport?.serviceReportTemplate?.enableSuggestedSpares && <ViewHistory isLoading={isLoading} title="Suggested Spares" historicalData={defaultValues.suggestedSpares} />}
          <ViewHistory isLoading={isLoading} title="Internal Note" historicalData={defaultValues.internalNote} />
          {/* <ViewFormField isLoading={isLoading} sm={12} heading="Operators" chipDialogArrayParam={operators} /> */}
          <ViewHistory isLoading={isLoading} title="Operator Notes" historicalData={defaultValues.operatorNotes} />
          {machineServiceReport?.files?.length > 0 && 
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
              onDownloadFile={()=> handleDownloadReportFile(file._id, file?.name, file?.extension)}
              onDeleteFile={()=> handleDeleteReportFile(file._id)}
              isArchived={ machine?.isArchived }
              toolbar
            />
          ))}

          {machineServiceReport?.files?.map((file, _index) => !file.fileType.startsWith("image") && (
              <DocumentGalleryItem isLoading={isLoading} key={file?._id} image={file} 
                onOpenFile={()=> handleOpenFile(file._id, file?.name, file?.extension)}
                onDownloadFile={()=> handleDownloadReportFile(file._id, file?.name, file?.extension)}
                onDeleteFile={()=> handleDeleteReportFile(file._id)}
                isArchived={ machine?.isArchived }
                toolbar
              />
            ))}

          { machineServiceReport?.status?.name?.toUpperCase() === 'DRAFT' && <ThumbnailDocButton onClick={handleAddFileDialog}/>}
        </Box>
          
          <ViewFormAudit defaultValues={defaultValues} />

        </Grid>
      </Grid>
      {pdfViewerDialog && <PDFViewerDialog machineServiceReport={machineServiceReport} />}
      {sendEmailDialog && <SendEmailDialog fileName={fileName}/>}
      <DialogServiceReportAddFile />
      <DialogServiceReportComplete reportStatus={reportStatus}/>
    </Card>
      <Card sx={{ mt: 2 }}>
        <ServiceReportsFormComments serviceReportData={machineServiceReport} currentUser={{...user, userId}} machine={machine}/>
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

export default memo(MachineServiceReportViewForm)
