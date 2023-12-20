import PropTypes from 'prop-types';
import {  useMemo, useEffect, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import download from 'downloadjs';
import {
  Grid,
  Card,
  Link,
  Chip
} from '@mui/material';
import { ThumbnailDocButton } from '../../components/Thumbnails'
import { StyledVersionChip } from '../../../theme/styles/default-styles';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

import {
  getDocumentHistory,
  resetDocument,
  setDocumentFormVisibility,
  setDocumentHistoryAddFilesViewFormVisibility,
  setDocumentHistoryNewVersionFormVisibility,
  setDocumentAddFilesViewFormVisibility,
  setDocumentNewVersionFormVisibility,
  getDocument,
  deleteDocument,
  setDocumentHistoryViewFormVisibility,
  setDocumentEditFormVisibility,
  setDocumentViewFormVisibility,
  setDocumentVersionEditDialogVisibility,
} from '../../../redux/slices/document/document';
import { deleteDrawing, getDrawings, resetDrawings, 
  setDrawingEditFormVisibility, setDrawingViewFormVisibility } from '../../../redux/slices/products/drawing';

import { getCustomer, resetCustomer, setCustomerDialog} from '../../../redux/slices/customer/customer';
import { getMachineForDialog, resetMachine, setMachineDialog } from '../../../redux/slices/products/machine';
import { Thumbnail } from '../../components/Thumbnails/Thumbnail';
import FormLabel from '../../components/DocumentForms/FormLabel';
import DocumentCover from '../../components/DocumentForms/DocumentCover';
import CustomerDialog from '../../components/Dialog/CustomerDialog';
import MachineDialog from '../../components/Dialog/MachineDialog';
import { PATH_DOCUMENT } from '../../../routes/paths';
import { useSnackbar } from '../../../components/snackbar';
import { Snacks } from '../../../constants/document-constants';
import UpdateDocumentVersionDialog from '../../components/Dialog/UpdateDocumentVersionDialog';

// ----------------------------------------------------------------------

DocumentHistoryViewForm.propTypes = {
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  drawingPage: PropTypes.bool,
  machineDrawings: PropTypes.bool,
};
function DocumentHistoryViewForm({ customerPage, machinePage, drawingPage, machineDrawings }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { documentHistory, isLoading } = useSelector((state) => state.document);
  const { machine } = useSelector((state) => state.machine);
  const { customer } = useSelector((state) => state.customer);
  const { drawing } = useSelector((state) => state.drawing);

  useEffect(() => {
    if(!machinePage && !drawingPage){
      dispatch(resetMachine());
    }
    if(!customerPage && !drawingPage){
      dispatch(resetCustomer());
    }
    if(!machinePage && !customerPage && !drawingPage && id){
      dispatch(getDocumentHistory(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

// get machine data for machine portal
  useEffect(() => {
    if (documentHistory?.machine && !machinePage && !drawingPage) {
      dispatch(setMachineDialog(false));
    }
  }, [documentHistory, machinePage, drawingPage, dispatch]);

// get customer data for customer portal
  useEffect(() => {
    if (documentHistory?.customer && !customerPage) {
      dispatch(setCustomerDialog(false));
      // dispatch(getCustomer(documentHistory.customer._id));
    }
  }, [documentHistory, customerPage, dispatch]);

  const defaultValues = useMemo(
    () => ({
      displayName: documentHistory?.displayName || '',
      documentName: documentHistory?.documentName?.name || '',
      docCategory: documentHistory?.docCategory?.name || '',
      docType: documentHistory?.docType?.name || '',
      referenceNumber: documentHistory?.referenceNumber || '',
      stockNumber: documentHistory?.stockNumber || '',
      customer: documentHistory?.customer?.name || '',
      site: documentHistory?.site?.name || '',
      contact: documentHistory?.contact?.name || '',
      machine: documentHistory?.machine?.serialNo || '',
      model: documentHistory?.machineModel?.name || '',
      customerAccess: documentHistory?.customerAccess,
      isActiveVersion: documentHistory?.isActiveVersion,
      documentVersion: documentHistory?.documentVersions?.length > 0
                        ? documentHistory?.documentVersions[0]?.versionNo : '',
      versionPrefix: documentHistory?.versionPrefix || '',
      description: documentHistory?.description,
      isArchived: documentHistory?.isArchived,
      isActive: documentHistory?.isActive,
      createdAt: documentHistory?.createdAt || '',
      createdByFullName: documentHistory?.createdBy?.name || '',
      createdIP: documentHistory?.createdIP || '',
      updatedAt: documentHistory?.updatedAt || '',
      updatedByFullName: documentHistory?.updatedBy?.name || '',
      updatedIP: documentHistory?.updatedIP || '',
      machines: documentHistory?.productDrawings || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documentHistory]
  );

  const linkedDrawingMachines = documentHistory?.productDrawings?.map((pdrawing, index) => pdrawing?.machine._id !== machine?._id && (
    <Chip sx={{ml:index===0?0:1}} onClick={() => handleMachineDialog(pdrawing?.machine?._id)} label={`${pdrawing?.machine?.serialNo || ''} ${pdrawing?.machine?.name ? ` - ${pdrawing?.machine?.name}` : '' } `} />
  ));

  // refresh the document when file deleted
const callAfterDelete = () => {dispatch(getDocumentHistory(documentHistory._id))};

const handleNewVersion = async () => {
  if(customerPage || machinePage){
    dispatch(setDocumentHistoryViewFormVisibility(false));
    dispatch(setDocumentFormVisibility(true));
    dispatch(setDocumentHistoryNewVersionFormVisibility(true));
    dispatch(setDocumentHistoryAddFilesViewFormVisibility(false));
    dispatch(setDocumentAddFilesViewFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    dispatch(resetDocument());
  }else if(!customerPage && !machinePage && !machineDrawings){
    dispatch(setDocumentHistoryNewVersionFormVisibility(true));
    dispatch(setDocumentHistoryAddFilesViewFormVisibility(false));
    dispatch(setDocumentAddFilesViewFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    navigate(PATH_DOCUMENT.document.new,"drawingPage");
    dispatch(resetDocument());
  }else if(machineDrawings){
    dispatch(setDocumentHistoryNewVersionFormVisibility(true));
    dispatch(setDocumentHistoryAddFilesViewFormVisibility(false));
    dispatch(setDocumentAddFilesViewFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    navigate(PATH_DOCUMENT.document.machineDrawings.new);
    dispatch(resetDocument());
  }
}

const handleUpdateVersion = async () => {
  dispatch(setDocumentVersionEditDialogVisibility(true));
}

const handleNewFile = async () => {
  if(customerPage || machinePage){
    dispatch(setDocumentHistoryViewFormVisibility(false));
    dispatch(setDocumentHistoryAddFilesViewFormVisibility(true));
    dispatch(setDocumentHistoryNewVersionFormVisibility(false));
    dispatch(setDocumentAddFilesViewFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    dispatch(setDocumentFormVisibility(true));
    dispatch(resetDocument());
  }else if(!customerPage && !machinePage && !machineDrawings){
    dispatch(setDocumentAddFilesViewFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    dispatch(setDocumentHistoryAddFilesViewFormVisibility(true));
    dispatch(setDocumentHistoryNewVersionFormVisibility(false));
    dispatch(resetDocument());
    navigate(PATH_DOCUMENT.document.new);
  }
  else if(machineDrawings){
    dispatch(setDocumentAddFilesViewFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    dispatch(setDocumentHistoryAddFilesViewFormVisibility(true));
    dispatch(setDocumentHistoryNewVersionFormVisibility(false));
    navigate(PATH_DOCUMENT.document.machineDrawings.new);
    dispatch(resetDocument());
  }
}
  const handleCustomerDialog = () =>{
    if (documentHistory?.customer && !customerPage) {
      dispatch(setCustomerDialog(true));
      dispatch(getCustomer(documentHistory.customer._id));
    }
  }
  const handleMachineDialog = (machineId) =>{
    // if (documentHistory?.machine && !machinePage && !drawingPage) {
      dispatch(setMachineDialog(true));
      dispatch(getMachineForDialog(machineId));
    // }
  }

  const handleEditDrawing = async () => {
    await dispatch(getDocument(documentHistory._id));
    dispatch(setDrawingViewFormVisibility(false));
    dispatch(setDrawingEditFormVisibility(true));
  };

  // const handleEditDoc = async () => {
  //   await dispatch(getDocument(documentHistory._id));
  //   dispatch(setDocumentFormVisibility(false));
  //   dispatch(setDocumentHistoryViewFormVisibility(false));
  //   dispatch(setDocumentViewFormVisibility(false));
  //   dispatch(setDocumentEditFormVisibility(true));
  // };

  const handleDelete = async () => {
    try {
      await dispatch(deleteDocument(documentHistory?._id));
      navigate(PATH_DOCUMENT.document.machineDrawings.list);
      enqueueSnackbar("Document Deleted Successfully!", { variant: `success` });
    }catch(error) {
      enqueueSnackbar(error, { variant: `error` });
    }
  }

  const handleDeleteDrawing = async () => {
    try {
      await dispatch(deleteDrawing(drawing?._id));
      await dispatch(resetDrawings());
      await dispatch(getDrawings(machine?._id));
      dispatch(setDrawingViewFormVisibility(false))
      enqueueSnackbar(Snacks.deletedDrawing, { variant: `success` });
    } catch (err) {
      console.log(err);
      enqueueSnackbar(Snacks.failedDeleteDrawing, { variant: `error` });
    }
  };

  return (
    <>
      {!customerPage && !machinePage && !drawingPage &&
        <DocumentCover content={defaultValues?.displayName} generalSettings />
      } 

        <Grid item md={12} mt={2}>
          <Card sx={{ p: 3 }}>
          <ViewFormEditDeleteButtons
          customerAccess={defaultValues?.customerAccess}
          isActive={defaultValues.isActive}
          handleEdit={drawingPage && handleEditDrawing}
          onDelete={drawingPage?handleDeleteDrawing : handleDelete }
          disableDeleteButton={drawingPage && machine?.status?.slug==="transferred"}
          disableEditButton={drawingPage && machine?.status?.slug==="transferred"}
          backLink={(customerPage || machinePage || drawingPage ) ? ()=>{dispatch(setDocumentHistoryViewFormVisibility(false)); dispatch(setDrawingViewFormVisibility(false));}
          : () =>  machineDrawings ? navigate(PATH_DOCUMENT.document.machineDrawings.list) : navigate(PATH_DOCUMENT.document.list)}
      />
            <Grid container sx={{mt:2}}>
              <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues?.displayName} />
              <ViewFormField isLoading={isLoading}
                sm={6}
                NewVersion={!defaultValues.isArchived}
                handleNewVersion={handleNewVersion}
                handleUpdateVersion={handleUpdateVersion}
                heading="Active Version"
                objectParam={
                  defaultValues.documentVersion && (
                    <StyledVersionChip label={defaultValues.versionPrefix + defaultValues.documentVersion}
                      size="small" variant="outlined"
                    />
                  )
                }
              />

              <ViewFormField isLoading={isLoading}
                sm={6}
                heading="Document Category"
                param={defaultValues?.docCategory}
              />
              <ViewFormField isLoading={isLoading} sm={6} heading="Document Type" param={defaultValues?.docType} />
              <ViewFormField isLoading={isLoading} sm={6} heading="Reference Number" param={defaultValues?.referenceNumber} />
              <ViewFormField isLoading={isLoading} sm={6} heading="Stock Number" param={defaultValues?.stockNumber} />

              {!customerPage && !machineDrawings && !drawingPage && defaultValues.customer && (
                <ViewFormField isLoading={isLoading}
                  sm={6}
                  variant='h4'
                  heading="Customer"
                  objectParam={
                    defaultValues.customer && (
                      <Link onClick={handleCustomerDialog} href="#" underline="none">
                        {defaultValues.customer}
                      </Link>
                    )
                  }
                />
              )}

              {!machinePage && !machineDrawings && !drawingPage &&  defaultValues?.machine && (
                <ViewFormField isLoading={isLoading}
                  sm={6}
                  heading="Machine"
                  variant='h4'
                  objectParam={
                    defaultValues.machine && (
                      <Link onClick={()=> handleMachineDialog(documentHistory?.machine?._id)} href="#" underline="none">
                        {defaultValues.machine}
                      </Link>
                    )
                  }
                />
              )}

              <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
              {((drawingPage && documentHistory?.productDrawings?.length > 1) || machineDrawings) && 
                <ViewFormField isLoading={isLoading} sm={12} heading="Attached with Machines" chipDialogArrayParam={linkedDrawingMachines} />
              }
              <Grid container sx={{ mt: '1rem', mb: '-1rem' }}>
                <ViewFormAudit defaultValues={defaultValues} />
              </Grid>


              {documentHistory &&
                documentHistory?.documentVersions?.map((files, index) => {
                  const fileValues = {
                      createdAt: files?.createdAt || '',
                      createdByFullName: files?.createdBy?.name || '',
                      createdIP: files?.createdIP || '',
                      updatedAt: files?.updatedAt || '',
                      updatedByFullName: files?.updatedBy?.name || '',
                      updatedIP: files?.updatedIP || '',
                    }
                 return (
                  <Grid container key={index}>
                    <Grid container sx={{ pt: '2rem' }} mb={1}>
                      <FormLabel content={`Version No. ${files?.versionNo}`} />
                      {defaultValues.description !== files?.description && (
                        <ViewFormField sm={12} heading="Description" param={files?.description} />
                      )}
                    </Grid>
                    {files?.files?.map((file) => (
                      <Grid sx={{ display: 'flex-inline', m: 0.5 }} key={file?._id}>
                        <Grid container justifyContent="flex-start" gap={1}>
                          <Thumbnail
                            // sx={{m:2}}
                            // key={file?._id}
                            file={file}
                            currentDocument={documentHistory}
                            customer={customer}
                            getCallAfterDelete={callAfterDelete}
                            hideDelete={defaultValues.isArchived}
                          />
                        </Grid>
                      </Grid>
                    ))}
                    {index === 0 && !defaultValues.isArchived && (<ThumbnailDocButton onClick={handleNewFile}/>)}
                    <ViewFormAudit key={`${index}-files`} defaultValues={fileValues} />
                  </Grid>
                )})}
            </Grid>
          </Card>
        </Grid>
      <CustomerDialog />
      <MachineDialog />
      <UpdateDocumentVersionDialog versionNo={defaultValues?.documentVersion} />
    </>
  );
}

export default memo(DocumentHistoryViewForm)