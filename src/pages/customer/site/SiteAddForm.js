import { useEffect,useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput } from 'mui-tel-input';
import { Box,Card, Grid, Stack, Typography, alpha, Button, IconButton } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
// slice
import { addSite, getSites, setSiteFormVisibility } from '../../../redux/slices/customer/site';
import { getActiveContacts, resetActiveContacts } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
// assets
import { countries } from '../../../assets/data';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFSwitch, RHFTextField, RHFAutocomplete, RHFCountryAutocomplete, RHFCustomPhoneInput, RHFCheckbox } from '../../../components/hook-form';
import { SiteSchema } from '../../schemas/customer'
import Iconify from '../../../components/iconify';
import { StyledTooltip } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function SiteAddForm() {

  const { customer } = useSelector((state) => state.customer);
  const { activeContacts } = useSelector((state) => state.contact);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();


  const theme = createTheme({
    palette: {
      success: green,
    },
  });

  useEffect(() => {
    dispatch( getActiveContacts(customer?._id))
    return( ) => {
      dispatch(resetActiveContacts())
    }
  }, [ customer, dispatch ] );

  const defaultValues = useMemo(
    () => ({
      name: '',
      customer: customer?._id,
      billingSite: '',
      phoneNumbers: [ { type: 'Phone', countryCode: '64' }, { type: 'Fax', countryCode: '64' } ],
      email: '',
      website: '',
      street: '',
      suburb: '',
      city: '',
      region: '',
      postcode: '',
      country: countries.find((contry)=> contry?.label?.toLocaleLowerCase() === 'New Zealand'.toLocaleLowerCase() ) || null ,
      primaryTechnicalContact: null,
      updateAddressPrimaryBillingContact: false,
      primaryBillingContact: null,
      updateAddressPrimaryTechnicalContact: false,
      isArchived: false,
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(SiteSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { phoneNumbers,  country } = watch();

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(addSite(data));
      await dispatch(getSites(customer?._id))
      reset();
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  useEffect(() => {
    phoneNumbers?.forEach((pN, index) => {
      if(!phoneNumbers[index]?.contactNumber || phoneNumbers[index]?.contactNumber === undefined ){
        setValue( `phoneNumbers[${index}].countryCode`,  country?.phone?.replace(/[^0-9]/g, '') )
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ country ]);

  const updateCountryCode = () =>{
    phoneNumbers?.forEach((pN, index ) =>  setValue( `phoneNumbers[${index}].countryCode`,  country?.phone?.replace(/[^0-9]/g, '') ))
  }

  const removeContactNumber = (indexToRemove) => {
    setValue('phoneNumbers',  phoneNumbers?.filter((_, index) => index !== indexToRemove) || [] );
  }

  const addContactNumber = () => {
    const updatedPhoneNumbers = [...phoneNumbers, { type: 'Phone', countryCode: country?.phone?.replace(/[^0-9]/g, '')} ]; 
    setValue( 'phoneNumbers', updatedPhoneNumbers )
  }
  const toggleCancel = () => dispatch(setSiteFormVisibility(false));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container >
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <RHFTextField name="name" label="Name*" />
              <Box
                rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <RHFTextField name="street" label="Street" />
                <RHFTextField name="suburb" label="Suburb" />
                <RHFTextField name="city" label="City" />
                <RHFTextField name="region" label="Region" />
                <RHFTextField name="postcode" label="Post Code" />
                <RHFCountryAutocomplete  name="country" label="Country" />
                <RHFTextField name="lat" label="Latitude" />
                <RHFTextField name="long" label="Longitude" />
                </Box>
                <Box display="flex" alignItems="center" gridTemplateColumns={{ sm: 'repeat(1, 1fr)' }} >
                  <IconButton onClick={updateCountryCode} size="small" variant="contained" color='secondary' sx={{ mr: 0.5}} >
                    <Iconify icon="icon-park-outline:update-rotation" sx={{width: 25, height: 25}}  />
                  </IconButton>
                  <Typography variant='body2' sx={{ color:'gray'}}>Update country code in phone/fax.</Typography>
                </Box>
                  <Grid>
                    {phoneNumbers?.map((pN, index) => (
                      <Grid sx={{ py: 1 }} display="flex" alignItems="center" >
                        <RHFCustomPhoneInput name={`phoneNumbers[${index}]`} value={pN} label={pN?.type || 'Contact Number'} index={index} />
                        <IconButton disabled={phoneNumbers?.length === 1} onClick={ () => removeContactNumber(index) } size="small" variant="contained" color='error' sx={{ mx: 1 }} >
                          <StyledTooltip title="Remove Contact Number" placement="top" disableFocusListener tooltipcolor={theme.palette.error.main}  color={ phoneNumbers?.length > 1 ? theme.palette.error.main : theme.palette.text.main }  >
                            <Iconify icon="icons8:minus" sx={{width: 25, height: 25}}  />
                          </StyledTooltip>
                        </IconButton>
                      </Grid>
                    ))}
                    <Grid >
                      <IconButton disabled={ phoneNumbers?.length > 9 } onClick={ addContactNumber } size="small" variant="contained" color='success' sx={{ ml: 'auto', mr:1 }} >
                        <StyledTooltip title="Add Contact Number" placement="top" disableFocusListener tooltipcolor={theme.palette.success.dark} color={ phoneNumbers?.length < 10 ? theme.palette.success.dark : theme.palette.text.main }  >
                          <Iconify icon="icons8:plus" sx={{width: 25, height: 25}}  />
                        </StyledTooltip>
                      </IconButton>
                    </Grid>
                  </Grid>
              <Box
                rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <RHFTextField name="email" label="Email" />
                <RHFTextField name="website" label="Website" />
              </Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Contact Details
              </Typography>
              <Box
                rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
              <Box display="grid" gridTemplateColumns={{  sm: 'repeat(1, 1fr)' }}  >
                <RHFAutocomplete
                  name='primaryBillingContact'
                  label="Primary Billing Contact" 
                  options={activeContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''}`}
                  renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.firstName || ''} ${option.lastName || ''}`}</li> )}
                />
                <RHFCheckbox name="updateAddressPrimaryBillingContact" label="Update Primary Billing Contact Address" />
              </Box>
              <Box display="grid" gridTemplateColumns={{ sm: 'repeat(1, 1fr)' }} >
                <RHFAutocomplete
                  name='primaryTechnicalContact'
                  label="Primary Technical Contact"
                  options={activeContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName : ''}`}
                  renderOption={(props, option) => ( <li {...props} key={option?._id}> {`${option.firstName || ''} ${option.lastName || ''}`}</li> )}
                />
                <RHFCheckbox name="updateAddressPrimaryTechnicalContact" label="Update Primary Technical Contact Address" />
              </Box>
              </Box>
              <RHFSwitch name="isActive" label="Active" />
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
