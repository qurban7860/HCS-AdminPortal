import PropTypes from 'prop-types';
import {  useMemo, useEffect, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import download from 'downloadjs';
import {
  Grid,
  Card,
  Link
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
  setDocumentHistoryViewFormVisibility,
} from '../../../redux/slices/document/document';
import { getCustomer, resetCustomer, setCustomerDialog} from '../../../redux/slices/customer/customer';
import { getMachineForDialog, resetMachine, setMachineDialog } from '../../../redux/slices/products/machine';
import { Thumbnail } from '../../components/Thumbnails/Thumbnail';
import FormLabel from '../../components/DocumentForms/FormLabel';
import { setDrawingEditFormVisibility, setDrawingViewFormVisibility } from '../../../redux/slices/products/drawing';
import DocumentCover from '../../components/DocumentForms/DocumentCover';
import CustomerDialog from '../../components/Dialog/CustomerDialog';
import MachineDialog from '../../components/Dialog/MachineDialog';
import { PATH_DOCUMENT } from '../../../routes/paths';

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
  const navigate = useNavigate();
  const { documentHistory } = useSelector((state) => state.document);
  const { customer } = useSelector((state) => state.customer);

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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documentHistory]
  );

  console.log("documentHistory:::::",documentHistory)

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
    }
    else if(machineDrawings){
      console.log('drawingPage', drawingPage)
      dispatch(setDocumentHistoryNewVersionFormVisibility(true));
      dispatch(setDocumentHistoryAddFilesViewFormVisibility(false));
      dispatch(setDocumentAddFilesViewFormVisibility(false));
      dispatch(setDocumentNewVersionFormVisibility(false));
      navigate(PATH_DOCUMENT.document.machineDrawings.new);
      dispatch(resetDocument());
    }
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
  const handleMachineDialog = () =>{
    if (documentHistory?.machine && !machinePage && !drawingPage) {
      dispatch(setMachineDialog(true));
      dispatch(getMachineForDialog(documentHistory.machine._id));
    }
  }

  const handleEdit = async () => {
    await dispatch(getDocument(documentHistory._id));
    dispatch(setDrawingViewFormVisibility(false));
    dispatch(setDrawingEditFormVisibility(true));
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
          handleEdit={drawingPage && handleEdit}
          backLink={(customerPage || machinePage || drawingPage ) ? ()=>{dispatch(setDocumentHistoryViewFormVisibility(false)); dispatch(setDrawingViewFormVisibility(false));}
          : () =>  machineDrawings ? navigate(PATH_DOCUMENT.document.machineDrawings.list) : navigate(PATH_DOCUMENT.document.list)}
      />
            <Grid container sx={{mt:2}}>
              <ViewFormField sm={8} heading="Name" param={defaultValues?.displayName} />
              <ViewFormField
                sm={4}
                NewVersion={!defaultValues.isArchived}
                handleNewVersion={handleNewVersion}
                heading="Active Version"
                objectParam={
                  defaultValues.documentVersion && (
                    <StyledVersionChip
                    label={defaultValues.versionPrefix + defaultValues.documentVersion}
                    size="small"
                    variant="outlined"
                  />
                  )
                }

                // chipLabel='asdasd'
                // chips={defaultValues.versionPrefix + defaultValues.documentVersion}
                // param='asdasd'
              />

              <ViewFormField
                sm={6}
                heading="Document Category"
                param={defaultValues?.docCategory}
              />
              <ViewFormField sm={6} heading="Document Type" param={defaultValues?.docType} />
              <ViewFormField sm={6} heading="Reference Number" param={defaultValues?.referenceNumber} />
              <ViewFormField sm={6} heading="Stock Number" param={defaultValues?.stockNumber} />

              {!customerPage && !machineDrawings && !drawingPage && defaultValues.customer && (
                <ViewFormField
                  sm={6}
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
                <ViewFormField
                  sm={6}
                  heading="Machine"
                  objectParam={
                    defaultValues.machine && (
                      <Link onClick={handleMachineDialog} href="#" underline="none">
                        {defaultValues.machine}
                      </Link>
                    )
                  }
                />
              )}

              <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
              <ViewFormField sm={12} heading="Machines" param='asdasdasd' />
              
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
    </>
  );
}

export default memo(DocumentHistoryViewForm)