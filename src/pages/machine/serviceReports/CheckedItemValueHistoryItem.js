import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import download from 'downloadjs';
import { Grid, Typography, Divider, Chip,  Switch, Box, Button, Dialog, DialogTitle } from '@mui/material';
import b64toBlob from 'b64-to-blob';
import CopyIcon from '../../../components/Icons/CopyIcon';
import { fDate } from '../../../utils/formatTime';
import ServiceReportAuditLogs from './ServiceReportAuditLogs';
import { downloadCheckItemFile } from '../../../redux/slices/products/machineServiceReport';
import { DocumentGalleryItem } from '../../../components/gallery/DocumentGalleryItem';
import Lightbox from '../../../components/lightbox/Lightbox';
import SkeletonPDF from '../../../components/skeleton/SkeletonPDF';

const CheckedItemValueHistoryItem = ({ historyItem, inputType }) => {
  const dispatch = useDispatch();
  const regEx = /^[^2]*/;
  const { enqueueSnackbar } = useSnackbar();
  const { machineId } = useParams();
  const [pdf, setPDF] = useState(null);
  const [PDFName, setPDFName] = useState('');
  const [AttachedPDFViewerDialog, setAttachedPDFViewerDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(-1);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    if (historyItem?.files) {
        const updatedFiles = historyItem.files?.filter(file => file?.fileType && file.fileType.startsWith("image"))?.map(file => ({
          ...file,
          src: `data:${file?.fileType};base64,${file?.thumbnail}`,
          thumbnail: `data:${file?.fileType};base64,${file?.thumbnail}`
        }));
        setSlides(updatedFiles);
    }
  }, [historyItem]);

  const handleOpenLightbox = async (_index) => {
    setSelectedImage(_index);
    const image = slides[_index];

    if(!image?.isLoaded && image?.fileType?.startsWith('image')){
      try {
        const response = await dispatch(downloadCheckItemFile(machineId, image.serviceReport, image?._id));
        if (regEx.test(response.status)) {
          // Update the image property in the imagesLightbox array
          const updatedSlides = [
            ...slides.slice(0, _index), // copies slides before the updated slide
            {
              ...slides[_index],
              src: `data:image/png;base64, ${response.data}`,
              isLoaded: true,
            },
            ...slides.slice(_index + 1), // copies slides after the updated slide
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


  const handleDownloadCheckItemFile = (file) => {
    dispatch(downloadCheckItemFile( machineId, file.serviceReport, file._id ))
      .then((res) => {
        if (regEx.test(res.status)) {
          download(atob(res.data), `${file?.name}.${file?.extension}`, { type: file?.extension });
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

  const handleOpenFile = async (file) => {
    try {
      setPDFName(`${file?.name}.${file?.extension}`);
      setAttachedPDFViewerDialog(true);
      setPDF(null);
      const response = await dispatch(downloadCheckItemFile(machineId, file.serviceReport, file._id));
      if (regEx.test(response.status)) {
        const blob = b64toBlob(encodeURI(response.data), 'application/pdf')
        const url = URL.createObjectURL(blob);
        setPDF(url);
      } else {
        enqueueSnackbar(response.statusText, { variant: 'error' });
      }
    } catch (error) {
      setAttachedPDFViewerDialog(false);
      if (error?.message || error?.Message) {
        enqueueSnackbar((error?.message || '' ) || (error?.Message || ''), { variant: 'error' });
      } else {
        enqueueSnackbar('File Download Failed!', { variant: 'error' });
      }
    }
  };

  return (
            <>
              {historyItem?.checkItemValue && (
                <Grid sx={{ mt: 0.5, alignItems: 'center', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    <b>Value: </b>
                    {inputType.toLowerCase() === 'boolean' && historyItem?.checkItemValue && (
                      <Switch sx={{mt:-0.5}} size='small' disabled checked={historyItem?.checkItemValue==="true"} />
                    )}
                    {inputType.toLowerCase() === 'date' ? (
                      fDate(historyItem?.checkItemValue)
                    ) : (
                      <>
                        {inputType.toLowerCase() === 'status' ? (
                          historyItem?.checkItemValue && <Chip size="small" label={historyItem?.checkItemValue || ''} />
                        ) : (
                          (inputType.toLowerCase() === 'number' ||
                            inputType.toLowerCase() === 'long text' ||
                            inputType.toLowerCase() === 'short text') &&
                          historyItem?.checkItemValue
                        )}
                        {historyItem?.checkItemValue?.trim() && inputType.toLowerCase() !== 'boolean' && <CopyIcon value={historyItem?.comments} />}
                      </>
                    )}
                  </Typography>
                </Grid>
              )}
              <Grid sx={{ alignItems: 'center', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                {historyItem?.comments && (
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    <b>Comment: </b>
                    {` ${historyItem?.comments || ''}`}
                    {historyItem?.comments?.trim() && <CopyIcon value={historyItem?.comments} />}
                  </Typography>
                )}
              </Grid>

              <Box
                sx={{my:1, width:'100%'}}
                gap={2}
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
            <DocumentGalleryItem key={file?._id} image={file} 
              onOpenLightbox={()=> handleOpenLightbox(_index)}
              onDownloadFile={()=> handleDownloadCheckItemFile(file)}
              toolbar
            />
          ))}

          {historyItem?.files?.map((file, _index) => !file.fileType.startsWith("image") && (
              <DocumentGalleryItem key={file?._id} image={file} 
                onOpenFile={()=> handleOpenFile(file)}
                onDownloadFile={()=> handleDownloadCheckItemFile(file)}
                toolbar
              />
            ))}

            </Box>
            <ServiceReportAuditLogs data={ historyItem || null } />
            <Lightbox
              index={selectedImage}
              slides={slides}
              open={selectedImage>=0}
              close={handleCloseLightbox}
              onGetCurrentIndex={handleOpenLightbox}
              disabledTotal
              disabledDownload
              disabledSlideshow
            />
            {AttachedPDFViewerDialog && (
              <Dialog fullScreen open={AttachedPDFViewerDialog} onClose={()=> setAttachedPDFViewerDialog(false)}>
                <DialogTitle variant='h3' sx={{pb:1, pt:2, display:'flex', justifyContent:'space-between'}}>
                    PDF View
                      <Button variant='outlined' onClick={()=> setAttachedPDFViewerDialog(false)}>Close</Button>
                </DialogTitle>
                <Divider variant='fullWidth' />
                  {pdf?(
                      <iframe title={PDFName} src={pdf} style={{paddingBottom:10}} width='100%' height='842px'/>
                    ):(
                      <SkeletonPDF />
                    )}
              </Dialog>
            )}
          </>
        );
};


CheckedItemValueHistoryItem.propTypes = {
  historyItem: PropTypes.object,
  inputType: PropTypes.string,
};

export default CheckedItemValueHistoryItem;
