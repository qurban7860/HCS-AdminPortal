import PropTypes from 'prop-types';
import React, { useMemo, Suspense, lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';
import { Grid, Typography, Link, Tooltip, Card } from '@mui/material';
import {
  deleteDocument,
  getDocumentHistory,
  resetDocumentHistory,
  getDocument,
  getDocuments,
  setDocumentEditFormVisibility,
  setDocumentViewFormVisibility,
  setDocumentHistoryViewFormVisibility,
  resetDocument,
} from '../../../redux/slices/document/document';
// components
import { Thumbnail } from '../../components/Thumbnails/Thumbnail';
import { useSnackbar } from '../../../components/snackbar';
import { Snacks } from '../../../constants/document-constants';
import LoadingScreen from '../../../components/loading-screen';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import VersionsLink from '../../components/DocumentForms/VersionsLink';

DocumentViewForm.propTypes = {
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  DocId: PropTypes.string,
};

export default function DocumentViewForm({ customerPage, machinePage, DocId }) {
  const { document } = useSelector((state) => state.document);
  const { customer } = useSelector((state) => state.customer);
  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();
  // necessary. dont remove
  // const theme = useTheme();
  // const navigate = useNavigate();
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
    // navigate(PATH_DOCUMENT.document.view(document._id));
    // dispatch(resetDocument());
      dispatch(resetDocumentHistory())
    await dispatch(getDocumentHistory(document?._id));
  };

  useEffect(() => {
    dispatch(resetDocument());
  }, [dispatch]);

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
  console.log("defaultValues.documentVersionLength : ",defaultValues.documentVersionLength)
  const callAfterDelete = async () => {
    await dispatch(getDocument(document._id));
    // if(customerPage || machinePage){
    //   if(customer?._id || machine?._id ){
    //     await dispatch(getDocuments(customerPage ? customer?._id : null , machinePage ? machine?._id : null));
    //   }
    // }else{
    //   await dispatch(getDocuments());
    // }
  };
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
        <ViewFormField sm={6} heading="Name" param={defaultValues?.displayName} />
        <ViewFormField
          sm={6}
          heading="Version"
          objectParam={
            defaultValues.documentVersion && (
              <Typography display="flex">
                {defaultValues.versionPrefix} {defaultValues.documentVersion}
                {defaultValues.documentVersion && (
                  <VersionsLink onClick={linkDocumentView} content="View other versions" />
                )}
              </Typography>
            )
          }
        />
        {!customerPage && !machinePage && (
          <>
            <ViewFormField sm={6} heading="Customer" param={defaultValues?.customer} />
            {/* <ViewFormField sm={6} heading="Site" param={defaultValues?.site} /> */}
            {/* <ViewFormField sm={6} heading="Contact" param={defaultValues?.contact} /> */}
            <ViewFormField sm={6} heading="Machine" param={defaultValues?.machine} />
            {/* <ViewFormField sm={6} heading="Model" param={defaultValues?.model} /> */}
          </>
        )}

        <ViewFormField sm={6} heading="Document Category" param={defaultValues?.docCategory} />
        <ViewFormField sm={6} heading="Document Type" param={defaultValues?.docType} />
        <ViewFormField sm={6} heading="Reference Number" param={defaultValues?.referenceNumber} />

        {/* <ViewFormField sm={6} heading="Customer" param={defaultValues?.customer} /> */}
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
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 2 }}>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}
