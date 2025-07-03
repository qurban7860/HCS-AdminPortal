import React, { useMemo, useState, useLayoutEffect, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Container, Box, Card, Stack, FormControl, Grid, InputLabel, MenuItem, Select, Dialog, DialogTitle, Divider, Button } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import b64toBlob from 'b64-to-blob';
import { PATH_MACHINE } from '../../../routes/paths';
// Components
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { useSnackbar } from '../../../components/snackbar';
import { updateProfile, getProfile, getFile, deleteFile, ProfileTypes, resetProfile } from '../../../redux/slices/products/profile';
import { ProfileSchema } from './schemas/ProfileSchema';
import FormProvider, { RHFSwitch, RHFTextField, RHFChipsInput, RHFUpload } from '../../../components/hook-form';
import { useAuthContext } from '../../../auth/useAuthContext';
import MachineTabContainer from '../util/MachineTabContainer';
import { handleError } from '../../../utils/errorHandler';
import SkeletonPDF from '../../../components/skeleton/SkeletonPDF';
import FormLabel from '../../../components/DocumentForms/FormLabel';

// ----------------------------------------------------------------------

export default function ProfileEditForm() {

  const { profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isAllAccessAllowed } = useAuthContext()
  const navigate = useNavigate();
  const { machineId, id } = useParams();
  const regEx = /^[^2]*/;

  useLayoutEffect(() => {
    if (machineId && id) {
      dispatch(getProfile(machineId, id))
    }
    return () => {
      dispatch(resetProfile())
    }
  }, [dispatch, machineId, id])

  const defaultValues = useMemo(
    () => ({
      defaultName: profile?.defaultName || '',
      names: profile?.names || [],
      web: profile?.web || '',
      flange: profile?.flange || '',
      thicknessStart: profile?.thicknessStart || '',
      thicknessEnd: profile?.thicknessEnd || '',
      type: profile?.type || 'CUSTOMER',
      files: profile?.files?.map(file => ({
        key: file?._id,
        _id: file?._id,
        name: `${file?.name}.${file?.extension}`,
        type: file?.fileType,
        fileType: file?.fileType,
        preview: `data:${file?.fileType};base64, ${file?.thumbnail}`,
        src: `data:${file?.fileType};base64, ${file?.thumbnail}`,
        path: `${file?.name}.${file?.extension}`,
        downloadFilename: `${file?.name}.${file?.extension}`,
      })) || [],
      isActive: profile?.isActive || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile]
  );

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, profile])

  const { files } = watch();

  const handleDropMultiFile = useCallback(async (acceptedFiles) => {
    const newFiles = [];
    acceptedFiles.forEach((file, index) => {
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
        src: URL.createObjectURL(file),
        isLoaded: true,
      });
      newFiles.push(newFile);
    });
    setValue('files', [...files, ...newFiles], { shouldValidate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, files]);

  const toggleCancel = async () => navigate(PATH_MACHINE.machines.profiles.view(machineId, id));

  // Handle Type
  const [selectedValue, setSelectedValue] = useState(defaultValues?.type);
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setValue('type', event.target.value);
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateProfile(machineId, id, data));
      reset();
      enqueueSnackbar("Profile updated successfully");
      navigate(PATH_MACHINE.machines.profiles.view(machineId, id))
    } catch (err) {
      enqueueSnackbar(handleError(err) || "Profile update failed!", { variant: 'error' });
      console.error(err.message);
    }
  };

  const handleRemoveFile = async (inputFile) => {
    let images = getValues(`files`);
    if (inputFile?._id) {
      await dispatch(deleteFile(machineId, id, inputFile?._id));
      images = await images?.filter((file) => (file?._id !== inputFile?._id))
    } else {
      images = await images?.filter((file) => (file !== inputFile))
    }
    setValue(`files`, images, { shouldValidate: true })
  };

  const handleLoadImage = async (imageId) => {
    try {
      const response = await dispatch(getFile(machineId, id, imageId));
      if (regEx.test(response.status)) {
        const existingFiles = getValues('files');
        const imageIndex = existingFiles.findIndex(image => image?._id === imageId);
        if (imageIndex !== -1) {
          const image = existingFiles[imageIndex];
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
      console.error('Error loading full file:', handleError(error));
    }
  };

  const [pdf, setPDF] = useState(null);
  const [PDFName, setPDFName] = useState('');
  const [PDFViewerDialog, setPDFViewerDialog] = useState(false);

  const handleOpenFile = async (file, fileName) => {
    try {
      setPDFName(fileName);
      setPDFViewerDialog(true);
      setPDF(null);
      if (!file?.isLoaded) {
        const response = await dispatch(getFile(machineId, id, file._id));
        if (regEx.test(response.status)) {
          const blob = b64toBlob(encodeURI(response.data), 'application/pdf')
          const url = URL.createObjectURL(blob);
          setPDF(url);
        } else {
          enqueueSnackbar(response.statusText, { variant: 'error' });
        }
      } else {
        setPDF(file?.src);
      }
    } catch (error) {
      setPDFViewerDialog(false);
      enqueueSnackbar(handleError(error) || 'Open file failed!', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='profile' />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} mb={5}>
        <Grid
          container
          spacing={2}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', }}>
                  <RHFTextField name="defaultName" label="Default Name" />
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="type"
                      value={selectedValue}
                      label="Type"
                      onChange={handleChange}
                      disabled={!isAllAccessAllowed}
                    >
                      {ProfileTypes.map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', }} sx={{ mt: 2 }}>
                  <RHFChipsInput name="names" label="Other Names" />
                </Box>

                <Box sx={{ marginTop: 2 }} rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(4, 1fr)', }}>
                  <RHFTextField name="web" label="Web" />
                  <RHFTextField name="flange" label="Flange" />
                  <RHFTextField name="thicknessStart" label="Min. Thickness" />
                  <RHFTextField name="thicknessEnd" label="Max. Thickness" />

                </Box>
                <Grid container sx={{ mt: 4 }}>
                  <FormLabel content='Documents' />
                </Grid>
                <Box >
                  <RHFUpload
                    multiple
                    thumbnail
                    name="files"
                    onDrop={handleDropMultiFile}
                    dropZone={false}
                    onRemove={handleRemoveFile}
                    onLoadImage={handleLoadImage}
                    onLoadPDF={handleOpenFile}
                  />
                </Box>
                <RHFSwitch name="isActive" label="Active" />
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      {PDFViewerDialog && (
        <Dialog fullScreen open={PDFViewerDialog} onClose={() => setPDFViewerDialog(false)}>
          <DialogTitle variant='h3' sx={{ pb: 1, pt: 2, display: 'flex', justifyContent: 'space-between' }}>
            PDF View
            <Button variant='outlined' onClick={() => setPDFViewerDialog(false)}>Close</Button>
          </DialogTitle>
          <Divider variant='fullWidth' />
          {pdf ? (
            <iframe title={PDFName} src={pdf} style={{ paddingBottom: 10 }} width='100%' height='842px' />
          ) : (
            <SkeletonPDF />
          )}
        </Dialog>
      )}
    </Container>
  );
}
