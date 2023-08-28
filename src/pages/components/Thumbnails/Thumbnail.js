import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import download from 'downloadjs';
import { useTheme } from '@mui/material/styles';
import { Stack, Tooltip, Typography } from '@mui/material';
import {
  ThumbnailCard,
  ThumbnailCardContent,
  ThumbnailCardMedia,
  ThumbnailCardMediaIcon,
  ThumbnailGrid,
  ThumbnailNameGrid,
  ThumbnailIconify,
} from '../../../theme/styles/document-styles';
import DeleteIconButton, { ThumbnailIconButtonDefault } from './ThumbnailIconButtonsDefault';
import ImagePreviewDialog from './ImagePreviewDialog';
import { useSnackbar } from '../../../components/snackbar';
import {
  getDocumentDownload,
  deleteDocumentFile,
} from '../../../redux/slices/document/documentFile';
import { document } from '../../../constants/document-constants';
import { fileThumb } from '../../../components/file-thumbnail/utils';

export function Thumbnail({
  deleteOnClick,
  file,
  previewOnClick,
  currentDocument,
  customer,
  getCallAfterDelete,
  hideDelete = false,
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

  const handleDelete = async (documentId, versionId, fileId) => {
    try {
      await dispatch(deleteDocumentFile(documentId, versionId, fileId, customer?._id));
      getCallAfterDelete();
      enqueueSnackbar('File DELETED successful');
    } catch (err) {
      console.log(err);
      enqueueSnackbar('File DELETE failed!', { variant: `error` });
    }
  };

  //   Download and Preview
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
          {!hideDelete && (
            <DeleteIconButton
              left={file?.fileType.startsWith('image') ? 44 : 76}
              onClick={() =>
                handleDelete(
                  currentDocument._id,
                  currentDocument?.documentVersions[0]._id,
                  file._id
                )
              }
            />
          )}
          {file?.fileType.startsWith('image') && (
            <ThumbnailIconButtonDefault
              icon="icon-park-outline:preview-open"
              left={76}
              size="small"
              onClick={() => {
                handleDownloadAndPreview(
                  currentDocument._id,
                  currentDocument?.documentVersions[0]._id,
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
                currentDocument._id,
                currentDocument?.documentVersions[0]._id,
                file._id,
                file.name,
                file.extension
              )
            }
            theme={theme}
          />
          {file?.fileType.startsWith('image') && file.thumbnail && (
            <ThumbnailCardMedia
              component="img"
              image={`data:image/png;base64, ${file?.thumbnail}`}
              alt="Document photo was here"
            />
          )}
          {file?.fileType.startsWith('image') && !file.thumbnail && (
            <ThumbnailCardMediaIcon
              component="img"
              image={fileThumb('image')}
              alt="Document photo was here"
            />
          )}
          {!file?.fileType.startsWith('image') && (
            <ThumbnailCardMediaIcon
              component="img"
              image={fileThumb(file.extension.toLowerCase())}
              alt="Document photo was here"
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
  currentDocument: PropTypes.object,
  customer: PropTypes.object,
  getCallAfterDelete: PropTypes.func,
  hideDelete: PropTypes.bool,
};

export default Thumbnail;

// _____________________________________________________________________________________________

// whats this {downloadBase64File} for?

//   const downloadBase64File = (base64Data, fileName) => {
//     // Decode the Base64 file
//     const decodedString = atob(base64Data);
//     // Convert the decoded string to a Uint8Array
//     const byteNumbers = new Array(decodedString.length);
//     for (let i = 0; i < decodedString.length; i += 1) {
//       byteNumbers[i] = decodedString.charCodeAt(i);
//     }
//     const byteArray = new Uint8Array(byteNumbers);
//     // Create a Blob object from the Uint8Array
//     const blob = new Blob([byteArray]);
//     const link = React.createElement('a');
//     link.href = window.URL.createObjectURL(blob);
//     link.download = fileName;
//     link.target = '_blank';
//     link.click();
//   };

//   // download file
//   const handleDownloadFile = (base64) => {
//     const base64Data = base64;
//     const fileName = 'your_file_name.ext';
//     downloadBase64File(base64Data, fileName);
//   };
