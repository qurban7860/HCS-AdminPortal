import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Grid, Stack } from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input';
// hooks
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from '../../components/snackbar';
// slice
import { updateCustomer, setCustomerEditFormVisibility, setCustomerTab } from '../../redux/slices/customer/customer';
import { getActiveContacts, getActiveSPContacts } from '../../redux/slices/customer/contact';
import { getActiveSites } from '../../redux/slices/customer/site';
// routes
import { PATH_CUSTOMER } from '../../routes/paths';
// components
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFSwitch, RHFTextField, RHFAutocomplete } from '../../components/hook-form';
// constants
import { FORMLABELS  } from '../../constants/customer-constants';
// schema
import { EditCustomerSchema } from '../schemas/customer';
import FormLabel from '../../components/DocumentForms/FormLabel';

// ----------------------------------------------------------------------

export default function CustomerEditForm() {
  const { customer } = useSelector((state) => state.customer);
  const { activeSites } = useSelector((state) => state.site);
  const { activeSpContacts, activeContacts } = useSelector((state) => state.contact);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      id: customer?._id || '',
      code: customer?.clientCode || '',
      name: customer?.name || '',
      mainSite: customer?.mainSite || null,
      primaryTechnicalContact: customer?.primaryTechnicalContact || null,
      primaryBillingContact: customer?.primaryBillingContact || null,
      supportSubscription: customer?.supportSubscription,
      tradingName: customer?.tradingName || [],
      accountManager: customer?.accountManager || [],
      projectManager: customer?.projectManager || [],
      supportManager: customer?.supportManager || [],
      isFinancialCompany: customer?.isFinancialCompany || false,
      excludeReports: customer?.excludeReports || false,
      updateProductManagers: false,
      isActive: customer?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customer]
  );
  const methods = useForm({
    resolver: yupResolver( EditCustomerSchema ),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { tradingName } = watch();

  useLayoutEffect(() => {
    dispatch(getActiveContacts(customer._id));
    dispatch(getActiveSites(customer._id));
    dispatch(getActiveSPContacts());
  }, [dispatch, customer]);

  const toggleCancel = () => {
    dispatch(setCustomerEditFormVisibility(false));
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateCustomer(data));
      await dispatch(setCustomerTab('info'));
      reset();
      enqueueSnackbar('Customer updated successfully!');
      navigate(PATH_CUSTOMER.view(customer._id));
    } catch (err) {
      enqueueSnackbar(err, { variant: `error` });
    }
  };

  const handleChipChange = (newChips) => {
    const array = [...new Set(newChips)]
    setValue('tradingName', array );
  };

  return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container >
          <Grid item xs={18} md={12}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <FormLabel content={FORMLABELS.CUSTOMER.EDITCUSTOMER} />
                <Box rowGap={3} columnGap={2} display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)', sm: 'repeat(1, 5fr 1fr)', 
                  }}
                >
                  <RHFTextField name="name" label={FORMLABELS.CUSTOMER.NAME.label} />
                  <RHFTextField name="code" label={FORMLABELS.CUSTOMER.CODE.label} />
                </Box>

                <Box rowGap={3} columnGap={2} display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)',
                  }}
                >
                  <MuiChipsInput
                    name={FORMLABELS.CUSTOMER.TRADING_NAME.name}
                    label={FORMLABELS.CUSTOMER.TRADING_NAME.label}
                    value={tradingName}
                    onChange={handleChipChange}
                  />
                </Box>

                {/* main site */}
                <Box rowGap={3} columnGap={2} display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFAutocomplete
                    name="mainSite"
                    label={FORMLABELS.CUSTOMER.MAINSITE.label}
                    options={activeSites || []}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option?.name || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option._id}>{option?.name || ''} </li>)}
                  />
                </Box>

                  {/* primary billing contact */}
                  <Box rowGap={3} columnGap={2} display="grid"
                    gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', }}
                  >
                    <RHFAutocomplete
                      name="primaryBillingContact"
                      label={FORMLABELS.CUSTOMER.BILLING_CONTACT}
                      options={activeContacts || []}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) =>`${option?.firstName || ''} ${option?.lastName || ''}`}
                      renderOption={(props, option) => (<li {...props} key={option._id}>{option?.firstName || ''}{' '}{option?.lastName ||''}</li>)}
                    />
                    {/* primary technical contact */}
                    <RHFAutocomplete
                      name="primaryTechnicalContact"
                      label={FORMLABELS.CUSTOMER.TECHNICAL_CONTACT}
                      options={activeContacts || []}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) =>`${option.firstName || ''} ${option.lastName || ''}`}
                      renderOption={(props, option) => (<li {...props} key={option._id}>{option?.firstName || ''}{' '}{option?.lastName || ''}</li>)}
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
                    filterSelectedOptions
                    name="accountManager"
                    label="Account Manager"
                    options={activeSpContacts || []}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option?.firstName || ''} ${ option?.lastName || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
                    ChipProps={{ size: 'small' }}
                  />

                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="projectManager"
                    label="Project Manager"
                    options={activeSpContacts || []}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option?.firstName || ''} ${ option?.lastName || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
                    ChipProps={{ size: 'small' }}
                  />

                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="supportManager"
                    label="Support Manager" 
                    options={activeSpContacts || []}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option?.firstName || ''} ${ option?.lastName || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
                    ChipProps={{ size: 'small' }}
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
  );
}
