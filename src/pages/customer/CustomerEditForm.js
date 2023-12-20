import { useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Grid, Stack, Autocomplete, TextField, Typography } from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input';
// hooks
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from '../../components/snackbar';
// slice
import {
  updateCustomer,
  setCustomerEditFormVisibility,
} from '../../redux/slices/customer/customer';
import { getActiveContacts, getSPContacts } from '../../redux/slices/customer/contact';
import { getSites } from '../../redux/slices/customer/site';
// routes
import { PATH_CUSTOMER } from '../../routes/paths';
// components
import AddFormButtons from '../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFSwitch, RHFTextField, RHFAutocomplete } from '../../components/hook-form';
// constants
import { FORMLABELS  } from '../../constants/customer-constants';
// schema
import { EditCustomerSchema } from '../schemas/customer';
import { StyledToggleButtonLabel } from '../../theme/styles/document-styles';
import FormLabel from '../components/DocumentForms/FormLabel';

// ----------------------------------------------------------------------

export default function CustomerEditForm() {
  const { customer } = useSelector((state) => state.customer);
  const { sites } = useSelector((state) => state.site);
  const { spContacts, activeContacts } = useSelector((state) => state.contact);
  const filteredContacts = spContacts.filter((contact) => contact.isActive === true);
  const [billingContactVal, setBillingContactVal] = useState('');
  const [technicalContactVal, setTechnicalContactVal] = useState('');
  const [siteVal, setSiteVal] = useState('');
  const [chips, setChips] = useState([]);
  // hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const defaultValues = useMemo(
    () => ({
      id: customer?._id || '',
      code: customer?.clientCode || '',
      name: customer?.name || '',
      isActive: customer?.isActive,
      supportSubscription: customer?.supportSubscription,
      accountManager: customer?.accountManager || [],
      projectManager: customer?.projectManager || [],
      supportManager: customer?.supportManager || [],
      isFinancialCompany: customer?.isFinancialCompany || false,
      excludeReports: customer?.excludeReports || false,
      updateProductManagers: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customer]
  );
  // customer. === null || customer. === undefined  ? null : customer.,
  const methods = useForm({
    resolver: yupResolver(EditCustomerSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useLayoutEffect(() => {
    dispatch(getActiveContacts(customer._id));
    dispatch(getSites(customer._id));
    dispatch(getSPContacts());
    setSiteVal(customer?.mainSite);
    setChips(customer?.tradingName);
    setBillingContactVal(customer?.primaryBillingContact);
    setTechnicalContactVal(customer?.primaryTechnicalContact);
  }, [dispatch, customer]);

  const toggleCancel = () => {
    dispatch(setCustomerEditFormVisibility(false));
  };

  const onSubmit = async (data) => {
    data.mainSite = siteVal?._id || null;
    data.tradingName = chips;
    data.primaryBillingContact = billingContactVal?._id || null;
    data.primaryTechnicalContact = technicalContactVal?._id || null;

    try {
      await dispatch(updateCustomer(data ));
      reset();
      enqueueSnackbar('Update success!');
      navigate(PATH_CUSTOMER.view(customer._id));
    } catch (err) {
      reset();
      setValue('code',data.code);
      enqueueSnackbar(err, { variant: `error` });
    }
  };

  const handleChipChange = (newChips) => {
    const array = [...new Set(newChips)]
    setChips(array);
  };

  return (
    <>
      {/* <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} md={6}>
          <BreadcrumbsProvider>
            <BreadcrumbsLink to={PATH_CUSTOMER.list} name={BREADCRUMBS.CUSTOMERS} />
            <BreadcrumbsLink to={PATH_CUSTOMER.view} name={customer.name} />
          </BreadcrumbsProvider>
        </Grid>
        {!isMobile && <AddButtonAboveAccordion isCustomer />}
      </Grid> */}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container >
          <Grid item xs={18} md={12}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <FormLabel content={FORMLABELS.CUSTOMER.EDITCUSTOMER} />
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 5fr 1fr)', // First one spans 1 column, and the second spans 5 columns on sm screens
                  }}
                >
                  <RHFTextField name="name" label={FORMLABELS.CUSTOMER.NAME.label} />
                  <RHFTextField name="code" label={FORMLABELS.CUSTOMER.CODE.label} />
                </Box>

                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                  }}
                >
                  <MuiChipsInput
                    name={FORMLABELS.CUSTOMER.TRADING_NAME.name}
                    label={FORMLABELS.CUSTOMER.TRADING_NAME.label}
                    value={chips}
                    onChange={handleChipChange}
                  />
                </Box>

                {/* main site */}
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <Autocomplete
                    // freeSolo
                    value={siteVal || null}
                    options={sites}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setSiteVal(newValue);
                      } else {
                        setSiteVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.name && option.name}
                      </li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => (
                      <TextField {...params} label={FORMLABELS.CUSTOMER.MAINSITE.label} />
                    )}
                    ChipProps={{ size: 'small' }}
                  />
                </Box>

                  {/* primary billing contact */}
                  <Box rowGap={3} columnGap={2} display="grid"
                    gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', }}
                  >
                    <Autocomplete
                      // freeSolo
                      value={billingContactVal || null}
                      options={activeContacts}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) =>`${option.firstName && option.firstName} ${option.lastName && option.lastName}`}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setBillingContactVal(newValue);
                        } else {
                          setBillingContactVal('');
                        }
                      }}
                      renderOption={(props, option) => (<li {...props} key={option._id}>{option.firstName ? option.firstName : ''}{' '}{option.lastName ? option.lastName : ''}</li>)}
                      id="controllable-states-demo"
                      renderInput={(params) => (<TextField {...params} label={FORMLABELS.CUSTOMER.BILLING_CONTACT} />)}
                      ChipProps={{ size: 'small' }}
                    />
                    {/* primary technical contact */}
                    <Autocomplete
                      // freeSolo
                      value={technicalContactVal || null}
                      options={activeContacts}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) =>`${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName : ''}`}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setTechnicalContactVal(newValue);
                        } else {
                          setTechnicalContactVal('');
                        }
                      }}
                      renderOption={(props, option) => (<li {...props} key={option._id}>{option.firstName ? option.firstName : ''}{' '}{option.lastName ? option.lastName : ''}</li>)}
                      id="controllable-states-demo"
                      renderInput={(params) => (
                        <TextField {...params} label={FORMLABELS.CUSTOMER.TECHNICAL_CONTACT} />
                      )}
                      ChipProps={{ size: 'small' }}
                    />
                  </Box>
              </Stack>
                </Card>
                <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                <FormLabel content={FORMLABELS.CUSTOMER.HOWICKRESOURCESS} />
                {/* account manager */}
                <Box rowGap={3} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)'}}
                >
                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    name="accountManager"
                    options={filteredContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>
                    )}
                    renderInput={(params) => <TextField {...params} label="Account Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />

                  <RHFAutocomplete
                    // freeSolo
                    multiple
                    disableCloseOnSelect
                    name="projectManager"
                    options={filteredContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>
                    )}
                    renderInput={(params) => <TextField {...params} label="Project Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />
                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    name="supportManager"
                    options={filteredContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>
                    )}
                    renderInput={(params) => <TextField {...params} label="Support Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />

                  <RHFSwitch name="updateProductManagers" label="Update Account, Project, and Support Manager in machine data" checked={defaultValues?.isActive} />
                </Box>
                <Grid sx={{display:{md:'flex'}}}>
                    <RHFSwitch name="isActive" label="Active" checked={defaultValues?.isActive} />
                    <RHFSwitch name="supportSubscription" label='Support Subscription' checked={defaultValues?.supportSubscription} />
                    <RHFSwitch name="isFinancialCompany" label="Financing Company" defaultChecked={defaultValues?.isFinancialCompany} />
                    <RHFSwitch name="excludeReports" label="Exclude Reporting" defaultChecked={defaultValues?.excludeReports} />
                </Grid>

                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
