import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import download from 'downloadjs';
import b64toBlob from 'b64-to-blob';
import { useTheme } from '@mui/material/styles';
import { Stack, Tooltip, Typography, Grid, Box } from '@mui/material';
import {
  ThumbnailCard,
  ThumbnailCardContent,
  ThumbnailCardMedia,
  ThumbnailCardMediaIcon,
  ThumbnailGrid,
  ThumbnailNameGrid,
} from '../../theme/styles/document-styles';
import DeleteIconButton, { ThumbnailIconButtonDefault } from './ThumbnailIconButtonsDefault';
import ImagePreviewDialog from './ImagePreviewDialog';
import { useSnackbar } from '../snackbar';
import {
  getDocumentDownload,
  deleteDocumentFile,
} from '../../redux/slices/document/documentFile';
import { fileThumb } from '../file-thumbnail/utils';
import Lightbox from '../lightbox/Lightbox';
import { DocumentGalleryItem } from '../gallery/DocumentGalleryItem';
import ThumbnailDocButton from './ThumbnailDocButton';

export function ThumbnailsWithLightbox({
  files,
  downloadFile,
  deleteFile,
  addFile,
  isLoading,
  hideDelete = false,
}) {
  
  console.log('hiiii  there')
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
 
  const regEx = /^[^2]*/;
  const [selectedImage, setSelectedImage] = useState(-1);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    if (files) {
      const newSlides = files?.map((file) => {
          if (file?.fileType && file.fileType.startsWith("image")) {
            return{
              thumbnail: `data:image/png;base64, ${file.thumbnail}`,
              src: `data:image/png;base64, ${file.thumbnail}`,
              downloadFilename: `${file?.name}.${file?.extension}`,
              name: file?.name,
              title: file?.name,
              extension: file?.extension,
              category: file?.docCategory?.name,
              fileType: file?.fileType,
              isLoaded: false,
              _id: file?._id,
              width: '100%',
              height: '100%',
            }
          }
          return null;
        }).filter(Boolean) // Remove null entries from the array
  
      setSlides(newSlides);
    }
  }, [files]);


  const handleOpenLightbox = async (index) => {
    setSelectedImage(index);
    const image = slides[index];

    if(!image?.isLoaded && image?.fileType?.startsWith('image')){
      try {
        const response = await dispatch(downloadFile());
        if (regEx.test(response.status)) {
          // Update the image property in the imagesLightbox array
          const updatedSlides = [
            ...slides.slice(0, index), // copies slides before the updated slide
            {
              ...slides[index],
              src: `data:image/png;base64, ${response.data}`,
              isLoaded: true,
            },
            ...slides.slice(index + 1), // copies slides after the updated slide
          ];

          // Update the state with the new array
          setSlides(updatedSlides);
        }
      } catch (error) {
        console.error('Error loading full file:', error);
      }
    }
  };

  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };

  const [pdf, setPDF] = useState(null);
  const [PDFName, setPDFName] = useState('');
  const [PDFViewerDialog, setPDFViewerDialog] = useState(false);

  const handleOpenFile = async (fileName, fileExtension) => {
    setPDFName(`${fileName}.${fileExtension}`);
    setPDFViewerDialog(true);
    setPDF(null);
    try {
      const response = await dispatch(downloadFile());
      if (regEx.test(response.status)) {
        const pdfData = `data:application/pdf;base64,${encodeURI(response.data)}`;
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

  const handleDownloadFile = (fileName, fileExtension) => {
    dispatch(downloadFile())
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

  const handleDeleteFile = async () => {
    try {
      // await dispatch(deleteFile());
      enqueueSnackbar('File Archived successfully');
    } catch (err) {
      console.log(err);
      enqueueSnackbar('File Deletion failed!', { variant: `error` });
    }
  };

  return (
    <>
      <Box
          sx={{mt:2, width:'100%'}}
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
            <DocumentGalleryItem isLoading={isLoading} key={file?._id} image={file} 
              onOpenLightbox={()=> downloadFile && handleOpenLightbox(_index)}
              onDownloadFile={()=> downloadFile && handleDownloadFile(file?.name, file?.extension)}
              onDeleteFile={()=> deleteFile && handleDeleteFile(file?.id)}
              toolbar
              size={150}
            />
          ))}

          {files?.map((file, _index) =>  
              {
                if(!file.fileType.startsWith('image')){
                  return <DocumentGalleryItem key={file?._id} image={{
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
                  }} isLoading={isLoading} 
                  onDownloadFile={()=> handleDownloadFile(file?.name, file?.extension)}
                  onDeleteFile={()=> handleDeleteFile()}
                  onOpenFile={()=> handleOpenFile(file?.name, file?.extension)}
                  toolbar
                  />
                }
                return null;
              }
          )}
          {addFile && <ThumbnailDocButton onClick={addFile}/>}
        </Box>
        
        <Lightbox
          index={selectedImage}
          slides={slides}
          open={selectedImage >= 0}
          close={handleCloseLightbox}
          onGetCurrentIndex={(index) => handleOpenLightbox(index)}
          disabledSlideshow
        />
    </>
  );
}

ThumbnailsWithLightbox.propTypes = {
  files: PropTypes.array,
  downloadFile: PropTypes.func,
  deleteFile: PropTypes.func,
  addFile: PropTypes.func,
  isLoading: PropTypes.bool,
  hideDelete: PropTypes.bool,
};

export default ThumbnailsWithLightbox;

// ____________________________________________________________________________________________