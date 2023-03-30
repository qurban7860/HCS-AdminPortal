import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
// global
import { CONFIG } from '../../config-global';
// slice
import { updateAsset } from '../../redux/slices/asset';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import Iconify from '../../components/iconify';

import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFTextField,

} from '../../components/hook-form';



// ----------------------------------------------------------------------

const COUNTRIES = [
  { id: '1', value: 'New Zealand' },
  { id: '2', value: 'Canada' },
  { id: '3', value: 'USA' },
  { id: '4', value: 'Portugal' },
];

const STATUS_OPTION = [
  { id: '1', value: 'Order Received' },
  { id: '2', value: 'In Progress' },
  { id: '3', value: 'Ready For Transport' },
  { id: '4', value: 'In Freight' },
  { id: '5', value: 'Deployed' },
  { id: '6', value: 'Archived' },
];
const CATEGORY_OPTION = [
  { group: 'FRAMA', classify: ['FRAMA 3200', 'FRAMA 3600', 'FRAMA 4200', 'FRAMA 5200', 'FRAMA 5600', 'FRAMA 6800', 'FRAMA 7600', 'FRAMA 7800', 'FRAMA 8800', 'FRAMA Custom Female interlock'] },
  { group: 'Decoiler', classify: ['0.5T Decoiler', '1.0T Decoiler', '1.5T Decoiler', '3.0T Decoiler', '5.0T Decoiler', '6.0T Decoiler'] },
  { group: 'Rivet Cutter', classify: ['Rivet Former', 'Rivet Cutter Red', 'Rivet Cutter Green', 'Rivet Cutter Blue'] },
];

// ----------------------------------------------------------------------

// AssetEditForm.propTypes = {
//   currentAsset: PropTypes.object,
// };

export default function AssetEditForm() {

  const { error, asset } = useSelector((state) => state.asset);

  const { departments } = useSelector((state) => state.department);
  
  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const EditAssetSchema = Yup.object().shape({
    name: Yup.string().required('Name is required')  ,
    status: Yup.string(),
    tag: Yup.string(),
    model: Yup.string(),
    serial: Yup.string().required('Serial is required'),
    location: Yup.string(),
    department: Yup.string(),
    image: Yup.mixed().nullable(true),  });


  const defaultValues = useMemo(
    () => ({
      id: asset?._id || '',
      name: asset?.name || '',
      status: asset?.status || '',
      tag: asset?.assetTag || '',
      model: asset?.assetModel || '',
      serial: asset?.serial || '',
      location: asset?.location || '',
      department: asset?.department?._id || '',
      image: null,
      imagePath: asset?.image || null,
      replaceImage: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [asset]
  );

  const methods = useForm({
    resolver: yupResolver(EditAssetSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (asset) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset]);


  const onSubmit = async (data) => {
    // console.log(data);
      try{
        dispatch(updateAsset(data));
        reset();
        enqueueSnackbar('Update success!');
        navigate(PATH_DASHBOARD.asset.list);
      } catch(err){
        enqueueSnackbar('Saving failed!');
        console.error(error);
      }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('image', newFile, { shouldValidate: true });
        setValue('replaceImage', true);
      }
    },
    [setValue]
  );

  const handleRemoveFile = () => {
    setValue('image', null);
  };

  const onDownload = () => {

  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={7} md={7}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Asset Name" />

              <RHFTextField name="serial" label="Serial" />

              <RHFSelect native name="model" label="Model">
                  <option value="" />
                  {CATEGORY_OPTION.map((model) => (
                    <optgroup key={model.group} label={model.group}>
                      {model.classify.map((classify) => (
                        <option key={classify} value={classify}>
                          {classify}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </RHFSelect>

                <RHFSelect xs={3} md={4} native name="status" label="Status">
                <option value="" disabled/>
                  {STATUS_OPTION.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </RHFSelect>

                <RHFTextField name="tag" label="Asset Tag" />

                <RHFSelect native name="location" label="Location">
                <option value="" disabled/>
                {COUNTRIES.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </RHFSelect>

                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <RHFSelect native name="department" label="Department">
                    <option value="" disabled/>
                    {departments.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={4}>
                    <LoadingButton variant="contained" size="large" loading={isSubmitting}>
                      New
                    </LoadingButton>
                  </Grid>
                </Grid>



              <Grid container spacing={1}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Image
                  </Typography>

                  <RHFUpload
                    name="image"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    onDelete={handleRemoveFile}
                  />

                  </Stack>

                  </Grid>

                <Grid item xs={8}>

                
                {/* {currentAsset.image && <Link
                  href = {currentAsset.image === undefined ? '' : `${CONFIG.APP_DOMAIN_NAME}:${CONFIG.APP_PORT}/${currentAsset.image}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                  size ="small" 
                  color ="secondary" 
                  variant ="contained" 
                  // href = {currentAsset.image === undefined ? '' : `localhost:5000/${currentAsset.image}`}
                  startIcon={<Iconify icon="ic:baseline-download" />}
                  >
                    View Attachment
                  </Button>
                </Link>} */}

                </Grid>

              </Grid>



              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Save Changes
            </LoadingButton>
            </Stack>

          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
