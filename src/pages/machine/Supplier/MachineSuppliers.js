import PropTypes from 'prop-types';
import * as Yup from 'yup';
import axios from 'axios';
import { useLayoutEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// import style from '../../style/style.css'
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Container,
  Checkbox,
  DialogTitle,
  Dialog,
  InputAdornment,
} from '@mui/material';
// slice
import { saveSupplier } from '../../../redux/slices/products/supplier';
// routes
import { PATH_DASHBOARD, PATH_MACHINE } from '../../../routes/paths';
import { useSettingsContext } from '../../../components/settings';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFAutocomplete,
  RHFTextField,
  RHFSwitch,
  RHFMultiSelect,
  RHFEditor,
  RHFUpload,
} from '../../../components/hook-form';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// asset
import { countries } from '../../../assets/data';
// util
import MachineDashboardNavbar from '../util/MachineDashboardNavbar';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
// ----------------------------------------------------------------------

export default function MachineSuppliers() {
  const { userId, user } = useAuthContext();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddMachineSchema = Yup.object().shape({
    name: Yup.string().max(50).required('Name is required'),
    isActive: Yup.boolean(),
    Contact_Name: Yup.string(),
    Contact_Title: Yup.string(),
    phone: Yup.string().nullable(),
    fax: Yup.string().nullable(),
    email: Yup.string().email(),
    website: Yup.string(),
    street: Yup.string(),
    suburb: Yup.string(),
    region: Yup.string(),
    country: Yup.string(),
    postcode: Yup.string(),
    city: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      Contact_Name: '',
      Contact_Title: '',
      phone: '',
      email: '',
      fax: '',
      website: '',
      street: '',
      suburb: '',
      region: '',
      country: '',
      city: '',
      postcode: '',
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddMachineSchema),
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

  // useLayoutEffect(() => {
  //   dispatch(getSPContacts());
  // }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      //   const finaldata= {
      //     name: data.name,
      //     contactName:data.Contact_Name,
      //     contactTitle:data.contactTitle ,
      //     phone:data.phone ,
      //     email:data.email ,
      //     website:data.website ,
      //     fax: data.fax,
      //     address:{
      //         street:data.street ,
      //         suburb:data.suburb ,
      //         city:data.city ,
      //         region:data.region ,
      //         country:data.country ,
      //     }
      // }
      await dispatch(saveSupplier(data));
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_MACHINE.machines.settings.supplier.list);
      // console.log(PATH_MACHINE.tool.list)
    } catch (error) {
      // enqueueSnackbar('Saving failed!');
      enqueueSnackbar(error?.message, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.supplier.list);
  };

  const { themeStretch } = useSettingsContext();
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="New Supplier" icon="material-symbols:inventory-2-rounded" />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={18} md={12} sx={{ mt: 3 }}>
          <Card sx={{ p: 3, mt: 3 }}>
            <Stack spacing={3}>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(1, 1fr)',
                }}
              >
                <RHFTextField name="name" label="Name of Supplier" />
              </Box>
            </Stack>
          </Card>
          <Card sx={{ p: 3, mt: 3 }}>
            <Stack spacing={3}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Contact Information
              </Typography>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                {/* / //contact / */}
                <RHFTextField name="Contact_Name" label="Contact Name" />
                <RHFTextField name="contactTitle" label="Contact Title" />
                <RHFTextField name="phone" label="Phone" type="number" />
                <RHFTextField name="email" label="Email" />
                <RHFTextField name="fax" label="Fax" type="number" />
                <RHFTextField name="website" label="Website" />
              </Box>
            </Stack>
          </Card>
          {/* //address */}
          <Card sx={{ p: 3, mt: 3 }}>
            <Stack spacing={3}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Address Information
              </Typography>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="street" label="Street" />
                <RHFTextField name="suburb" label="Suburb" />
                <RHFTextField name="city" label="City" />
                <RHFTextField name="postcode" label="Post Code" />
                <RHFTextField name="region" label="Region" />
                <RHFAutocomplete
                  name="country"
                  label="Country"
                  freeSolo
                  options={countries.map((country) => country.label)}
                  // getOptionLabel={(option) => option.title}

                  ChipProps={{ size: 'small' }}
                />
              </Box>
              <RHFSwitch
                name="isActive"
                labelPlacement="start"
                label={
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mx: 0,
                      width: 1,
                      justifyContent: 'space-between',
                      mb: 0.5,
                      color: 'text.secondary',
                    }}
                  >
                    Active
                  </Typography>
                }
              />

              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Stack>
          </Card>
        </Grid>
      </FormProvider>
    </Container>
  );
}
