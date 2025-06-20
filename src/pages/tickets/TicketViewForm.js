import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Box, Dialog, Divider, Button, DialogTitle, Link } from '@mui/material';
import download from 'downloadjs';
import b64toBlob from 'b64-to-blob';
// redux
import { deleteTicket, resetTicket, getFile, deleteFile, updateTicketField } from '../../redux/slices/ticket/tickets';
// paths
import { PATH_SUPPORT, PATH_CRM, PATH_MACHINE } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { ThumbnailDocButton } from '../../components/Thumbnails';
import { DocumentGalleryItem } from '../../components/gallery/DocumentGalleryItem';
import FormLabel from '../../components/DocumentForms/FormLabel';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import { useAuthContext } from '../../auth/useAuthContext';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import TicketTabs from './TicketTabs';
import { handleError } from '../../utils/errorHandler';
import Lightbox from '../../components/lightbox/Lightbox';
import SkeletonPDF from '../../components/skeleton/SkeletonPDF';
import DialogTicketAddFile from '../../components/Dialog/DialogTicketAddFile';
import DropDownField from './utils/DropDownField';
import FilledTextField from './utils/FilledTextField';
import FilledEditorField from './utils/FilledEditorField';
import FilledDateField from './utils/FilledDateField';
import FilledTimeField from './utils/FilledTimeField';
import ViewFormSWitch from '../../components/ViewForms/ViewFormSwitch';
import { getCustomer, setCustomerDialog } from '../../redux/slices/customer/customer';
import { getMachineForDialog, setMachineDialog } from '../../redux/slices/products/machine';
import OpenInNewPage from '../../components/Icons/OpenInNewPage';
import DropDownMultipleSelection from './utils/DropDownMultipleSelection';
import { getAssignedSecurityUsers, resetAssignedSecurityUsers, getSecurityUsers, resetSecurityUser, getActiveSecurityUsers, resetActiveSecurityUsers } from '../../redux/slices/securityUser/securityUser';
import { resetComments } from '../../redux/slices/ticket/ticketComments/ticketComment';
import { resetHistories } from '../../redux/slices/ticket/ticketHistories/ticketHistory';
import { resetWorkLogs } from '../../redux/slices/ticket/ticketWorkLogs/ticketWorkLog';

