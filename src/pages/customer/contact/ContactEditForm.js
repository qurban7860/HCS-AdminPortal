import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput } from 'mui-tel-input';
import { Box, Card, Grid, Stack } from '@mui/material';
// slice
import {
  updateContact,
  setContactEditFormVisibility,
  resetContact,
  getContacts,
  getActiveContacts,
  getContact,
} from '../../../redux/slices/customer/contact';
import { getActiveDepartments } from '../../../redux/slices/Department/department'
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFAutocomplete,
  RHFMultiSelect,
  RHFTextField,
} from '../../../components/hook-form';
import { AddFormLabel } from '../../../components/DocumentForms/FormLabel';
import ToggleButtons from '../../../components/DocumentForms/ToggleButtons';
// assets
import { countries } from '../../../assets/data';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
// schema
import { ContactSchema } from '../../schemas/customer';
// constants
import { FORMLABELS, Snacks } from '../../../constants/customer-constants';
import { FORMLABELS as formLABELS } from '../../../constants/default-constants';


// ----------------------------------------------------------------------

ContactEditForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentAsset: PropTypes.object,
};

export default function ContactEditForm({ isEdit, readOnly, currentAsset }) {
  const { contact, activeContacts } = useSelector((state) => state.contact);
  const { customer } = useSelector((state) => state.customer);
  const { departments } = useSelector((state) => state.department);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [phone, setPhone] = useState('');

  // --------------------------------hooks----------------------------------
  const defaultValues = useMemo(
    () => ({
      id: contact?._id || '',
      customer: contact?.customer || '',
      firstName: contact?.firstName || '',
      lastName: contact?.lastName || '',
      title: contact?.title || '',
      contactTypes: contact?.contactTypes || [],
      // phone: contact?.phone || '',
      email: contact?.email || '',
      reportingTo: contact?.reportingTo || null,
      department: contact?.department || null,
      street: contact?.address?.street || '',
      suburb: contact?.address?.suburb || '',
      city: contact?.address?.city || '',
      region: contact?.address?.region || '',
      postcode: contact?.address?.postcode || '',
      isActive: contact?.isActive,
      country: countries.find((contry)=> contry?.label?.toLocaleLowerCase() === contact?.address?.country?.toLocaleLowerCase() ) || null ,
    }),
    [contact]
  );

  const methods = useForm({
    resolver: yupResolver(ContactSchema),
    defaultValues,
  });

  const {
    reset,
    watch,

    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  watch();

  useEffect(() => {
    dispatch(getActiveContacts(customer?._id))
    dispatch(getActiveDepartments())
  },[dispatch, customer?._id])

  useEffect(() => {
    setPhone(contact?.phone);
  }, [contact]);

  useEffect(() => {
    if (contact) {
      reset(defaultValues);
    }
  }, [contact, reset, defaultValues]);

  // -------------------------------functions---------------------------------
  const toggleCancel = () => { dispatch(setContactEditFormVisibility(false)) };

  const onSubmit = async (data) => {
    try {
      if (phone && phone.length > 4) {
        data.phone = phone;
      } else {
        data.phone = '';
      }
      await dispatch(updateContact(customer?._id, data));
      reset();
      dispatch(setContactEditFormVisibility(false));
      dispatch(resetContact());
      dispatch(getContacts(customer?._id));
      dispatch(getContact(customer?._id, contact?._id));

      enqueueSnackbar(Snacks.SAVE_SUCCESS);
    } catch (err) {
      enqueueSnackbar(Snacks.SAVE_FAILED, { variant: 'error' });
      console.error(err);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container direction="column">
        <Grid item sm={12} lg={12}>
          <Card sx={{ p: 3, mb: 3 }}>
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

                <RHFTextField name={FORMLABELS.FIRSTNAME.name} label={FORMLABELS.FIRSTNAME.label} />
                <RHFTextField name={FORMLABELS.LASTNAME.name} label={FORMLABELS.LASTNAME.label} />
                <RHFTextField name={FORMLABELS.TITLE.name} label={FORMLABELS.TITLE.label} />

                <RHFMultiSelect
                  chip
                  checkbox
                  name={FORMLABELS.CONTACT_TYPES.name}
                  label={FORMLABELS.CONTACT_TYPES.label}
                  options={FORMLABELS.CONTACT_TYPES.options}
                />

                <MuiTelInput
                  value={phone}
                  name="phone"
                  label="Phone Number"
                  flagSize="medium"
                  onChange={(newValue)=>setPhone(newValue)}
                  inputProps={{maxLength:13}}
                  forceCallingCode
                  defaultCountry="NZ"
                />

                <RHFTextField name={FORMLABELS.EMAIL.name} label={FORMLABELS.EMAIL.label} />

              <RHFAutocomplete
                  name={FORMLABELS.REPORTINGTO.name}
                  label={FORMLABELS.REPORTINGTO.label}
                  options={activeContacts.filter((activeContact)=> contact?._id !== activeContact?._id )}
                  getOptionLabel={(option) => `${option?.firstName || ''} ${option?.lastName || ''}`}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => (
                    <li {...props} key={option?._id}>{`${option?.firstName  || '' } ${option?.lastName  || '' }`}</li>
                  )}
                />

              <RHFAutocomplete
                name={FORMLABELS.DEPARTMENT.name}
                label={FORMLABELS.DEPARTMENT.label}
                options={departments}
                getOptionLabel={(option) => option?.departmentName || ''}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                renderOption={(props, option) => (
                  <li {...props} key={option?._id}>{option?.departmentName || ''}</li>
                )}
              />

              </Box>
              
            </Stack>
          </Card>

          <Card sx={{ p: 3, mb: 3 }}>
            <Stack spacing={3}>
              <AddFormLabel content={formLABELS.ADDRESS} />
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name={FORMLABELS.STREET.name} label={FORMLABELS.STREET.label} />
                <RHFTextField name={FORMLABELS.SUBURB.name} label={FORMLABELS.SUBURB.label} />
                <RHFTextField name={FORMLABELS.CITY.name} label={FORMLABELS.CITY.label} />
                <RHFTextField name={FORMLABELS.REGION.name} label={FORMLABELS.REGION.label} />
                <RHFTextField name={FORMLABELS.POSTCODE.name} label={FORMLABELS.POSTCODE.label} />

                <RHFAutocomplete
                  options={countries}
                  name={FORMLABELS.COUNTRY.name}
                  label={FORMLABELS.COUNTRY.label}
                  getOptionLabel={(option) => `${option.label} (${option.code}) `}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      <img loading="lazy" width="20" alt=""
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                      />
                      {option.label || ''} ({option.code || '' }) {option.phone || '' }
                    </Box>
                  )}
                />
              </Box>
              <ToggleButtons isMachine name={formLABELS.isACTIVE.name} />
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
