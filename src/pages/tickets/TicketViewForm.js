import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Box, Dialog, Divider, Button, DialogTitle } from '@mui/material';
import download from 'downloadjs';
import b64toBlob from 'b64-to-blob';
// redux
import { deleteTicket, resetTicket, getFile, deleteFile, updateTicketField } from '../../redux/slices/ticket/tickets';
// paths
import { PATH_SUPPORT } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { ThumbnailDocButton } from '../../components/Thumbnails';
import { DocumentGalleryItem } from '../../components/gallery/DocumentGalleryItem';
import FormLabel from '../../components/DocumentForms/FormLabel';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import { useAuthContext } from '../../auth/useAuthContext';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import TicketComments from './TicketComments';
import { handleError } from '../../utils/errorHandler';
import Lightbox from '../../components/lightbox/Lightbox';
import SkeletonPDF from '../../components/skeleton/SkeletonPDF';
import DialogTicketAddFile from '../../components/Dialog/DialogTicketAddFile';
import DropDownField from './utils/DropDownField';
import FilledTextField from './utils/FilledTextField';
import FilledDateField from './utils/FilledDateField';
import FilledTimeField from './utils/FilledTimeField';
import ViewFormSWitch from '../../components/ViewForms/ViewFormSwitch';
import DropDownMultipleSelection from './utils/DropDownMultipleSelection';
import { getContact, getCustomerContacts, getActiveSPContacts, resetContact, resetCustomersContacts, resetActiveSPContacts } from '../../redux/slices/customer/contact';
import { resetComments } from '../../redux/slices/ticket/ticketComments/ticketComment';
import { resetHistories } from '../../redux/slices/ticket/ticketHistories/ticketHistory';

