import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, IconButton } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';

// schema
import { ContactSchema } from '../../schemas/customer';
// slice
import {
  addContact,
  setIsExpanded,
  getActiveContacts,
  setContactFormVisibility,
  setContactEditFormVisibility,
  setContactMoveFormVisibility,
  resetActiveContacts,
} from '../../../redux/slices/customer/contact';
import {
  getActiveDepartments,
  resetDepartments,
} from '../../../redux/slices/Department/department';
// components
import { useSnackbar } from '../../../components/snackbar';
import { useAuthContext } from '../../../auth/useAuthContext';
import FormProvider, {
  RHFMultiSelect,
  RHFTextField,
  RHFAutocomplete,
  RHFCountryAutocomplete,
  RHFCustomPhoneInput,
} from '../../../components/hook-form';
// assets

import { countries } from '../../../assets/data';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import ToggleButtons from '../../../components/DocumentForms/ToggleButtons';
import { FORMLABELS as FORM_LABELS } from '../../../constants/default-constants';
import { FORMLABELS } from '../../../constants/customer-constants';
import { AddFormLabel } from '../../../components/DocumentForms/FormLabel';
import Iconify from '../../../components/iconify';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import { PATH_CUSTOMER } from '../../../routes/paths';

// ----------------------------------------------------------------------

ContactAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentContact: PropTypes.object,
};

