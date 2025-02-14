import React, { useState, useMemo, useEffect, useLayoutEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// @mui
import { Container, Box, Card, Stack, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// Components
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { useSnackbar } from '../../../components/snackbar';
import { updateProfile, getProfile, ProfileTypes } from '../../../redux/slices/products/profile';
import { getMachine } from '../../../redux/slices/products/machine';
import { ProfileSchema } from './schemas/ProfileSchema';
import FormProvider, { RHFSwitch, RHFTextField, RHFChipsInput, RHFUpload } from '../../../components/hook-form';
import { useAuthContext } from '../../../auth/useAuthContext';
import MachineTabContainer from '../util/MachineTabContainer';
import { removeFileExtension, getRefferenceNumber, getVersionNumber } from '../../documents/util/Util';

// ----------------------------------------------------------------------

export default function ProfileEditForm() {
  
  const { profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isAllAccessAllowed } = useAuthContext()
  const navigate = useNavigate();
  const { machineId, id } = useParams();

  useLayoutEffect(()=>{
    if(machineId && id ){
      dispatch(getProfile(machineId, id ))
    }
  },[ dispatch, machineId, id ])
  
  const defaultValues = useMemo(
    () => ({
      defaultName: profile?.defaultName ||'',
      names:profile?.names ||[],
      web:profile?.web || '',
      flange:profile?.flange ||'',
      thicknessStart: profile?.thicknessStart || '',
      thicknessEnd: profile?.thicknessEnd || '',
      type:profile?.type ||'CUSTOMER',
      files: profile?.files || [],
      isActive: profile?.isActive || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
    formState: { isSubmitting },
  } = methods;

  const { files } = watch();

  const handleDropMultiFile = useCallback(
    async (acceptedFiles) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
      const docFiles = files || [];
      
      const newFiles = await Promise.all(acceptedFiles.map(async (file) => {
        const displayName = removeFileExtension(file.name);
        const referenceNumber = getRefferenceNumber(file.name);
        const versionNo = getVersionNumber(file.name);
        let stockNumber = '';

        if (file.type.indexOf('pdf') > -1) {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDocument = await pdfjs.getDocument(arrayBuffer).promise;
          const page = await pdfDocument.getPage(1);
          const textContent = await page.getTextContent();
          try {
            textContent.items.some((item, index) => {
              if (item.str === 'DRAWN BY' && textContent?.items[index + 2]?.str?.length < 15) {
                stockNumber = textContent.items[index + 2].str;
                return true;
              }
              if (item.str === "STOCK NO." && textContent?.items[index + 2]?.str?.length < 15) {
                stockNumber = textContent.items[index + 2].str;
                return true;
              }
              if (item.str === 'APPROVED' && textContent?.items[index - 2]?.str?.length < 15) {
                stockNumber = textContent.items[index - 2].str;
                return true;
              }
              return false;
            });
          } catch (e) {
            console.log(e);
          }
        }

        return Object.assign(file, {
          preview: URL.createObjectURL(file),
          src: URL.createObjectURL(file),
          displayName,
          referenceNumber,
          versionNo: versionNo?.replace(/[^\d.]+/g, ""),
          stockNumber,
          isLoaded: true
        });
      }));

      setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
    },
    [files, setValue]
  );

  const toggleCancel = async() => navigate(PATH_MACHINE.machines.profiles.view(machineId, id));

   // Handle Type
  const [selectedValue, setSelectedValue] = useState(defaultValues?.type);
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setValue('type', event.target.value);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      
      // Add profile data
      formData.append('defaultName', data.defaultName);
      formData.append('type', data.type);
      formData.append('web', data.web);
      formData.append('flange', data.flange);
      formData.append('thicknessStart', data.thicknessStart);
      formData.append('thicknessEnd', data.thicknessEnd);
      formData.append('isActive', data.isActive);
      
      // Add names array
      if (data.names && data.names.length > 0) {
        data.names.forEach((name) => {
          formData.append('names[]', name);
        });
      }

      // Add files
      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append('images', file);
        });
      }

      await dispatch(updateProfile(machineId, id, formData));
      reset();
      enqueueSnackbar("Profile updated successfully");
      navigate(PATH_MACHINE.machines.profiles.view(machineId, id))
    } catch (err) {
      enqueueSnackbar("Failed to update profile", { variant: 'error' });
      console.error(err.message);
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
            <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)',}}>
              <RHFTextField name="defaultName" label="Default Name"/>
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

            <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)',}} sx={{mt:2}}>
              <RHFChipsInput name="names" label="Other Names" />
            </Box>

            <Box sx={{marginTop:2}} rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(4, 1fr)',}}>
              <RHFTextField name="web" label="Web"/>
              <RHFTextField name="flange" label="Flange"/>
              <RHFTextField name="thicknessStart" label="Min. Thickness"/>
              <RHFTextField name="thicknessEnd" label="Max. Thickness"/>
              
            </Box>
              <Box sx={{ mt: 2 }}>
                <RHFUpload
                  multiple
                  thumbnail
                  name="files"
                  imagesOnly
                  onDrop={handleDropMultiFile}
                  onRemove={(inputFile) =>
                    files.length > 1
                      ? setValue('files', files && files?.filter((file) => file !== inputFile), {
                          shouldValidate: true,
                        })
                      : setValue('files', '', { shouldValidate: true })
                  }
                  onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
                />
              </Box>
              <RHFSwitch name="isActive" label="Active" />
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  </Container>
  );
}
