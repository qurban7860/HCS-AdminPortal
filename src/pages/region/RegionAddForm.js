import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  IconButton,
  InputAdornment,
  Autocomplete,
  TextField,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
// component
import Iconify from '../../components/iconify';
// routes
import { PATH_DASHBOARD, PATH_SECURITY, PATH_SETTING } from '../../routes/paths';
// assets
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFMultiSelect } from '../../components/hook-form';
// slice
import { getRoles } from '../../redux/slices/securityUser/role';
import { addRegion, getCountries } from '../../redux/slices/region/region';
// current user
import { useAuthContext } from '../../auth/useAuthContext';
import AddFormButtons from '../components/DocumentForms/AddFormButtons';
// ----------------------------------------------------------------------

RegionAddForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function RegionAddForm({ isEdit = false, currentUser }) {
  const userRolesString = localStorage.getItem('userRoles');
  // const userRoles = JSON.parse(userRolesString);

  const [userRoles, setUserRoles] = useState(JSON.parse(userRolesString));
  const { roles } = useSelector((state) => state.role);
  const { countries } = useSelector((state) => state.region);
  console.log('countries====>', countries);
  const [sortedRoles, setSortedRoles] = useState([]);
  const ROLES = [];
  roles.map((role) => ROLES.push({ value: role?._id, label: role.name }));

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    dispatch(getCountries());
    dispatch(getRoles());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const mappedRoles = roles.map((role) => ({
      value: role?._id,
      label: role.name,
    }));

    const sortedRolesTemp = [...mappedRoles].sort((a, b) => {
      const nameA = a.label.toUpperCase();
      const nameB = b.label.toUpperCase();
      return nameA.localeCompare(nameB);
    });

    setSortedRoles(sortedRolesTemp);
  }, [roles]);


  // useEffect(() => {
  //   countries.forEach((country) => {
  //     const img = new Image();
  //     img.src = `https://flagcdn.com/w20/${country.country_code.toLowerCase()}.png`;
  //     img.srcSet = `https://flagcdn.com/w40/${country.country_code.toLowerCase()}.png 2x`;
  //   });
  // }, [countries]);

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required!').max(40, 'Name must not exceed 40 characters!'),
    description: Yup.string(),
    countries: Yup.array(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      isActive: true,
      countries: [],
      description: ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    trigger,
  } = methods;

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(addRegion(data));
      // await dispatch(resetContacts());
      reset();
      navigate(PATH_SETTING.regions.view(response.data.Region._id));
    } catch (error) {
      if (error.Message) {
        enqueueSnackbar(error.Message, { variant: `error` });
      } else if (error.message) {
        enqueueSnackbar(error.message, { variant: `error` });
      } else {
        enqueueSnackbar('Something went wrong!', { variant: `error` });
      }
      console.log('Error:', error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SETTING.regions.list);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
       <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <RHFTextField name="name" label="Name" />
                  <RHFMultiSelect
                    chip
                    checkbox
                    name="countries"
                    label="Countries"
                    options={countries.map((country) => ({
                      value: country._id, // or the appropriate value for each country
                      label: (
                        <>
                          <Stack direction="row">
                          {country.country_name} ({country.country_code})
                          </Stack>
                        </>
                      ),
                    }))}
                  />
                <RHFTextField name="description" label="Description" minRows={8} multiline />
                <Grid display="flex" alignItems="end">
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
                        {' '}
                        Active
                      </Typography>
                    }
                  />
                </Grid>
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
    </FormProvider>
  );
}
