import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// slice
import { getDepartments } from '../../../redux/slices/department';

import { saveAsset } from '../../../redux/slices/asset';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

import { useAuthContext } from '../../../auth/useAuthContext';

import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from '../../../components/hook-form';


import { LocationForm } from '../location';



// import { GridRow } from '@mui/x-data-grid';

// ----------------------------------------------------------------------

const COUNTRIES = [
  { id: '1', value: 'Pakistan' },
  { id: '2', value: 'Canada' },
  { id: '3', value: 'Portugal' },
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

AssetNewForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentAsset: PropTypes.object,
};

export default function AssetNewForm({ isEdit, readOnly, currentAsset }) {

  const { error } = useSelector((state) => state.asset);

  const { departments } = useSelector((state) => state.department);
  
  const { userId } = useAuthContext();

  // console.log(user);


  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewAssetSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').disabled  ,
    status: Yup.string().required('Status is required'),
    tag: Yup.string().required('Asset Tag is required'),
    model: Yup.string().required('Model is required'),
    serial: Yup.string().required('Serial is required'),
    location: Yup.string().required('Location is required'),
    department: Yup.string().required('Department is required'),
    notes: Yup.string(),
    image: Yup.mixed().nullable(true),  });

  const defaultValues = useMemo(
    () => ({
      id: '',
      name: '',
      status: '',
      tag: '',
      model: '',
      serial: '',
      location: '',
      department_id: '',
      notes: '',
      image: null,
      addedBy: userId,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentAsset]
  );

  const methods = useForm({
    resolver: yupResolver(NewAssetSchema),
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

  useLayoutEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

  useEffect(() => {
      reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);


  const onSubmit = async (data) => {
    console.log(data);
      try{
        dispatch(saveAsset(data));
        reset();
        enqueueSnackbar('Create success!');
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
      }
    },
    [setValue]
  );

  const handleRemoveFile = () => {
    setValue('image', null);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={7} md={7}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Asset Name" />

              <RHFTextField name="tag" label="Asset Tag" />

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
                    <option key={option.id} value={option.id}>
                      {option.value}
                    </option>
                  ))}
                </RHFSelect>

                <RHFTextField name="serial" label="Serial" />

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


              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Notes
                </Typography>

                <RHFEditor simple name="notes" />
              </Stack> 


              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Image
                </Typography>

                <RHFUpload
                  name="image"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onDelete={handleRemoveFile}
                  // onUpload={() => console.log('ON UPLOAD')}
                />
              </Stack>

              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Save Asset' : 'Save Changes'}
            </LoadingButton>
            </Stack>
            
          </Card>
          
        </Grid>
      </Grid>
    </FormProvider>
  );
}
