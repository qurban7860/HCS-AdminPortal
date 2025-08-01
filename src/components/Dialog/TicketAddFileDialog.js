import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, Button, DialogTitle, Divider, DialogActions, Alert, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { addFiles } from '../../redux/slices/ticket/tickets';
import FormProvider from '../hook-form/FormProvider';
import { RHFUpload } from '../hook-form';
import { MachineServiceReportPart3Schema } from '../../pages/schemas/machine';

TicketAddFileDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
};

function TicketAddFileDialog({ open, handleClose }) {

  const dispatch = useDispatch();
  const { ticket } = useSelector((state) => state.tickets);
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      files: []
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(MachineServiceReportPart3Schema),
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, },
  } = methods;

  const { files } = watch();

  // Check if any uploaded files have HEIC or HEIF extensions
  const hasHeicOrHeifFiles = useMemo(() => {
    if (!files || !Array.isArray(files)) return false;
    
    return files.some(file => {
      const extension = file.name?.split('.').pop()?.toLowerCase();
      return extension === 'heic' || extension === 'heif';
    });
  }, [files]);

  const handleDropMultiFile = useCallback(
    async (acceptedFiles) => {
      const docFiles = files || [];

      const newFiles = acceptedFiles.map((file, index) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          src: URL.createObjectURL(file),
          isLoaded: true
        })

      );
      setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files]
  );

  const onSubmit = async (data) => {
    try {
      if (ticket?._id) {
        await dispatch(addFiles(ticket?._id, data))
        await handleClose();
        await reset();
        await enqueueSnackbar('Files uploaded successfully!');
      } else {
        enqueueSnackbar('File upload failed, parameters missing!', { variant: `error` });
      }
    } catch (error) {
      enqueueSnackbar('Failed to upload files. Please try again.', { variant: `error` });
      console.error(error);
    }
  };


  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={handleClose}>
      <DialogTitle variant='h3' sx={{ pb: 1, pt: 2 }}>Add Documents / Images</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{ pt: 2 }}>
        {hasHeicOrHeifFiles && (
          <Alert 
            severity="info" 
            sx={{ mb: 2 }}
          >
            <Typography variant='body2'>
              Please note: HEIC/HEIF image files require format conversion during upload, which may result in extended processing times.
            </Typography>
          </Alert>
        )}
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <RHFUpload multiple thumbnail name="files" imagesOnly
            onDrop={handleDropMultiFile}
            onRemove={(inputFile) =>
              files.length > 1 ?
                setValue(
                  'files',
                  files &&
                  files?.filter((file) => file !== inputFile),
                  { shouldValidate: true }
                ) : setValue('files', '', { shouldValidate: true })
            }
            onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
          />
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handleClose}>Cancel</Button>
        <LoadingButton loading={isSubmitting} onClick={handleSubmit(onSubmit)} variant='contained'>Save</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default TicketAddFileDialog;
