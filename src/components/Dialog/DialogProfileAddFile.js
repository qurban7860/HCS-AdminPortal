import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Dialog, DialogContent, Button, DialogTitle, Divider, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { addFiles } from '../../redux/slices/products/profile';
import FormProvider from '../hook-form/FormProvider';
import { RHFUpload } from '../hook-form';
import { filesValidations } from '../../pages/schemas/machine';

DialogProfileAddFile.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
};

function DialogProfileAddFile({ open, handleClose }) {
  const { machineId, id } = useParams()

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      files: []
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(filesValidations),
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
      if (id && data?.files.length > 0) {
        await dispatch(addFiles(machineId, id, data))
        await handleClose();
        await reset();
        await enqueueSnackbar('Files uploaded successfully!');
      } else if (!data?.files.length > 0) {
        enqueueSnackbar('Documents required!', { variant: `error` });
      } else {
        enqueueSnackbar('Upload document failed!, parameters missing!', { variant: `error` });
      }
    } catch (error) {
      enqueueSnackbar('Upload document failed! Please try again.', { variant: `error` });
      console.error(error);
    }
  };


  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={handleClose}>
      <DialogTitle variant='h3' sx={{ pb: 1, pt: 2 }}>Add Documents / Images</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{ pt: 2 }}>
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

export default DialogProfileAddFile;
