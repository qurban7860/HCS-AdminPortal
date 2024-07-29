import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import ReactPDF from '@react-pdf/renderer';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, Button, DialogTitle, Divider, DialogActions, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import {  
  addMachineServiceRecordFiles,
  getMachineServiceRecord,
  setAddFileDialog,
} from '../../redux/slices/products/machineServiceRecord';

import FormProvider from '../hook-form/FormProvider';
import { RHFTextField, RHFUpload } from '../hook-form';
import { validateImageFileType } from '../../pages/documents/util/Util';
import ViewFormField from '../ViewForms/ViewFormField';
import { fDate } from '../../utils/formatTime';
import FormLabel from '../DocumentForms/FormLabel';
import { imagesExtensions } from '../../constants/document-constants';

function DialogServiceRecordAddFile() {

  const { machineId, id } = useParams();
    
  const dispatch = useDispatch();
  const { addFileDialog, isLoading } = useSelector((state) => state.machineServiceRecord);
  
  const handleCloseDialog = ()=>{ 
    dispatch(setAddFileDialog(false)) 
    reset();
  }
  
  const { enqueueSnackbar } = useSnackbar();
  
  const MachineServiceRecordFilesSchema = Yup.object().shape({
    files: Yup.mixed().required('File is required!')
    .test(
      'fileType',
      'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp',
      validateImageFileType
    ).nullable(true),
  });

  const defaultValues = useMemo(
    () => ({
      files:[]
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(MachineServiceRecordFilesSchema),
    defaultValues:{
      files: defaultValues?.files || []
    },
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
      await dispatch(addMachineServiceRecordFiles(machineId, id, data))
      await dispatch(setAddFileDialog(false));
      await dispatch(getMachineServiceRecord(machineId, id))
      await reset();
      await enqueueSnackbar('Files uploaded successfully!');
    } catch (error) {
      enqueueSnackbar('Failed file upload', { variant: `error` });
      console.error(error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xl" open={addFileDialog} onClose={handleCloseDialog}>
      <DialogTitle variant='h3' sx={{pb:1, pt:2}}>Add Documents</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{pt:2}}>
          {/* <Grid container sx={{pb:2}}>
            <ViewFormField isLoading={isLoading} variant='h4' sm={3} heading="Service Date" param={fDate(machineServiceRecord.serviceDate)} />
            <ViewFormField isLoading={isLoading} variant='h4' sm={6} heading="Service Record Configuration" param={`${machineServiceRecord?.serviceRecordConfig?.docTitle} ${machineServiceRecord?.serviceRecordConfig?.recordType ? '-' : ''} ${machineServiceRecord?.serviceRecordConfig?.recordType || ''}`} />
            <ViewFormField isLoading={isLoading} variant='h4' sm={3} heading="Version No" param={machineServiceRecord?.currentVersion?.versionNo}/>
            <FormLabel content='Add new files'/>
          </Grid> */}
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
