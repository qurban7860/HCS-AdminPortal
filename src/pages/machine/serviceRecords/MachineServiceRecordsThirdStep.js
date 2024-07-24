import { useEffect, useLayoutEffect, useMemo, useState, memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, Card, Grid, Stack, StepLabel, Step, Stepper, Box, StepContent, Button, StepButton, Typography } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import download from 'downloadjs';
import { PATH_MACHINE } from '../../../routes/paths';
// slice
import { addMachineServiceRecord, updateMachineServiceRecord, resetMachineServiceRecord, setAddFileDialog, deleteMachineServiceRecord, getMachineServiceRecord, addMachineServiceRecordFiles, deleteRecordFile, downloadRecordFile } from '../../../redux/slices/products/machineServiceRecord';
import { getActiveServiceRecordConfigsForRecords, getServiceRecordConfig, resetServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
import { getActiveContacts } from '../../../redux/slices/customer/contact';
// components
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { useSnackbar } from '../../../components/snackbar';
import { MachineServiceRecordPart1Schema, MachineServiceRecordPart2Schema, MachineServiceRecordPart3Schema } from '../../schemas/machine';
import FormProvider, { RHFAutocomplete, RHFSwitch, RHFTextField, RHFUpload } from '../../../components/hook-form';
import { getActiveSecurityUsers, getSecurityUser } from '../../../redux/slices/securityUser/securityUser';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { useAuthContext } from '../../../auth/useAuthContext';
import MachineTabContainer from '../util/MachineTabContainer';
import DialogServiceRecordAddFile from '../../../components/Dialog/DialogServiceRecordAddFile';
import Iconify from '../../../components/iconify';
import { ColorlibConnector, ColorlibStepIcon } from '../../../theme/styles/default-styles';
import { DocumentGalleryItem } from '../../../components/gallery/DocumentGalleryItem';
import { ThumbnailDocButton } from '../../../components/Thumbnails';
  

function MachineServiceRecordsThirdStep() {
  
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
      
    const { activeContacts } = useSelector((state) => state.contact);
    const { recordTypes } = useSelector((state) => state.serviceRecordConfig);
    const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
    const { activeSecurityUsers, securityUser } = useSelector((state) => state.user);
    const { machine } = useSelector((state) => state.machine);
    const { activeServiceRecordConfigsForRecords, serviceRecordConfig } = useSelector((state) => state.serviceRecordConfig);

    const [ isDraft, setIsDraft ] = useState(false);
    const saveAsDraft = async () => setIsDraft(false);
    const [ activeServiceRecordConfigs, setActiveServiceRecordConfigs ] = useState([]);

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
              name: file?.name,
              type: file?.fileType,
              fileType: file?.fileType,
              preview: `data:${file?.fileType};base64, ${file?.thumbnail}`,
              src: `data:${file?.fileType};base64, ${file?.thumbnail}`,
              path:`${file?.name}.${file?.extension}`,
              downloadFilename:`${file?.name}.${file?.extension}`,
              machineId:machineServiceRecord?.machine?._id,
              serviceId:machineServiceRecord?._id,
            })) || [],
            operatorNotes:                machineServiceRecord?.operatorNotes || '',
            isActive:                     machineServiceRecord?.isActive || true,
        }
        return initialValues;
      },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ machineServiceRecord ]
      );

    const methods = useForm({
        resolver: yupResolver(MachineServiceRecordPart3Schema),
        defaultValues,
    });
    
    const {
    reset,
    watch,
    setValue,
    getValues,
    trigger,
    handleSubmit,
    formState: { isSubmitting },
    } = methods;

    // useEffect(()=>{
    //   const updatedFiles = []

    //   machineServiceRecord.file.map((file)=> ....file, src:file.thumbnail)
    //   console.log("defaultValues:::::",defaultValues)
    //   ...._file, src:_file.thumbnail
    //   setValue(file)
    // })

    const { files, decoilers, operators } = watch()
    const handleDropMultiFile = useCallback(
      async (acceptedFiles) => {
        const docFiles = files || [];
        const newFiles = acceptedFiles.map((file, index) => 
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
        );
        setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [ files ]
    );

    const onSubmit = async (data) => {
        try {
          if(machineServiceRecord?._id){
            await dispatch(updateMachineServiceRecord( machine?._id, machineServiceRecord?._id, data ));
            await handleDraftRequest();  
            if(data?.files)
              await dispatch(addMachineServiceRecordFiles(machine?._id, machineServiceRecord?._id, data))
            await navigate(PATH_MACHINE.machines.serviceRecords.view(machine?._id, machineServiceRecord?._id))  
          }

          if(isDraft){
            await navigate(PATH_MACHINE.machines.serviceRecords.root(machine?._id))
          }

    
        } catch (err) {
          console.error(err);
          enqueueSnackbar('Saving failed!', { variant: `error` });
        }
      };

      const handleDraftRequest = async ()=> {
        if(isDraft){
          await navigate(PATH_MACHINE.machines.serviceRecords.root(machine?._id))
        }
      }

      const toggleCancel = async () =>{
        if( machineServiceRecord?._id ){
          await dispatch(deleteMachineServiceRecord(machine?._id, machineServiceRecord?._id, machineServiceRecord?.status ))
        }
        navigate(PATH_MACHINE.machines.serviceRecords.root(machine?._id));
      }

      const handleRemoveFile = async (inputFile) => {
        if (inputFile?._id) {
          await dispatch(deleteRecordFile(machine?._id, machineServiceRecord?._id, inputFile?._id));
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
          const response = await dispatch(downloadRecordFile(machine?._id, machineServiceRecord?._id, imageId));
      
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
        <Stack mx={1} spacing={2}>
        <FormLabel content="Complete Service Record" />
            {/* { serviceRecordConfig?.enableNote && <RHFTextField name="serviceNote" label={`${docRecordType?.name?.charAt(0).toUpperCase()||''}${docRecordType?.name?.slice(1).toLowerCase()||''} Note`} minRows={3} multiline/> } */}
            { serviceRecordConfig?.enableMaintenanceRecommendations && <RHFTextField name="recommendationNote" label="Recommendation Note" minRows={3} multiline/> }
            { serviceRecordConfig?.enableSuggestedSpares && <RHFTextField name="suggestedSpares" label="Suggested Spares" minRows={3} multiline/> }
            <RHFTextField name="internalNote" label="Internal Note" minRows={3} multiline/> 
              <RHFAutocomplete 
                multiple
                disableCloseOnSelect
                filterSelectedOptions
                name="operators" 
                label="Operators"
                options={activeContacts}
                getOptionLabel={(option) => `${option?.firstName ||  ''} ${option.lastName || ''}`}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
              />

            <RHFTextField name="operatorNotes" label="Operator Notes" minRows={3} multiline/> 
            <RHFUpload multiple  thumbnail name="files" imagesOnly
              onDrop={handleDropMultiFile}
              dropZone={false}
              onRemove={handleRemoveFile}
              // onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
              onLoadImage={handleLoadImage}
            />

            {/* <ThumbnailDocButton onClick={handleAddFileDialog}/> */}

            {/* <RHFUpload multiple  thumbnail name="files" imagesOnly
              onDrop={handleDropMultiFile}
              onRemove={(inputFile) =>
                files.length > 1 ?
                setValue(
                  'files',
                  files &&
                    files?.filter((file) => file !== inputFile),
                  { shouldValidate: true }
                ): setValue('files', '', { shouldValidate: true })
              }
              onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
            /> */}

          <Grid container display="flex">
            <RHFSwitch name="isActive" label="Active"/>
          </Grid>
          <AddFormButtons isSubmitting={isSubmitting} 
              saveAsDraft={saveAsDraft} 
              saveButtonName="Next"
              isDisabledBackButton handleBack backButtonName="Back" 
              toggleCancel={toggleCancel} cancelButtonName="Discard" 
          />
      </Stack>
  </FormProvider>
)
}

export default MachineServiceRecordsThirdStep