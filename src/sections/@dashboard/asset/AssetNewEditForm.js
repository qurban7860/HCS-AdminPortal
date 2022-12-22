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
import { Box, Card, Grid, Stack, Typography, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from '../../../components/hook-form';


import { LocationForm } from './Location';



// import { GridRow } from '@mui/x-data-grid';

// ----------------------------------------------------------------------

const GENDER_OPTION = [
  { label: 'Men', value: 'Men' },
  { label: 'Women', value: 'Women' },
  { label: 'Kids', value: 'Kids' },
];

const STATUS_OPTION = [
  { id: '1', value: 'Ready To Deploy' },
  { id: '2', value: 'Pending' },
  { id: '3', value: 'Archived' },
  { id: '4', value: 'Undeployable' },
];
const CATEGORY_OPTION = [
  { group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather'] },
  { group: 'Tailored', classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats'] },
  { group: 'Accessories', classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'] },
];

const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots',
];

// ----------------------------------------------------------------------

AssetNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentAsset: PropTypes.object,
};

export default function AssetNewEditForm({ isEdit, currentAsset }) {
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewAssetSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    images: Yup.array().min(1, 'Images is required'),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    model: Yup.string().required('model is required'),
    status: Yup.string().required('status is required'),
    serial: Yup.string().required('serial is required'),
    department: Yup.string().required('department is required'),
    location: Yup.string().required('location is required'),
    supplier: Yup.string().required('supplier is required'),
    notes: Yup.string().required('notes is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentAsset?.name || '',
      description: currentAsset?.description || '',
      images: currentAsset?.images || [],
      tags: currentAsset?.tags || '',
      price: currentAsset?.price || '',
      model: currentAsset?.model || '',
      status: currentAsset?.status || '',
      // tags: currentAsset?.tags || [TAGS_OPTION[0]],
      department: currentAsset?.department || '',
      location: currentAsset?.location || '',
      supplier: currentAsset?.supplier || '',
      notes: currentAsset?.notes || '',
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

  useEffect(() => {
    if (isEdit && currentAsset) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentAsset]);


  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.asset.list);
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = (inputFile) => {
    const filtered = values.images && values.images?.filter((file) => file !== inputFile);
    setValue('images', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('images', []);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={7} md={7}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Asset Name" />

              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Description
                </Typography>

                <RHFEditor simple name="description" />
              </Stack> 

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

                <RHFTextField name="serial" label="Serials" />
                
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <RHFSelect native name="department" label="Department">
                    <option value="" disabled/>
                      {/* {STATUS_OPTION.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.value}
                        </option>
                      ))} */}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={4}>
                    <LoadingButton variant="contained" size="large" loading={isSubmitting}>
                      {!isEdit ? 'New' : 'Save Changes'}
                    </LoadingButton>
                  </Grid>
                </Grid>

                <RHFSelect native name="location" label="Location">
                <option value="" disabled/>
                  {/* {STATUS_OPTION.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.value}
                    </option>
                  ))} */}
                </RHFSelect>

                <RHFSelect native name="supplier" label="Supplier">
                <option value="" disabled/>
                  {/* {STATUS_OPTION.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.value}
                    </option>
                  ))} */}
                </RHFSelect>

 

              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Images
                </Typography>

                <RHFUpload
                  multiple
                  thumbnail
                  name="images"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemoveFile}
                  onRemoveAll={handleRemoveAllFiles}
                  onUpload={() => console.log('ON UPLOAD')}
                />
              </Stack>
            </Stack>
            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Save Asset' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>

        {/* <Dialog fullWidth maxWidth="xs" open={true} onClose={false}> 
          <DialogTitle>Add Location</DialogTitle>

          <LocationForm
            event={selectedEvent}
            onCancel={handleCloseModal}
            onCreateUpdateEvent={handleCreateUpdateEvent}
            onDeleteEvent={handleDeleteEvent}         
           />
      </Dialog>  */}
{/* 
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <RHFSwitch name="inStock" label="In stock" />

              <Stack spacing={3} mt={2}>
                <RHFTextField name="code" label="Asset Code" />

                <RHFTextField name="sku" label="Asset SKU" />

                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Gender
                  </Typography>

                  <RHFRadioGroup row spacing={4} name="gender" options={GENDER_OPTION} />
                </Stack>

                <RHFSelect native name="category" label="Category">
                  <option value="" />
                  {CATEGORY_OPTION.map((category) => (
                    <optgroup key={category.group} label={category.group}>
                      {category.classify.map((classify) => (
                        <option key={classify} value={classify}>
                          {classify}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </RHFSelect>

                <RHFAutocomplete
                  name="tags"
                  label="Tags"
                  multiple
                  freeSolo
                  options={TAGS_OPTION.map((option) => option)}
                  ChipProps={{ size: 'small' }}
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField
                  name="price"
                  label="Regular Price"
                  placeholder="0.00"
                  onChange={(event) =>
                    setValue('price', Number(event.target.value), { shouldValidate: true })
                  }
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          $
                        </Box>
                      </InputAdornment>
                    ),
                    type: 'number',
                  }}
                />

                <RHFTextField
                  name="priceSale"
                  label="Sale Price"
                  placeholder="0.00"
                  onChange={(event) => setValue('priceSale', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          $
                        </Box>
                      </InputAdornment>
                    ),
                    type: 'number',
                  }}
                />
              </Stack>

              <RHFSwitch name="taxes" label="Price includes taxes" />
            </Card>

            
          </Stack>
        </Grid>  */}
      </Grid>
    </FormProvider>
  );
}
