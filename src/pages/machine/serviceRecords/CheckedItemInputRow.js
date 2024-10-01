import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { addCheckItemValues, deleteCheckItemFile, downloadCheckItemFile, resetSubmittingCheckItemIndex } from '../../../redux/slices/products/machineServiceRecord';
import FormProvider from '../../../components/hook-form/FormProvider';
import { RHFAutocomplete, RHFDatePicker, RHFSwitch, RHFTextField, RHFUpload } from '../../../components/hook-form';
import { statusTypes } from '../util';
import { fDate, stringToDate } from '../../../utils/formatTime';
import CheckedItemValueHistory from './CheckedItemValueHistory';
import { CheckItemSchema } from '../../schemas/machine';

const CheckedItemInputRow = memo(({ index, childIndex, checkItemListId, rowData }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { machineId, id } = useParams();
    const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);

    const getRecordValue = (item) => {
      if (item?.inputType === 'Date') {
        return stringToDate(item?.recordValue?.checkItemValue, 'dd/MM/yyyy');
      }
      if (item?.inputType === 'Boolean') {
        return item?.recordValue?.checkItemValue === 'true';
      }
      if (item?.inputType === 'Number') {
        const value = parseFloat(item?.recordValue?.checkItemValue);
        return Number.isNaN(value) ? "" : value;
      }
      if (item?.inputType === 'Status') {
        return statusTypes.find((st) => st?.name === item?.recordValue?.checkItemValue) || null;
      }
      return item?.recordValue?.checkItemValue || "";
    };

    const defaultValues = useMemo(
      () => ({
          checkItemListId,
          machineCheckItem:     rowData._id || null,
          serviceRecord:        machineServiceRecord?._id,
          serviceId:            machineServiceRecord?.serviceId,
          versionNo:            machineServiceRecord?.versionNo,
          comments:             rowData?.recordValue?.comments || "",
          checkItemValue:       getRecordValue(rowData),
          inputType:            rowData?.inputType || '',
          name:                 rowData?.name || '',
          isRequired:           rowData?.isRequired || false,
          images:               rowData?.recordValue?.files?.map(file => ({
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
      }), [ rowData, machineId, id, checkItemListId, machineServiceRecord ] );
    
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
      formState: { isDirty, isSubmitting },
      handleSubmit
    } = methods;

  const watchedValues = watch();

  const isChanged = useMemo(() => 
    JSON.stringify(watchedValues) !== JSON.stringify(defaultValues)
  ,[watchedValues, defaultValues]);
  
    const [showMessages, setShowMessages] = useState( false );

    useEffect(() => {
        reset(defaultValues);
    }, [ reset, defaultValues ]);
    

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
        // reset(data);
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
      
      if(inputFile?._id){
        await dispatch(deleteCheckItemFile(machineId, inputFile?._id))
      }
      setValue(`images`, getValues(`images`)?.filter((file) => file !== inputFile), { shouldValidate: true } )
    }

    const regEx = /^[^2]*/;
    const handleLoadImage = async ( imageId, imageIndex ) => {
      try {
        const response = await dispatch(downloadCheckItemFile(machineId, id, imageId));
        if (regEx.test(response.status)) {
          const existingFiles = getValues(`images`) || [];
          const image = existingFiles[imageIndex];
    
          existingFiles[imageIndex] = {
            ...image,
            src: `data:${image?.fileType};base64,${response.data}`,
            preview: `data:${image?.fileType};base64,${response.data}`,
            isLoaded: true,
          };
          setValue(`images`, existingFiles, { shouldValidate: true });
        }
      } catch (error) {
        console.error('Error loading full file:', error);
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
                  disabled={!( isChanged ||  isDirty )} 
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