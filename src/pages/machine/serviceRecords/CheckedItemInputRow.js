import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import b64toBlob from 'b64-to-blob';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography, Stack, Card, Dialog, DialogTitle, Button, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { addCheckItemValues, deleteCheckItemFile, downloadCheckItemFile, resetSubmittingCheckItemIndex } from '../../../redux/slices/products/machineServiceRecord';
import FormProvider from '../../../components/hook-form/FormProvider';
import { RHFAutocomplete, RHFDatePicker, RHFSwitch, RHFTextField, RHFUpload } from '../../../components/hook-form';
import { statusTypes } from '../util';
import { fDate, stringToDate } from '../../../utils/formatTime';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import CheckedItemValueHistory from './CheckedItemValueHistory';
import { CheckItemSchema } from '../../schemas/machine';
import SkeletonPDF from '../../../components/skeleton/SkeletonPDF';

const CheckedItemInputRow = memo(({ index, row }) => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { machineId, id } = useParams();
    const { machineServiceRecord, submittingCheckItemIndex } = useSelector((state) => state.machineServiceRecord);
    
    const MainSchema = Yup.object().shape({
      checkItems: Yup.array().of(CheckItemSchema),
    });

    const getRecordValue = (item) => {
      if (item?.inputType === 'Date') {
        return stringToDate(item?.recordValue?.checkItemValue, 'dd/MM/yyyy');
      }
      if (item?.inputType === 'Boolean') {
        return item?.recordValue?.checkItemValue === 'true';
      }
      if (item?.inputType === 'Number') {
        const value = parseFloat(item?.recordValue?.checkItemValue);
        return Number.isNaN(value) ? '' : value;
      }
      if (item?.inputType === 'Status') {
        return statusTypes.find((st) => st?.name === item?.recordValue?.checkItemValue) || null;
      }
      return item?.recordValue?.checkItemValue;
    };

    const defaultValues = useMemo(
      () => ({
        checkItems: row?.checkItems?.map(item => ({
          _id:item._id,
          comment: item?.recordValue?.comments,
          value:getRecordValue(item),
          recordValue:item?.recordValue,
          inputType:item?.inputType,
          images: item?.recordValue?.files?.map(file => ({
            uploaded:true,
            key: file?._id,
            _id: file?._id,
            name:`${file?.name}.${file?.extension}`,
            type: file?.fileType,
            fileType: file?.fileType,
            preview: `data:${file?.fileType};base64, ${file?.thumbnail}`,
            src: `data:${file?.fileType};base64, ${file?.thumbnail}`,
            path:`${file?.name}.${file?.extension}`,
            downloadFilename:`${file?.name}.${file?.extension}`,
            machineId,
            id,
          })) || []
        })) || [],
      }),
      [row, machineId, id]
    );
    
    const methods = useForm({
      resolver: yupResolver(MainSchema),
      defaultValues,
      mode:'onChange',
    });
  
    const {
      reset,
      setValue,
      getValues,
      trigger,
    } = methods;

    const [showMessages, setShowMessages] = useState({});

    useEffect(() => {
        reset(defaultValues);
        dispatch(resetSubmittingCheckItemIndex());
    }, [dispatch, reset, defaultValues]);
    

    const onSubmit = async (data, childIndex) => {
      try {
        const checkItem = data.checkItems[childIndex];
        const params = {
          serviceRecord:machineServiceRecord?._id,
          serviceId:machineServiceRecord?.serviceId,
          versionNo:machineServiceRecord?.versionNo,
          checkItemListId:row?._id,
          machineCheckItem:checkItem?._id,
          comments:checkItem?.comment || '',
          recordValue:checkItem?.recordValue || {},
          images:checkItem?.images.filter(image => !image.uploaded)
        }

        if (checkItem.value instanceof Date) {
          params.checkItemValue = fDate(checkItem.value, 'dd/MM/yyyy');
        } else if(typeof checkItem.value==='object'){
          params.checkItemValue=checkItem?.value?.name;
        } else if(typeof checkItem.value==='boolean'){
          params.checkItemValue=checkItem?.value;
        }else{
          params.checkItemValue=checkItem?.value || '';
        }

        const serviceRecordValue = await dispatch(addCheckItemValues(machineId,params, childIndex));
        console.log("data Saved  on submit serviceRecordValue : ", serviceRecordValue)
        const updatedCheckItems = [...getValues('checkItems')];
        updatedCheckItems[childIndex].recordValue = serviceRecordValue;
        updatedCheckItems[childIndex].images = updatedCheckItems[childIndex].images?.map(image => ({
          uploaded: true,
          name:image?.name,
          type:image?.type,
          ...image
        }));
        reset({ ...getValues(), checkItems: updatedCheckItems });
        const combinedIndex = `${index}-${childIndex}`;
        setShowMessages(prev => ({ ...prev, [combinedIndex]: true }));
        setTimeout(() => {
          setShowMessages(prev => ({ ...prev, [combinedIndex]: false }));
        }, 20000);
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Saving failed!', { variant: `error` });
      }
    };

    const handleDropMultiFile = useCallback(
      (acceptedFiles, childIndex) => {
        const existingFiles = getValues(`checkItems[${childIndex}].images`) || [];
        const newFiles = acceptedFiles?.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            src: URL.createObjectURL(file),
            isLoaded: true,
          })
        );
        const updatedFiles = [...existingFiles, ...newFiles];
        setValue(`checkItems[${childIndex}].images`, updatedFiles, { shouldValidate: true });
      },
      [setValue, getValues]
    );

    const handleRemoveFile = async (inputFile, childIndex)=>{
      
      if(inputFile?._id){
        await dispatch(deleteCheckItemFile(machineId, inputFile?._id))
      }

      setValue(
        `checkItems[${childIndex}].images`,
        getValues(`checkItems[${childIndex}].images`)?.filter((file) => file !== inputFile),
        { shouldValidate: true }
      )
    }

    const regEx = /^[^2]*/;
    const handleLoadImage = async (imageId, imageIndex, childIndex) => {
      try {
        const response = await dispatch(downloadCheckItemFile(machineId, id, imageId));
        if (regEx.test(response.status)) {
          // Update the image property in the imagesLightbox array
          const existingFiles = getValues(`checkItems[${childIndex}].images`) || [];
          const image = existingFiles[imageIndex];
    
          existingFiles[imageIndex] = {
            ...image,
            src: `data:${image?.fileType};base64,${response.data}`,
            preview: `data:${image?.fileType};base64,${response.data}`,
            isLoaded: true,
          };
    
          setValue(`checkItems[${childIndex}].images`, existingFiles, { shouldValidate: true });
        }
      } catch (error) {
        console.error('Error loading full file:', error);
      }
    };

    const [pdf, setPDF] = useState(null);
    const [PDFName, setPDFName] = useState('');
    const [PDFViewerDialog, setPDFViewerDialog] = useState(false);

    const handleOpenFile = async (file, fileName) => {
      setPDFName(fileName);
      setPDFViewerDialog(true);
      setPDF(null);
      try {
        if(!file?.isLoaded){
          const response = await dispatch(downloadCheckItemFile(machineId, id, file._id));
          if (regEx.test(response.status)) {
            const pdfData = `data:application/pdf;base64,${encodeURI(response.data)}`;
            const blob = b64toBlob(encodeURI(response.data), 'application/pdf')
            const url = URL.createObjectURL(blob);
            setPDF(url);
          } else {
            enqueueSnackbar(response.statusText, { variant: 'error' });
          }
        }else{
          setPDF(file?.src);
        }
      } catch (error) {
        if (error.message) {
          enqueueSnackbar(error.message, { variant: 'error' });
        } else {
          enqueueSnackbar('Something went wrong!', { variant: 'error' });
        }
      }
    };

    const handleSave = async (childIndex) => {
      const isValid = await trigger(`checkItems[${childIndex}].value`);
      if(isValid){
        const data = getValues();
        await onSubmit(data, childIndex);
      }
    };

  return (
    <Stack spacing={2} px={2}>
      <FormLabel
        content={`${index + 1}). ${
          (typeof row?.ListTitle === 'string' && row?.ListTitle) || ''
        } ( Items: ${`${row?.checkItems?.length} `})`}
      />
      <FormProvider key={`form-${index}`} methods={methods}>
        {row?.checkItems?.map((childRow, childIndex) => (
          <Card key={`card-${index}-${childIndex}`} sx={{ boxShadow: 'none' }}>
            <Stack spacing={1} mx={1} key={childRow._id}>
              <Typography variant="body2" size="small">
                <b>{`${index + 1}.${childIndex + 1}. `}</b>
                {`${childRow.name}`}
              </Typography>
              {childRow?.inputType === 'Boolean' && (
                <RHFSwitch size="small" label="Check" name={`checkItems[${childIndex}].value`} />
              )}
              {(childRow?.inputType === 'Short Text' || childRow?.inputType === 'Long Text') && (
                <RHFTextField
                  multiline
                  label={`${childRow?.inputType}`}
                  name={`checkItems[${childIndex}].value`}
                  size="small"
                  required
                  InputProps={{
                    inputProps: { maxLength: childRow?.inputType === 'Long Text' ? 3000 : 200 },
                  }}
                />
              )}
              {childRow?.inputType === 'Date' && (
                <RHFDatePicker
                  label={`Enter Date ${childRow?.isRequired && '*'}`}
                  name={`checkItems[${childIndex}].value`}
                  format="dd/mm/yyyy"
                  size="small"
                  required
                />
              )}
              {childRow?.inputType === 'Number' && (
                <RHFTextField
                  label={`${childRow?.inputType}`}
                  name={`checkItems[${childIndex}].value`}
                  type="number"
                  size="small"
                  required
                />
              )}
              {childRow?.inputType === 'Status' && (
                <RHFAutocomplete
                  size="small"
                  label={`${childRow?.inputType} ${childRow?.isRequired ? '*' : ''}`}
                  name={`checkItems[${childIndex}].value`}
                  options={statusTypes}
                  required
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  renderOption={(props, option) => (
                    <li {...props} key={`status-${index}-${childIndex}-${option.name}`}>{`${
                      option?.name || ''
                    }`}</li>
                  )}
                />
              )}

              <RHFTextField
                name={`checkItems[${childIndex}].comment`}
                label="Comments"
                type="text"
                size="small"
                minRows={2}
                multiline
                InputProps={{ inputProps: { maxLength: 5000 } }}
              />

              <RHFUpload
                multiple
                thumbnail
                dropZone={false}
                name={`checkItems[${childIndex}].images`}
                // files={files[childIndex] || []}
                onDrop={(accepted) => handleDropMultiFile(accepted, childIndex)}
                onRemove={(inputFile) => handleRemoveFile(inputFile, childIndex)}
                onLoadImage={(imageId, imageIndex) =>
                  handleLoadImage(imageId, imageIndex, childIndex)
                }
                onLoadPDF={handleOpenFile}
              />

              <Grid
                container
                sx={{ m: 1 }}
                display="flex"
                direction="row"
                justifyContent="flex-end"
                gap={2}
              >
                {showMessages[`${index}-${childIndex}`] && (
                  <Typography variant="body2" color="green" sx={{ mt: 1 }}>
                    Saved Successfully!
                  </Typography>
                )}
                <LoadingButton
                  size="small"
                  onClick={() => handleSave(childIndex)} // Pass childIndex
                  loading={submittingCheckItemIndex === childIndex}
                  variant="contained"
                >
                  Save
                </LoadingButton>
              </Grid>

              {childRow?.historicalData?.length > 0 && (
                <CheckedItemValueHistory
                  historicalData={childRow.historicalData}
                  inputType={childRow.inputType}
                />
              )}
            </Stack>
          </Card>
        ))}
      </FormProvider>
      {PDFViewerDialog && (
      <Dialog fullScreen open={PDFViewerDialog} onClose={()=> setPDFViewerDialog(false)}>
        <DialogTitle variant='h3' sx={{pb:1, pt:2, display:'flex', justifyContent:'space-between'}}>
            PDF View
              <Button variant='outlined' onClick={()=> setPDFViewerDialog(false)}>Close</Button>
        </DialogTitle>
        <Divider variant='fullWidth' />
          {pdf?(
              <iframe title={PDFName} src={pdf} style={{paddingBottom:10}} width='100%' height='842px'/>
            ):(
              <SkeletonPDF />
            )}
      </Dialog>
    )}
    </Stack>
  );
});

CheckedItemInputRow.propTypes = {
    index: PropTypes.number,  
    row: PropTypes.object,
  };

export default CheckedItemInputRow;