import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { Box, Card, Grid, Stack, Typography, TextField } from '@mui/material';
// schema
import { AddContactSchema } from './schemas/AddContactSchema';
// slice
import { addContact, setContactFormVisibility } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
import { useAuthContext } from '../../../auth/useAuthContext';
import FormProvider, {
  RHFMultiSelect,
  RHFTextField,
  RHFAutocomplete,
} from '../../../components/hook-form';
// assets
import { countries } from '../../../assets/data';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import { FORMLABELS as FORM_LABELS } from '../../../constants/default-constants';
import { Snacks, FORMLABELS } from '../../../constants/customer-constants';
import { AddFormLabel } from '../../components/DocumentForms/FormLabel';

// ----------------------------------------------------------------------

ContactAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentContact: PropTypes.object,
};

export default function ContactAddForm({ isEdit, readOnly, currentContact }) {
  const { formVisibility } = useSelector((state) => state.contact);
  const { customer } = useSelector((state) => state.customer);
  const { userId, user } = useAuthContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const numberRegExp = /^[0-9]+$/;
  const [phone, setPhone] = useState('');
  const [country, setCountryVal] = useState('');

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
    if(newValue.length < 17){
      setPhone(newValue);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (phone && phone.length > 7) {
        data.phone = phone;
      }
      if (country) {
        data.country = country.label;
      }
      await dispatch(addContact(data));
      reset();
    } catch (error) {
      enqueueSnackbar(Snacks.SAVE_FAILED, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    dispatch(setContactFormVisibility(false));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid>
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
              mb={2}
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

              {/* <RHFTextField name="phone" label="Phone" /> */}
              <MuiTelInput
                value={phone}
                name={FORMLABELS.PHONE.name}
                label={FORMLABELS.PHONE.label}
                flagSize={FORMLABELS.PHONE.flagSize}
                onChange={handlePhoneChange}
                forceCallingCode
                defaultCountry={FORMLABELS.PHONE.defaultCountry}
              />

              <RHFTextField name={FORMLABELS.EMAIL.name} label={FORMLABELS.EMAIL.label} />
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

              <RHFAutocomplete
                id={FORMLABELS.COUNTRY.id}
                options={countries}
                value={country || null}
                name={FORMLABELS.COUNTRY.name}
                label={FORMLABELS.COUNTRY.label}
                autoHighlight
                onChange={(event, newValue) => {
                  if (newValue) {
                    setCountryVal(newValue);
                  } else {
                    setCountryVal('');
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
                  <TextField {...params} label={FORMLABELS.COUNTRY.select} />
                )}
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
