import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, Button, DialogTitle, Divider, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { addMachineServiceReportFiles, setAddReportDocsDialog, setIsReportDoc } from '../../redux/slices/products/machineServiceReport';
import FormProvider from '../hook-form/FormProvider';
import { RHFUpload } from '../hook-form';
import { useServiceReportParams } from '../../hooks/useServiceReportParams';
import { MachineServiceReportPart3Schema } from '../../pages/schemas/machine';

function ServiceReportAddFileDialog( ) {
  const { machineId, id } = useServiceReportParams() 
  
  const dispatch = useDispatch();
  const { addReportDocsDialog, isReportDoc } = useSelector((state) => state.machineServiceReport);
  
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      files:[]
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(MachineServiceReportPart3Schema),
    defaultValues
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { files } = watch();

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
      if(isReportDoc){
        data.isReportDoc = isReportDoc;
      }
      if( machineId && id ){
        await dispatch(addMachineServiceReportFiles(machineId, id, data))
        await handleCloseDialog();
        await enqueueSnackbar('Files uploaded successfully!');
      } else {
        enqueueSnackbar('File upload failed, parameters missing!', { variant: `error` });
      }
    } catch (error) {
      enqueueSnackbar('Failed to upload files. Please try again.', { variant: `error` });
      console.error(error);
    }
  };

  const handleCloseDialog = async ()=>{
    await dispatch(setAddReportDocsDialog(false));
    await dispatch(setIsReportDoc(false));
    reset();
  }

  return (
    <Dialog fullWidth maxWidth="xl" open={ addReportDocsDialog } onClose={handleCloseDialog}>
      <DialogTitle variant='h3' sx={{pb:1, pt:2}}>Add Documents / Images</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{pt:2}}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <RHFUpload multiple  thumbnail name="files" imagesOnly
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
            />
          </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handleCloseDialog}>Cancel</Button>
        <LoadingButton loading={isSubmitting} onClick={handleSubmit(onSubmit)} variant='contained'>Save</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default ServiceReportAddFileDialog;
