import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Box, Typography, Dialog, Divider, Button, DialogTitle } from '@mui/material';
import download from 'downloadjs';
import b64toBlob from 'b64-to-blob';
// redux
import { deleteTicket, resetTicket, getFile, deleteFile } from '../../redux/slices/ticket/tickets';
// paths
import { PATH_SUPPORT } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { ThumbnailDocButton } from '../../components/Thumbnails';
import { DocumentGalleryItem } from '../../components/gallery/DocumentGalleryItem';
import FormLabel from '../../components/DocumentForms/FormLabel';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import Iconify from '../../components/iconify';
import { useAuthContext } from '../../auth/useAuthContext';
import { StyledTooltip } from '../../theme/styles/default-styles';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import TicketComments from './TicketComments';
import { handleError } from '../../utils/errorHandler';
import Lightbox from '../../components/lightbox/Lightbox';
import SkeletonPDF from '../../components/skeleton/SkeletonPDF';
import DialogTicketAddFile from '../../components/Dialog/DialogTicketAddFile';



export default function TicketViewForm() {
  const { ticket, isLoading } = useSelector((state) => state.tickets);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userId } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const regEx = /^[^2]*/;
  const [ selectedImage, setSelectedImage ] = useState(-1);
  const [ fileDialog, setFileDialog ] = useState( false );
  const [ slides, setSlides ] = useState([]);

    useEffect(() => {
        const newSlides = ticket?.files?.map((file) => {
            if (file?.fileType && file.fileType.startsWith("image")) {
              return{
                thumbnail: `data:image/png;base64, ${file.thumbnail}`,
                src: `data:image/png;base64, ${file.thumbnail}`,
                downloadFilename: `${file?.name}.${file?.extension}`,
                name: file?.name,
                extension: file?.extension,
                fileType: file?.fileType,
                isLoaded: false,
                _id: file?._id,
                width: '100%',
                height: '100%',
              }
            }
            return null;
        })?.filter(Boolean) 
        setSlides(newSlides || [] );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ ticket?.files?.length ]);

  
  const handleEdit = () => {
    navigate(PATH_SUPPORT.supportTickets.edit(ticket._id));
  };

  const defaultValues = useMemo(
    () => ({
      ticketNo: id && ticket?.ticketNo || '',
      customer: id && ticket?.customer?.name || '',
      machine: id && `${ticket?.machine?.serialNo || ''} - ${ticket?.machine?.machineModel?.name || ''}` || '',
      issueType: id && ticket?.issueType?.name || '',
      // reporter: id && `${ticket.reporter?.firstName || ''} ${ticket.reporter?.lastName || ''}` || '',
      reporter: id && ticket?.reporter && `${ticket.reporter.firstName || ''} ${ticket.reporter.lastName || ''}` || '',
      summary: id && ticket?.summary || '',
      description: id && ticket?.description || '',
      files: id && ticket?.files || [],
      hlcPlc: id && `${ticket?.hlc || ' - - '} / ${ticket?.plc || ' - - '}` || '',
      priority: id && ticket?.priority?.name || '',
      status: id && ticket?.status?.name || '',
      impact: id && ticket?.impact?.name || '',
      shareWith: id && ticket?.shareWith,
      changeType: id && ticket?.changeType?.name || '',
      changeReason: id && ticket?.changeReason?.name || '',
      implementationPlan: id && ticket?.implementationPlan || '',
      backoutPlan: id && ticket?.backoutPlan || '',
      testPlan: id && ticket?.testPlan || '',
      investigationReason: id && ticket?.investigationReason?.name || '',
      rootCause: id && ticket?.rootCause || '',
      workaround: id && ticket?.workaround || '',
      isActive: id && ticket?.isActive || '',
      createdByFullName: id && ticket?.createdBy?.name || '',
      createdAt: id && ticket?.createdAt || '',
      createdIP: id && ticket?.createdIP || '',
      updatedByFullName: id && ticket?.updatedBy?.name || '',
      updatedAt: id && ticket?.updatedAt || '',
      updatedIP:  id && ticket?.updatedIP || '',
    }),
    [ ticket, id ]
  );

  const onArchive = async () => {
    try {
      await dispatch(deleteTicket(id, true));
      enqueueSnackbar('Ticket Archived Successfully!', { variant: 'success' });
      navigate(PATH_SUPPORT.supportTickets.root);
      dispatch(resetTicket());
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      console.error('Error:', error);
    }
  };


  //  ---------------------------------- Files Helper ------------------------------------------

  const handleOpenLightbox = async (index) => {
    setSelectedImage(index);
    const image = slides[index];
    if(!image?.isLoaded && image?.fileType?.startsWith('image')){
      try {
        const response = await dispatch(getFile( id, image?._id));
        if (regEx.test(response.status)) {
          const updatedSlides = [ ...slides.slice(0, index),
            {
              ...slides[index],
              src: `data:image/png;base64, ${response.data}`,
              isLoaded: true,
            },...slides.slice(index + 1),
          ];
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

  const handleDeleteFile = async ( fileId ) => {
    try {
      await dispatch(deleteFile( id, fileId ));
      enqueueSnackbar('File archived successfully');
    } catch (err) {
      console.log(err);
      enqueueSnackbar('File archive failed!', { variant: `error` });
    }
  };

  const handleDownloadFile = ( fileId, fileName, fileExtension) => {
    dispatch(getFile( id, fileId))
      .then((res) => {
        if (regEx.test(res.status)) {
          download(atob(res.data), `${fileName}.${fileExtension}`, { type: fileExtension });
          enqueueSnackbar(res.statusText);
        } else {
          enqueueSnackbar(res.statusText, { variant: `error` });
        }
      })
      .catch((err) => {
          enqueueSnackbar( handleError( err ), { variant: `error` });
      });
  };

  const [pdf, setPDF] = useState(null);
  const [PDFName, setPDFName] = useState('');
  const [PDFViewerDialog, setPDFViewerDialog] = useState(false);

  const handleOpenFile = async ( fileId, fileName, fileExtension ) => {
    setPDFName(`${fileName}.${fileExtension}`);
    setPDFViewerDialog(true);
    setPDF(null);
    try {
      const response = await dispatch(getFile( id, fileId));
      if (regEx.test(response.status)) {
        const blob = b64toBlob(encodeURI(response.data), 'application/pdf')
        const url = URL.createObjectURL(blob);
        setPDF(url);
      } else {
        enqueueSnackbar(response.statusText, { variant: 'error' });
      }
    } catch (error) {
      if (error.message) {
        enqueueSnackbar(error.message, { variant: 'error' });
      } else {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
      }
    }
  };


  return (
    <>
      <Card sx={{ p: 2 }}>
        <Grid>
          <ViewFormEditDeleteButtons
            backLink={() => {
              dispatch(resetTicket());
              navigate(PATH_SUPPORT.supportTickets.root);
            }}
            shareWith={defaultValues.shareWith}
            handleEdit={handleEdit}
            onArchive={onArchive}
          />
          <Grid container >
            <ViewFormField isLoading={isLoading} sm={4} heading="Ticket No."
              param={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {ticket?.issueType?.icon ? (
                    <StyledTooltip
                      placement="top"
                      title={ticket?.issueType?.name}
                      tooltipcolor={ticket.issueType.color}
                    >
                      <Iconify icon={ticket.issueType.icon} style={{ width: 25, height: 25, color: ticket.issueType.color }} />
                    </StyledTooltip>
                  ) : null}
                  <Typography sx={{ marginLeft: 0.5 }}>{`  ${ticket?.ticketNo || ''}`}</Typography>
                </Box>
              }
            />
            <ViewFormField
              isLoading={isLoading} sm={4} heading="Status"
              param={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {ticket?.status?.icon ? (
                    <StyledTooltip
                     placement="top"
                     title={ticket?.status?.name}
                     tooltipcolor={ticket.status.color}
                    >
                    <Iconify icon={ticket.status.icon} style={{ width: 25, height: 25, color: ticket.status.color }} />
                    </StyledTooltip>
                  ) : null}
                  {/* <Typography sx={{ marginLeft: 0.5 }}>{ticket?.status?.name}</Typography> */}
                </Box>
              }
            />
            <ViewFormField
              isLoading={isLoading} sm={4} heading="Priority"
              param={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {ticket?.priority?.icon ? (
                    <StyledTooltip
                     placement="top"
                     title={ticket?.priority?.name}
                     tooltipcolor={ticket.priority.color}
                    >
                    <Iconify icon={ticket.priority.icon} style={{ width: 25, height: 25, color: ticket.priority.color }} />
                    </StyledTooltip>
                  ) : null}
                  {/* <Typography sx={{ marginLeft: 0.5 }}>{ticket?.priority?.name}</Typography> */}
                </Box>
              }
            />
            <ViewFormField isLoading={isLoading} sm={4} heading="Customer" param={defaultValues.customer} />
            <ViewFormField isLoading={isLoading} sm={4} heading="Machine" param={defaultValues.machine} />
            <ViewFormField isLoading={isLoading} sm={4} heading="HLC/PLC" param={defaultValues.hlcPlc}/>
            <ViewFormField isLoading={isLoading} sm={4} heading="Reporter" param={defaultValues.reporter}/>
            <ViewFormField isLoading={isLoading} sm={4} heading="Assignee" />
            <ViewFormField isLoading={isLoading} sm={4} heading="Approvers" />
            <ViewFormField isLoading={isLoading} sm={12} heading="Summary" param={defaultValues.summary} />
            <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues.description} />
            {/* <ViewFormField isLoading={isLoading} sm={12} heading="Files" param={defaultValues.files} /> */}

                    <FormLabel content='Documents' />
                    <Box
                      sx={{mt:2, width:'100%'}}
                      gap={1}
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
                        <DocumentGalleryItem 
                          isLoading={ isLoading } 
                          key={file?._id} 
                          image={file} 
                          onOpenLightbox={()=> handleOpenLightbox(_index)}
                          onDownloadFile={()=> handleDownloadFile( file._id, file?.name, file?.extension)}
                          onDeleteFile={()=> handleDeleteFile( file._id)}
                          toolbar
                          size={150}
                        />
                      ))}
            
                      { ticket?.files?.map((file, _index) =>  
                          {
                            if(!file.fileType.startsWith('image')){
                              return <DocumentGalleryItem key={file?._id} 
                              image={{
                                thumbnail: `data:image/png;base64, ${file.thumbnail}`,
                                src: `data:image/png;base64, ${file.thumbnail}`,
                                downloadFilename: `${file?.name}.${file?.extension}`,
                                name: file?.name,
                                fileType: file?.fileType,
                                extension: file?.extension,
                                isLoaded: false,
                                id: file?._id,
                                width: '100%',
                                height: '100%',
                              }} 
                              isLoading={ isLoading } 
                              onDownloadFile={()=> handleDownloadFile( file._id, file?.name, file?.extension)}
                              onDeleteFile={()=> handleDeleteFile( file._id)}
                              onOpenFile={()=> handleOpenFile( file._id, file?.name, file?.extension)}
                              toolbar
                              />
                            }
                            return null;
                          }
                      )}
                      <ThumbnailDocButton onClick={ () => setFileDialog(true) } />
                    </Box>
                    
                    <Lightbox
                      index={selectedImage}
                      slides={slides}
                      open={selectedImage >= 0}
                      close={handleCloseLightbox}
                      onGetCurrentIndex={(index) => handleOpenLightbox(index)}
                      disabledSlideshow
                    />
            <ViewFormField isLoading={isLoading} sm={4} heading="Impact" param={defaultValues.impact} />
            {ticket?.issueType?.name === 'Change Request' && (
              <>
                <ViewFormField isLoading={isLoading} sm={4} heading="Change Type" param={defaultValues.changeType} />
                <ViewFormField isLoading={isLoading} sm={4} heading="Change Reason" param={defaultValues.changeReason} />
                <ViewFormField isLoading={isLoading} sm={12} heading="Implementation Plan" param={defaultValues.implementationPlan} />
                <ViewFormField isLoading={isLoading} sm={12} heading="Backout Plan" param={defaultValues.backoutPlan} />
                <ViewFormField isLoading={isLoading} sm={12} heading="Test Plan" param={defaultValues.testPlan} />
              </>
            )}
            {ticket?.issueType?.name === 'Service Request' && (
              <>
                <ViewFormField isLoading={isLoading} sm={6} heading="Investigation Reason" param={defaultValues.investigationReason} />
                <ViewFormField isLoading={isLoading} sm={12} heading="Root Cause" param={defaultValues.rootCause} />
                <ViewFormField isLoading={isLoading} sm={12} heading="Workaround" param={defaultValues.workaround} />
              </>
            )}
          </Grid>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Card>
      <Card sx={{ mt: 2 }}>
        <TicketComments currentUser={{ ...user, userId }} />
      </Card>
      {fileDialog  && <DialogTicketAddFile open={ fileDialog } handleClose={ () => setFileDialog(false) } />}
      {PDFViewerDialog && (
        <Dialog fullScreen open={PDFViewerDialog} onClose={()=> setPDFViewerDialog(false)}>
          <DialogTitle variant='h3' sx={{pb:1, pt:2, display:'flex', justifyContent:'space-between'}}>
              PDF View
                <Button variant='outlined' onClick={()=> setPDFViewerDialog(false)}>Close</Button>
          </DialogTitle>
          <Divider variant='fullWidth' />
            {pdf?(
                <iframe title={PDFName} src={pdf} style={{paddingBottom:10}} width='100%' height='842px'/>
              ):(
                <SkeletonPDF />
              )}
        </Dialog>
      )}
    </>
  );
}
