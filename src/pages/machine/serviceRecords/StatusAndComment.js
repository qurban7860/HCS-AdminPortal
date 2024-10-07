import React, { useState, memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Chip, TableRow, Typography, Box, Switch, Divider, Button, Dialog, DialogTitle } from '@mui/material';
import download from 'downloadjs';
import { useSnackbar } from 'notistack';
import b64toBlob from 'b64-to-blob';
import { fDate } from '../../../utils/formatTime';
import CopyIcon from '../../../components/Icons/CopyIcon';
import ViewFormServiceRecordVersionAudit from '../../../components/ViewForms/ViewFormServiceRecordVersionAudit';
import { DocumentGalleryItem } from '../../../components/gallery/DocumentGalleryItem';
import { deleteCheckItemFile, downloadCheckItemFile, setAddFileDialog } from '../../../redux/slices/products/machineServiceRecord';
import Lightbox from '../../../components/lightbox/Lightbox';
import CheckedItemValueHistory from './CheckedItemValueHistory';
import SkeletonPDF from '../../../components/skeleton/SkeletonPDF';

const StatusAndComment = ({index, childIndex, childRow, machineId, serviceId}) => {
    const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const regEx = /^[^2]*/;
    const [selectedImage, setSelectedImage] = useState(-1);
    const [slides, setSlides] = useState([]);
    const [pdf, setPDF] = useState(null);
    const [PDFName, setPDFName] = useState('');
    const [AttachedPDFViewerDialog, setAttachedPDFViewerDialog] = useState(false);

    const handleAddFileDialog = () => {
      dispatch(setAddFileDialog(true));
    }

    useEffect(() => {
      if ( childRow?.recordValue?.files ){
          const updatedFiles = childRow?.recordValue?.files?.filter(file => file?.fileType && file.fileType.startsWith("image"))?.map(file => ({
            ...file,
            src: `data:${file?.fileType};base64,${file?.thumbnail}`,
            thumbnail: `data:${file?.fileType};base64,${file?.thumbnail}`
          }));
          setSlides(updatedFiles);
      }
    }, [childRow]);
  
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
        if( machineId && fileId ){
          await dispatch(deleteCheckItemFile( machineId, fileId, index, childIndex ));
        }
        // if( machineId && machineServiceRecord?._id ){
        //   await dispatch(getMachineServiceRecordCheckItems( machineId, machineServiceRecord?._id ))
        // }
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


  const handleOpenFile = async (file) => {
    try {
      setPDFName(`${file?.name}.${file?.extension}`);
      setAttachedPDFViewerDialog(true);
      setPDF(null);
      const response = await dispatch(downloadCheckItemFile(machineId, file.serviceRecord, file._id));
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
    <TableRow key={childRow._id} sx={{ backgroundColor: 'none',}} >
    <Grid item md={12} sx={{mt: childIndex !==0 && 0.5, p:1,  border: '1px solid #e8e8e8',  borderRadius:'7px',backgroundColor: 'white' }} >
      <Grid item md={12} sx={{ display: childRow?.recordValue?.checkItemValue ? 'block' : 'flex'}}>
        <Typography variant="body2" ><b>{`${index+1}.${childIndex+1}- `}</b>{`${childRow.name}`}</Typography>
        {childRow?.recordValue?.checkItemValue && 
          <Grid >
            <Grid sx={{ mt:1,
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word' }}>
              <Typography variant="body2" >
                  <b>Value: </b>
                  {childRow?.inputType.toLowerCase() === 'boolean' && childRow?.recordValue?.checkItemValue && 
                    <Switch sx={{mt:-0.5}} size='small' disabled checked={childRow?.recordValue?.checkItemValue==='true'} />
                  }                        
                  {childRow?.inputType.toLowerCase() === 'date' ? fDate(childRow?.recordValue?.checkItemValue) : 
                    <> 
                      {childRow?.inputType.toLowerCase() === 'status' ? (childRow?.recordValue?.checkItemValue && 
                        <Chip size="small" label={childRow?.recordValue?.checkItemValue} /> || '') : 
                        (childRow?.inputType.toLowerCase() === 'number' || 
                        childRow?.inputType.toLowerCase() === 'long text' || 
                        childRow?.inputType.toLowerCase() === 'short text') && 
                        childRow?.recordValue?.checkItemValue 
                      }
                        {childRow?.recordValue?.checkItemValue?.trim() && childRow?.inputType?.toLowerCase() !== 'boolean' && <CopyIcon value={childRow?.recordValue?.checkItemValue}/>}
                    </> 
                }
              </Typography>
            </Grid>
            <Grid sx={{ 
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word' }}>
              {childRow?.recordValue?.comments && <Typography variant="body2" sx={{mr:1}} ><b>Comment: </b>{childRow?.recordValue?.comments}
                {childRow?.recordValue?.comments?.trim() && <CopyIcon value={childRow?.recordValue?.comments || ''} />}
              </Typography>}
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
                onDeleteFile={machineServiceRecord.status === "DRAFT" ? ()=> handleDeleteCheckItemFile(file._id):undefined}
                toolbar
              />
            ))}
            { childRow?.recordValue?.files?.map((file, _index) => !file.fileType.startsWith("image") && (
              <DocumentGalleryItem key={file?.id} image={file} 
                onOpenFile={()=> handleOpenFile(file)}
                onDownloadFile={()=> handleDownloadCheckItemFile(file._id, file?.name, file?.extension)}
                onDeleteFile={machineServiceRecord.status === "DRAFT" ? ()=> handleDeleteCheckItemFile(file._id):undefined}
                toolbar
              />
            ))}
          </Box>
          <ViewFormServiceRecordVersionAudit value={childRow?.recordValue}/>
        </Grid>
        }
        {/* {childRow?.historicalData && childRow?.historicalData?.length > 0 &&
          <HistoryDropDownUpIcons showTitle="Show History" hideTitle="Hide History" activeIndex={`${activeIndex || ''}`} indexValue={`${index}${childIndex}`} onClick={handleAccordianClick}/>
        } */}
      </Grid>

      {childRow?.historicalData?.length > 0 && (
        <CheckedItemValueHistory historicalData={childRow?.historicalData} inputType={childRow?.inputType} />
      )}
      </Grid>
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
    </TableRow>
  )
}
StatusAndComment.propTypes = {
    index: PropTypes.number,
    childIndex: PropTypes.number,
    childRow: PropTypes.object,
    machineId: PropTypes.string,
    serviceId: PropTypes.string,
  };
export default memo(StatusAndComment)