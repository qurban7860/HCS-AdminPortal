import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
// import { LoadingButton } from '@mui/lab';
import { Box,Card, Grid, Stack, Typography, CardHeader } from '@mui/material';
// slice
import {moveMachine, setMachineMoveFormVisibility } from '../../../redux/slices/products/machine';
import { getActiveCustomers } from '../../../redux/slices/customer/customer';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFAutocomplete } from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import { getActiveSites, resetActiveSites } from '../../../redux/slices/customer/site';
// ----------------------------------------------------------------------

export default function MoveMachineForm() {
  const { machine } = useSelector((state) => state.machine);
  const { activeSites } = useSelector((state) => state.site);
  const { activeCustomers } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(MoveMachineSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  
  useEffect(() => {
    dispatch(resetActiveSites())
    dispatch(getActiveCustomers())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { customer } = watch();
  useEffect(() => {
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
      setMachineMoveFormVisibility(false);
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    dispatch(setMachineMoveFormVisibility(false));
  };

  return (
    <>
      <Card sx={{ width: '100%', p: '0', mb:3 }}>
        <CardHeader title="Machine Detail" sx={{p:'5px 15px', m:0, color:'white', 
        backgroundImage: (theme) => `linear-gradient(to right, ${theme.palette.primary.main} ,  white)`}} />
        
        <Grid container>
          <ViewFormField sm={2} heading="Serial No" param={defaultValues.serialNo} />
          <ViewFormField sm={2} heading="Machine Model" param={defaultValues.machineModel} />
          <ViewFormField sm={2} heading="Profile" param={defaultValues.machineProfile} />
          {/* <ViewFormField sm={3} heading="Profile" 
            param={`${machine?.machineProfile?.defaultName} ${(machine?.machineProfile?.web && machine?.machineProfile?.flange)? `(${machine?.machineProfile?.web} X ${machine?.machineProfile?.flange})` :""}`} 
          /> */}
        </Grid>
      </Card>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Move Machine</Typography>
                </Stack>
                <RHFAutocomplete 
                    name="customer"
                    label="Customer*"
                    options={activeCustomers.filter(activeCustomer => activeCustomer._id !== id)}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />
                <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)',}}>
                  <RHFAutocomplete 
                    name="installationSite"
                    label="Installation Site"
                    options={activeSites}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

                  <RHFAutocomplete 
                    name="billingSite"
                    label="Billing Site"
                    options={activeSites}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

                </Box>
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
