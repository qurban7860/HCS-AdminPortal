import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// slice
import { updateMachineServiceRecord, resetMachineServiceRecord, addMachineServiceRecordFiles, deleteRecordFile, downloadRecordFile } from '../../../redux/slices/products/machineServiceRecord';
import { getActiveContacts, resetActiveContacts } from '../../../redux/slices/customer/contact';
// components
import ServiceRecodStepButtons from '../../../components/DocumentForms/ServiceRecodStepButtons';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField, RHFUpload } from '../../../components/hook-form';
import { validateImageFileType } from '../../documents/util/Util';
  
MachineServiceRecordsThirdStep.propTypes = {
  handleDraftRequest: PropTypes.func,
  handleDiscard: PropTypes.func,
  handleBack: PropTypes.func
};

function MachineServiceRecordsThirdStep({handleDraftRequest, handleDiscard, handleBack}) {
  
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { machineId, id } = useParams();
    const { machine } = useSelector((state) => state.machine);
    const { activeContacts } = useSelector((state) => state.contact);
    const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);

    const [ isDraft, setIsDraft ] = useState(false);
    const saveAsDraft = async () => setIsDraft(true);

    useEffect(() => {
      if (machine?.customer?._id) {
        dispatch(getActiveContacts(machine?.customer?._id));
      }
      return () =>{
          dispatch(resetActiveContacts());
      }
    }, [ dispatch, machine ]);

    const defaultValues = useMemo(
        () => {
          const initialValues = {
            serviceNote:                  machineServiceRecord?.serviceNote || '',
            recommendationNote:           machineServiceRecord?.recommendationNote || '',
            internalComments:             machineServiceRecord?.internalComments || '',
            suggestedSpares:              machineServiceRecord?.suggestedSpares || '',
            internalNote:                 machineServiceRecord?.internalNote || '',
            operators:                    machineServiceRecord?.operators || [],
            files: machineServiceRecord?.files?.map(file => ({
              key: file?._id,
              _id: file?._id,
              name:`${file?.name}.${file?.extension}`,
              type: file?.fileType,
              fileType: file?.fileType,
              preview: `data:${file?.fileType};base64, ${file?.thumbnail}`,
              src: `data:${file?.fileType};base64, ${file?.thumbnail}`,
              path:`${file?.name}.${file?.extension}`,
              downloadFilename:`${file?.name}.${file?.extension}`,
              machineId:machineServiceRecord?.machineId,
              serviceId:id,
            })) || [],
            operatorNotes:                machineServiceRecord?.operatorNotes || '',
            isActive:                     true,
        }
        return initialValues;
      },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ machineServiceRecord ]
      );

    const ValidationSchema = Yup.object().shape({
      files: Yup.array().test({
        name: 'fileType',
        message: 'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
        test: validateImageFileType
      }),
    });

    const methods = useForm({
        resolver: yupResolver(ValidationSchema),
        defaultValues,
    });
    
    const {
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
    } = methods;

    useEffect(() => {
      if (machineServiceRecord) {
        reset(defaultValues);
      }
      return(()=> resetMachineServiceRecord());
    }, [reset, machineServiceRecord, defaultValues]);

    const { isActive, files } = watch()
    
    const handleDropMultiFile = useCallback(
      async (acceptedFiles) => {
        const docFiles = files || [];
        const newFiles = acceptedFiles.map((file, index) => 
            Object.assign(file, {
              preview: URL.createObjectURL(file),
              src: URL.createObjectURL(file),
              isLoaded:true
            })
        );
        setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [ files ]
    );

    const onSubmit = async (data) => {
      try {
          if(isDraft){
            data.status='DRAFT'
          }else{
            data.status='SUBMITTED'  
          }
          
          if(id){
            if(Array.isArray(data?.files) && data?.files?.filter((f)=>!f?._id)?.length > 0){
              await dispatch(addMachineServiceRecordFiles(machineId, id, data))
            }
            
            await dispatch(updateMachineServiceRecord( machineId, id, data, isDraft ));
            await handleDraftRequest(isDraft);
            setIsDraft(false);  
            await navigate(PATH_MACHINE.machines.serviceRecords.view(machineId, id))  
          }

          if(isDraft){
            await navigate(PATH_MACHINE.machines.serviceRecords.root(machineId))
          }

    
        } catch (err) {
          console.error(err);
          enqueueSnackbar('Saving failed!', { variant: `error` });
        }
        setIsDraft(false);
      };

      const handleRemoveFile = async (inputFile) => {
        if (inputFile?._id) {
          await dispatch(deleteRecordFile(machineId, id, inputFile?._id));
        }
      
        if (files.length > 1) {
          setValue(
            'files',
            files.filter((file) => file !== inputFile),
            { shouldValidate: true }
          );
        } else {
          setValue('files', [], { shouldValidate: true });
        }
      };

      const regEx = /^[^2]*/;
      const handleLoadImage = async (imageId, imageIndex) => {
        try {
          const response = await dispatch(downloadRecordFile(machineId, id, imageId));
      
          if (regEx.test(response.status)) {
            // Update the image property in the imagesLightbox array
            const existingFiles = getValues('files') || [];
            const image = existingFiles[imageIndex];
      
            if (image) {
              existingFiles[imageIndex] = {
                ...image,
                src: `data:${image?.fileType};base64,${response.data}`,
                preview: `data:${image?.fileType};base64,${response.data}`,
                isLoaded: true,
              };
      
              setValue('files', existingFiles, { shouldValidate: true });
            }
          }
        } catch (error) {
          console.error('Error loading full file:', error);
        }
      };

  return (
      <FormProvider methods={methods}  onSubmit={handleSubmit(onSubmit)}>
        <Stack px={2} spacing={2}>    
          { machineServiceRecord?.serviceRecordConfig?.enableNote && <RHFTextField name="serviceNote" label={`${machineServiceRecord?.serviceRecordConfig?.recordType?.toLowerCase() === 'install' ? 'Install' : 'Service' } Note`} minRows={3} multiline/> }      
          { machineServiceRecord?.serviceRecordConfig?.enableMaintenanceRecommendations && <RHFTextField name="recommendationNote" label="Recommendation Note" minRows={3} multiline/> }
          { machineServiceRecord?.serviceRecordConfig?.enableSuggestedSpares && <RHFTextField name="suggestedSpares" label="Suggested Spares" minRows={3} multiline/> }
          <RHFTextField name="internalNote" label="Internal Note" minRows={3} multiline/> 
          <RHFAutocomplete 
            multiple
            disableCloseOnSelect
            filterSelectedOptions
            name="operators" 
            label="Operators"
            options={activeContacts}
            getOptionLabel={(option) => `${option?.firstName ||  ''} ${option?.lastName || ''}`}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}` }</li> )}
          />
          <RHFTextField name="operatorNotes" label="Operator Notes" minRows={3} multiline/> 
          <RHFUpload multiple  thumbnail name="files" imagesOnly
            onDrop={handleDropMultiFile}
            dropZone={false}
            onRemove={handleRemoveFile}
            onLoadImage={handleLoadImage}
          />
          {/* <Grid container display="flex"><RHFSwitch name="isActive" label="Active"/></Grid> */}
      </Stack>
      <ServiceRecodStepButtons isActive={isActive} isSubmitting={isSubmitting} isDraft={isDraft} handleDraft={saveAsDraft} />
    </FormProvider>
  )}

export default MachineServiceRecordsThirdStep