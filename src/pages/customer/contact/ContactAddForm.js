import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useLayoutEffect, useMemo , useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Button, Typography, DialogTitle, Dialog, InputAdornment , TextField} from '@mui/material';
// slice
import { getCustomers } from '../../../redux/slices/customer/customer';

import { saveContact, setContactFormVisibility } from '../../../redux/slices/customer/contact';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

import { useAuthContext } from '../../../auth/useAuthContext';

import FormProvider, {
  RHFSelect,
  RHFMultiSelect,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch
} from '../../../components/hook-form';
// assets
import { countries } from '../../../assets/data';


// ----------------------------------------------------------------------

ContactAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentContact: PropTypes.object,
};

const CONTACT_TYPES = [
  { value: 'technical', label: 'Technical' },
  { value: 'financial', label: 'Financial' },
  { value: 'support', label: 'Support' },
];

export default function ContactAddForm({ isEdit, readOnly, currentContact }) {

  const { formVisibility } = useSelector((state) => state.contact);

  const { customer } = useSelector((state) => state.customer);

  const { userId, user } = useAuthContext();

  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const numberRegExp = /^[0-9]+$/;

  const [phone, setPhone] = useState('')
  const [country, setCountryVal] = useState('')

  const AddContactSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    title: Yup.string(),
    contactTypes: Yup.array(),
    // phone: Yup.string(),
    email: Yup.string().trim('The email name cannot include leading and trailing spaces').email('Email must be a valid email address'),
    street: Yup.string(),
    suburb: Yup.string(),
    city: Yup.string(),
    region: Yup.string(),
    postcode: Yup.string(),
    // country: Yup.string().nullable()
  });

  const defaultValues = useMemo(
    () => ({
      customer: customer._id,
      firstName: '',
      lastName: '',
      title: '',
      contactTypes: [],
      // phone: '',
      email: '',
      loginUser: {
        userId,
        email: user.email,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddContactSchema),
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
    reset(defaultValues);
    if (!formVisibility) {
      dispatch(setContactFormVisibility(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handlePhoneChange = (newValue) => {
    matchIsValidTel(newValue)
    if(newValue.length < 20){
      setPhone(newValue)
    }
  }

  const onSubmit = async (data) => {
    // console.log(data);
      try{
        if(phone.length > 7){
          data.phone = phone ;
        }
        if(country){
          data.country = country.label
        }
        await dispatch(saveContact(data));
        reset();
      } catch(error){
        enqueueSnackbar('Saving failed!');
        console.error(error);
      }
  };

  const toggleCancel = () => 
    {
      dispatch(setContactFormVisibility(false));
    };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
              >

              <RHFTextField name="firstName" label="First Name" />

              <RHFTextField name="lastName" label="Last Name" />

              <RHFTextField name="title" label="Title" />

              <RHFMultiSelect
                chip
                checkbox
                name="contactTypes"
                label="Contact Types"
                options={CONTACT_TYPES}
              />

              {/* <RHFTextField name="phone" label="Phone" /> */}
              <MuiTelInput value={phone} name='phone' label="Phone Number" flagSize="medium"  onChange={handlePhoneChange}  forceCallingCode defaultCountry="NZ"/>
                
              <RHFTextField name="email" label="Email" />
              
              </Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Address Details
              </Typography>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >

                <RHFTextField name="street" label="Street" />

                <RHFTextField name="suburb" label="Suburb" />

                <RHFTextField name="city" label="City" />

                <RHFTextField name="region" label="Region" />

                <RHFTextField name="postcode" label="Post Code" />


                {/* <RHFAutocomplete
                  name="country"
                  label="Country"
                  freeSolo
                  options={countries.map((country) => country.label)}
                  // getOptionLabel={(option) => option.title}
                  
                  ChipProps={{ size: 'small' }}
                /> */}
                <RHFAutocomplete
                   id="country-select-demo"
                    options={countries}
                    value={country || null}
                    name="country"
                    label="Country"
                    autoHighlight
                    isOptionEqualToValue={(option, value) => option.lable === value.lable}
                    onChange={(event, newValue) => {
                      if(newValue){
                      setCountryVal(newValue);
                      }
                      else{ 
                      setCountryVal("");
                      }
                    }}
                    getOptionLabel={(option) => `${option.label} (${option.code}) `}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img
                          loading="lazy"
                          width="20"
                          src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                          srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                          alt=""
                        />
                        {option.label} ({option.code}) +{option.phone}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Choose a country"
                      />
                    )}
                />
              </Box>

              <Box
                rowGap={5}
                columnGap={4}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(4, 1fr)',
                }}
              > 
              
                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Save Contact
                </LoadingButton>
              
                <Button 
                  onClick={toggleCancel}
                  variant="outlined" 
                  size="large">
                    Cancel
                </Button>


            </Box>

            </Stack>
            
          </Card>
      </Grid>
    </FormProvider>
  );
}
