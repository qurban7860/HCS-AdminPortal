import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// hooks
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Breadcrumbs,
  Autocomplete,
  TextField,
} from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input';
import useResponsive from '../../hooks/useResponsive';
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
import { useSnackbar } from '../../components/snackbar';
import AddFormButtons from '../components/DocumentForms/AddFormButtons';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import FormProvider, { RHFTextField, RHFSwitch } from '../../components/hook-form';
// constants
import { BREADCRUMBS } from '../../constants/default-constants';

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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useResponsive('sm', 'down');

  const EditCustomerSchema = Yup.object().shape({
    name: Yup.string().min(2).max(40).required('Name is required'),
    tradingName: Yup.string().max(40),
    // mainSite: Yup.string().nullable(),
    // sites: Yup.array().nullable(),
    isActive: Yup.boolean(),
    // contacts: Yup.array().nullable(),
    // accountManager: Yup.string().nullable(),
    // projectManager: Yup.string().nullable(),
    // supportManager: Yup.string().nullable(),
    // primaryBillingContact: Yup.string().nullable(),
    // primaryTechnicalContact: Yup.string().nullable(),
  });

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
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useLayoutEffect(() => {
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
  };

  const onSubmit = async (data) => {
    // console.log("customer : ",data);
    data.mainSite = siteVal?._id || null;
    if (chips && chips.length > 0) {
      data.tradingName = chips;
    }
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
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  const handleChipChange = (newChips) => {
    setChips(newChips);
  };

  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} md={6}>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator="›"
            sx={{ fontSize: '12px', color: 'text.disabled' }}
          >
            <BreadcrumbsLink to={PATH_CUSTOMER.list} name={BREADCRUMBS.CUSTOMERS} />
            <BreadcrumbsLink to={PATH_CUSTOMER.view} name={customer.name} />
          </Breadcrumbs>
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
                  <RHFTextField name="name" label="Customer Name" />

                  {/* <RHFTextField name="tradingName" label="Trading Name" /> */}
                  <MuiChipsInput
                    name="tradingName"
                    label="Trading Name / Alias"
                    value={chips}
                    onChange={handleChipChange}
                  />
                </Box>
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
                        {option.name ? option.name : ''}
                      </li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Main Site" />}
                    ChipProps={{ size: 'small' }}
                  />
                </Box>
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
                      `${option.firstName ? option.firstName : ''} ${
                        option.lastName ? option.lastName : ''
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
                      <TextField {...params} label="Primary Billing Contact" />
                    )}
                    ChipProps={{ size: 'small' }}
                  />

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
                      <TextField {...params} label="Primary Technical Contact" />
                    )}
                    ChipProps={{ size: 'small' }}
                  />
                </Box>
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
                    renderInput={(params) => <TextField {...params} label="Account Manager" />}
                    ChipProps={{ size: 'small' }}
                  />
                  <Autocomplete
                    // freeSolo
                    value={projectManVal || null}
                    options={filteredContacts}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) =>
                      `${option.firstName ? option.firstName : ''} ${
                        option.lastName ? option.lastName : ''
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
                        {option.firstName ? option.firstName : ''}{' '}
                        {option.lastName ? option.lastName : ''}
                      </li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Project Manager" />}
                    ChipProps={{ size: 'small' }}
                  />
                  <Autocomplete
                    // freeSolo
                    value={supportManVal || null}
                    options={filteredContacts}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) =>
                      `${option.firstName ? option.firstName : ''} ${
                        option.lastName ? option.lastName : ''
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
                        {option.firstName ? option.firstName : ''}{' '}
                        {option.lastName ? option.lastName : ''}
                      </li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Support Manager" />}
                    ChipProps={{ size: 'small' }}
                  />
                </Box>
                {customer?.type !== 'SP' ? (
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
                        Active
                      </Typography>
                    }
                  />
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
