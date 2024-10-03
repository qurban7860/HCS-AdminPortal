import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, Button, DialogTitle, Divider, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import {  
  addMachineServiceRecordFiles,
  setAddFileDialog,
  setAddReportDocsDialog
} from '../../redux/slices/products/machineServiceRecord';

import FormProvider from '../hook-form/FormProvider';
import { RHFUpload } from '../hook-form';
import { MachineServiceRecordPart3Schema } from '../../pages/schemas/machine';

function DialogServiceRecordAddFile( ) {

  const { machineId, id } = useParams();
  const dispatch = useDispatch();
  const { addFileDialog, addReportDocsDialog } = useSelector((state) => state.machineServiceRecord);
  
  const handleCloseDialog = async ()=>{ 
    await dispatch(setAddFileDialog(false)) 
    await dispatch(setAddReportDocsDialog(false))
    reset();
  }
  
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      files:[]
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(MachineServiceRecordPart3Schema),
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
      data.isReportDoc = addReportDocsDialog;
      await dispatch(addMachineServiceRecordFiles(machineId, id, data))
      await handleCloseDialog();
      await reset();
      await enqueueSnackbar('Files uploaded successfully!');
    } catch (error) {
      enqueueSnackbar('Failed file upload', { variant: `error` });
      console.error(error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xl" open={ addFileDialog || addReportDocsDialog } onClose={handleCloseDialog}>
      <DialogTitle variant='h3' sx={{pb:1, pt:2}}>Add Images</DialogTitle>
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

export default DialogServiceRecordAddFile;
