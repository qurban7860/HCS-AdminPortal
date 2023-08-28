import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useState, useMemo, useEffect, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import download from 'downloadjs';
import {
  Container,
  Grid,
  Card,
  Tooltip,
  Typography,
  Dialog,
  Link,
  DialogContent,
  Button
} from '@mui/material';
import { PATH_CUSTOMER, PATH_MACHINE, PATH_DOCUMENT } from '../../../routes/paths';
import { useSnackbar } from '../../../components/snackbar';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import { getDocumentDownload } from '../../../redux/slices/document/documentFile';
import {
  getDocumentHistory,
  getDocuments,
  deleteDocument,
  resetActiveDocuments,
  resetDocument,
  setDocumentFormVisibility,
  setDocumentHistoryViewFormVisibility,
  setDocumentHistoryAddFilesViewFormVisibility,
  setDocumentHistoryNewVersionFormVisibility,
  setDocumentAddFilesViewFormVisibility,
  setDocumentNewVersionFormVisibility,
} from '../../../redux/slices/document/document';
import { getCustomer, resetCustomer, setCustomerDialog} from '../../../redux/slices/customer/customer';
import { getMachine, resetMachine, setMachineDialog } from '../../../redux/slices/products/machine';
import { Thumbnail } from '../../components/Thumbnails/Thumbnail';
import FormLabel from '../../components/DocumentForms/FormLabel';
import DialogLink from '../../components/Dialog/DialogLink';
import DialogLabel from '../../components/Dialog/DialogLabel';
import { document as documentType, Snacks } from '../../../constants/document-constants';
import DocumentCover from '../../components/DocumentForms/DocumentCover';
import CustomerDialog from '../../components/Dialog/CustomerDialog';
import MachineDialog from '../../components/Dialog/MachineDialog';

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
  const { enqueueSnackbar } = useSnackbar();
  const regEx = /^[^2]*/;

  const { documentHistory } = useSelector((state) => state.document);
  const { customer } = useSelector((state) => state.customer);
  const { machine } = useSelector((state) => state.machine);
  const [onPreview, setOnPreview] = useState(false);
  const [imageData, setImageData] = useState(false);
  const [imageName, setImageName] = useState('');
  const [imageExtension, setImageExtension] = useState('');

  useEffect(() => {
    // dispatch(resetActiveDocuments());
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
      dispatch(getMachine(documentHistory.machine._id));
    }
  }, [documentHistory, machinePage, drawingPage, dispatch]);

// get customer data for customer portal
  useEffect(() => {
    if (documentHistory?.customer && !customerPage) {
      dispatch(setCustomerDialog(false));
      dispatch(getCustomer(documentHistory.customer._id));
    }
  }, [documentHistory, customerPage, dispatch]);

  const defaultValues = useMemo(
    () => ({
      displayName: documentHistory?.displayName || '',
      documentName: documentHistory?.documentName?.name || '',
      docCategory: documentHistory?.docCategory?.name || '',
      docType: documentHistory?.docType?.name || '',
      referenceNumber: documentHistory?.referenceNumber || '',
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

// download the file 
  const handleDownload = (documentId, versionId, fileId, fileName, fileExtension) => {
    dispatch(getDocumentDownload(documentId, versionId, fileId))
      .then((res) => {
        if (regEx.test(res.status)) {
          download(atob(res.data), `${fileName}.${fileExtension}`, { type: fileExtension });
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

  // for download the file
  const handleDownloadImage = (fileName, fileExtension) => {
    download(atob(imageData), `${fileName}.${fileExtension}`, { type: fileExtension });
  };

  // for download and preview the file
  const handleDownloadAndPreview = (documentId, versionId, fileId, fileName, fileExtension) => {
    setImageName(fileName);
    setImageExtension(fileExtension);
    dispatch(getDocumentDownload(documentId, versionId, fileId))
      .then((res) => {
        if (regEx.test(res.status)) {
          setImageData(res.data);
          handleOpenPreview();
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

  // refresh the document when file deleted
  const callAfterDelete = () => {dispatch(getDocumentHistory(documentHistory._id))};


// delete document and navigate to docuements list page
const onDelete = async () => {
  try {
    await dispatch(deleteDocument(documentHistory._id));
    dispatch(getDocuments());
    navigate(PATH_DOCUMENT.document.list);
    enqueueSnackbar(Snacks.deletedDoc);
  } catch (err) {
    enqueueSnackbar(Snacks.failedDeleteDoc, { variant: `error` });
    console.log('Error:', err);
  }
};

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
    navigate(PATH_DOCUMENT.document.new);
    dispatch(resetDocument());
  }
  else if(machineDrawings){
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
  const handleCustomerDialog = () =>{dispatch(setCustomerDialog(true))}
  const handleMachineDialog = () =>{dispatch(setMachineDialog(true))}
  // preview portal control
  const handleOpenPreview = () => { setOnPreview(true)};
  const handleClosePreview = () => { setOnPreview(false)};


  return (
    <>
      {!customerPage && !machinePage && !drawingPage && 
        <DocumentCover content={defaultValues?.displayName} backLink={!customerPage && !machinePage && !machineDrawings} machineDrawingsBackLink={machineDrawings}  generalSettings />
      }
        <Grid item md={12} mt={2}>
          <Card sx={{ p: 3 }}>
            <Grid display="inline-flex">
              <Tooltip>
                <ViewFormField isActive={defaultValues.isActive} />
              </Tooltip>
              <Tooltip>
                <ViewFormField customerAccess={defaultValues?.customerAccess} />
              </Tooltip>
            </Grid>
            <Grid container>
              <ViewFormField sm={12} heading="Name" param={defaultValues?.displayName} />
              <ViewFormField
                sm={6}
                heading="Document Category"
                param={defaultValues?.docCategory}
              />
              <ViewFormField sm={6} heading="Document Type" param={defaultValues?.docType} />
              <ViewFormField sm={6} heading="Reference Number" param={defaultValues?.referenceNumber} />
              <ViewFormField
                sm={6}
                NewVersion
                handleNewVersion={handleNewVersion}
                heading="Active Version"
                objectParam={
                  defaultValues.documentVersion && (
                    <Typography display="flex">
                      {defaultValues.versionPrefix} {defaultValues.documentVersion}
                    </Typography>
                  )
                }
              />
              
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
                  <Grid container>
                    <Grid container sx={{ pt: '2rem' }} mb={1}>
                      <FormLabel content={`Version No. ${files?.versionNo}`} />
                      {defaultValues.description !== files?.description && (
                        <ViewFormField sm={12} heading="Description" param={files?.description} />
                      )}
                    </Grid>
                    {files?.files?.map((file) => (
                      <Grid sx={{ display: 'flex-inline', m: 0.5 }}>
                        <Grid container justifyContent="flex-start" gap={1}>
                          <Thumbnail
                            // sx={{m:2}}
                            key={file?._id}
                            file={file}
                            currentDocument={documentHistory}
                            customer={customer}
                            getCallAfterDelete={callAfterDelete}
                          />
                        </Grid>
                      </Grid>
                    ))}
                    {index === 0 && ( <Button title="Add/Upload Files in Current version." variant="contained" color="inherit" onClick={handleNewFile}  sx={{width:'140px', height:'140px', borderRadius:'16px'}} >Add/Upload Files</Button>)}
                      <ViewFormAudit defaultValues={fileValues} />
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