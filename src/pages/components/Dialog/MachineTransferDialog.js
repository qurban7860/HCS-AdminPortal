import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { Box, Grid, Dialog, DialogContent,  Divider, Stepper, Step, TextField, Button,  StepLabel, StepContent } from '@mui/material';
import { PATH_MACHINE } from '../../../routes/paths';
import DialogLabel from './DialogLabel';
import ViewFormField from '../ViewForms/ViewFormField';
import { setMachineTransferDialog, transferMachine } from '../../../redux/slices/products/machine';
import { getActiveMachineStatuses } from '../../../redux/slices/products/statuses';
import { getActiveCustomers, getFinancialCompanies } from '../../../redux/slices/customer/customer';
import { getActiveSites, resetActiveSites } from '../../../redux/slices/customer/site';
import { getMachineConnections, resetMachineConnections } from '../../../redux/slices/products/machineConnections';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFCheckbox } from '../../../components/hook-form';
import { machineTransferSchema } from '../../schemas/machine'
import { Snacks } from '../../../constants/machine-constants';
import { useScreenSize } from '../../../hooks/useResponsive';


function MachineTransferDialog() {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const smScreen = useScreenSize('sm');
  const mdScreen = useScreenSize('md');

  const { machine, machineTransferDialog } = useSelector((state) => state.machine);
  const { machineConnections } = useSelector((state) => state.machineConnections);
  const { activeMachineStatuses } = useSelector((state) => state.machinestatus);
  const { activeCustomers, financialCompanies } = useSelector((state) => state.customer);
  const { activeSites } = useSelector((state) => state.site);

  const [activeStep, setActiveStep] = useState(0);

  useEffect(()=> {
    dispatch(getActiveMachineStatuses())
    dispatch(getActiveCustomers())
    dispatch(getFinancialCompanies())
    dispatch(getActiveSites())
    return ()=>{ dispatch(resetActiveSites()); resetMachineConnections() }
  },[ dispatch ])



  const methods = useForm({
    resolver: yupResolver(machineTransferSchema),
    defaultValues: {
      customer: null,
      status: null,
      financialCompany: null,
      installationSite: null,
      billingSite: null,
      allSettings: false,
      allTools: false,
      allDrawings: false,
      allProfiles: false,
      allINIs: false,
      machineConnectionVal: [],
    },
  });

  const {
    reset,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { customer, status, financialCompany, installationSite, billingSite, machineConnectionVal } =watch();

  const handleMachineDialog = ()=>{ dispatch(setMachineTransferDialog(false)) }

  const onSubmit = async (data) => {
    // const handleTransfer = async (customerId, statusId) => {
      try {
        const response = await dispatch(transferMachine(machine?._id, data ));
        const machineId = response.data.Machine._id;
        reset();
        enqueueSnackbar(Snacks.machineTransferSuccess);
        navigate(PATH_MACHINE.machines.view(machineId));
        handleMachineDialog()
      } catch (error) {
        // Snacks.machineFailedTransfer
          enqueueSnackbar( error, { variant: `error` });
        console.error(error);
      }
  };

  const handleNext = async () => {
    await trigger().then((response) => {
      if( activeStep < 3 && response ) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    })
  };

  const handleBack = () => {
    if( activeStep > 0 ) setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Dialog
      disableEnforceFocus
      fullWidth
      maxWidth={ smScreen && !mdScreen && 'sm' || mdScreen &&  'md' }
      open={ machineTransferDialog }
      onClose={ handleMachineDialog }
      aria-describedby="alert-dialog-slide-description"
    >
      {/* <DialogTitle variant='h3' sx={{pb:1, pt:2}}>Transfer Machine</DialogTitle> */}
      <DialogLabel content="Transfer Ownership" onClick={ handleMachineDialog } />
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{ height: '670px', p:2 }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
          <Box >
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step key={0}>
                <StepLabel>Informaton</StepLabel>
                <StepContent>
                <Box rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ md: 'repeat(2, 1fr)', sm: 'repeat(1, 1fr)' }}
                >
                    <RHFAutocomplete
                      size="small"
                      name="customer"
                      label="Customer"
                      options={activeCustomers}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      onChange={ async (event, newValue) => {
                          if (newValue) {
                            if(customer?._id !== newValue?._id) {
                            setValue('machineConnectionVal', []);
                            setValue('installationSite', null);
                            setValue('billingSite', null);
                            await dispatch(resetActiveSites());
                            await dispatch(resetMachineConnections());
                            await dispatch(getActiveSites(newValue?._id));
                            await dispatch(getMachineConnections(newValue?._id));
                            }
                            setValue('customer',newValue);
                          } else {
                            setValue('customer',null);
                            setValue('machineConnectionVal', []);
                            setValue('installationSite', null);
                            setValue('billingSite', null);
                            await dispatch(resetActiveSites());
                            await dispatch(resetMachineConnections());
                          }
                        }}
                      renderOption={(props, option) => ( <li {...props} key={option._id}> {option.name && option.name} </li> )}
                      />

                    <RHFAutocomplete
                      size="small"
                      name="status"
                      label="Status"
                      options={activeMachineStatuses.filter((st) => st?.slug !== 'intransfer')}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => (<li {...props} key={option._id}> {option.name && option.name} </li> )}
                    />

                    <RHFAutocomplete
                      size="small"
                      name="financialCompany"
                      label="Financing Company"
                      options={financialCompanies}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option._id}> {option.name && option.name} </li> )}
                    />

                    <RHFAutocomplete
                      size="small"
                      name="installationSite"
                      label="Installation Site"
                      options={activeSites}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => (<li {...props} key={option._id}> {option.name && option.name} </li> )}
                    />

                    <RHFAutocomplete
                      size="small"
                      name="billingSite"
                      label="Billing Site"
                      options={activeSites}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option._id}> {option.name && option.name} </li> )}
                      />

                  </Box>
                  <Box sx={{ mb: 2 }}>
                      <Button disabled={activeStep === 0} variant="outlined" onClick={handleBack} sx={{ mt: 1, mr: 1 }} > Back </Button>
                      <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }} >Continue</Button>
                  </Box>
                </StepContent>
              </Step>
              <Step key={1}>
                <StepLabel>Configuration</StepLabel>
                <StepContent>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={2} 
                    sx={{
                      p:2,
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                      flexWrap: 'wrap', 
                    }} >
                    <RHFCheckbox name="allSettings" label="All Settings"/>
                    <RHFCheckbox name="allTools" label="All Tools"/>
                    <RHFCheckbox name="allDrawings" label="All Drawings"/>
                    <RHFCheckbox name="allProfiles" label="All Profiles"/>
                    <RHFCheckbox name="allINIs" label="All INIs"/>
                  </Grid>
                  <Box sx={{ mb: 2 }}>
                      <Button variant="outlined" onClick={handleBack} sx={{ mt: 1, mr: 1 }} >Back</Button>
                      <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }} >Continue</Button>
                  </Box>
                </StepContent>
              </Step>
              <Step key={2}>
                <StepLabel>Connected Machines</StepLabel>
                <StepContent>
                  <RHFAutocomplete
                    size="small"
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="machineConnectionVal"
                    id="tags-outlined"
                    options={machineConnections}
                    getOptionLabel={(option) => `${option.serialNo || ''} ${option.name ? '-' : ''} ${option.name || ''}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderInput={(params) => ( <TextField  {...params}  label="Connected Machines"   placeholder="Search"  /> )}
                  />
                  <Box sx={{ mb: 2 }}>
                    <div>
                        <Button variant="outlined" onClick={handleBack} sx={{ mt: 1, mr: 1 }} >Back</Button>
                        <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }} >Continue</Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
              <Step key={3}>
                <StepLabel>Confirmation</StepLabel>
                <StepContent>
                <Box display="grid"
                  gridTemplateColumns={{ md: 'repeat(2, 1fr)', sm: 'repeat(1, 1fr)' }}
                >
                  <ViewFormField heading="Customer" param={ customer?.name || '' } />
                  <ViewFormField heading="Status" param={ status?.name  || '' } />
                  <ViewFormField heading="Financing Company" param={ financialCompany?.name || '' } />
                  <ViewFormField heading="Installation Site" param={ installationSite?.name || '' } />
                  <ViewFormField heading="Billing Site" param={ billingSite?.name || '' } />
                </Box>
                <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={2} 
                    sx={{
                      p:2,
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                      flexWrap: 'wrap', 
                    }} >
                    <RHFCheckbox disabled name="allSettings" label="All Settings"/>
                    <RHFCheckbox disabled name="allTools" label="All Tools"/>
                    <RHFCheckbox disabled name="allDrawings" label="All Drawings"/>
                    <RHFCheckbox disabled name="allProfiles" label="All Profiles"/>
                    <RHFCheckbox disabled name="allINIs" label="All INIs"/>
                  </Grid>
                  <ViewFormField heading="Connected Machines" machineConnectionArrayChip={ machineConnectionVal || [] } />
                  <Box sx={{ mb: 2, mt:3.5 }}>
                    <div>
                      <Button variant="outlined" onClick={handleBack} sx={{ mr: 1 }} >Back</Button>
                      <LoadingButton variant="contained" type="submit" loading={isSubmitting} >Confirm</LoadingButton>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            </Stepper>
          </Box>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export default MachineTransferDialog;
