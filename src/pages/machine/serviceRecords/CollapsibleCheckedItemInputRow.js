import { memo, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import download from 'downloadjs';
import { Table, TableBody, Grid, TextField, Checkbox, Typography, Stack, Divider, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CommentsInput from './CommentsInput';
import ViewFormServiceRecordVersionAudit from '../../../components/ViewForms/ViewFormServiceRecordVersionAudit';
import { StyledTableRow } from '../../../theme/styles/default-styles';
import { deleteFile, downloadFile, setAddFileDialog } from '../../../redux/slices/products/machineServiceRecord';
import { DocumentGalleryItem } from '../../../components/gallery/DocumentGalleryItem';
import { ThumbnailDocButton } from '../../../components/Thumbnails';
import DialogServiceRecordAddFile from '../../../components/Dialog/DialogServiceRecordAddFile';

const CollapsibleCheckedItemInputRow = ({ row, index, checkItemLists, setValue, 
  editPage,
  handleChangeCheckItemListDate,
  handleChangeCheckItemListValue, 
  handleChangeCheckItemListStatus,
  handleChangeCheckItemListComment,
  handleChangeCheckItemListChecked,
  handleChangeCheckItemListCheckBoxValue, machineId, serviceId }) => {

    const dispatch  = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
  
    const [files, setFiles] = useState([]);

    const regEx = /^[^2]*/;
    const [selectedImage, setSelectedImage] = useState(-1);
    const [slides, setSlides] = useState([]);

    const handleAddFileDialog = ()=>{
      dispatch(setAddFileDialog(true));
    }
  
    const handleOpenLightbox = async (_index) => {
      setSelectedImage(_index);
      const image = slides[_index];
  
      if(!image?.isLoaded && image?.fileType?.startsWith('image')){
        try {
          const response = await dispatch(downloadFile(machineId, serviceId, image?._id));
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
  
    const handleDeleteFile = async (fileId) => {
      try {
        await dispatch(deleteFile(machineId, serviceId, fileId));
        // await dispatch(getMachineServiceRecord(serviceId))
        enqueueSnackbar('File Archived successfully!');
      } catch (err) {
        console.log(err);
        enqueueSnackbar('File Deletion failed!', { variant: `error` });
      }
    };
  
    const handleDownloadFile = (fileId, name, extension) => {
      dispatch(downloadFile(machineId, serviceId, fileId))
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

    return(<>
        <Typography key={index} variant='h5'>
            <b>{`${index+1}). `}</b>{typeof row?.ListTitle === 'string' && row?.ListTitle || ''}{' ( Items: '}<b>{`${row?.checkItems?.length}`}</b>{' ) '}
        </Typography>
        <Grid sx={{ml:3}} >
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {row?.checkItems?.map((childRow,childIndex) => (
                    <StyledTableRow key={childRow._id}>
                      <Grid display='flex' flexDirection='column' sx={{ m:  1}} key={childRow._id} >
                          <Grid>
                            <CommentsInput index={index} childIndex={childIndex} 
                              key={`${index}${childIndex}`}
                              childRow={childRow}
                              checkParamList={checkItemLists} 
                              isChecked={checkItemLists[index]?.checkItems[childIndex]?.checked}
                              callCheckedValue={()=>handleChangeCheckItemListChecked(index, childIndex )}
                              handleChangeCheckItemListDate={handleChangeCheckItemListDate}
                              handleChangeCheckItemListValue={handleChangeCheckItemListValue}
                              handleChangeCheckItemListStatus={handleChangeCheckItemListStatus}
                              handleChangeCheckItemListComment={handleChangeCheckItemListComment}
                              handleChangeCheckItemListChecked={handleChangeCheckItemListChecked}
                              handleChangeCheckItemListCheckBoxValue={handleChangeCheckItemListCheckBoxValue}
                            />
                        </Grid>

                        <Grid >
                          <TextField 
                              type="text"
                              label="Comment" 
                              name="comment"
                              disabled={!checkItemLists[index]?.checkItems[childIndex]?.checked}
                              onChange={(e) => handleChangeCheckItemListComment(index, childIndex, e.target.value)}
                              size="small" sx={{ width: '100%',mt:2 }} 
                              value={checkItemLists[index]?.checkItems[childIndex]?.comments}
                              minRows={2} multiline
                              InputProps={{ inputProps: { maxLength: 5000 } }}
                              InputLabelProps={{ shrink: checkItemLists[index]?.checkItems[childIndex]?.checked || checkItemLists[index]?.checkItems[childIndex]?.comments}}
                          />
                        </Grid>
                        {editPage && childRow?.recordValue?.checkItemValue && 
                          <Stack spacing={1}  >
                              <Divider sx={{mt:1.5 }}/>
                              <Typography variant="body2" sx={{mt:1}}><b>Value : </b>
                              {childRow?.inputType?.toLowerCase() !== 'boolean' ? childRow?.recordValue?.checkItemValue || ''  : 
                              <Checkbox  disabled checked={childRow?.recordValue?.checkItemValue === 'true' || childRow?.recordValue?.checkItemValue === true } sx={{my:'auto',mr:'auto'}} /> }
                              </Typography>
                              {childRow?.recordValue?.comments && <Typography variant="body2" sx={{ alignItems: 'center', whiteSpace: 'pre-line', wordBreak: 'break-word'}} ><b>Comment: </b>{childRow?.recordValue?.comments || ''}</Typography>}
                              <ViewFormServiceRecordVersionAudit value={childRow?.recordValue}/>
                          </Stack>}
                      </Grid>
                      <Box
                        sx={{my:1, mx:1, width:'100%'}}
                        gap={2}
                        display="grid"
                        gridTemplateColumns={{
                          xs: 'repeat(1, 1fr)',
                          sm: 'repeat(3, 1fr)',
                          md: 'repeat(5, 1fr)',
                          lg: 'repeat(6, 1fr)',
                          xl: 'repeat(12, 1fr)',
                        }}
                      >

                    {files?.map((file, _index) => (
                      <DocumentGalleryItem size={70} isLoading={!files} key={file?.id} image={file} 
                        onOpenLightbox={()=> handleOpenLightbox(_index)}
                        onDownloadFile={()=> handleDownloadFile(file._id, file?.name, file?.extension)}
                        onDeleteFile={()=> handleDeleteFile(file._id)}
                        toolbar
                      />
                    ))}

                    {childRow && <ThumbnailDocButton size={70} onClick={handleAddFileDialog}/>}
                  </Box>
                  <Grid sx={{m:1}} display='flex' direction='row-reverse'>
                    <LoadingButton variant='contained'>Save</LoadingButton>
                  </Grid>
                  </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
        </Grid>
        <DialogServiceRecordAddFile />
        </>
  )
}

CollapsibleCheckedItemInputRow.propTypes = {
    index: PropTypes.number,
    row: PropTypes.object,
    editPage: PropTypes.bool,
    checkItemLists: PropTypes.array,
    handleChangeCheckItemListDate: PropTypes.func,
    handleChangeCheckItemListValue: PropTypes.func,
    handleChangeCheckItemListStatus: PropTypes.func,
    handleChangeCheckItemListComment: PropTypes.func,
    handleChangeCheckItemListChecked: PropTypes.func,
    handleChangeCheckItemListCheckBoxValue: PropTypes.func,
    setValue: PropTypes.func,
    machineId:PropTypes.string,
    serviceId:PropTypes.string
  };

export default memo(CollapsibleCheckedItemInputRow)