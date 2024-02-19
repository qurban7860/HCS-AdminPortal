import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput } from 'mui-tel-input';
import { Box, Card, Grid, Stack } from '@mui/material';
// schema
import { ContactSchema } from '../../schemas/customer';
// slice
import { addContact, getActiveContacts, setContactFormVisibility, setContactEditFormVisibility, setContactMoveFormVisibility, resetActiveContacts } from '../../../redux/slices/customer/contact';
import { getActiveDepartments, resetDepartments } from '../../../redux/slices/Department/department';
// components
import { useSnackbar } from '../../../components/snackbar';
import { useAuthContext } from '../../../auth/useAuthContext';
import FormProvider, { RHFMultiSelect, RHFTextField, RHFAutocomplete, RHFCountryAutocomplete } from '../../../components/hook-form';
// assets
import { countries } from '../../../assets/data';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import ToggleButtons from '../../../components/DocumentForms/ToggleButtons';
import { FORMLABELS as FORM_LABELS } from '../../../constants/default-constants';
import { FORMLABELS } from '../../../constants/customer-constants';
import { AddFormLabel } from '../../../components/DocumentForms/FormLabel';

// ----------------------------------------------------------------------

ContactAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  setIsExpanded: PropTypes.func,
  currentContact: PropTypes.object,
};

export default function ContactAddForm({ isEdit, readOnly, setIsExpanded, currentContact }) {
  const { formVisibility, activeContacts } = useSelector((state) => state.contact);
  const { customer } = useSelector((state) => state.customer);
  const { departments } = useSelector((state) => state.department);
  const { userId, user } = useAuthContext();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [phone, setPhone] = useState('');

  const defaultValues = useMemo(
    () => ({
      customer: customer?._id,
      firstName: '',
      lastName: '',
      title: '',
      contactTypes: [],
      isActive: true,
      // phone: '',
      email: '',
      reportingTo: null,
      department: null,
      country: countries.find((contry)=> contry?.label?.toLocaleLowerCase() === 'New Zealand'.toLocaleLowerCase() ) || null ,
      loginUser: {
        userId,
        email: user.email,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(ContactSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    // setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

   watch();

  useEffect(() => {
    dispatch(getActiveContacts(customer?._id));
    dispatch(getActiveDepartments())
    reset(defaultValues);
    if (!formVisibility) {
      dispatch(setContactFormVisibility(true));
    }
    return ()=>{ 
      dispatch(resetActiveContacts())
      dispatch(resetDepartments())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      if (phone && phone.length > 7) {
        data.phone = phone;
      }
      await dispatch(addContact(data));
      setIsExpanded(true);
      dispatch(setContactEditFormVisibility(false))
      dispatch(setContactMoveFormVisibility(false))
      enqueueSnackbar('Contact added successfully');
      reset();
    } catch (error) {
      enqueueSnackbar("Failed : Contact adding", { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => { dispatch(setContactFormVisibility(false)) };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <Card sx={{ p: 3, mb: 3 }}>
          <Stack spacing={3}>
            <Box
              rowGap={2}
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
                name={FORMLABELS.PHONE.name}
                label={FORMLABELS.PHONE.label}
                flagSize={FORMLABELS.PHONE.flagSize}
                onChange={(newValue)=>setPhone(newValue)}
                inputProps={{maxLength:13}}
                forceCallingCode
                defaultCountry="NZ"
              />
              <RHFTextField name={FORMLABELS.EMAIL.name} label={FORMLABELS.EMAIL.label} />
              <RHFAutocomplete
                name={FORMLABELS.REPORTINGTO.name}
                label={FORMLABELS.REPORTINGTO.label}
                options={activeContacts}
                getOptionLabel={(option) => `${option?.firstName || ''} ${option?.lastName || ''}` }
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
            <AddFormLabel content={FORM_LABELS.ADDRESS} />
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

              <RHFCountryAutocomplete 
                name={FORMLABELS.COUNTRY.name}
                label={FORMLABELS.COUNTRY.label}
              />

            </Box>
            <ToggleButtons isMachine name={FORMLABELS.isACTIVE.name} />
          </Stack>
          <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
        </Card>
      </Grid>
    </FormProvider>
  );
}
