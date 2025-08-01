import React, { useMemo, memo, useLayoutEffect, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import b64toBlob from 'b64-to-blob';
// @mui
import { Container, Card, Chip, Grid, Box, Stack, Dialog, DialogTitle, Divider, Button, Typography, Link } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import download from 'downloadjs';
import { PATH_MACHINE, PATH_CRM } from '../../../routes/paths';
import ServiceReportAuditLogs from './ServiceReportAuditLogs';
// redux
import { deleteMachineServiceReport,   
  getMachineServiceReport, 
  resetMachineServiceReport,
  setSendEmailDialog,
  setPDFViewerDialog,
  setAddReportDocsDialog,
  setIsReportDoc,
  downloadReportFile,
  deleteReportFile,
  setFormActiveStep,
  getMachineServiceReportCheckItems,
  resetCheckItemValues,
  setCompleteDialog, 
  sendToDraftMachineServiceReportStatus} from '../../../redux/slices/products/machineServiceReport';
import { getActiveSPContacts } from '../../../redux/slices/customer/contact';
import { getMachineForDialog, setMachineDialog } from '../../../redux/slices/products/machine';
import { getCustomer, setCustomerDialog } from '../../../redux/slices/customer/customer';
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
import SendEmailDialog from '../../../components/Dialog/SendEmailDialog';
import PDFViewerDialog from '../../../components/Dialog/PDFViewerDialog';
import Iconify from '../../../components/iconify';
import MachineTabContainer from '../util/MachineTabContainer';
import { ThumbnailDocButton } from '../../../components/Thumbnails';
import { DocumentGalleryItem } from '../../../components/gallery/DocumentGalleryItem';
import { useAuthContext } from '../../../auth/useAuthContext';
import { handleError } from '../../../utils/errorHandler';
import Lightbox from '../../../components/lightbox/Lightbox';
import SkeletonLine from '../../../components/skeleton/SkeletonLine';
import DialogServiceReportComplete from '../../../components/Dialog/ServiceReportCompleteDialog';
import SkeletonPDF from '../../../components/skeleton/SkeletonPDF';
import IconButtonTooltip from '../../../components/Icons/IconButtonTooltip';
import ServiceReportsFormComments from '../../../components/machineServiceReports/ServiceReportsFormComments';
import OpenInNewPage from '../../../components/Icons/OpenInNewPage';
import ReportStatusButton from './ReportStatusButton';
import ViewNoteHistory from './ViewNoteHistory';

function MachineServiceReportViewForm(  ) {
  
  const { machineServiceReport, machineServiceReportCheckItems, isLoadingCheckItems, isLoading, pdfViewerDialog, sendEmailDialog } = useSelector((state) => state.machineServiceReport);
  const { machine } = useSelector((state) => state.machine)
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { machineId, id } = useParams();
  const { user, userId } = useAuthContext();
  const [selectedImage, setSelectedImage] = useState(-1);
  const [slides, setSlides] = useState([]);

  const [selectedReportingImage, setSelectedReportingImage] = useState(-1);
  const [slidesReporting, setSlidesReporting] = useState([]);

  useLayoutEffect(()=>{
    if( id ){
      dispatch(setAddReportDocsDialog(false));
      dispatch(getMachineServiceReport(machineId, id));
    }
    dispatch(setPDFViewerDialog(false));
    dispatch(setSendEmailDialog(false));
    return ()=>{
      dispatch(resetMachineServiceReport());
    }
  },[ dispatch, machineId, id])

  useLayoutEffect(()=>{
    if( id && !pdfViewerDialog && machineServiceReport?.reportSubmition ){
      dispatch(getMachineServiceReportCheckItems( machineId, id ));
    }
    return ()=> dispatch(resetCheckItemValues())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch, machineId, id, machineServiceReport?.reportSubmition ] )

  const onDelete = async () => {
    try {
      await dispatch(deleteMachineServiceReport(machineId, id, machineServiceReport?.status?._id ));
      await enqueueSnackbar('Machine Service Report Archived Successfully!');
      await navigate(PATH_MACHINE.machines.serviceReports.root(machineId))
    } catch (error) {
      enqueueSnackbar( handleError( error ) || 'Service report delete failed!', { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async () => {
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
      textBeforeCheckItems:                 machineServiceReport?.textBeforeCheckItems || "",
      textAfterCheckItems:                  machineServiceReport?.textAfterCheckItems || "",
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

  // const handleContactView = async (contactId) => {
  //   await dispatch(setCardActiveIndex(contactId));
  //   await dispatch(setIsExpanded(true));
  //   await navigate(PATH_CRM.customers.contacts.view(machine?.customer?._id,contactId))
  // };

  // const handleContactViewInNewPage = async (contactId) => {
  //   await dispatch(setCardActiveIndex(contactId));
  //   await dispatch(setIsExpanded(true));
  //   await window.open(PATH_CRM.customers.contacts.view(machine?.customer?._id, contactId), '_blank');
  // };

  // const operators = defaultValues?.operators?.map((operator, index) => (  
  //   <Chip 
  //       onClick={() => handleContactView(operator?._id)} 
  //       sx={{m:0.2}}
  //       key={operator?._id}
  //       deleteIcon={<Iconify icon="fluent:open-12-regular"/>}
  //       onDelete={()=> handleContactViewInNewPage(operator?._id)}
  //       label={`${operator?.firstName || ''} ${operator?.lastName || ''}`} 
  //     />
  // ));

  const handleBackLink = () => navigate( PATH_MACHINE.machines.serviceReports.root(machineId) );
  
  const [ reportApprovalDialogType, setReportApprovalDialogType ] = useState(null);

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
  }, [machineServiceReport]);


  const regEx = /^[^2]*/;

  const handleAddFileDialog = ()=>{
    dispatch(setAddReportDocsDialog(true));
  }

  const handleAddReportDocsDialog = ()=>{
    dispatch(setIsReportDoc(true));
    dispatch(setAddReportDocsDialog(true));
  }

  const handleOpenLightbox = async (index) => {
    setSelectedImage(index);
    const file = slides[index];
    try {
      const response = await dispatch(downloadReportFile(machineId, id, file?._id));
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
        const response = await dispatch(downloadReportFile(machineId, id, file?._id));
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
    approvalLogs: machineServiceReport?.approval?.approvalHistory,
    approvingContacts: machineServiceReport?.approval?.approvingContacts,
  }

  const handleDeleteReportFile = async (fileId) => {
    try {
      await dispatch(deleteReportFile(machineId, machineServiceReport?._id, fileId));
      await dispatch(getMachineServiceReport(machineId, id))
      enqueueSnackbar('File deleted successfully!');
    } catch (err) {
      console.log(err);
      enqueueSnackbar( handleError( err ) || 'File Deletion failed!', { variant: `error` });
    }
  };

  const handleDownloadReportFile = (fileId, name, extension) => {
    dispatch(downloadReportFile(machineId, id, fileId))
      .then((res) => {
        if (regEx.test(res.status)) {
          download(atob(res.data), `${name}.${extension}`, { type: extension });
          enqueueSnackbar(res.statusText);
        } else {
          enqueueSnackbar(res.statusText, { variant: `error` });
        }
      })
      .catch((err) => {
        enqueueSnackbar( handleError( err ) || 'File download failed!' , { variant: `error` });
      });
  };
  
  const handleCompleteConfirm = (type) => {
    setReportApprovalDialogType(type)
    dispatch(setCompleteDialog(true))
    dispatch(getActiveSPContacts());
  }

  const [pdf, setPDF] = useState(null);
  const [PDFName, setPDFName] = useState('');
  const [AttachedPDFViewerDialog, setAttachedPDFViewerDialog] = useState(false);

  const handleOpenFile = async (fileId, _fileName, fileExtension) => {
    setPDFName(`${_fileName}.${fileExtension}`);
    setAttachedPDFViewerDialog(true);
    setPDF(null);
    try {
      const response = await dispatch(downloadReportFile(machineId, id, fileId));
      if (regEx.test(response.status)) {
        const blob = b64toBlob(encodeURI(response.data), 'application/pdf')
        const url = URL.createObjectURL(blob);
        setPDF(url);
      } else {
        enqueueSnackbar(response.statusText, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar( handleError( error ) || 'PDF open failed!', { variant: 'error' });
      setAttachedPDFViewerDialog(false);

    }
  };  

  const handleCustomerDialog = async (event, customerId) => {
    event.preventDefault(); 
    await dispatch(getCustomer(customerId));
    await dispatch(setCustomerDialog(true));
  };

  const handleMachineDialog = async ( event, MachineID ) => {
    event.preventDefault(); 
    await dispatch(getMachineForDialog(MachineID));
    await dispatch(setMachineDialog(true)); 
  };

  const handleSendToDraft = async () => {
    try {
      await dispatch(sendToDraftMachineServiceReportStatus(machineId, id));
      enqueueSnackbar('Service Report sent to draft successfully!');
    } catch (error) {
      enqueueSnackbar( handleError( error ) || 'Service Report send to draft failed!', { variant: 'error' });
    }
  };

  const Decoilers = defaultValues?.decoilers?.map(( dM ) => (
    <Chip 
      key={dM?._id}
      sx={{ m:0.2 }} 
      onClick={ ( event ) => handleMachineDialog( event, dM?._id ) }
      deleteIcon={<Iconify icon="fluent:open-12-regular"/>}
      onDelete={()=> {
        window.open(PATH_MACHINE.machines.view(dM?._id), '_blank');
      }}
      label={`${dM?.serialNo || ''} ${dM?.name  ? '-' : '' } ${dM?.name || ''} `} 
    />
  ));

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
            machineServiceReport?._id && handleEdit || undefined
          }
          onDelete={
            !machine?.isArchived &&
            machineServiceReport?.status?.name?.toUpperCase() === 'DRAFT' &&
            machineServiceReport?._id
              ? onDelete
              : undefined
          }
          backLink={handleBackLink}
          handleSendPDFEmail={ !machine?.isArchived && machineServiceReport?._id && handleSendEmail || undefined }
          handleViewPDF={ !machine?.isArchived && machineServiceReport?._id && handlePDFViewer || undefined }

          serviceReportStatus={
            ((machineServiceReport.isActive &&
              machineServiceReport?.status?.name?.toUpperCase() === 'SUBMITTED' &&
              machineServiceReport?.approval?.approvingContacts?.length > 0) ||
              machineServiceReport?.approval?.approvalHistory.length > 0) ?
              serviceReportApprovalData : null
          }
        />
        
        <Grid container>
          <FormLabel 
            content={`${defaultValues.serviceReportTemplateReportType || FORMLABELS.KEYDETAILS}`} 
            endingContent={`${defaultValues.serviceReportTemplate || ""}`} 
          />

          <ViewFormField 
            isLoading={isLoading} 
            variant='h4' 
            sm={4} 
            heading="Service Date" 
            param={fDate(defaultValues.serviceDate)} 
          />

          <ViewFormField
            isLoading={isLoading}
            variant="h4"
            sm={4}
            heading="Service ID"
            param={ defaultValues.serviceReportUID }
          />

          <ViewFormField
              isLoading={isLoading}
              variant="h4"
              sm={4}
              heading="Status"
              node={
                <>
                  <Typography
                    variant="h4"
                    sx={{
                      mr: 1,
                      color:
                        (machineServiceReport?.currentApprovalStatus === 'REJECTED' && 'red') ||
                        (machineServiceReport?.currentApprovalStatus === 'APPROVED' && 'green') ||
                        'inherit',
                    }}
                  >
                    {machineServiceReport?.currentApprovalStatus === 'PENDING'
                      ? (machineServiceReport?.status?.name && (
                          <ReportStatusButton
                            machineID={machineId}
                            iconButton
                            reportID={id}
                            status={machineServiceReport?.status}
                          />
                        )) ||
                        ''
                      : machineServiceReport?.currentApprovalStatus}
                  </Typography>
                  {!machine?.isArchived &&
                    machineServiceReport?.isActive && 
                    machineServiceReport?.currentApprovalStatus === 'REJECTED' && (
                      <IconButtonTooltip
                        title="Send to Draft"
                        icon="fluent:edit-arrow-back-16-regular"
                        onClick={handleSendToDraft}
                      />
                    )}
                  {!machine?.isArchived &&
                    machineServiceReport?.isActive &&
                    machineServiceReport?.status?.type?.toLowerCase() === 'done' &&
                    machineServiceReport?.currentApprovalStatus !== 'APPROVED' && (
                      <IconButtonTooltip
                        title="Request Approval"
                        icon="mdi:email-seal"
                        onClick={() => handleCompleteConfirm("sendEmail")}
                        sx={{ mt: 1 }}
                      />
                    )}
                  {!machine?.isArchived &&
                    machineServiceReport?.isActive &&
                    machineServiceReport?.status?.type?.toLowerCase() === 'done' && 
                    Array.isArray(machineServiceReport?.approval?.approvingContacts) &&
                    machineServiceReport?.approval?.approvingContacts?.length > 0 &&
                    machineServiceReport?.approval?.approvingContacts?.find(
                      (c) => c === user.contact
                    ) &&
                    machineServiceReport?.currentApprovalStatus !== 'APPROVED' && (
                      <IconButtonTooltip
                        title="Approve / Reject"
                        icon="mdi:list-status"
                        onClick={() => handleCompleteConfirm("evaluate")}
                      />
                    )}
                </>
              }
            />

          {( machineServiceReport?.currentApprovalStatus !== "PENDING" && machineServiceReport?.approval?.approvalHistory?.length > 0) ? (              
            <Grid container item md={12} >
              <ViewFormField
                sm={ 12 }
                isLoading={ isLoading } 
                heading={ `${machineServiceReport?.currentApprovalStatus === "REJECTED" ? "Rejection" : "Approval"} Comments` }
                param={ machineServiceReport?.approval?.approvalHistory[0]?.comments || "" }
              />
              <ServiceReportAuditLogs 
                data={ machineServiceReport?.approval?.approvalHistory?.[0] || {}}
              />
            </Grid>
          ) : null }

          <ViewFormField
            sm={ 4 }
            variant='h4'
            heading="Customer" 
            isLoading={ isLoading }
            node={ defaultValues?.customer && (
                <>
                <Link variant='h4' onClick={(event)=> handleCustomerDialog(event, defaultValues.customer?._id)} underline="none" sx={{ cursor: 'pointer'}}>
                  {defaultValues.customer?.name}
                </Link>
                  <OpenInNewPage onClick={()=> window.open( PATH_CRM.customers.view(defaultValues.customer?._id), '_blank' ) }/>
                </>
              )
            }
          />

          <ViewFormField
            isLoading={isLoading}
            sm={4}
            variant='h4'
            heading="Machine"
            node={ defaultValues?.customer && (
                <>
                  <Link 
                    variant='h4' 
                    onClick={(event)=> handleMachineDialog(event, defaultValues.machine?._id)} 
                    underline="none" 
                    sx={{ cursor: 'pointer'}}
                  >
                    {defaultValues.machine?.serialNo}
                  </Link>
                  <OpenInNewPage onClick={()=> window.open( PATH_MACHINE.machines.view(defaultValues.machine?._id), '_blank' ) }/>
                </>
              )
            }
          />
          <ViewFormField
            isLoading={isLoading}
            sm={4}
            heading="Decoilers"
            node={<Grid container>{Decoilers}</Grid>} 
          />
          <ViewNoteHistory label="Technician Notes" historicalData={machineServiceReport.technicianNotes} />

          { !machineServiceReport?.reportSubmition &&
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
              { slidesReporting?.map((file, _index) => (
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
          
          { machineServiceReport?.reportSubmition && 
            <>
              <FormLabel content={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />
              { defaultValues.textBeforeCheckItems &&
                typeof defaultValues.textBeforeCheckItems === "string" && 
                <ViewFormNoteField isLoading={isLoading} sm={12} param={defaultValues.textBeforeCheckItems} />
              }
              {!isLoadingCheckItems ? 
                <Grid item md={12} sx={{ overflowWrap: 'break-word' }}>
                  <Grid item md={12} sx={{display:'flex', flexDirection:'column'}}>
                  { machineServiceReportCheckItems?.checkItemLists?.map((row, index) => (
                      <CheckedItemValueRow
                        machineId={machineId}
                        value={row}
                        index={index}
                        key={row._id}
                      />
                    ))
                  }
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

              { defaultValues.textAfterCheckItems && 
                typeof defaultValues.textAfterCheckItems === "string" && 
                <ViewFormNoteField isLoading={isLoading} sm={12}  param={defaultValues.textAfterCheckItems} />
              }
            </>
          }
          {machineServiceReport?.serviceReportTemplate?.enableNote && <ViewNoteHistory label={`${machineServiceReport?.serviceReportTemplate?.reportType?.charAt(0).toUpperCase()||''}${machineServiceReport?.serviceReportTemplate?.reportType?.slice(1).toLowerCase()||''} Note`} historicalData={defaultValues.serviceNote} />}
          {machineServiceReport?.serviceReportTemplate?.enableMaintenanceRecommendations && <ViewNoteHistory label="Recommendation Note" historicalData={defaultValues.recommendationNote} />}
          {machineServiceReport?.serviceReportTemplate?.enableSuggestedSpares && <ViewNoteHistory label="Suggested Spares" historicalData={defaultValues.suggestedSpares} />}
          <ViewNoteHistory label="Internal Note" historicalData={defaultValues.internalNote} />
          <ViewNoteHistory label="Operator Notes" historicalData={defaultValues.operatorNotes} />
          { machineServiceReport?.reportSubmition &&
            <FormLabel content='Documents / Images' />
          }
          { machineServiceReport?.reportSubmition &&
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

          { slides?.map((file, _index) => (
            <DocumentGalleryItem isLoading={isLoading} key={file?._id} image={file} 
              onOpenLightbox={()=> handleOpenLightbox(_index)}
              onDownloadFile={()=> handleDownloadReportFile(file._id, file?.name, file?.extension)}
              onDeleteFile={()=> handleDeleteReportFile(file._id)}
              isArchived={ machine?.isArchived }
              toolbar
            />
          ))}

          { machineServiceReport?.files?.map((file, _index) => !file.fileType.startsWith("image") && (
              <DocumentGalleryItem isLoading={isLoading} key={file?._id} image={file} 
                onOpenFile={()=> handleOpenFile(file._id, file?.name, file?.extension)}
                onDownloadFile={()=> handleDownloadReportFile(file._id, file?.name, file?.extension)}
                onDeleteFile={()=> handleDeleteReportFile(file._id)}
                isArchived={ machine?.isArchived }
                toolbar
              />
            ))}

          { machineServiceReport?.status?.name?.toUpperCase() === 'DRAFT' && 
            <ThumbnailDocButton onClick={handleAddFileDialog} />
          }
        </Box>}
          
          <ViewFormAudit defaultValues={defaultValues} />

        </Grid>
      </Grid>
      {pdfViewerDialog && <PDFViewerDialog machineServiceReport={machineServiceReport} />}
      {sendEmailDialog && <SendEmailDialog fileName={fileName}/>}
      
      <DialogServiceReportComplete dialogType={reportApprovalDialogType}/>
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