export default function ContactAddForm({ isEdit, readOnly, currentContact }) {

  const { formVisibility, activeContacts } = useSelector((state) => state.contact);
  const { customer } = useSelector((state) => state.customer);
  const { departments } = useSelector((state) => state.department);
  const { userId, user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { customerId, id } = useParams() 

  const [phone, setPhone] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = createTheme({ palette: { success: green } });

  const PHONE_TYPES_ = JSON.parse( localStorage.getItem('configurations'))?.find( ( c )=> c?.name === 'PHONE_TYPES' )
  let PHONE_TYPES = ['Mobile', 'Home', 'Work', 'Fax', 'Others'];
  if(PHONE_TYPES_) {
    PHONE_TYPES = PHONE_TYPES_.value.split(',').map(item => item.trim());
  }
  const defaultValues = useMemo(
    () => ({
      customer: customer?._id,
      firstName: '',
      lastName: '',
      title: '',
      contactTypes: [],
      isActive: true,
      // phone: '',
      phoneNumbers: [
        { type: PHONE_TYPES[0], countryCode: '64' },
        { type: PHONE_TYPES[0], countryCode: '64' },
      ],
      email: '',
      reportingTo: null,
      department: null,
      country:
        countries.find(
          (contry) => contry?.label?.toLocaleLowerCase() === 'New Zealand'.toLocaleLowerCase()
        ) || null,
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
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  watch();

  const { phoneNumbers, country } = watch();

  useEffect(() => {
    phoneNumbers?.forEach((pN, index) => {
      if (!phoneNumbers[index]?.contactNumber || phoneNumbers[index]?.contactNumber === undefined) {
        setValue(`phoneNumbers[${index}].countryCode`, country?.phone?.replace(/[^0-9]/g, ''));
      }
    });

    dispatch(getActiveContacts( customerId ));
    dispatch(getActiveDepartments());
    return () => {
      dispatch(resetActiveContacts());
      dispatch(resetDepartments());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const updateCountryCode = () => {
    phoneNumbers?.forEach((pN, index) =>
      setValue(`phoneNumbers[${index}].countryCode`, country?.phone?.replace(/[^0-9]/g, ''))
    );
  };

  const removeContactNumber = (indexToRemove) => {
    setValue('phoneNumbers', phoneNumbers?.filter((_, index) => index !== indexToRemove) || []);
  };

  const addContactNumber = () => {
    const updatedPhoneNumbers = [
      ...phoneNumbers,
      { type: '', countryCode: country?.phone?.replace(/[^0-9]/g, '') },
    ];
    setValue('phoneNumbers', updatedPhoneNumbers);
  };

  const onSubmit = async (data) => {
    try {
      if (phone && phone.length > 7) {
        data.phone = phone;
      }
      await dispatch(addContact(data));
      dispatch(setIsExpanded(true));
      enqueueSnackbar('Contact added successfully');
      reset();
      navigate(PATH_CUSTOMER.contact.root(customerId ))
    } catch (error) {
      enqueueSnackbar('Failed : Contact adding', { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () =>  navigate(PATH_CUSTOMER.contact.root(customerId ));

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
            </Box>
            <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFAutocomplete
                name={FORMLABELS.DEPARTMENT.name}
                label={FORMLABELS.DEPARTMENT.label}
                options={departments}
                getOptionLabel={(option) => option?.departmentName || ''}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                renderOption={(props, option) => (
                  <li {...props} key={option?._id}>
                    {option?.departmentName || ''}
                  </li>
                )}
              />
              <RHFAutocomplete
                name={FORMLABELS.REPORTINGTO.name}
                label={FORMLABELS.REPORTINGTO.label}
                options={activeContacts}
                getOptionLabel={(option) => `${option?.firstName || ''} ${option?.lastName || ''}`}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                renderOption={(props, option) => (
                  <li {...props} key={option?._id}>{`${option?.firstName || ''} ${
                    option?.lastName || ''
                  }`}</li>
                )}
              />
            </Box>
            <RHFTextField name={FORMLABELS.EMAIL.name} label={FORMLABELS.EMAIL.label} />
            <AddFormLabel content={FORM_LABELS.ADDRESS} />
            <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
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
            <Box display="flex" alignItems="center" gridTemplateColumns={{ sm: 'repeat(1, 1fr)' }}>
              <IconButton
                onClick={updateCountryCode}
                size="small"
                variant="contained"
                color="secondary"
                sx={{ mr: 0.5 }}
              >
                <Iconify icon="icon-park-outline:update-rotation" sx={{ width: 25, height: 25 }} />
              </IconButton>
              <Typography variant="body2" sx={{ color: 'gray' }}>
                Update country code in phone/fax.
              </Typography>
            </Box>
            <Grid>
              {phoneNumbers?.map((pN, index) => (
                <Grid sx={{ py: 1 }} display="flex" alignItems="center">
                  <RHFCustomPhoneInput
                    name={`phoneNumbers[${index}]`}
                    value={pN}
                    label={pN?.type || 'Contact Number'}
                    index={index}
                  />
                  <IconButton
                    disabled={phoneNumbers?.length === 1}
                    onClick={() => removeContactNumber(index)}
                    size="small"
                    variant="contained"
                    color="error"
                    sx={{ mx: 1 }}
                  >
                    <StyledTooltip
                      title="Remove Contact Number"
                      placement="top"
                      disableFocusListener
                      tooltipcolor={theme.palette.error.main}
                      color={
                        phoneNumbers?.length > 1
                          ? theme.palette.error.main
                          : theme.palette.text.main
                      }
                    >
                      <Iconify icon="icons8:minus" sx={{ width: 25, height: 25 }} />
                    </StyledTooltip>
                  </IconButton>
                </Grid>
              ))}
              <Grid>
                <IconButton
                  disabled={phoneNumbers?.length > 9}
                  onClick={addContactNumber}
                  size="small"
                  variant="contained"
                  color="success"
                  sx={{ ml: 'auto', mr: 1 }}
                >
                  <StyledTooltip
                    title="Add Contact Number"
                    placement="top"
                    disableFocusListener
                    tooltipcolor={theme.palette.success.dark}
                    color={
                      phoneNumbers?.length < 10
                        ? theme.palette.success.dark
                        : theme.palette.text.main
                    }
                  >
                    <Iconify icon="icons8:plus" sx={{ width: 25, height: 25 }} />
                  </StyledTooltip>
                </IconButton>
              </Grid>
            </Grid>

            <ToggleButtons isMachine name={FORMLABELS.isACTIVE.name} />
          </Stack>
          <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
        </Card>
      </Grid>
    </FormProvider>
  );
}
