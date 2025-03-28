import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { Box, Grid, Dialog, DialogContent,  Divider, Stepper, Step, TextField, Button,  StepLabel, StepContent } from '@mui/material';
import { PATH_MACHINE } from '../../routes/paths';
import DialogLabel from './DialogLabel';
import ViewFormField from '../ViewForms/ViewFormField';
import { setMachineTransferDialog, transferMachine } from '../../redux/slices/products/machine';
import { getActiveMachineStatuses, resetActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { getActiveCustomers, getFinancialCompanies, resetActiveCustomers, resetFinancingCompanies } from '../../redux/slices/customer/customer';
import { getActiveSites, resetActiveSites } from '../../redux/slices/customer/site';
import { getMachineConnections, resetMachineConnections } from '../../redux/slices/products/machineConnections';
import { getActiveMachineDocuments, resetActiveMachineDocuments } from '../../redux/slices/document/machineDocument';
import { useSnackbar } from '../snackbar';
import FormProvider, { RHFAutocomplete, RHFCheckbox, RHFDatePicker } from '../hook-form';
import { machineTransferSchema } from '../../pages/schemas/machine'
import { Snacks } from '../../constants/machine-constants';
import { useScreenSize } from '../../hooks/useResponsive';
import { fDate } from '../../utils/formatTime';
import FormLabel from '../DocumentForms/FormLabel';


function MachineTransferDialog() {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  
  const axiosToken = () => axios.CancelToken.source();
  const cancelTokenSource = axiosToken();

  const navigate = useNavigate();
  const smScreen = useScreenSize('sm');
  const mdScreen = useScreenSize('md');
  const lgScreen = useScreenSize('lg');

  const { machine, machineTransferDialog } = useSelector((state) => state.machine);
  const { machineConnections } = useSelector((state) => state.machineConnections);
  const { activeMachineStatuses } = useSelector((state) => state.machinestatus);
  const { activeCustomers, financialCompanies } = useSelector((state) => state.customer);
  const { activeSites } = useSelector((state) => state.site);
  const { activeMachineDocuments } = useSelector((state) => state.machineDocument );
  const [activeStep, setActiveStep] = useState(0);

  useEffect(()=> {
    dispatch(getActiveMachineStatuses(cancelTokenSource))
    dispatch(getActiveCustomers(cancelTokenSource))
    dispatch(getFinancialCompanies(cancelTokenSource))
    dispatch(getActiveMachineDocuments(machine?._id, cancelTokenSource))
    return ()=>{  
      // cancelTokenSource.cancel()
      dispatch(resetActiveCustomers())
      dispatch(resetFinancingCompanies())
      dispatch(resetActiveSites())
      dispatch(resetMachineConnections())
      dispatch(resetActiveMachineStatuses())
      dispatch(resetActiveMachineDocuments()) 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ dispatch ])



  const methods = useForm({
    resolver: yupResolver(machineTransferSchema),
    defaultValues: {
      customer: null,
      financialCompany: null,
      billingSite: null,
      installationSite: null,
      shippingDate: null,
      installationDate: null,
      status: null,
      isAllSettings: true,
      isAllTools: true,
      isAllDrawings: true,
      isAllProfiles: true,
      isAllINIs: true,
      machineConnection: [],
      machineDocuments: [],
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

  const { customer, status, financialCompany, installationSite, billingSite, shippingDate, installationDate, machineConnection, machineDocuments } =watch();

  const handleMachineDialog = ()=>{ dispatch(setMachineTransferDialog(false)) }

  const onSubmit = async (data) => {
      try {
        const response = await dispatch(transferMachine(machine?._id, data ));
        const machineId = response.data.Machine._id;
        reset();
        enqueueSnackbar(Snacks.machineTransferSuccess);
        navigate(PATH_MACHINE.machines.view(machineId));
        handleMachineDialog()
      } catch (error) {
        enqueueSnackbar( error, { variant: `error` });
        console.error(error);
      }
  };

  const handleNext = async () => {
    await trigger().then((response) => {
      if( activeStep < 4 && response ) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    })
  };

  const handleBack = () => {
    if( activeStep > 0 ) setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => { 
    trigger() 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ shippingDate, installationDate ]);

  useEffect(()=>{
    if(customer?._id){
          setValue('customer',customer);
          setValue('machineConnection', []);
          setValue('installationSite', null);
          setValue('billingSite', null);
          dispatch(resetActiveSites());
          dispatch(resetMachineConnections());
          dispatch(getActiveSites(customer?._id, cancelTokenSource));
          dispatch(getMachineConnections(customer?._id, cancelTokenSource));
    }else{
      setValue('customer',null);
      setValue('machineConnection', []);
      setValue('installationSite', null);
      setValue('billingSite', null);
      dispatch(resetActiveSites());
      dispatch(resetMachineConnections());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ customer?._id ])

  return (
    <Dialog
      disableEnforceFocus
      fullWidth
      maxWidth={ smScreen && !mdScreen && !lgScreen && 'sm' || mdScreen && !lgScreen && 'md' || lgScreen && 'lg' }
      open={ machineTransferDialog }
      onClose={ handleMachineDialog }
      PaperProps={{ style: {
        minHeight: '90%',
        maxHeight: '90%',
      }}}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogLabel content="Transfer Ownership" onClick={ handleMachineDialog } />
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers style={{ p:2, height: '85%'  }}>
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
                      options={activeCustomers.filter((cstmr)=> cstmr?._id !== machine?.customer?._id )}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}> {option.name && option.name} </li> )}
                    />

                    <RHFAutocomplete
                      size="small"
                      name="financialCompany"
                      label="Financing Company"
                      options={financialCompanies}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}> {option.name && option.name} </li> )}
                    />

                    <RHFAutocomplete
                      size="small"
                      name="billingSite"
                      label="Billing Site"
                      options={activeSites}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}> {option.name && option.name} </li> )}
                    />

                    <RHFAutocomplete
                      size="small"
                      name="installationSite"
                      label="Installation Site"
                      options={activeSites}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li> )}
                    />

                    <RHFDatePicker size="small" inputFormat='dd/MM/yyyy' name="shippingDate" label="Shipping Date" />

                    <RHFDatePicker size="small" inputFormat='dd/MM/yyyy' name="installationDate" label="Installation Date" />

                    <RHFAutocomplete
                      size="small"
                      name="status"
                      label="Status"
                      options={activeMachineStatuses.filter((st) => st?.slug !== 'intransfer')}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li> )}
                    />

                  </Box>
                  <Box sx={{ mb: 2, display:'flex', justifyContent: 'flex-end' }}>
                      <Button disabled={activeStep === 0} variant="outlined" onClick={handleBack} sx={{ mt: 1, mr: 1 }} > Back </Button>
                      <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }} >Next</Button>
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
                    <RHFCheckbox name="isAllSettings" label="All Settings"/>
                    <RHFCheckbox name="isAllTools" label="All Tools"/>
                    <RHFCheckbox name="isAllDrawings" label="All Drawings"/>
                    <RHFCheckbox name="isAllProfiles" label="All Profiles"/>
                    <RHFCheckbox name="isAllINIs" label="All INIs"/>
                  </Grid>
                  <Box sx={{ mb: 2, display:'flex', justifyContent: 'flex-end'  }}>
                      <Button variant="outlined" onClick={handleBack} sx={{ mt: 1, mr: 1 }} >Back</Button>
                      <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }} >Next</Button>
                  </Box>
                </StepContent>
              </Step>
              <Step key={2}>
                <StepLabel>Machine Documents</StepLabel>
                <StepContent>
                  <RHFAutocomplete
                    size="small"
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="machineDocuments"
                    id="tags-outlined"
                    options={activeMachineDocuments}
                    getOptionLabel={(option) => `${option?.displayName || ''}`}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    renderInput={(params) => ( <TextField  {...params}  label="Machine Documents"   placeholder="Search"  /> )}
                  />
                  <Box sx={{ mb: 2, display:'flex', justifyContent: 'flex-end'  }}>
                    <div>
                        <Button variant="outlined" onClick={handleBack} sx={{ mt: 1, mr: 1 }} >Back</Button>
                        <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }} >Next</Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
              <Step key={3}>
                <StepLabel>Connected Machines</StepLabel>
                <StepContent>
                  <RHFAutocomplete
                    size="small"
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="machineConnection"
                    id="tags-outlined"
                    options={machineConnections}
                    getOptionLabel={(option) => `${option.serialNo || ''} ${option.name ? '-' : ''} ${option.name || ''}`}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    renderInput={(params) => ( <TextField  {...params}  label="Connected Machines"   placeholder="Search"  /> )}
                  />
                  <Box sx={{ mb: 2,display:'flex', justifyContent: 'flex-end'}}>
                    <div>
                        <Button variant="outlined" onClick={handleBack} sx={{ mt: 1, mr: 1 }} >Back</Button>
                        <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }} >Next</Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
              <Step key={4}>
                <StepLabel>Review Details</StepLabel>
                <StepContent>
                <FormLabel content='Information' />
                <Box display="grid"
                  gridTemplateColumns={{ md: 'repeat(2, 1fr)', sm: 'repeat(1, 1fr)' }}
                >
                  <ViewFormField heading="Customer" param={ customer?.name || '' } />
                  <ViewFormField heading="Financing Company" param={ financialCompany?.name || '' } />
                  <ViewFormField heading="Billing Site" param={ billingSite?.name || '' } />
                  <ViewFormField heading="Installation Site" param={ installationSite?.name || '' } />
                  <ViewFormField heading="Shipping Date" param={ fDate(shippingDate) } />
                  <ViewFormField heading="Installation Date" param={ fDate(installationDate) } />
                  <ViewFormField heading="Status" param={ status?.name  || '' } />
                </Box>
                <FormLabel content='Configuration' />
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
                    <RHFCheckbox disabled name="isAllSettings" label="All Settings"/>
                    <RHFCheckbox disabled name="isAllTools" label="All Tools"/>
                    <RHFCheckbox disabled name="isAllDrawings" label="All Drawings"/>
                    <RHFCheckbox disabled name="isAllProfiles" label="All Profiles"/>
                    <RHFCheckbox disabled name="isAllINIs" label="All INIs"/>
                  </Grid>
                  <FormLabel content='Machine Documents' />
                  <ViewFormField  machineDocumentsArrayChip={ machineDocuments || [] } />
                  <FormLabel content='Connected Machines' />
                  <ViewFormField machineConnectionArrayChip={ machineConnection || [] } />
                  <Box sx={{ mb: 2, mt:3.5, display:'flex', justifyContent: 'flex-end' }}>
                    <div>
                      <Button variant="outlined" onClick={handleBack} sx={{ mr: 1 }} >Back</Button>
                      <LoadingButton variant="contained" type="submit" loading={isSubmitting} >Transfer</LoadingButton>
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