export default function TicketViewForm() {
  const { ticket, ticketSettings, isLoading } = useSelector((state) => state.tickets);
  const { contact, customersContacts, activeSpContacts } = useSelector((state) => state.contact);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userId } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const regEx = /^[^2]*/;
  const [ selectedImage, setSelectedImage ] = useState(-1);
  const [ fileDialog, setFileDialog ] = useState( false );
  const [ slides, setSlides ] = useState([]);
  const [ approvers, setApprovers ] = useState([]);
  const [ reportersList, setReportersList ] = useState([]);
  const [filteredRequestTypes, setFilteredRequestTypes] = useState([]);
  const configurations = JSON.parse(localStorage.getItem('configurations'));
  const prefix = configurations?.find((config) => config?.name?.toLowerCase() === 'ticket_prefix')?.value || '';

  useEffect(() => {
    if (Array.isArray(customersContacts)) {
      const updatedReportersList = [...customersContacts];

      if (ticket?.createdBy?.contact?._id && !updatedReportersList.some(c => c?._id === ticket?.createdBy?.contact?._id)) {
        updatedReportersList.unshift(ticket.createdBy.contact);
      }

      if (contact?._id && !updatedReportersList.some(c => c?._id === contact?._id)) {
        updatedReportersList.unshift(contact);
      }

      setReportersList(updatedReportersList);

    }
  }, [ customersContacts, ticket, contact ]);

  useEffect(() => {
    if (ticket?.customer?._id) {
      dispatch(getCustomerContacts( ticket?.customer?._id ));
    }
    dispatch(getActiveSPContacts());
    dispatch(getContact( user?.customer, user?.contact ));

    return () => {
      dispatch(resetContact());
      dispatch(resetCustomersContacts());
      dispatch(resetActiveSPContacts());
      dispatch(resetComments());
      dispatch(resetHistories());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ dispatch, ticket?.customer?._id ]);
  
  useEffect(() => {
    if (ticketSettings?.requestTypes && ticket?.issueType) {  
      const filtered = ticketSettings.requestTypes.filter(
        (requestType) => requestType.issueType._id === ticket.issueType._id 
      );
      setFilteredRequestTypes(filtered);
    } else {
      setFilteredRequestTypes([]); 
    }
  }, [ticketSettings?.requestTypes, ticket?.issueType]);

  useEffect(() => { 

    if (configurations?.length > 0 && activeSpContacts?.length > 0) {
      let approvingContactsArray = [];

      const approvingContactsConfig = configurations.find(
        (config) => config?.name?.trim()?.toLowerCase() === 'approving_contacts'
      );

      if (approvingContactsConfig?.value) {
        const configEmails = approvingContactsConfig.value
        ?.split(',')
        ?.map((email) => email.trim()?.toLowerCase());

        approvingContactsArray = activeSpContacts
          ?.map((activeSpUser) => activeSpUser?.contact)
          ?.filter((c) => c?.email && configEmails.includes(c.email.toLowerCase()))
          ?.sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            return nameA.localeCompare(nameB);
          });
      } else {
        approvingContactsArray = activeSpContacts?.map((activeSpUser) => activeSpUser.contact);
      }
      setApprovers(approvingContactsArray)
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ activeSpContacts ])
  
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

  
  // const handleEdit = () => {
  //   navigate(PATH_SUPPORT.supportTickets.edit(ticket._id));
  // };
 
  const defaultValues = useMemo(
    () => ({
      ticketNo: id && `${prefix || ''} - ${ticket?.ticketNo || ''}` || '',
      customer: id && ticket?.customer?.name || '',
      machine: id && `${ticket?.machine?.serialNo || ''} - ${ticket?.machine?.machineModel?.name || ''}` || '',
      // issueType: id && ticket?.issueType?.name || '',
      reporter: id && ticket?.reporter && { _id: ticket?.reporter?._id, name: `${ticket.reporter.firstName || ''} ${ticket.reporter.lastName || ''}` } || '',
      assignee: id && ticket?.assignee && { _id: ticket?.assignee?._id, name: `${ticket.assignee.firstName || ''} ${ticket.assignee.lastName || ''}` } || null,
      // approvers: id && ticket?.approvers && approvers?.map{ _id: ticket?.assignee?._id, name: `${ticket.assignee.firstName || ''} ${ticket.assignee.lastName || ''}` } || '',
      summary: id && ticket?.summary || '',
      description: id && ticket?.description || '',
      files: id && ticket?.files || [],
      hlc: id && ticket?.hlc || '',
      plc: id && ticket?.plc || '',
      // priority: id && ticket?.priority?.name || '',
      // status: id && ticket?.status?.name || '',
      // impact: id && ticket?.impact?.name || '',
      shareWith: id && ticket?.shareWith,
      // changeType: id && ticket?.changeType?.name || '',
      // changeReason: id && ticket?.changeReason?.name || '',
      implementationPlan: id && ticket?.implementationPlan || '',
      backoutPlan: id && ticket?.backoutPlan || '',
      testPlan: id && ticket?.testPlan || '',
      // investigationReason: id && ticket?.investigationReason?.name || '',
      rootCause: id && ticket?.rootCause || '',
      workaround: id && ticket?.workaround || '',
      plannedStartDate: ticket?.plannedStartDate || null,
      startTime: ticket?.startTime || null,
      plannedEndDate: ticket?.plannedEndDate || null,
      endTime: ticket?.endTime || null,
      isActive: id && ticket?.isActive,
      createdByFullName: id && ticket?.createdBy?.name || '',
      createdAt: id && ticket?.createdAt || '',
      createdIP: id && ticket?.createdIP || '',
      updatedByFullName: id && ticket?.updatedBy?.name || '',
      updatedAt: id && ticket?.updatedAt || '',
      updatedIP:  id && ticket?.updatedIP || '',
    }),
    [ ticket, id, prefix ]
  );

  const onSubmit = async (fieldName, value) => {
    try {
      await dispatch(updateTicketField(id, fieldName, value)); 
      enqueueSnackbar(`Ticket updated successfully!`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(`Ticket update failed!`, { variant: 'error' });
      throw error
    }
  };

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
  
  const [shareWith, setShareWith] = useState(defaultValues.shareWith); 
  const [isActive, setIsActive] = useState(defaultValues.isActive); 

  useEffect(() => {
    setShareWith(defaultValues.shareWith); 
  }, [defaultValues.shareWith]);

  const handleShareWithChange = (event) => {
    setShareWith(event.target.checked);
    onSubmit('shareWith', event.target.checked); 
  };

  useEffect(() => {
    setIsActive(defaultValues.isActive); 
  }, [defaultValues.isActive]);

  const handleIsActiveChange = (event) => {
    setIsActive(event.target.checked);
    onSubmit('isActive', event.target.checked); 
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
            // handleEdit={handleEdit}
            onArchive={onArchive}
          />
          <Grid container >
            <ViewFormField isLoading={isLoading} sm={4} heading="Ticket No."
              node={<DropDownField name="issueType" iconButton label='Issue Type' value={{ ...(ticket?.issueType || {}), ticketNo: defaultValues.ticketNo }} onSubmit={onSubmit} options={ ticketSettings?.issueTypes } />}
            />
             <ViewFormField isLoading={isLoading} sm={4} heading="Request Type"
              node={<DropDownField name="requestType" label='Request Type' value={ticket?.requestType} onSubmit={onSubmit} options={ filteredRequestTypes } />}
            />
            {/* <ViewFormField isLoading={isLoading} sm={4} heading=""
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
                  <Typography sx={{ marginLeft: 0.5 }}>{defaultValues.ticketNo || ''}</Typography>
                </Box>
              }
            /> */}
            <ViewFormField isLoading={isLoading} sm={2} heading="Status"
              node={<DropDownField name="status" label='Status' value={ticket?.status} onSubmit={onSubmit} options={ ticketSettings?.statuses} />}
            />
            <ViewFormField isLoading={isLoading} sm={2} heading="Priority"
              node={<DropDownField name="priority" isNullable label='Priority' value={ticket?.priority} onSubmit={onSubmit} options={ticketSettings?.priorities} />}
            />
            <ViewFormField isLoading={isLoading} sm={4} heading="Customer" param={defaultValues.customer} />
            <ViewFormField isLoading={isLoading} sm={4} heading="Machine" param={defaultValues.machine} />
            <ViewFormField isLoading={isLoading} sm={2} heading="HLC" 
              node={<FilledTextField name="hlc" value={defaultValues.hlc} onSubmit={onSubmit} />}
            />
            <ViewFormField isLoading={isLoading} sm={2} heading="PLC" 
              node={<FilledTextField name="plc" value={defaultValues.plc} onSubmit={onSubmit}  />}
            />
            <ViewFormField isLoading={isLoading} sm={4} heading="Raise ticket on behalf of / Reporter" 
              node={<DropDownMultipleSelection name="reporter" isNullable label='Reporter' value={ticket?.reporter} onSubmit={onSubmit} options={reportersList} multiple={false} />} 
            />
            <ViewFormField isLoading={isLoading} sm={4} heading="Assignee" 
              node={<DropDownMultipleSelection name="assignee" isNullable label='Assignee' value={ticket?.assignee} onSubmit={onSubmit} options={activeSpContacts} multiple={false} />}
            />
            <ViewFormField isLoading={isLoading} sm={4} heading="Approvers" 
              node={<DropDownMultipleSelection name="approvers" label='Approvers' value={ticket?.approvers} onSubmit={onSubmit} options={ approvers } />}
            />
            <ViewFormField isLoading={isLoading} sm={12} heading="Summary"
              node={<FilledTextField name="summary" value={defaultValues.summary} onSubmit={onSubmit}  />}
            />
            <ViewFormField isLoading={isLoading} sm={12} heading="Description"
              node={<FilledTextField name="description" value={defaultValues.description} onSubmit={onSubmit} minRows={4}  />}
            />
                  <Grid container sx={{ mt:4 }}>
                    <FormLabel content='Documents' />
                  </Grid>
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
                          onDownloadFile={()=> handleDownloadFile( file?._id, file?.name, file?.extension)}
                          onDeleteFile={()=> handleDeleteFile( file?._id)}
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
                              onDownloadFile={()=> handleDownloadFile( file?._id, file?.name, file?.extension)}
                              onDeleteFile={()=> handleDeleteFile( file?._id)}
                              onOpenFile={()=> handleOpenFile( file?._id, file?.name, file?.extension)}
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
            <ViewFormField isLoading={isLoading} sm={4} heading="Impact"
              node={<DropDownField name="impact" isNullable label='Impact' value={ticket?.impact} options={ticketSettings?.impacts} onSubmit={onSubmit}  />} 
            />
            {ticket?.issueType?.name === 'Change Request' && (
              <>
                <ViewFormField isLoading={isLoading} sm={4} heading="Change Type"
                  node={<DropDownField name="changeType" isNullable label='Change Type' value={ticket?.changeType} options={ticketSettings?.changeTypes} onSubmit={onSubmit}  />} 
                />
                <ViewFormField isLoading={isLoading} sm={4} heading="Change Reason" 
                  node={<DropDownField name="changeReason" isNullable label='Change Reason' value={ticket?.changeReason} options={ticketSettings?.changeReasons} onSubmit={onSubmit} />} 
                />
                <ViewFormField isLoading={isLoading} sm={12} heading="Implementation Plan"
                  node={<FilledTextField name="implementationPlan" value={defaultValues.implementationPlan} onSubmit={onSubmit} minRows={4}  />}
                />
                <ViewFormField isLoading={isLoading} sm={12} heading="Backout Plan"
                  node={<FilledTextField name="backoutPlan" value={defaultValues.backoutPlan} onSubmit={onSubmit} minRows={4}  />}
                />
                <ViewFormField isLoading={isLoading} sm={12} heading="Test Plan"
                  node={<FilledTextField name="testPlan" value={defaultValues.testPlan} onSubmit={onSubmit} minRows={4}  />}
                />
              </>
            )}
            {ticket?.issueType?.name?.trim()?.toLowerCase() === 'service request' && (
              <>
                <ViewFormField isLoading={isLoading} sm={6} heading="Investigation Reason" 
                  node={<DropDownField name="investigationReason" isNullable label='Investigation Reason' value={ticket?.investigationReason} options={ticketSettings?.investigationReasons} onSubmit={onSubmit}  />}
                />
                <ViewFormField isLoading={isLoading} sm={12} heading="Root Cause"
                  node={<FilledTextField name="rootCause" value={defaultValues.rootCause} onSubmit={onSubmit} minRows={4} />}
                />
                <ViewFormField isLoading={isLoading} sm={12} heading="Workaround"
                  node={<FilledTextField name="workaround" value={defaultValues.workaround} onSubmit={onSubmit} minRows={4} />}
                />
              </>
            )}
            {ticket?.issueType?.name?.trim()?.toLowerCase() === 'change request' && (
              <Grid container  sx={{pb: 3 }}>
                <ViewFormField isLoading={isLoading} sm={3} heading="Planned Start Date" 
                  node={<FilledDateField name="plannedStartDate" value={ defaultValues.plannedStartDate } onSubmit={onSubmit} />}
                />
                <ViewFormField isLoading={isLoading} sm={3} heading="Planned Start Time" 
                  node={<FilledTimeField name="startTime" value={ defaultValues.startTime } onSubmit={onSubmit} />}
                />
                <ViewFormField isLoading={isLoading} sm={3} heading="Planned End Date" 
                  node={<FilledDateField name="plannedEndDate" value={ defaultValues.plannedEndDate } onSubmit={onSubmit} />}
                />
                <ViewFormField isLoading={isLoading} sm={3} heading="Planned End Time" 
                  node={<FilledTimeField name="endTime" value={ defaultValues.endTime } onSubmit={onSubmit} />}
                />
              </Grid>
            )}
            <ViewFormSWitch isLoading={isLoading} sm={4}
              shareWithHeading="Shared With Organization"
              shareWith={shareWith} 
              onChange={handleShareWithChange}
              isEditable 
            />
            <ViewFormSWitch isLoading={isLoading} sm={4}
              isActiveHeading="Active"
              isActive={isActive} 
              onChange={handleIsActiveChange}
              isEditable 
            />
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
