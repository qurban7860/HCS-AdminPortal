import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import PropTypes, { object } from 'prop-types';
import download from 'downloadjs';
import { useNavigate } from 'react-router';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Table, TableBody, Grid, TextField, Checkbox, Typography, Stack, Divider, Box, Card, CardContent, CardHeader, Autocomplete } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CommentsInput from './CommentsInput';
import ViewFormServiceRecordVersionAudit from '../../../components/ViewForms/ViewFormServiceRecordVersionAudit';
import { StyledTableRow } from '../../../theme/styles/default-styles';
import { addCheckItemValues, deleteCheckItemFile, downloadCheckItemFile, setAddFileDialog } from '../../../redux/slices/products/machineServiceRecord';
import { DocumentGalleryItem } from '../../../components/gallery/DocumentGalleryItem';
import { ThumbnailDocButton } from '../../../components/Thumbnails';
import DialogServiceRecordAddFile from '../../../components/Dialog/DialogServiceRecordAddFile';
import FormProvider from '../../../components/hook-form/FormProvider';
import { RHFAutocomplete, RHFCheckbox, RHFDatePicker, RHFTextField, RHFUpload } from '../../../components/hook-form';
import { statusTypes } from '../util';
import { fDate, stringToDate } from '../../../utils/formatTime';
import { validateImageFileType } from '../../documents/util/Util';

