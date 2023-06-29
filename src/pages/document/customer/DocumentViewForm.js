import PropTypes from 'prop-types';
import React, { useMemo, useState, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import download from 'downloadjs';
// @mui
// eslint-disable-next-line import/no-anonymous-default-export
import { styled, alpha, useTheme } from '@mui/material/styles';
import {
  CardContent,
  IconButton,
  Card,
  Grid,
  Stack,
  Typography,
  CardMedia,
  Link,
  Tooltip,
} from '@mui/material';
import {
  ThumbnailCard,
  ThumbnailCardMedia,
  ThumbnailCardContent,
  ThumbnailGrid,
  ThumbnailIconify,
  ThumbnailNameGrid,
} from '../../../theme/styles/document-styles';
// redux
import {
  getDocumentDownload,
  deleteDocumentFile,
} from '../../../redux/slices/document/documentFile';
import {
  setCustomerDocumentEditFormVisibility,
  deleteCustomerDocument,
  getCustomerDocuments,
  getCustomerDocument,
  resetCustomerDocument,
  getCustomerDocumentHistory,
} from '../../../redux/slices/document/customerDocument';
// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import LoadingScreen from '../../../components/loading-screen';
import Iconify from '../../../components/iconify';
import { fDate, fDateTime } from '../../../utils/formatTime';
import { useSnackbar } from '../../../components/snackbar';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormField from '../../components/ViewFormField';
import DeleteIconButton, {
  ThumbnailIconButtonDefault,
} from '../../components/Thumbnails/ThumbnailIconButtonsDefault';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';
import ImagePreviewDialog from '../../components/ImagePreviewDialog';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
const DownloadComponent = Loadable(lazy(() => import('../DownloadDocument')));

// ----------------------------------------------------------------------
DocumentViewForm.propTypes = {
  currentCustomerDocument: PropTypes.object,
};

export default function DocumentViewForm({ currentCustomerDocument = null }) {
  const regEx = /^[^2]*/;
  const { customerDocument, isLoading } = useSelector((state) => state.customerDocument);
  // console.log("currentCustomerDocument : ",currentCustomerDocument)
  const { customer, customers } = useSelector((state) => state.customer);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onDelete = async () => {
    try {
      await dispatch(deleteCustomerDocument(currentCustomerDocument._id));
      dispatch(getCustomerDocuments(customer._id));
      enqueueSnackbar('Document deleted successfully!');
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Document delete failed!', { variant: `error` });
    }
  };

  const handleEdit = async () => {
    await dispatch(getCustomerDocument(currentCustomerDocument._id));
    dispatch(setCustomerDocumentEditFormVisibility(true));
  };

  const linkCustomerDocumentView = async () => {
    navigate(PATH_DASHBOARD.document.customer(currentCustomerDocument._id));
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

  const downloadBase64File = (base64Data, fileName) => {
    // Decode the Base64 file
    const decodedString = atob(base64Data);
    // Convert the decoded string to a Uint8Array
    const byteNumbers = new Array(decodedString.length);
    for (let i = 0; i < decodedString.length; i += 1) {
      byteNumbers[i] = decodedString.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    // Create a Blob object from the Uint8Array
    const blob = new Blob([byteArray]);
    const link = React.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.target = '_blank';
    link.click();
  };

  const handleDownloadFile = (base64) => {
    const base64Data = base64;
    const fileName = 'your_file_name.ext';
    downloadBase64File(base64Data, fileName);
  };

  const handleDelete = async (documentId, versionId, fileId) => {
    try {
      await dispatch(deleteDocumentFile(documentId, versionId, fileId, customer?._id));
      dispatch(getCustomerDocuments(customer._id));
      enqueueSnackbar('File deleted successfully!');
    } catch (err) {
      console.log(err);
      enqueueSnackbar('File delete failed!', { variant: `error` });
    }
  };

  const handleDownload = (documentId, versionId, fileId, fileName, fileExtension) => {
    dispatch(getDocumentDownload(documentId, versionId, fileId))
      .then((res) => {
        if (regEx.test(res.status)) {
          download(atob(res.data), `${fileName}.${fileExtension}`, { type: fileExtension });
          // downloadBase64File(res.data, `${fileName}.${fileExtension}`);
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

  const [onPreview, setOnPreview] = useState(false);
  const [imageData, setImageData] = useState(false);
  const [imageName, setImageName] = useState('');
  const [imageExtension, setImageExtension] = useState('');

  const handleOpenPreview = () => {
    setOnPreview(true);
  };
  const handleClosePreview = () => {
    setOnPreview(false);
  };

  const handleDownloadImage = (fileName, fileExtension) => {
    download(atob(imageData), `${fileName}.${fileExtension}`, { type: fileExtension });
  };

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

  const document = {
    icon: {
      pdf: 'bxs:file-pdf',
      doc: 'mdi:file-word',
      docx: 'mdi:file-word',
      xls: 'mdi:file-excel',
      xlsx: 'mdi:file-excel',
      ppt: 'mdi:file-powerpoint',
      pptx: 'mdi:file-powerpoint',
    },
    color: {
      pdf: '#f44336',
      doc: '#448aff',
      docx: '#448aff',
      xls: '#388e3c',
      xlsx: '#388e3c',
      ppt: '#e65100',
      pptx: '#e65100',
    },
  };

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
                    <Link onClick={linkCustomerDocumentView} href="#" underline="none">
                      <Typography variant="body2" sx={{ mt: 0.45, ml: 1 }}>
                        More version
                      </Typography>
                    </Link>
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
            {currentCustomerDocument?.documentVersions[0]?.files?.map((file) =>
              file?.fileType.startsWith('image') ? (
                <ThumbnailCard>
                  <ThumbnailGrid item justifyContent="center">
                    <ThumbnailCardContent component={Stack} display="block" height="110px">
                      <DeleteIconButton
                        left={44}
                        onClick={() =>
                          handleDelete(
                            currentCustomerDocument._id,
                            currentCustomerDocument?.documentVersions[0]._id,
                            file._id
                          )
                        }
                      />
                      <ThumbnailIconButtonDefault
                        theme={theme}
                        icon="icon-park-outline:preview-open"
                        left={76}
                        size="small"
                        onClick={() => {
                          handleDownloadAndPreview(
                            currentCustomerDocument._id,
                            currentCustomerDocument?.documentVersions[0]._id,
                            file._id,
                            file.name,
                            file.extension
                          );
                        }}
                      />
                      {onPreview && (
                        <ImagePreviewDialog
                          onPreview={onPreview}
                          handleClosePreview={handleClosePreview}
                          handleDownloadImage={handleDownloadImage}
                          imageName={imageName}
                          imageExtension={imageExtension}
                          file={file}
                          imageData={imageData}
                        />
                      )}

                      <ThumbnailIconButtonDefault
                        icon="line-md:download-loop"
                        left={108}
                        size="small"
                        onClick={() =>
                          handleDownload(
                            currentCustomerDocument._id,
                            currentCustomerDocument?.documentVersions[0]._id,
                            file._id,
                            file.name,
                            file.extension
                          )
                        }
                        theme={theme}
                      />
                      <ThumbnailCardMedia
                        component="img"
                        image={`data:image/png;base64, ${file?.thumbnail}`}
                        alt="customer's contact cover photo was here"
                      />
                    </ThumbnailCardContent>
                  </ThumbnailGrid>
                  <ThumbnailNameGrid item justifyContent="center">
                    <Tooltip title={file.name} arrow>
                      <Typography variant="body2">
                        {file?.name?.length > 15 ? file?.name?.substring(0, 15) : file?.name}{' '}
                        {file?.name?.length > 15 ? '...' : null}
                      </Typography>
                    </Tooltip>
                  </ThumbnailNameGrid>
                </ThumbnailCard>
              ) : (
                <ThumbnailCard sx={{ height: '140px', width: '140px', m: 1 }}>
                  <ThumbnailGrid item justifyContent="center">
                    <ThumbnailCardContent component={Stack} display="block" height="110px">
                      <DeleteIconButton
                        left={76}
                        onClick={() =>
                          handleDelete(
                            currentCustomerDocument._id,
                            currentCustomerDocument?.documentVersions[0]._id,
                            file._id
                          )
                        }
                      />

                      <ThumbnailIconButtonDefault
                        icon="line-md:download-loop"
                        left={108}
                        size="small"
                        onClick={() =>
                          handleDownload(
                            currentCustomerDocument._id,
                            currentCustomerDocument?.documentVersions[0]._id,
                            file._id,
                            file.name,
                            file.extension
                          )
                        }
                      />
                      {document.icon[file.extension] && document.color[file.extension] && (
                        <ThumbnailIconify
                          icon={document.icon[file.extension]}
                          color={document.color[file.extension]}
                        />
                      )}
                    </ThumbnailCardContent>
                  </ThumbnailGrid>
                  <ThumbnailNameGrid item justifyContent="center">
                    <Tooltip title={file.name} arrow>
                      <Typography variant="body2">
                        {file?.name?.length > 15 ? file?.name?.substring(0, 15) : file?.name}{' '}
                        {file?.name?.length > 15 ? '...' : null}
                      </Typography>
                    </Tooltip>
                  </ThumbnailNameGrid>
                </ThumbnailCard>
              )
            )}
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 2 }}>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Grid>
  );
}
