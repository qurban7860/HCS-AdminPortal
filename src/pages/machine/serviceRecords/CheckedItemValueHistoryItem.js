import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import download from 'downloadjs';
import { Grid, Typography, Divider, Chip, IconButton, Switch, Box } from '@mui/material';
import CopyIcon from '../../../components/Icons/CopyIcon';
import Iconify from '../../../components/iconify';
import { fDate } from '../../../utils/formatTime';
import ViewFormServiceRecordVersionAudit from '../../../components/ViewForms/ViewFormServiceRecordVersionAudit';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import { deleteCheckItemFile, downloadCheckItemFile, getMachineServiceRecordCheckItems } from '../../../redux/slices/products/machineServiceRecord';
import { DocumentGalleryItem } from '../../../components/gallery/DocumentGalleryItem';
import Lightbox from '../../../components/lightbox/Lightbox';

const CheckedItemValueHistoryItem = ({ historyItem, inputType }) => {
  const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machineId, serviceId} = useParams();

  const regEx = /^[^2]*/;
  const [selectedImage, setSelectedImage] = useState(-1);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    if (historyItem?.files) {
        const updatedFiles = historyItem.files?.map(file => ({
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
        const response = await dispatch(downloadCheckItemFile(machineId, serviceId, image?._id));
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

  const handleDeleteCheckItemFile = async (fileId) => {
    try {
      await dispatch(deleteCheckItemFile(machineId, fileId));
      await dispatch(getMachineServiceRecordCheckItems(machineId, machineServiceRecord?._id))
      enqueueSnackbar('File Archived successfully!');
    } catch (err) {
      console.log(err);
      enqueueSnackbar('File Deletion failed!', { variant: `error` });
    }
  };

  const handleDownloadCheckItemFile = (fileId, name, extension) => {
    dispatch(downloadCheckItemFile(machineId, serviceId, fileId))
      .then((res) => {
        if (regEx.test(res.status)) {
          download(atob(res.data), `${name}.${extension}`, { type: extension });
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
                <DocumentGalleryItem isLoading={!slides} key={file?.id} image={file} 
                  onOpenLightbox={()=> handleOpenLightbox(_index)}
                  onDownloadFile={()=> handleDownloadCheckItemFile(file._id, file?.name, file?.extension)}
                  onDeleteFile={()=> handleDeleteCheckItemFile(file._id)}
                  toolbar
                />
              ))}
            </Box>
            <ViewFormServiceRecordVersionAudit value={historyItem} />
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
          </>
        );
};


CheckedItemValueHistoryItem.propTypes = {
  historyItem: PropTypes.object,
  inputType: PropTypes.string,
};

export default CheckedItemValueHistoryItem;
