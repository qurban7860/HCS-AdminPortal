import React, { useState, useMemo, useEffect, useLayoutEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// @mui
import { Container, Box, Card, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// slice
import { ProfileTypes, addProfile, getProfiles } from '../../../redux/slices/products/profile';
import { getMachine } from '../../../redux/slices/products/machine';
// schema
import { ProfileSchema } from './schemas/ProfileSchema';
// components
import { useSnackbar } from '../../../components/snackbar';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
// assets
import FormProvider, { RHFSwitch, RHFTextField, RHFChipsInput, RHFUpload } from '../../../components/hook-form';
import MachineTabContainer from '../util/MachineTabContainer';
import { removeFileExtension, getRefferenceNumber, getVersionNumber } from '../../documents/util/Util';

// ----------------------------------------------------------------------

export default function ProfileAddForm() {

  const { profiles } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const { machineId } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [profileTypes, setProfileTypes] = useState([]);

  useLayoutEffect(()=>{
    dispatch(getProfiles(machineId))
  },[ dispatch, machineId ])

  const defaultValues = useMemo(
    () => ({
      defaultName: '',
      names:[],
      web:'',
      flange:'',
      thicknessStart: '',
      thicknessEnd:'',
      type:'CUSTOMER',
      files: [],
      isActive: true,
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

  useEffect(() => {
    const hasManufacturer = profiles.some((profile) => profile.type === 'MANUFACTURER');
    const updatedProfileTypes = hasManufacturer? ProfileTypes.filter((type) => type !== 'MANUFACTUR') : ProfileTypes;
    setProfileTypes(updatedProfileTypes);
  }, [profiles]);

  // Handle Type
  const [selectedValue, setSelectedValue] = useState('CUSTOMER');
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setValue('type',event.target.value);
  };
   
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

      await dispatch(addProfile(machineId, formData));
      await enqueueSnackbar('Profile added successfully');
      await dispatch(getMachine(machineId));
      await reset();
      await navigate(PATH_MACHINE.machines.profiles.root(machineId))
    } catch (err) {
      enqueueSnackbar(err, { variant: 'error' });
    }
  };

  const toggleCancel = () => navigate(PATH_MACHINE.machines.profiles.root(machineId));


  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue="profile" />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} mb={5}>
        <Grid container spacing={2}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <RHFTextField name="defaultName" label="Default Name*" />
                <FormControl>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="type"
                    value={selectedValue}
                    label="Type"
                    onChange={handleChange}
                  >
                    {profileTypes.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
                sx={{ mt: 2 }}
              >
                <RHFChipsInput name="names" label="Other Names" />
              </Box>
              <Box
                sx={{ marginTop: 2 }}
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(4, 1fr)' }}
              >
                <RHFTextField name="web" label="Web" />
                <RHFTextField name="flange" label="Flange" />
                <RHFTextField name="thicknessStart" label="Min. Thickness" />
                <RHFTextField name="thicknessEnd" label="Max. Thickness" />
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
                />{' '}
              </Box>
              <RHFSwitch name="isActive" label="Active" />
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