const CheckedItemInputRow = ({ index, row, machineId, serviceId }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    
    const { machineServiceRecord, isLoadingCheckItemValues } = useSelector((state) => state.machineServiceRecord);
    const { serviceRecordConfig } = useSelector((state) => state.serviceRecordConfig);
    const { machine } = useSelector((state) => state.machine);

    // Define the schema for each image
    const CheckItemSchema = Yup.object().shape({
      comment: Yup.string().max(5000, 'Comments cannot exceed 5000 characters'),
      images: Yup.array().test({
        name: 'fileType',
        message: 'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
        test: validateImageFileType
      }),
    });
    
    const MainSchema = Yup.object().shape({
      checkItems: Yup.array().of(CheckItemSchema),
    });


    const defaultValues = useMemo(
      () => ({
        checkItems: row?.checkItems.map(item => ({
          _id:item._id,
          comment: item?.recordValue?.comments || '',
          value:item?.inputType==='Date'?stringToDate(item?.recordValue?.checkItemValue, 'dd/MM/yyyy'):(item?.recordValue?.checkItemValue || null),
          images: item?.recordValue?.files.map(file => ({
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
            serviceId,
          })) || []
        })) || [],
      }),
      [row, machineId, serviceId]
    );

    const methods = useForm({
      resolver: yupResolver(MainSchema),
      defaultValues,
    });
    

    const {
      control,
      reset,
      watch,
      setValue,
      getValues,
      trigger,
      handleSubmit,
      formState: { isSubmitting, isSubmitted },
    } = methods;

    const [submittedIndexes, setSubmittedIndexes] = useState([]);
    const formValues = watch();

    useEffect(() => {
      if (machineServiceRecord) {
        reset(defaultValues);
      }
    }, [reset, machineServiceRecord, defaultValues]);
    

    const onSubmit = async (data, childIndex) => {
      const checkItem = data.checkItems[childIndex];
      const params = {
        serviceRecord:machineServiceRecord?._id,
        serviceId:machineServiceRecord?.serviceId,
        checkItemListId:row?._id,
        machineCheckItem:checkItem._id,
        comments:checkItem.comment,
        images:checkItem.images.filter(image => !image._id)
      }

      if (checkItem.value instanceof Date) {
        params.checkItemValue = fDate(checkItem.value, 'dd/MM/yyyy');
      } else if(typeof checkItem.value==='object'){
        params.checkItemValue=checkItem?.value?.name;
      }else{
        params.checkItemValue=checkItem.value;
      }

      try {
        const result = await dispatch(addCheckItemValues(machine?._id,params, childIndex));
        const combinedIndex = `${index}-${childIndex}`;
        setSubmittedIndexes(prev => [...prev, combinedIndex]);
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Saving failed!', { variant: `error` });
      }
    };

    const handleDropMultiFile = useCallback(
      (acceptedFiles, childIndex) => {
        const existingFiles = getValues(`checkItems[${childIndex}].images`) || [];
        const newFiles = acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            src: URL.createObjectURL(file),
          })
        );
        setValue(`checkItems[${childIndex}].images`, [...existingFiles, ...newFiles], { shouldValidate: true });
      },
      [getValues, setValue]
    );

    const handleRemoveFile = async (inputFile, childIndex)=>{
      
      if(inputFile?._id){
        await dispatch(deleteCheckItemFile(machineId, serviceId, inputFile?._id))
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
        const response = await dispatch(downloadCheckItemFile(machineId, serviceId, imageId));
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

  return(<>
        <FormProvider key={`form-${index}`} methods={methods}>
          {row?.checkItems?.map((childRow,childIndex) => (
          <Card key={`card-${index}-${childIndex}`} sx={{boxShadow:'none'}}>
            {/* <CardHeader title={`${index+1}.${childIndex+1} - ${childRow?.name}`} sx={{py:1}} />
            <CardContent> */}
                <Stack spacing={1} mx={1} key={childRow._id}>
                  <Typography variant='body2' size='small'  >
                      <b>{`${index+1}.${childIndex+1}. `}</b>{`${childRow.name}`}
                  </Typography>
                      {childRow?.inputType === 'Boolean' &&
                        <RHFCheckbox 
                          label='Check'
                          name={`checkItems[${childIndex}].value`}

                        /> 
                      }
                      {(childRow?.inputType === 'Short Text' || childRow?.inputType === 'Long Text') &&
                        <RHFTextField 
                          multiline
                          label={childRow?.inputType}
                          name={`checkItems[${childIndex}].value`}
                          size="small" 
                          required={childRow?.isRequired}
                          InputProps={{ inputProps: { maxLength:childRow?.inputType === 'Long Text'?3000:200 } }}
                        />
                      }
                      {childRow?.inputType === 'Date'  && 
                        <RHFDatePicker 
                          label='Enter Date'
                          name={`checkItems[${childIndex}].value`}
                          format="dd/mm/yyyy"
                          size="small" 
                          required={childRow?.isRequired}
                        /> 
                      }
                      {childRow?.inputType === 'Number'  && 
                        <RHFTextField 
                            label={`${childRow?.unitType ? childRow?.unitType : 'Enter Value'}`}
                            name={`checkItems[${childIndex}].value`}
                            type="number"
                            size="small" 
                            required={childRow?.isRequired}
                        />
                      }
                      {childRow?.inputType==="Status" &&
                        <>
                          <RHFAutocomplete 
                            label='Status'
                            name={`checkItems[${childIndex}].value`}
                            options={statusTypes}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option.name === value.name}
                            renderOption={(props, option) => ( <li {...props} key={option.name}>{`${option?.name || ''}`}</li> )}
                          />
                        </>
                      }

                      
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
                        imagesOnly
                        onDrop={(accepted)=> handleDropMultiFile(accepted, childIndex)}
                        onRemove={(inputFile) => handleRemoveFile(inputFile, childIndex)}
                        onLoadImage={(imageId, imageIndex)=> handleLoadImage(imageId, imageIndex, childIndex)}
                        // onRemoveAll={() => setValue(`checkItems[${childIndex}].images`, [], { shouldValidate: true })}
                      />
                      {/* <RHFUpload
                        name={`checkItems[${childIndex}].images`}
                        // control={control}
                        label='Upload Images'
                        multiple
                        thumbnail
                        imagesOnly
                        onRemove={(inputFile) =>
                          setValue(
                            `checkItems[${childIndex}].images`,
                            watch(`checkItems[${childIndex}].images`).filter((file) => file !== inputFile),
                            { shouldValidate: true }
                          )
                        }
                        onRemoveAll={() => setValue(`checkItems[${childIndex}].images`, [], { shouldValidate: true })}
                      /> */}
                      
                  <Grid container sx={{m:1}} display='flex' direction='row-reverse'>
                    <LoadingButton 
                        onClick={handleSubmit((data) => onSubmit(data, childIndex))} // Pass childIndex
                        disabled={submittedIndexes.includes(`${index}-${childIndex}`)}
                        loading={isLoadingCheckItemValues===childIndex}
                        variant='contained'>{submittedIndexes.includes(`${index}-${childIndex}`)?"Saved!":"Save"}</LoadingButton>
                  </Grid>
                </Stack>
            {/* </CardContent> */}
          </Card>
        ))}
    </FormProvider>
</>)
}

CheckedItemInputRow.propTypes = {
    index: PropTypes.number,  
    row: PropTypes.object,
    machineId:PropTypes.string,
    serviceId:PropTypes.string,
  };

export default memo(CheckedItemInputRow)