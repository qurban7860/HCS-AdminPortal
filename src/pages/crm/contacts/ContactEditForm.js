import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, IconButton } from '@mui/material';
import { green } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
// slice
import {
  updateContact,
  getContacts,
  getContact,
  getActiveContacts,
  resetActiveContacts,
} from '../../../redux/slices/customer/contact';
import { getActiveDepartments, resetDepartments } from '../../../redux/slices/department/department'
// components
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFAutocomplete,
  RHFTextField,
  RHFCountryAutocomplete,
  RHFCustomPhoneInput,
  RHFSwitch,
} from '../../../components/hook-form';
import { AddFormLabel } from '../../../components/DocumentForms/FormLabel';
// assets
import { countries } from '../../../assets/data';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
// schema
import { ContactSchema } from '../../schemas/customer';
// constants
import { FORMLABELS } from '../../../constants/customer-constants';
import { FORMLABELS as formLABELS } from '../../../constants/default-constants';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import { PATH_CRM } from '../../../routes/paths';

// ----------------------------------------------------------------------

ContactEditForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentAsset: PropTypes.object,
};

const theme = createTheme({
  palette: {
    success: green,
  },
});

export default function ContactEditForm({ isEdit, readOnly, currentAsset }) {
  const { contact, activeContacts } = useSelector((state) => state.contact);
  const { customer } = useSelector((state) => state.customer);
  const { departments } = useSelector((state) => state.department);
  const { enqueueSnackbar } = useSnackbar();
  const { customerId, id } = useParams()
  const [contactTypes, setContactTypes] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate()


  useEffect(() => {
    const systemConfig = JSON.parse(localStorage.getItem('configurations'))
    if (customer?.type?.toLowerCase() === 'sp' && systemConfig) {
      const configSPContactTypes = systemConfig?.find((c) => c?.name?.trim() === 'SP_CONTACT_TYPES')?.value?.split(',');
      const sPContactTypes = configSPContactTypes?.map(item => item?.trim())?.sort();
      if (Array.isArray(sPContactTypes) && sPContactTypes?.length > 0) {
        setContactTypes(sPContactTypes)
      }
    } else if (customer?.type?.toLowerCase() !== 'sp' && systemConfig) {
      const configCustomerContactTypes = systemConfig?.find((c) => c?.name?.trim() === 'CUSTOMER_CONTACT_TYPES')?.value?.split(',');
      const CustomerContactTypes = configCustomerContactTypes?.map(item => item?.trim())?.sort()
      if (Array.isArray(CustomerContactTypes) && CustomerContactTypes?.length > 0) {
        setContactTypes(CustomerContactTypes)
      }
    }
  }, [customer?.type])

  // --------------------------------hooks----------------------------------
  const defaultValues = useMemo(
    () => ({
      customer: contact?.customer || '',
      firstName: contact?.firstName || '',
      lastName: contact?.lastName || '',
      title: contact?.title || '',
      contactTypes: contact?.contactTypes || [],
      phoneNumbers: Array.isArray(contact?.phoneNumbers) && contact.phoneNumbers.length ? contact.phoneNumbers : [ { type: '', countryCode: '64' }, { type: 'Fax', countryCode: '64' } ],
      email: contact?.email || '',
      reportingTo: contact?.reportingTo || null,
      department: contact?.department || null,
      street: contact?.address?.street || '',
      suburb: contact?.address?.suburb || '',
      city: contact?.address?.city || '',
      region: contact?.address?.region || '',
      postcode: contact?.address?.postcode || '',
      isActive: contact?.isActive,
      formerEmployee: contact?.formerEmployee || false,
      country: countries.find((contry) => contry?.label?.toLocaleLowerCase() === contact?.address?.country?.toLocaleLowerCase()) || null,
    }),
    [contact]
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

  const { country, phoneNumbers } = watch();

  useEffect(() => {
    dispatch(getActiveContacts(customerId))
    dispatch(getActiveDepartments())
    dispatch(getContact(customerId, id));
    return () => {
      dispatch(resetActiveContacts())
      dispatch(resetDepartments())
    }
  }, [dispatch, customerId, id])

  useEffect(() => {
    phoneNumbers?.forEach((pN, index) => {
      if (!phoneNumbers[index].contactNumber) {
        setValue(`phoneNumbers[${index}].countryCode`, country?.phone?.replace(/[^0-9]/g, ''))
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);


  const updateCountryCode = () => {
    phoneNumbers?.map((pN, index) => setValue(`phoneNumbers[${index}].countryCode`, country?.phone?.replace(/[^0-9]/g, '')))
  }

  const removeContactNumber = (indexToRemove) => {
    setValue('phoneNumbers', phoneNumbers?.filter((_, index) => index !== indexToRemove) || []);
  }

  const addContactNumber = () => {
    const updatedPhoneNumbers = [...phoneNumbers, { type: '', countryCode: country?.phone?.replace(/[^0-9]/g, '') }];
    setValue('phoneNumbers', updatedPhoneNumbers)
  }

  // -------------------------------functions---------------------------------

  const onSubmit = async (data) => {
    try {
      await dispatch(updateContact(customerId, id, data));
      await dispatch(getContacts(customerId));
      await navigate(PATH_CRM.customers.contacts.view(customerId, id))
      await reset();
      enqueueSnackbar('Contact updated successfully!');
    } catch (err) {
      enqueueSnackbar(err, { variant: 'error' });
      console.error(err);
    }
  };

  const toggleCancel = () => navigate(PATH_CRM.customers.contacts.view(customerId, id));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
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

                <RHFAutocomplete
                  multiple
                  disableCloseOnSelect
                  filterSelectedOptions
                  name={FORMLABELS.CONTACT_TYPES.name}
                  label={FORMLABELS.CONTACT_TYPES.label}
                  options={contactTypes}
                  isOptionEqualToValue={(option, value) => option === value}
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
                  options={departments?.filter(el => (customer?.type?.toLowerCase() !== 'sp' && el.forCustomer) ? el.forCustomer : customer?.type?.toLowerCase() === 'sp')}
                  getOptionLabel={(option) => option?.departmentName || ''}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => (
                    <li {...props} key={option?._id}>{option?.departmentName || ''}</li>
                  )}
                />

                <RHFAutocomplete
                  name={FORMLABELS.REPORTINGTO.name}
                  label={FORMLABELS.REPORTINGTO.label}
                  options={activeContacts.filter((activeContact) => contact?._id !== activeContact?._id)}
                  getOptionLabel={(option) => `${option?.firstName || ''} ${option?.lastName || ''}`}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => (
                    <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>
                  )}
                />
              </Box>
              <AddFormLabel content={formLABELS.ADDRESS} />
              <Box
                rowGap={2}
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
                <RHFCountryAutocomplete name={FORMLABELS.COUNTRY.name} label={FORMLABELS.COUNTRY.label} />

              </Box>
              <Box display="flex" alignItems="center" gridTemplateColumns={{ sm: 'repeat(1, 1fr)' }} >
                <IconButton onClick={updateCountryCode} size="small" variant="contained" color='secondary' sx={{ mr: 0.5 }} >
                  <Iconify icon="icon-park-outline:update-rotation" sx={{ width: 25, height: 25 }} />
                </IconButton>
                <Typography variant='body2' sx={{ color: 'gray' }}>Update country code in phone/fax.</Typography>
              </Box>

              <Box sx={{ width: '100%', overflowX: { xs: 'auto', sm: 'hidden', }, maxWidth: '100%', display: 'flex', flexDirection: 'column' }} >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexWrap: { xs: 'nowrap', sm: 'wrap', }, }} >
                  {phoneNumbers?.map((pN, index) => (
                    <Box key={pN + index} sx={{ display: 'flex', alignItems: 'center', flex: '1 1 auto', minWidth: 300, ml: { xs: 'auto', sm: 0 }, mt: 1 }} >
                      <RHFCustomPhoneInput
                        name={`phoneNumbers[${index}]`}
                        value={pN}
                        label={pN?.type || 'Contact Number'}
                        index={index}
                        sx={{ flex: 1 }}
                      />
                      <IconButton disabled={phoneNumbers?.length === 1} onClick={() => removeContactNumber(index)} size="small" variant="contained" color='error' sx={{ mx: 1 }} >
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
                    </Box>
                  ))}
                  <Box>
                    <IconButton disabled={phoneNumbers?.length > 9} onClick={addContactNumber} size="small" variant="contained" color='success' sx={{ ml: 'auto', mr: 1 }} >
                      <StyledTooltip title="Add Contact Number" placement="top" disableFocusListener tooltipcolor={theme.palette.success.dark} color={phoneNumbers?.length < 10 ? theme.palette.success.dark : theme.palette.text.main}  >
                        <Iconify icon="icons8:plus" sx={{ width: 25, height: 25 }} />
                      </StyledTooltip>
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              <RHFTextField name={FORMLABELS.EMAIL.name} label={FORMLABELS.EMAIL.label} />
              <Grid sx={{ display: 'flex' }} >
                <RHFSwitch name="isActive" label="Active" />
                <RHFSwitch name="formerEmployee" label="Former Employee" />
              </Grid>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider >
  );
}
