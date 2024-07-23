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
import { addMachineServiceRecord, updateMachineServiceRecord, resetMachineServiceRecord, deleteFile, downloadFile, setAddFileDialog, deleteMachineServiceRecord, getMachineServiceRecord } from '../../../redux/slices/products/machineServiceRecord';
import { getActiveServiceRecordConfigsForRecords, getServiceRecordConfig, resetServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
import { getActiveContacts } from '../../../redux/slices/customer/contact';
// components
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { useSnackbar } from '../../../components/snackbar';
import { MachineServiceRecordPart1Schema, MachineServiceRecordPart2Schema, MachineServiceRecordPart3Schema } from '../../schemas/machine';
import FormProvider, { RHFAutocomplete, RHFSwitch, RHFTextField } from '../../../components/hook-form';
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
            files:                        machineServiceRecord?.files || [],
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
    trigger,
    handleSubmit,
    formState: { isSubmitting },
    } = methods;

    const { files, decoilers, operators } = watch()
    const handleDropMultiFile = useCallback(
      async (acceptedFiles) => {
        const docFiles = files || [];
        const newFiles = acceptedFiles.map((file, index) => 
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
        );
        setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [ files ]
    );

    const onSubmit = async (data) => {
        try {
          if(!machineServiceRecord?._id ){
            const serviceRecord = await dispatch(addMachineServiceRecord( machine?._id, data ));
            await handleDraftRequest();
            await navigate(PATH_MACHINE.machines.serviceRecords.edit(machine?._id, serviceRecord?._id))
          }else{
            const serviceRecord = await dispatch(updateMachineServiceRecord( machine?._id, machineServiceRecord?._id, data ));
            await handleDraftRequest();  
            await navigate(PATH_MACHINE.machines.serviceRecords.edit(machine?._id, machineServiceRecord?._id))  
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

      const regEx = /^[^2]*/;
      const [slides, setSlides] = useState([]);
    
      const handleAddFileDialog = ()=> dispatch(setAddFileDialog(true));
    
      const handleOpenLightbox = async (_index) => {
        const image = slides[_index];
        if(!image?.isLoaded && image?.fileType?.startsWith('image')){
          try {
            const response = await dispatch(downloadFile(machine?._id, machineServiceRecord?._id, image?._id));
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
    
      const handleDeleteFile = async (fileId) => {
        try {
          await dispatch(deleteFile(machine?._id, machineServiceRecord?._id, fileId));
          enqueueSnackbar('File Archived successfully!');
        } catch (err) {
          console.log(err);
          enqueueSnackbar('File Deletion failed!', { variant: `error` });
        }
      };
    
      const handleDownloadFile = (fileId, name, extension) => {
        dispatch(downloadFile(machine?._id, machineServiceRecord?._id, fileId))
          .then((res) => {
            if (regEx.test(res.status)) {
              download(atob(res.data), `${name}.${extension}`, { type: extension });
              enqueueSnackbar(res.statusText);
            } else {
              enqueueSnackbar(res.statusText, { variant: `error` });
            }
          })
          .catch((err) => {
            if ( err.Message) {
              enqueueSnackbar(err.Message, { variant: `error` });
            } else if (err.message) {
              enqueueSnackbar(err.message, { variant: `error` });
            } else {
              enqueueSnackbar('Something went wrong!', { variant: `error` });
            }
          });
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
            {files?.map((file, _index) => (
              <DocumentGalleryItem isLoading={!files} key={file?.id} image={file} 
                onOpenLightbox={()=> handleOpenLightbox(_index)}
                onDownloadFile={()=> handleDownloadFile(file._id, file?.name, file?.extension)}
                onDeleteFile={()=> handleDeleteFile(file._id)}
                toolbar
              />
            ))}

            <ThumbnailDocButton onClick={handleAddFileDialog}/>

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