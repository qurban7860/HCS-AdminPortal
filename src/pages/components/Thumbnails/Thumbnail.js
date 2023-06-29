import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import download from 'downloadjs';
import { useTheme } from '@mui/material/styles';
import { Link, Stack, Tooltip, Typography } from '@mui/material';
import { getCustomerDocuments } from '../../../redux/slices/document/customerDocument';
import {
  ThumbnailCard,
  ThumbnailCardContent,
  ThumbnailCardMedia,
  ThumbnailGrid,
  ThumbnailNameGrid,
  ThumbnailIconify,
} from '../../../theme/styles/document-styles';
import DeleteIconButton, { ThumbnailIconButtonDefault } from './ThumbnailIconButtonsDefault';
import ImagePreviewDialog from '../ImagePreviewDialog';
import { useSnackbar } from '../../../components/snackbar';
import {
  getDocumentDownload,
  deleteDocumentFile,
} from '../../../redux/slices/document/documentFile';

export function Thumbnail({
  deleteOnClick,
  file,
  previewOnClick,
  handleDownloadImage,
  currentCustomerDocument,
  customer,
}) {
  const [onPreview, setOnPreview] = useState(false);
  const [imageName, setImageName] = useState('');
  const [imageData, setImageData] = useState('');
  const [imageExtension, setImageExtension] = useState('');
  const theme = useTheme();
  const dispatch = useDispatch();
  const regEx = /^[^2]*/;

  const { enqueueSnackbar } = useSnackbar();

  const handleOpenPreview = () => {
    setOnPreview(true);
  };
  const handleClosePreview = () => {
    setOnPreview(false);
  };

  //   Delete
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

  //   Download and Preview
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

  //   Download
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

  return (
    <ThumbnailCard>
      <ThumbnailGrid item justifyContent="center">
        <ThumbnailCardContent component={Stack} display="block" height="110px">
          <DeleteIconButton
            left={document ? 76 : 44}
            onClick={() =>
              handleDelete(
                currentCustomerDocument._id,
                currentCustomerDocument?.documentVersions[0]._id,
                file._id
              )
            }
          />
          {file?.fileType.startsWith('image') && (
            <ThumbnailIconButtonDefault
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
          )}
          {file?.fileType.startsWith('image') && (
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
          {file?.fileType.startsWith('image') && (
            <ThumbnailCardMedia
              component="img"
              image={`data:image/png;base64, ${file?.thumbnail}`}
              alt="customer's contact cover photo was here"
            />
          )}
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
  );
}

Thumbnail.propTypes = {
  deleteOnClick: PropTypes.func,
  file: PropTypes.object,
  previewOnClick: PropTypes.func,
  handleDownloadImage: PropTypes.func,
  currentCustomerDocument: PropTypes.object,
  customer: PropTypes.object,
};

export default Thumbnail;
