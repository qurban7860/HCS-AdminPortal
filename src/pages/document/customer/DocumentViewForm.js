// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-anonymous-default-export
import PropTypes from 'prop-types';
import React, { useMemo, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';
import { Grid, Typography, Link, Tooltip } from '@mui/material';
import {
  setCustomerDocumentEditFormVisibility,
  deleteCustomerDocument,
  getCustomerDocuments,
  getCustomerDocument,
  resetCustomerDocument,
  getCustomerDocumentHistory,
} from '../../../redux/slices/document/customerDocument';
// paths
import { PATH_DASHBOARD, PATH_DOCUMENT } from '../../../routes/paths';
// components
import { Thumbnail } from '../../components/Thumbnails/Thumbnail';
import { useSnackbar } from '../../../components/snackbar';
import { Snacks } from '../../../constants/document-constants';
import LoadingScreen from '../../../components/loading-screen';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import VersionsLink from '../../components/DocumentForms/VersionsLink';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
const DownloadComponent = Loadable(lazy(() => import('../DownloadDocument')));

// ----------------------------------------------------------------------

export default function DocumentViewForm({ currentCustomerDocument = null }) {
  const { customerDocument, isLoading } = useSelector((state) => state.customerDocument);
  const { customer, customers } = useSelector((state) => state.customer);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onDelete = async () => {
    try {
      await dispatch(deleteCustomerDocument(currentCustomerDocument._id));
      dispatch(getCustomerDocuments(customer._id));
      enqueueSnackbar(Snacks.deletedDoc, { variant: `success` });
    } catch (err) {
      console.log(err);
      enqueueSnackbar(Snacks.failedDeleteDoc, { variant: `error` });
    }
  };

  const handleEdit = async () => {
    await dispatch(getCustomerDocument(currentCustomerDocument._id));
    dispatch(setCustomerDocumentEditFormVisibility(true));
  };

  const linkCustomerDocumentView = async () => {
    navigate(PATH_DOCUMENT.document.customer(currentCustomerDocument._id));
    dispatch(resetCustomerDocument());
    // dispatch(resetCustomer())
    await dispatch(getCustomerDocumentHistory(currentCustomerDocument?._id));
    // await dispatch(getCustomer(currentMachineDocument.customer._id))
  };

  const defaultValues = useMemo(
    () => ({
      displayName: currentCustomerDocument?.displayName || '',
      documentName: currentCustomerDocument?.documentName?.name || '',
      docCategory: currentCustomerDocument?.docCategory?.name || '',
      docType: currentCustomerDocument?.docType?.name || '',
      customer: currentCustomerDocument?.customer?.name || '',
      customerAccess: currentCustomerDocument?.customerAccess,
      isActiveVersion: currentCustomerDocument?.isActiveVersion,
      documentVersion: currentCustomerDocument?.documentVersions[0]?.versionNo || '',
      versionPrefix: currentCustomerDocument?.versionPrefix || '',
      description: currentCustomerDocument?.description,
      isActive: currentCustomerDocument?.isActive,
      createdAt: currentCustomerDocument?.createdAt || '',
      createdByFullName: currentCustomerDocument?.createdBy?.name || '',
      createdIP: currentCustomerDocument?.createdIP || '',
      updatedAt: currentCustomerDocument?.updatedAt || '',
      updatedByFullName: currentCustomerDocument?.updatedBy?.name || '',
      updatedIP: currentCustomerDocument?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCustomerDocument, customerDocument]
  );

  return (
    <Grid>
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
                {currentCustomerDocument?.documentVersions &&
                  currentCustomerDocument?.documentVersions?.length > 1 && (
                    <VersionsLink
                      onClick={linkCustomerDocumentView}
                      content="View other versions"
                    />
                  )}
              </Typography>
            )
          }
        />

        <ViewFormField sm={6} heading="Document Category" param={defaultValues?.docCategory} />
        <ViewFormField sm={6} heading="Document Type" param={defaultValues?.docType} />
        {/* <ViewFormField sm={6} heading="Customer" param={defaultValues?.customer} /> */}
        <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
        <Grid item sx={{ display: 'flex-inline' }}>
          <Grid container justifyContent="flex-start" gap={1}>
            {currentCustomerDocument?.documentVersions[0]?.files?.map((file) => (
              <Thumbnail
                key={file._id}
                file={file}
                currentDocument={currentCustomerDocument}
                customer={customer}
              />
            ))}
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 2 }}>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Grid>
  );
}

DocumentViewForm.propTypes = {
  currentCustomerDocument: PropTypes.object,
};
