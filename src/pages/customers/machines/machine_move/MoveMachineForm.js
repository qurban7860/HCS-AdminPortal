import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box,Card, Grid, Stack } from '@mui/material';
// slice
import {getMachine, resetMachine, moveMachine } from '../../../../redux/slices/products/machine';
import { getActiveCustomers, resetActiveCustomers } from '../../../../redux/slices/customer/customer';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFAutocomplete } from '../../../../components/hook-form';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import { getActiveSites, resetActiveSites } from '../../../../redux/slices/customer/site';
import FormLabel from '../../../../components/DocumentForms/FormLabel';
import { PATH_CUSTOMER } from '../../../../routes/paths';
// ----------------------------------------------------------------------

export default function MoveMachineForm() {
  const { machine, isLoading } = useSelector((state) => state.machine);
  const { activeSites } = useSelector((state) => state.site);
  const { activeCustomers } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const { customerId, id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getActiveCustomers())
    if(id){
      dispatch(getMachine(id))
    }
    return ()=> 
    {
      dispatch(resetMachine())
      dispatch(resetActiveCustomers())
      dispatch(resetActiveSites())
    }
  }, [ dispatch, id ]);

  const MoveMachineSchema = Yup.object().shape({
    customer: Yup.object().shape({name: Yup.string()}).nullable().required('Customer is required!'),
  });

  const machineProfile = `${machine?.machineProfile?.defaultName || ''} ${machine?.machineProfile?.web && machine?.machineProfile?.flange
    ? `(${machine.machineProfile.web}X${machine.machineProfile.flange})`
    : ""} `

  const defaultValues = useMemo(
    () => ({
      customer: null,
      installationSite: '',
      billingSite: '',
      serialNo: machine?.serialNo || "",
      machineModel: machine?.machineModel?.name || "",
      machineProfile: machineProfile || "",
    }),
    [ machine, machineProfile ]
  );

  const methods = useForm({
    resolver: yupResolver(MoveMachineSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { customer } = watch();

  useEffect(() => {
    setValue('installationSite',null);
    setValue('billingSite',null);
    if(customer !== null){
      dispatch(getActiveSites(customer?._id))
    }else{
      dispatch(resetActiveSites())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const onSubmit = async (data) => {
    if(machine){
      data.machine = machine?._id;
    }
    try {
      await dispatch(moveMachine(data));
      enqueueSnackbar('Machine moved successfully!');
      reset();
      if(customerId){
        navigate(PATH_CUSTOMER.machines.root(customerId))
      } 
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => { if(customerId) navigate(PATH_CUSTOMER.machines.root(customerId))};

  return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <FormLabel content="Machine Detail" />
              <Grid container>
                <ViewFormField isLoading={isLoading} sm={4} variant='h4' heading="Serial No" param={defaultValues?.serialNo} />
                <ViewFormField isLoading={isLoading} sm={4} variant='h4' heading="Machine Model" param={defaultValues?.machineModel} />
                <ViewFormField isLoading={isLoading} sm={4} variant='h4' heading="Profile" param={defaultValues?.machineProfile}/>
              </Grid>
              <Stack spacing={2}>
                <FormLabel content="Move Machine " />
                <RHFAutocomplete 
                    name="customer"
                    label="Customer*"
                    options={activeCustomers.filter(activeCustomer => activeCustomer._id !== id)}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />
                <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)',}}>
                  <RHFAutocomplete 
                    name="installationSite"
                    label="Installation Site"
                    options={activeSites}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

                  <RHFAutocomplete 
                    name="billingSite"
                    label="Billing Site"
                    options={activeSites}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

                </Box>
                <AddFormButtons isSubmitting={isSubmitting} saveButtonName='Move' toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
  );
}
