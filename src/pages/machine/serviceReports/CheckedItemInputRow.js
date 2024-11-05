import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import b64toBlob from 'b64-to-blob';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography, Stack, Dialog, DialogTitle, Button, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { addCheckItemValues, deleteCheckItemFile, downloadCheckItemFile } from '../../../redux/slices/products/machineServiceReport';
import FormProvider from '../../../components/hook-form/FormProvider';
import { RHFAutocomplete, RHFDatePicker, RHFSwitch, RHFTextField, RHFUpload } from '../../../components/hook-form';
import { statusTypes } from '../util';
import { fDate, stringToDate } from '../../../utils/formatTime';
import CheckedItemValueHistory from './CheckedItemValueHistory';
import { CheckItemSchema } from '../../schemas/machine';
import SkeletonPDF from '../../../components/skeleton/SkeletonPDF';

const CheckedItemInputRow = memo(({ index, childIndex, checkItemListId, rowData }) => {
    const regEx = /^[^2]*/;
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { machineId, id } = useParams();
    const { machineServiceReport } = useSelector((state) => state.machineServiceReport);
    const [pdf, setPDF] = useState(null);
    const [PDFName, setPDFName] = useState('');
    const [PDFViewerDialog, setPDFViewerDialog] = useState(false);

    const getReportValue = (item) => {
      if (item?.inputType === 'Date') {
        return stringToDate(item?.reportValue?.checkItemValue, 'dd/MM/yyyy');
      }
      if (item?.inputType === 'Boolean') {
        return item?.reportValue?.checkItemValue === 'true';
      }
      if (item?.inputType === 'Number') {
        const value = parseFloat(item?.reportValue?.checkItemValue);
        return Number.isNaN(value) ? "" : value;
      }
      if (item?.inputType === 'Status') {
        return statusTypes.find((st) => st?.name === item?.reportValue?.checkItemValue) || null;
      }
      return item?.reportValue?.checkItemValue || "";
    };

    const defaultValues = useMemo(
      () => ({
          checkItemListId,
          machineCheckItem:     rowData._id || null,
          serviceReport:        machineServiceReport?._id,
          serviceId:            machineServiceReport?.serviceId,
          versionNo:            machineServiceReport?.versionNo,
          comments:             rowData?.reportValue?.comments || "",
          checkItemValue:       getReportValue(rowData),
          inputType:            rowData?.inputType || '',
          name:                 rowData?.name || '',
          isRequired:           rowData?.isRequired || false,
          images:               rowData?.reportValue?.files?.map(file => ({
            uploaded:           true,
            key:                file?._id || '',
            _id:                file?._id || '',
            name:               `${file?.name || '' }.${file?.extension || ''}`,
            type:               file?.fileType || '',
            fileType:           file?.fileType || '',
            preview:            `data:${file?.fileType || '' };base64, ${file?.thumbnail || ''}`,
            src:                `data:${file?.fileType || '' };base64, ${file?.thumbnail || ''}`,
            path:               `${file?.name || '' }.${file?.extension || '' }`,
            downloadFilename:   `${file?.name || '' }.${file?.extension || '' }`,
            machineId,
            id,
          })) || []
      }), [ rowData, machineId, id, checkItemListId, machineServiceReport ] );
    
    const methods = useForm({
      resolver: yupResolver(CheckItemSchema),
      defaultValues,
      shouldUnregister: false,
    });

    const {
      reset,
      setValue,
      getValues,
      watch,
      formState: { isSubmitting },
      handleSubmit
    } = methods;
    
    const watchedValues = watch();

  const isChanged = useMemo(() => 
    JSON.stringify(defaultValues.checkItemValue) !== JSON.stringify(watchedValues.checkItemValue) ||
    JSON.stringify(defaultValues.comments ) !== JSON.stringify(watchedValues.comments ) ||
    watchedValues?.images?.filter( f => !f?.uploaded )?.length > 0 
  ,[watchedValues, defaultValues]);
  
    const [showMessages, setShowMessages] = useState( false );

    useEffect(() => {
        reset(defaultValues);
    }, [ reset, defaultValues, rowData ]);
    
    const onSubmit = async ( data ) => {
      try {
        if (data.checkItemValue instanceof Date) {
          data.checkItemValue = fDate(data.checkItemValue, 'dd/MM/yyyy');
        } else if(typeof data.checkItemValue === 'object'){
          data.checkItemValue = data?.checkItemValue?.name;
        } else{
          data.checkItemValue = data?.checkItemValue || '';
        }

        await dispatch( addCheckItemValues( machineId, data, index, childIndex ));
        reset()
        setShowMessages( true );
        setTimeout(() => {
          setShowMessages( false );
        }, 20000);
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Saving failed!', { variant: `error` });
      }
    };

    const handleDropMultiFile = useCallback(
      ( acceptedFiles ) => {
        const existingFiles = getValues('images') || [];
        const newFiles = acceptedFiles?.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            src: URL.createObjectURL(file),
            isLoaded: true,
          })
        );
        const updatedFiles = [...existingFiles, ...newFiles];
        setValue(`images`, updatedFiles, { shouldValidate: true });
      },
      [setValue, getValues]
    );

    const handleRemoveFile = async ( inputFile )=>{
      let images = getValues(`images`);
      if(inputFile?._id){
        await dispatch(deleteCheckItemFile(machineId, inputFile?._id, index, childIndex ))
        images = await images?.filter((file) => ( file?._id !== inputFile?._id ))
        console.log("images dispatch : ",images);
      } else {
        images = await images?.filter((file) => ( file !== inputFile ))
        console.log("images : ",images);
      }
      setValue(`images`, images, { shouldValidate: true } )
    }

    const handleLoadImage = async (imageId) => {
      try {
        const response = await dispatch(downloadCheckItemFile(machineId, id, imageId));
        if (regEx.test(response.status)) {
          const existingFiles = getValues('images');
          const imageIndex = existingFiles.findIndex(image => image?._id === imageId);
          if (imageIndex !== -1) {
            const image = existingFiles[imageIndex];
            existingFiles[imageIndex] = {
              ...image,
              src: `data:${image?.fileType};base64,${response.data}`,
              preview: `data:${image?.fileType};base64,${response.data}`,
              isLoaded: true,
            };
            setValue('images', existingFiles, { shouldValidate: true });
          }
        }
      } catch (error) {
        console.error('Error loading full file:', error);
      }
    };

    const handleOpenFile = async (file, fileName) => {
      setPDFName(fileName);
      setPDFViewerDialog(true);
      setPDF(null);
      try {
        if(!file?.isLoaded){
          const response = await dispatch(downloadCheckItemFile(machineId, id, file._id));
          if (regEx.test(response.status)) {
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
        setPDFViewerDialog(false)
        if (error.message) {
          enqueueSnackbar(error.message, { variant: 'error' });
        } else {
          enqueueSnackbar('Something went wrong!', { variant: 'error' });
        }
      }
    };

  return (
    <Stack spacing={2} px={2}>
      <FormProvider key={`form-${index}`} methods={methods}  onSubmit={handleSubmit(onSubmit)} >
            <Stack spacing={1} key={defaultValues._id}>
              <Typography variant="body2" size="small">
                <b>{`${index + 1}.${childIndex + 1}. `}</b>
                {`${defaultValues.name}`}
              </Typography>
              {defaultValues?.inputType === 'Boolean' && (
                <RHFSwitch size="small" label="Check" name="checkItemValue"  />
              )}
              {(defaultValues?.inputType === 'Short Text' || defaultValues?.inputType === 'Long Text') && (
                <RHFTextField
                  multiline
                  label={`${defaultValues?.inputType}`}
                  name="checkItemValue" 
                  size="small"
                  InputProps={{
                    inputProps: { maxLength: defaultValues?.inputType === 'Long Text' ? 3000 : 200 },
                  }}
                />
              )}
              {defaultValues?.inputType === 'Date' && (
                <RHFDatePicker
                  label={`Enter Date ${defaultValues?.isRequired && '*'}`}
                  name="checkItemValue" 
                  format="dd/mm/yyyy"
                  size="small"
                />
              )}
              {defaultValues?.inputType === 'Number' && (
                <RHFTextField
                  label={`${defaultValues?.inputType}`}
                  name="checkItemValue" 
                  type="number"
                  size="small"
                />
              )}
              {defaultValues?.inputType === 'Status' && (
                <RHFAutocomplete
                  size="small"
                  label={`${defaultValues?.inputType} ${defaultValues?.isRequired ? '*' : ''}`}
                  name="checkItemValue"                  
                  options={statusTypes}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, val ) => option.name === val.name}
                  renderOption={(props, option) => (
                    <li {...props} key={`status-${index}-${childIndex}-${option.name}`}>{`${
                      option?.name || ''
                    }`}</li>
                  )}
                />
              )}

              <RHFTextField
                name="comments"
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
                name="images"
                onDrop={(accepted) => handleDropMultiFile( accepted )}
                onRemove={(inputFile) => handleRemoveFile( inputFile )}
                onLoadPDF={ handleOpenFile }
                onLoadImage={(imageId, imageIndex) =>
                  handleLoadImage(imageId, imageIndex )
                }
              />

              <Grid
                container
                sx={{ m: 1 }}
                display="flex"
                direction="row"
                justifyContent="flex-end"
                gap={2}
              >
                { showMessages && (
                  <Typography variant="body2" color="green" sx={{ mt: 1 }}>
                    Saved Successfully!
                  </Typography>
                )}
                <LoadingButton
                  type="submit"
                  size="small"
                  loading={ isSubmitting }
                  variant="contained"
                  disabled={!( isChanged )} 
                >
                  Save
                </LoadingButton>
              </Grid>

              {rowData?.historicalData?.length > 0 && (
                <CheckedItemValueHistory
                  historicalData={rowData.historicalData}
                  inputType={rowData.inputType}
                />
              )}
            </Stack>
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
    childIndex: PropTypes.number,
    checkItemListId: PropTypes.string,
    rowData: PropTypes.object,
  };

export default CheckedItemInputRow;