export default function TicketViewForm() {
  const { ticket, ticketSettings, isLoading } = useSelector((state) => state.tickets);
  const { assignedUsers, securityUsers, activeSecurityUsers } = useSelector((state) => state.user);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userId } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const regEx = /^[^2]*/;
  const [selectedImage, setSelectedImage] = useState(-1);
  const [fileDialog, setFileDialog] = useState(false);
  const [slides, setSlides] = useState([]);
  const [reporters, setReporters] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [filteredRequestTypes, setFilteredRequestTypes] = useState([]);
  const configurations = JSON.parse(localStorage.getItem('configurations'));
  const prefix = configurations?.find((config) => config?.name?.toLowerCase() === 'ticket_prefix')?.value || '';

  // const defaultAsssignee = configurations.find((c) => c?.name?.trim() === 'DefaultSupportTicketAssignee'
  // )?.value?.split(',')?.map((e) => e.trim()?.toLowerCase());
  // const defaultApprover = configurations.find((c) => c?.name?.trim() === 'DefaultSupportTicketApprover'
  // )?.value?.split(',')?.map((e) => e.trim()?.toLowerCase());

  useEffect(() => {
    // CUSTOMER USERS
    const reportersList = [...assignedUsers];

    if (reportersList?.some(c => !c?._id?.toString() === ticket?.createdBy?._id)) {
      reportersList.unshift(ticket.createdBy);
    }

    if (reportersList?.some(c => !c?._id === userId)) {
      reportersList.unshift({ _id: userId, name: user?.displayName, email: user.email });
    }
    setReporters(reportersList);

  }, [assignedUsers, ticket, user, userId]);

  useEffect(() => {
    if (ticket?.customer?._id) {
      dispatch(getAssignedSecurityUsers({ customer: ticket?.customer?._id, isActive: true }));
    }

    const asssigneeRoleType = configurations.find((c) => c?.name?.trim() === 'SupportTicketAssigneeRoleType')?.value;
    const approverRoleType = configurations.find((c) => c?.name?.trim() === 'SupportTicketApproverRoleType')?.value;

    dispatch(getActiveSecurityUsers({ type: 'SP', roleType: asssigneeRoleType }));
    dispatch(getSecurityUsers({ type: 'SP', roleType: approverRoleType }));

    return () => {
      dispatch(resetSecurityUser());
      dispatch(resetActiveSecurityUsers());
      dispatch(resetAssignedSecurityUsers());

      dispatch(resetComments());
      dispatch(resetHistories());
      dispatch(resetWorkLogs());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, ticket?.customer?._id]);

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
    // APPROVING USERS
    let approversArray = [...securityUsers]?.sort((a, b) => {
      const nameA = a?.name?.toLowerCase();
      const nameB = b?.name?.toLowerCase();
      return nameA.localeCompare(nameB);
    })
    const approvingUsers = configurations?.find((c) => c?.name?.trim() === 'SupportTicketApprovingContacts'
    )?.value?.split(',')?.map((e) => e?.trim()?.toLowerCase());
    approversArray = approversArray?.filter((c) => c?.email && approvingUsers?.includes(c.email.toLowerCase()));
    setApprovers(approversArray)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [securityUsers])

  useEffect(() => {
    const newSlides = ticket?.files?.map(file => {
      const base64Thumbnail = `data:image/png;base64,${file.thumbnail}`;

      if (file?.fileType?.startsWith('image')) {
        return {
          type: 'image',
          thumbnail: base64Thumbnail,
          src: base64Thumbnail,
          downloadFilename: `${file?.name}.${file?.extension}`,
          name: file?.name,
          extension: file?.extension,
          fileType: file?.fileType,
          isLoaded: false,
          _id: file?._id,
          width: '100%',
          height: '100%',
        };
      }

      if (file?.fileType?.startsWith('video')) {
        return {
          type: 'video',
          sources: [{
            src: file?.src,
            type: file.fileType,
            playsInline: true,
            autoPlay: true,
            loop: true,
            muted: true,
            preload: 'auto',
          }],
          downloadFilename: `${file?.name}.${file?.extension}`,
          name: file?.name,
          extension: file?.extension,
          fileType: file?.fileType,
          isLoaded: false,
          _id: file?._id,
          width: '100%',
          height: '100%',
        };
      }

      return null;
    }).filter(Boolean);

    setSlides(newSlides || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket?.files]);

  const defaultValues = useMemo(
    () => ({
      ticketNo: id && ticket?.ticketNo && `${prefix || ''} - ${ticket?.ticketNo || ''}` || '',
      customer: id && ticket?.customer || '',
      machine: id && ticket?.machine || '',
      // issueType: id && ticket?.issueType?.name || '',
      // reporter: id && ticket?.reporter && { _id: ticket?.reporter?._id, name: `${ticket.reporter.firstName || ''} ${ticket.reporter.lastName || ''}` } || '',
      // assignee: id && ticket?.assignees && { _id: ticket?.assignee?._id, name: `${ticket.assignee.firstName || ''} ${ticket.assignee.lastName || ''}` } || null,
      // approvers: id && ticket?.approvers && approvers?.map( =>{ _id: ticket?.approver?._id, name: ticket?.approver.name }) || [],
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
      updatedIP: id && ticket?.updatedIP || '',
    }),
    [ticket, id, prefix]
  );

  const onSubmit = async (fieldName, value) => {
    try {
      await dispatch(updateTicketField(ticket?._id, fieldName, value));
      enqueueSnackbar(`Ticket updated successfully!`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(`Ticket update failed!`, { variant: 'error' });
      throw error
    }
  };

  const onArchive = async () => {
    try {
      await dispatch(deleteTicket(ticket?._id, true));
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
    if (!image?.isLoaded && (image?.fileType?.startsWith('image'))) {
      try {
        const response = await dispatch(getFile(id, image?._id));
        if (regEx.test(response.status)) {
          const base64 = response.data;
          const updatedSlides = [...slides];
          updatedSlides[index] = {
            ...image,
            src: `data:${image.fileType};base64,${base64}`,
            isLoaded: true
          };
          setSlides(updatedSlides);
        }
      } catch (error) {
        console.error('Error loading full file:', error);
        enqueueSnackbar('File loading failed!', { variant: 'error' });
      }
    }
  };

  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await dispatch(deleteFile(ticket?._id, fileId));
      enqueueSnackbar('File archived successfully');
    } catch (err) {
      console.log(err);
      enqueueSnackbar('File archive failed!', { variant: `error` });
    }
  };

  const handleDownloadFile = (fileId, fileName, fileExtension) => {
    const file = slides.find((item) => item._id === fileId);

    if (!file) {
      enqueueSnackbar("File not found.", { variant: "error" });
      return;
    }

    const isVideo = file.fileType?.startsWith("video");
    if (isVideo) {
      try {
        const signedUrl = file?.sources[0]?.src;
        window.open(signedUrl, "_blank");
        enqueueSnackbar("Video download started");
      } catch (error) {
        enqueueSnackbar("Video download failed!", { variant: "error" });
      }
    } else {
      dispatch(getFile(ticket?._id, fileId))
        .then((res) => {
          if (regEx.test(res.status)) {
            download(atob(res.data), `${fileName}.${fileExtension}`, { type: fileExtension });
            enqueueSnackbar("Download failed");
          }
        })
        .catch((err) => {
          enqueueSnackbar(handleError(err), { variant: `error` });
        });
    }
  };

  const [pdf, setPDF] = useState(null);
  const [PDFName, setPDFName] = useState('');
  const [PDFViewerDialog, setPDFViewerDialog] = useState(false);

  const handleOpenFile = async (fileId, fileName, fileExtension) => {
    setPDFName(`${fileName}.${fileExtension}`);
    setPDFViewerDialog(true);
    setPDF(null);
    try {
      const response = await dispatch(getFile(ticket?._id, fileId));
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

  const handleCustomerDialog = async (event, customerId) => {
    event.preventDefault();
    await dispatch(getCustomer(customerId));
    await dispatch(setCustomerDialog(true));
  };

  const handleMachineDialog = async (event, MachineID) => {
    event.preventDefault();
    await dispatch(getMachineForDialog(MachineID));
    await dispatch(setMachineDialog(true));
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
              node={<DropDownField name="issueType" iconButton label='Issue Type' value={{ ...(ticket?.issueType || {}), ticketNo: defaultValues.ticketNo }} onSubmit={onSubmit} options={ticketSettings?.issueTypes} />}
            />
            <ViewFormField isLoading={isLoading} sm={4} heading="Request Type"
              node={<DropDownField name="requestType" label='Request Type' value={ticket?.requestType} onSubmit={onSubmit} options={filteredRequestTypes} />}
            />
            <ViewFormField isLoading={isLoading} sm={2} heading="Status"
              node={<DropDownField name="status" isNullable label='Status' value={ticket?.status} onSubmit={onSubmit} options={ticketSettings?.statuses} />}
            />
            <ViewFormField isLoading={isLoading} sm={2} heading="Priority"
              node={<DropDownField name="priority" isNullable label='Priority' value={ticket?.priority} onSubmit={onSubmit} options={ticketSettings?.priorities} />}
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
            {/* <ViewFormField isLoading={isLoading} sm={4} heading="Status"
              node={<DropDownMultipleSelection name="status" label='Status' value={ticket?.status} onSubmit={onSubmit} options={ticketSettings?.statuses} multiple={false} isStatus/>}
            /> */}

            <ViewFormField sm={4} variant='h4' heading="Customer" isLoading={isLoading}
              node={defaultValues?.customer && (
                <>
                  <Link variant='h5' onClick={(event) => handleCustomerDialog(event, defaultValues.customer?._id)} underline="none" sx={{ cursor: 'pointer', fontWeight: 'normal' }}>
                    {defaultValues?.customer?.name}
                  </Link>
                  <OpenInNewPage onClick={() => window.open(PATH_CRM.customers.view(defaultValues.customer?._id), '_blank')} />
                </>
              )}
            />
            <ViewFormField isLoading={isLoading} sm={4} variant='h4' heading="Machine"
              node={defaultValues?.customer && (
                <>
                  <Link
                    variant='h5'
                    onClick={(event) => handleMachineDialog(event, defaultValues.machine?._id)}
                    underline="none"
                    sx={{ cursor: 'pointer', fontWeight: 'normal' }}
                  >
                    {`${defaultValues?.machine?.serialNo || ''} - ${defaultValues?.machine?.machineModel?.name || ''}`}
                  </Link>
                  <OpenInNewPage onClick={() => window.open(PATH_MACHINE.machines.view(defaultValues.machine?._id), '_blank')} />
                </>
              )}
            />
            {/* <ViewFormField isLoading={isLoading} sm={4} heading="Customer" param={defaultValues.customer} /> */}
            {/* <ViewFormField isLoading={isLoading} sm={4} heading="Machine" param={defaultValues.machine} /> */}
            <ViewFormField isLoading={isLoading} sm={2} heading="HLC"
              node={<FilledTextField name="hlc" value={defaultValues.hlc} onSubmit={onSubmit} />}
            />
            <ViewFormField isLoading={isLoading} sm={2} heading="PLC"
              node={<FilledTextField name="plc" value={defaultValues.plc} onSubmit={onSubmit} />}
            />
            <ViewFormField isLoading={isLoading} sm={4} heading="Raise ticket on behalf of / Reporter"
              node={<DropDownMultipleSelection name="reporter" isNullable label='Reporter' value={ticket?.reporter} onSubmit={onSubmit} options={reporters} multiple={false} />}
            />
            <ViewFormField isLoading={isLoading} sm={4} heading="Assignees"
              node={<DropDownMultipleSelection name="assignees" label='Assignees' value={ticket?.assignees} onSubmit={onSubmit} options={activeSecurityUsers} />}
            />
            <ViewFormField isLoading={isLoading} sm={4} heading="Approvers"
              node={<DropDownMultipleSelection name="approvers" label='Approvers' value={ticket?.approvers} onSubmit={onSubmit} options={approvers} />}
            />
            <ViewFormField isLoading={isLoading} sm={12} heading="Summary"
              node={<FilledTextField name="summary" value={defaultValues.summary} onSubmit={onSubmit} isBold />}
            />
            <ViewFormField isLoading={isLoading} sm={12} heading="Description"
              node={<FilledEditorField name="description" value={defaultValues.description} onSubmit={onSubmit} minRows={4} isEditor />}
            />
            <ViewFormField isLoading={isLoading} sm={10} heading="Fault"
              node={<DropDownMultipleSelection name="faults" label='Fault' value={ticket?.faults} options={ticketSettings?.faults} onSubmit={onSubmit} isStatus />}
            />
            <ViewFormField isLoading={isLoading} sm={2} heading="Impact"
              node={<DropDownField name="impact" isNullable label='Impact' value={ticket?.impact} options={ticketSettings?.impacts} onSubmit={onSubmit} />}
            />
            <Grid container sx={{ mt: 4 }}>
              <FormLabel content='Documents' />
            </Grid>
            <Box
              sx={{ mt: 2, width: '100%' }}
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
                  isLoading={isLoading}
                  key={file?._id}
                  image={file}
                  onOpenLightbox={() => handleOpenLightbox(_index)}
                  onDownloadFile={() => handleDownloadFile(file?._id, file?.name, file?.extension)}
                  onDeleteFile={() => handleDeleteFile(file?._id)}
                  toolbar
                  size={150}
                />
              ))}

              {Array.isArray(ticket?.files) && ticket?.files?.filter(f => !f.fileType.startsWith('image'))?.filter(f => !f.fileType.startsWith('video'))?.map((file, _index) =>
                <DocumentGalleryItem
                  key={file?._id}
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
                  isLoading={isLoading}
                  onDownloadFile={() => handleDownloadFile(file?._id, file?.name, file?.extension)}
                  onDeleteFile={() => handleDeleteFile(file?._id)}
                  onOpenFile={() => handleOpenFile(file?._id, file?.name, file?.extension)}
                  toolbar
                />
              )}
              <ThumbnailDocButton onClick={() => setFileDialog(true)} />
            </Box>

            <Lightbox
              index={selectedImage}
              slides={slides}
              open={selectedImage >= 0}
              close={handleCloseLightbox}
              onGetCurrentIndex={(index) => handleOpenLightbox(index)}
              disabledSlideshow
              disabledDownload
            />

            {ticket?.issueType?.name === 'Change Request' && (
              <>
                <ViewFormField isLoading={isLoading} sm={2} heading="Change Type"
                  node={<DropDownField name="changeType" isNullable label='Change Type' value={ticket?.changeType} options={ticketSettings?.changeTypes} onSubmit={onSubmit} />}
                />
                <ViewFormField isLoading={isLoading} sm={2} heading="Change Reason"
                  node={<DropDownField name="changeReason" isNullable label='Change Reason' value={ticket?.changeReason} options={ticketSettings?.changeReasons} onSubmit={onSubmit} />}
                />
                <ViewFormField isLoading={isLoading} sm={12} heading="Implementation Plan"
                  node={<FilledEditorField name="implementationPlan" value={defaultValues.implementationPlan} onSubmit={onSubmit} minRows={4} isEditor />}
                />
                <ViewFormField isLoading={isLoading} sm={12} heading="Backout Plan"
                  node={<FilledEditorField name="backoutPlan" value={defaultValues.backoutPlan} onSubmit={onSubmit} minRows={4} isEditor />}
                />
                <ViewFormField isLoading={isLoading} sm={12} heading="Test Plan"
                  node={<FilledEditorField name="testPlan" value={defaultValues.testPlan} onSubmit={onSubmit} minRows={4} isEditor />}
                />
              </>
            )}
            {['change_request', 'system_problem']?.includes(ticket?.issueType?.slug?.trim()?.toLowerCase()) && (
              <>
                <ViewFormField isLoading={isLoading} sm={4} heading="Investigation Reason"
                  node={<DropDownField name="investigationReason" isNullable label='Investigation Reason' value={ticket?.investigationReason} options={ticketSettings?.investigationReasons} onSubmit={onSubmit} />}
                />
                <ViewFormField isLoading={isLoading} sm={12} heading="Root Cause"
                  node={<FilledEditorField name="rootCause" value={defaultValues.rootCause} onSubmit={onSubmit} minRows={4} isEditor />}
                />
                <ViewFormField isLoading={isLoading} sm={12} heading="Workaround"
                  node={<FilledEditorField name="workaround" value={defaultValues.workaround} onSubmit={onSubmit} minRows={4} isEditor />}
                />
              </>
            )}
            {ticket?.issueType?.name?.trim()?.toLowerCase() === 'change request' && (
              <Grid container sx={{ pb: 3 }}>
                <ViewFormField isLoading={isLoading} sm={3} heading="Planned Start Date"
                  node={<FilledDateField name="plannedStartDate" value={defaultValues.plannedStartDate} onSubmit={onSubmit} />}
                />
                <ViewFormField isLoading={isLoading} sm={3} heading="Planned Start Time"
                  node={<FilledTimeField name="startTime" value={defaultValues.startTime} onSubmit={onSubmit} />}
                />
                <ViewFormField isLoading={isLoading} sm={3} heading="Planned End Date"
                  node={<FilledDateField name="plannedEndDate" value={defaultValues.plannedEndDate} onSubmit={onSubmit} />}
                />
                <ViewFormField isLoading={isLoading} sm={3} heading="Planned End Time"
                  node={<FilledTimeField name="endTime" value={defaultValues.endTime} onSubmit={onSubmit} />}
                />
              </Grid>
            )}

            <Grid sx={{ pt: 2, alignSelf: 'flex-end', xs: 4 }}>
              <ViewFormSWitch
                isLoading={isLoading}
                shareWithHeading="Shared With Organization"
                shareWith={shareWith}
                onChange={handleShareWithChange}
                isEditable
              />
            </Grid>

            <Grid sx={{ pt: 2, alignSelf: 'flex-end' }}>
              <ViewFormSWitch isLoading={isLoading}
                isActiveHeading="Active"
                isActive={isActive}
                onChange={handleIsActiveChange}
                isEditable
              />
            </Grid>
          </Grid>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Card>
      <Card sx={{ mt: 2 }}>
        <TicketTabs />
      </Card>
      {fileDialog && <DialogTicketAddFile open={fileDialog} handleClose={() => setFileDialog(false)} />}
      {PDFViewerDialog && (
        <Dialog fullScreen open={PDFViewerDialog} onClose={() => setPDFViewerDialog(false)}>
          <DialogTitle variant='h3' sx={{ pb: 1, pt: 2, display: 'flex', justifyContent: 'space-between' }}>
            PDF View
            <Button variant='outlined' onClick={() => setPDFViewerDialog(false)}>Close</Button>
          </DialogTitle>
          <Divider variant='fullWidth' />
          {pdf ? (
            <iframe title={PDFName} src={pdf} style={{ paddingBottom: 10 }} width='100%' height='842px' />
          ) : (
            <SkeletonPDF />
          )}
        </Dialog>
      )}
    </>
  );
}
