import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Grid, Stack, Typography, Autocomplete, TextField } from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input';
// hooks
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useResponsive from '../../hooks/useResponsive';
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
import ToggleButtons from '../components/DocumentForms/ToggleButtons';
import AddFormButtons from '../components/DocumentForms/AddFormButtons';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
import BreadcrumbsProvider from '../components/Breadcrumbs/BreadcrumbsProvider';
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import FormProvider, { RHFTextField } from '../../components/hook-form';
// constants
import { BREADCRUMBS, FORMLABELS as formLABELS } from '../../constants/default-constants';
import { FORMLABELS, Snacks } from '../../constants/customer-constants';
// schema
import { EditCustomerSchema } from '../schemas/customer';

// ----------------------------------------------------------------------

export default function CustomerEditForm() {
  const { error, customer, customerEditFormVisibility } = useSelector((state) => state.customer);
  const { sites } = useSelector((state) => state.site);
  const { contacts, spContacts, activeContacts } = useSelector((state) => state.contact);
  const filteredContacts = spContacts.filter((contact) => contact.isActive === true);
  const [accountManVal, setAccountManVal] = useState('');
  const [supportManVal, setSupportManVal] = useState('');
  const [projectManVal, setProjectManVal] = useState('');
  const [billingContactVal, setBillingContactVal] = useState('');
  const [technicalContactVal, setTechnicalContactVal] = useState('');
  const [siteVal, setSiteVal] = useState('');
  const [chips, setChips] = useState([]);
  // hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useResponsive('sm', 'down');
  const defaultValues = useMemo(
    () => ({
      id: customer?._id || '',
      name: customer?.name || '',
      // tradingName: customer?.tradingName || '',
      // mainSite: customer?.mainSite?._id === null || customer?.mainSite?._id === undefined  ? null : customer.mainSite._id ,
      // accountManager: customer?.accountManager?._id === null || customer?.accountManager?._id === undefined  ? null : customer.accountManager?._id,
      // projectManager: customer?.projectManager?._id === null || customer?.projectManager?._id === undefined  ? null : customer.projectManager?._id,
      // supportManager: customer?.supportManager?._id === null || customer?.supportManager?._id === undefined  ? null : customer.supportManager?._id,
      // primaryBillingContact: customer?.primaryBillingContact?._id  === null || customer?.primaryBillingContact?._id  === undefined  ? null : customer.primaryBillingContact?._id ,
      // primaryTechnicalContact: customer?.primaryTechnicalContact?._id === null || customer?.primaryTechnicalContact?._id === undefined  ? null : customer.primaryTechnicalContact._id,
      isActive: customer?.isActive,
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
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useLayoutEffect(() => {
    // window.history.pushState({}, null, `/customers/${customer._id}/edit`);
    dispatch(getActiveContacts(customer._id));
    dispatch(getSites(customer._id));
    dispatch(getSPContacts());
    setSiteVal(customer?.mainSite);
    setChips(customer?.tradingName);
    setAccountManVal(customer?.accountManager);
    setSupportManVal(customer?.supportManager);
    setProjectManVal(customer?.projectManager);
    setBillingContactVal(customer?.primaryBillingContact);
    setTechnicalContactVal(customer?.primaryTechnicalContact);
  }, [dispatch, customer]);

  useEffect(() => {
    if (customer) {
      reset(defaultValues);
    }
  }, [customer, reset, defaultValues]);

  const toggleCancel = () => {
    dispatch(setCustomerEditFormVisibility(false));
    // navigate(PATH_CUSTOMER.list);
    navigate(PATH_CUSTOMER.view(customer._id));

    // window.history.pushState({}, null, `/customers/${customer._id}/view`);
  };

  const onSubmit = async (data) => {
    // console.log("customer : ",data);
    data.mainSite = siteVal?._id || null;
    // if (chips && chips.length > 0) {
      data.tradingName = chips;
    // }
    data.accountManager = accountManVal?._id || null;
    data.projectManager = projectManVal?._id || null;
    data.supportManager = supportManVal?._id || null;
    data.primaryBillingContact = billingContactVal?._id || null;
    data.primaryTechnicalContact = technicalContactVal?._id || null;
    try {
      dispatch(updateCustomer(data));
      reset();
      enqueueSnackbar('Update success!');
      navigate(PATH_CUSTOMER.view(customer._id));
    } catch (err) {
      enqueueSnackbar(Snacks.SAVE_FAILED, { variant: `error` });
      console.error(err.message);
    }
  };

  const handleChipChange = (newChips) => {
    const array = [...new Set(newChips)]
    setChips(array);
  };

  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} md={6}>
          <BreadcrumbsProvider>
            <BreadcrumbsLink to={PATH_CUSTOMER.list} name={BREADCRUMBS.CUSTOMERS} />
            <BreadcrumbsLink to={PATH_CUSTOMER.view} name={customer.name} />
          </BreadcrumbsProvider>
        </Grid>
        {!isMobile && <AddButtonAboveAccordion isCustomer />}
      </Grid>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                  }}
                >
                  {/* customer name */}
                  <RHFTextField
                    name={FORMLABELS.CUSTOMER.NAME.name}
                    label={FORMLABELS.CUSTOMER.NAME.label}
                  />

                  {/* trading name / alias */}
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
                    isOptionEqualToValue={(option, value) => option.name === value.name}
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
                    value={billingContactVal || null}
                    options={activeContacts}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) =>
                      `${option.firstName && option.firstName} ${
                        option.lastName && option.lastName
                      }`
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setBillingContactVal(newValue);
                      } else {
                        setBillingContactVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.firstName ? option.firstName : ''}{' '}
                        {option.lastName ? option.lastName : ''}
                      </li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => (
                      <TextField {...params} label={FORMLABELS.CUSTOMER.BILLING_CONTACT} />
                    )}
                    ChipProps={{ size: 'small' }}
                  />

                  {/* primary technical contact */}
                  <Autocomplete
                    // freeSolo
                    value={technicalContactVal || null}
                    options={activeContacts}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) =>
                      `${option.firstName ? option.firstName : ''} ${
                        option.lastName ? option.lastName : ''
                      }`
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setTechnicalContactVal(newValue);
                      } else {
                        setTechnicalContactVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.firstName ? option.firstName : ''}{' '}
                        {option.lastName ? option.lastName : ''}
                      </li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => (
                      <TextField {...params} label={FORMLABELS.CUSTOMER.TECHNICAL_CONTACT} />
                    )}
                    ChipProps={{ size: 'small' }}
                  />
                </Box>

                {/* account manager */}
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
                    value={accountManVal || null}
                    options={filteredContacts}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) =>
                      `${option.firstName ? option.firstName : ''} ${
                        option.lastName ? option.lastName : ''
                      }`
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setAccountManVal(newValue);
                      } else {
                        setAccountManVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.firstName ? option.firstName : ''}{' '}
                        {option.lastName ? option.lastName : ''}
                      </li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => (
                      <TextField {...params} label={FORMLABELS.CUSTOMER.ACCOUNT} />
                    )}
                    ChipProps={{ size: 'small' }}
                  />

                  {/* project manager */}
                  <Autocomplete
                    // freeSolo
                    value={projectManVal || null}
                    options={filteredContacts}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) =>
                      `${option.firstName && option.firstName} ${
                        option.lastName && option.lastName
                      }`
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setProjectManVal(newValue);
                      } else {
                        setProjectManVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.firstName && option.firstName} {option.lastName && option.lastName}
                      </li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => (
                      <TextField {...params} label={FORMLABELS.CUSTOMER.PROJECT} />
                    )}
                    ChipProps={{ size: 'small' }}
                  />

                  {/* support manager */}
                  <Autocomplete
                    // freeSolo
                    value={supportManVal || null}
                    options={filteredContacts}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) =>
                      `${option.firstName && option.firstName} ${
                        option.lastName && option.lastName
                      }`
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setSupportManVal(newValue);
                      } else {
                        setSupportManVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.firstName && option.firstName} {option.lastName && option.lastName}
                      </li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => (
                      <TextField {...params} label={FORMLABELS.CUSTOMER.SUPPORT} />
                    )}
                    ChipProps={{ size: 'small' }}
                  />
                </Box>
                {customer?.type !== 'SP' ? (
                  <ToggleButtons isMachine name={formLABELS.isACTIVE.name} />
                ) : null}
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
