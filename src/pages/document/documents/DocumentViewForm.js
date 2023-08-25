import PropTypes from 'prop-types';
import React, { useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Tooltip, Card, Button } from '@mui/material';
import { PATH_DOCUMENT } from '../../../routes/paths';
import {
  deleteDocument,
  getDocumentHistory,
  resetDocumentHistory,
  getDocument,
  getDocuments,
  setDocumentEditFormVisibility,
  setDocumentViewFormVisibility,
  setDocumentHistoryViewFormVisibility,
  setDocumentFormVisibility,
  setDocumentAddFilesViewFormVisibility,
  setDocumentNewVersionFormVisibility,
  setDocumentHistoryAddFilesViewFormVisibility,
  setDocumentHistoryNewVersionFormVisibility,
} from '../../../redux/slices/document/document';
// components
import { Thumbnail } from '../../components/Thumbnails/Thumbnail';
import { useSnackbar } from '../../../components/snackbar';
import { Snacks } from '../../../constants/document-constants';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

DocumentViewForm.propTypes = {
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  DocId: PropTypes.string,
};

function DocumentViewForm({ customerPage, machinePage, DocId }) {
  const { document } = useSelector((state) => state.document);
  const { customer } = useSelector((state) => state.customer);
  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();

  // necessary. dont remove
  // const theme = useTheme();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onDelete = async () => {
    try {
      await dispatch(deleteDocument(document._id));
      if (customerPage || machinePage) {
        if (customer?._id || machine?._id) {
          await dispatch(
            getDocuments(customerPage ? customer?._id : null, machinePage ? machine?._id : null)
          );
        }
      } else {
        await dispatch(getDocuments());
      }
      dispatch(setDocumentViewFormVisibility(false));
      enqueueSnackbar(Snacks.deletedDoc, { variant: `success` });
    } catch (err) {
      console.log(err);
      enqueueSnackbar(Snacks.failedDeleteDoc, { variant: `error` });
    }
  };

  const handleEdit = async () => {
    await dispatch(getDocument(document._id));
    dispatch(setDocumentViewFormVisibility(false));
    dispatch(setDocumentEditFormVisibility(true));
  };

  const linkDocumentView = async () => {
    dispatch(setDocumentViewFormVisibility(false));
    dispatch(setDocumentHistoryViewFormVisibility(true));
    dispatch(resetDocumentHistory())
    await dispatch(getDocumentHistory(document?._id));
  };

  const callAfterDelete = async () => {
    await dispatch(getDocument(document._id));
  };

  // useEffect(() => {
  //   dispatch(resetDocument());
  // }, [dispatch]);

  const defaultValues = useMemo(
    () => ({
      displayName: document?.displayName || '',
      documentName: document?.documentName?.name || '',
      docCategory: document?.docCategory?.name || '',
      docType: document?.docType?.name || '',
      referenceNumber: document?.referenceNumber || '',
      customer: document?.customer?.name || '',
      site: document?.site?.name || '',
      contact: document?.contact?.name || '',
      machine: document?.machine?.serialNo || '',
      model: document?.machineModel?.name || '',
      customerAccess: document?.customerAccess,
      isActiveVersion: document?.isActiveVersion,
      documentVersion:
        document?.documentVersions && document?.documentVersions?.length > 0
          ? document?.documentVersions[0]?.versionNo
          : '',
      documentVersionLength: document?.documentVersions?.length > 1 ,
      versionPrefix: document?.versionPrefix || '',
      description: document?.description,
      isActive: document?.isActive,
      createdAt: document?.createdAt || '',
      createdByFullName: document?.createdBy?.name || '',
      createdIP: document?.createdIP || '',
      updatedAt: document?.updatedAt || '',
      updatedByFullName: document?.updatedBy?.name || '',
      updatedIP: document?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [document]
  );

  const handleNewVersion = async () => {
    if(customerPage || machinePage){
      dispatch(setDocumentHistoryNewVersionFormVisibility(false));
      dispatch(setDocumentHistoryAddFilesViewFormVisibility(false));
      dispatch(setDocumentAddFilesViewFormVisibility(false));
      dispatch(resetDocumentHistory());
      dispatch(setDocumentViewFormVisibility(false));
      dispatch(setDocumentFormVisibility(true));
      dispatch(setDocumentNewVersionFormVisibility(true));
  }else{
    dispatch(setDocumentNewVersionFormVisibility(true));
    navigate(PATH_DOCUMENT.document.new);
  }
  }

  const handleNewFile = async () => {
    if(customerPage || machinePage){
      dispatch(setDocumentHistoryNewVersionFormVisibility(false));
      dispatch(setDocumentHistoryAddFilesViewFormVisibility(false));
      dispatch(setDocumentNewVersionFormVisibility(false));
      dispatch(resetDocumentHistory());
      dispatch(setDocumentViewFormVisibility(false));
      dispatch(setDocumentFormVisibility(true));
      dispatch(setDocumentAddFilesViewFormVisibility(true));
  }else{
    dispatch(setDocumentAddFilesViewFormVisibility(true));
    navigate(PATH_DOCUMENT.document.new);
  }
  }
  return (
    <Card sx={{ p: 3 }}>
      <ViewFormEditDeleteButtons handleEdit={handleEdit} onDelete={onDelete} />
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
        <ViewFormField sm={6} heading="Document Category" param={defaultValues?.docCategory} />
        <ViewFormField sm={6} heading="Document Type" param={defaultValues?.docType} />
        <ViewFormField sm={6} heading="Reference Number" param={defaultValues?.referenceNumber} />
        <ViewFormField
          sm={6}
          heading="Version"
          NewVersion
          handleNewVersion={handleNewVersion}
          ViewAllVersions
          handleAllVersion={linkDocumentView}
          objectParam={`${defaultValues.versionPrefix} ${defaultValues.documentVersion}`}
        />
        {!customerPage && !machinePage && (
          <>
            <ViewFormField sm={6} heading="Customer" param={defaultValues?.customer} />
            <ViewFormField sm={6} heading="Machine" param={defaultValues?.machine} />
          </>
        )}
        <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
        <Grid item sx={{ display: 'flex-inline' }}>
          <Grid container justifyContent="flex-start" gap={1}>
            {document?.documentVersions &&
              document?.documentVersions[0]?.files?.map((file) => (
                <Thumbnail
                  key={file._id}
                  file={file}
                  currentDocument={document}
                  customer={customer}
                  getCallAfterDelete={callAfterDelete}
                />
              ))}
              <Button title="Add/Upload Files in Current version." variant="contained" color="inherit" onClick={handleNewFile}  sx={{width:'140px', height:'140px', borderRadius:'16px'}} >Add/Upload Files</Button>
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 2 }}>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}

export default memo(DocumentViewForm)