import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Grid, TextField, Card, Stack, Checkbox, Typography, Link } from '@mui/material';
import { PATH_MACHINE, PATH_CRM } from '../../routes/paths';
import { transferMachine , getMachine} from '../../redux/slices/products/machine';
import { getActiveMachineStatuses, resetActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { getActiveCustomers, getFinancialCompanies, resetActiveCustomers, resetFinancingCompanies, getCustomer, setCustomerDialog } from '../../redux/slices/customer/customer';
import { getActiveSites, resetActiveSites } from '../../redux/slices/customer/site';
import { getActiveMachineDocuments, resetActiveMachineDocuments } from '../../redux/slices/document/machineDocument';
import { getActiveSuppliers, resetActiveSuppliers } from '../../redux/slices/products/supplier';
import { getActiveSPContacts, resetActiveSPContacts } from '../../redux/slices/customer/contact';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFCheckbox, RHFDatePicker, RHFTextField } from '../../components/hook-form';
import { machineTransferSchema } from '../schemas/machine'
import { Snacks } from '../../constants/machine-constants';
import FormLabel from '../../components/DocumentForms/FormLabel';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import OpenInNewPage from '../../components/Icons/OpenInNewPage';

function MachineTransfer() {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machineId } = useParams();
  const axiosToken = () => axios.CancelToken.source();
  const cancelTokenSource = axiosToken();
  const navigate = useNavigate();
  const [ isTrigger, setIsTrigger ] = useState(true);
  const { activeSpContacts } = useSelector((state) => state.contact);
  const { machine, isLoading } = useSelector((state) => state.machine);
  const { activeMachineStatuses } = useSelector((state) => state.machinestatus);
  const { activeCustomers, financialCompanies } = useSelector((state) => state.customer);
  const { activeSites } = useSelector((state) => state.site);
  const { activeMachineDocuments } = useSelector((state) => state.machineDocument );
  const { activeSuppliers } = useSelector((state) => state.supplier);

  useEffect(()=> {
    dispatch(getActiveMachineStatuses(cancelTokenSource))
    dispatch(getActiveCustomers(cancelTokenSource))
    dispatch(getActiveSuppliers(cancelTokenSource))
    dispatch(getActiveSPContacts(cancelTokenSource))
    return ()=>{  
      // cancelTokenSource.cancel()
      dispatch(resetActiveCustomers())
      dispatch(resetActiveSites())
      dispatch(resetActiveMachineDocuments()) 
      dispatch(resetActiveMachineStatuses())
      dispatch(resetActiveSuppliers())
      dispatch(resetActiveSPContacts())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ dispatch])

  useEffect(()=> {
    if(machineId){
      dispatch(getMachine(machineId))
      dispatch(getActiveMachineDocuments(machineId, cancelTokenSource))
    } 
    return ()=>{  
      dispatch(resetActiveMachineDocuments()) 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ dispatch, machineId ])

  useEffect(()=>{
    dispatch(getFinancialCompanies(cancelTokenSource))
    return ()=>{  
      dispatch(resetFinancingCompanies())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ activeCustomers ])

  const handleCustomerDialog = (event, customerId) => {
    event.preventDefault(); 
    dispatch(getCustomer(customerId));
    dispatch(setCustomerDialog(true));
  };

  const methods = useForm({
    resolver: yupResolver(machineTransferSchema),
    defaultValues: {
      name: machine?.name || '',
      customer: null,
      financialCompany: null,
      supplier: machine?.supplier || null,
      workOrderRef: machine?.workOrderRef || '',
      billingSite: null,
      installationSite: null,
      siteMilestone: '',
      transferredDate: new Date(),
      shippingDate: null,
      installationDate: null,
      status: null,
      machineConnection: [],
      accountManager: machine?.accountManager || [],
      projectManager: machine?.projectManager || [],
      supportManager: machine?.supportManager || [],
      supportExpireDate: machine?.supportExpireDate || null,
      description: machine?.description || '',
      isAllSettings: true,
      isAllTools: true,
      isAllDrawings: true,
      isAllProfiles: true,
      isAllINIs: true,
      machineDocuments: [],
      isSelectAllDocs: false,
    },
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { isSubmitting },
  } = methods;

  const { customer, status, supportExpireDate, transferredDate, shippingDate, installationDate, machineDocuments } =watch();

  const onSubmit = async (data) => {
      try {
        const response = await dispatch(transferMachine( machineId, data ));
        enqueueSnackbar(Snacks.machineTransferSuccess);
        reset();
        navigate(PATH_MACHINE.machines.view(response?.data?.Machine?._id));
      } catch (error) {
        enqueueSnackbar( error, { variant: `error` });
        console.error(error);
      }
  };
  
  useEffect(() => {
    if (activeMachineDocuments?.length > 0) {
      setValue('machineDocuments', activeMachineDocuments.map((d) => d?._id) || []);
    }
  }, [activeMachineDocuments, setValue]);
  
  const handleSelectAll = (inputString) => {
    if(activeMachineDocuments?.length > 0) {
      if(activeMachineDocuments?.length === machineDocuments?.length ){
        setValue('machineDocuments',[]);
      }else{
        setValue('machineDocuments', activeMachineDocuments?.map((d) => d?._id) || []);
      }
    }
  };

  const handleMachineDoc = (inputString) => {
      if (machineDocuments.includes(inputString)) {
        setValue('machineDocuments', machineDocuments.filter(item => item !== inputString) || [] )
      } else{
        setValue('machineDocuments', [...machineDocuments, inputString]);
      }
  };

  useEffect(()=>{
    if(customer?._id){
          setValue('customer',customer);
          setValue('installationSite', null);
          setValue('billingSite', null);
          dispatch(resetActiveSites());
          dispatch(getActiveSites(customer?._id, cancelTokenSource));
          // dispatch(getMachineConnections(customer?._id, cancelTokenSource));
    }else{
      setValue('customer',null);
      setValue('installationSite', null);
      setValue('billingSite', null);
      dispatch(resetActiveSites());
      // dispatch(resetMachineConnections());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ customer?._id ])

  
useEffect(()=>{
  trigger().then((res) => setIsTrigger(res));
},[ trigger, customer, status, supportExpireDate, transferredDate, shippingDate, installationDate ])

// console.log("isTrigger : ",isTrigger)

  return (
    <Container maxWidth={false} sx={{mb:3}}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
        <StyledCardContainer>
          <Cover name="Machine Transfer" setting />
        </StyledCardContainer>
          <Grid container >
          <Grid item xs={12} md={12} >
          <Card sx={{ p: 3 }} >
            <Stack spacing={2} >
              <FormLabel content='Machine Information'/>
              <Grid container>
                <ViewFormField isLoading={isLoading} sm={3} variant='h4' heading="Serial No" param={machine?.serialNo} />
                <ViewFormField isLoading={isLoading} sm={3} variant='h4' heading="Machine Model" param={machine?.machineModel?.name} />
                <ViewFormField isLoading={isLoading} sm={3} variant='h4' heading="Customer"
                  node={
                    machine?.customer && (
                      <>
                      <Link onClick={(event)=> handleCustomerDialog(event, machine?.customer?._id)} underline="none" sx={{ cursor: 'pointer'}}>
                        {machine?.customer?.name}
                      </Link>
                        <OpenInNewPage onClick={()=> window.open( PATH_CRM.customers.view(machine?.customer?._id), '_blank' ) }/>
                      </>
                    )
                  }
                />
                <ViewFormField isLoading={isLoading} sm={3} heading="Status" param={machine?.status?.name || ''} />
              </Grid>
              <FormLabel content='Machine Transfer Information'/>
                <RHFTextField name="name" label="Machine Name" />
                <Box rowGap={2} columnGap={2} display="grid"
                    gridTemplateColumns={{ md: 'repeat(2, 1fr)', sm: 'repeat(1, 1fr)' }}
                  >
                    <RHFAutocomplete
                      name="customer"
                      label="Customer*"
                      options={activeCustomers.filter((cstmr)=> cstmr?._id !== machine?.customer?._id )}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}> {option.name && option.name} </li> )}
                    />

                    <RHFAutocomplete
                      name="financialCompany"
                      label="Financing Company"
                      options={financialCompanies}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}> {option.name && option.name} </li> )}
                    />

                    <RHFAutocomplete
                      name="supplier"
                      label="Supplier"
                      id="controllable-states-demo"
                      options={activeSuppliers}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.name || ''}`}</li> )}
                      ChipProps={{ size: 'small' }}
                    />

                    <RHFTextField name="workOrderRef" label="Work Order/ Purchase Order" />

                    <RHFAutocomplete
                      name="billingSite"
                      label="Billing Site"
                      options={activeSites}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}> {option.name && option.name} </li> )}
                    />

                    <RHFAutocomplete
                      name="installationSite"
                      label="Installation Site"
                      options={activeSites}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li> )}
                    />

                  </Box>

                    <RHFTextField name="siteMilestone" label="Landmark for Installation site" multiline />
                    <Box rowGap={2} columnGap={2} display="grid"
                    gridTemplateColumns={{ md: 'repeat(2, 1fr)', sm: 'repeat(1, 1fr)' }}
                  >
                    <RHFDatePicker inputFormat='dd/MM/yyyy' name="transferredDate" label="Transfer Date" />


                  </Box>

                  <Box rowGap={2} columnGap={2} display="grid"
                    gridTemplateColumns={{ md: 'repeat(2, 1fr)', sm: 'repeat(1, 1fr)' }}
                  >
                    <RHFDatePicker inputFormat='dd/MM/yyyy' name="shippingDate" label="Shipping Date" />

                    <RHFDatePicker inputFormat='dd/MM/yyyy' name="installationDate" label="Installation Date" />

                    <RHFAutocomplete
                      name="status"
                      label="Status*"
                      options={activeMachineStatuses.filter(st => !['intransfer', 'transferred'].includes(st?.slug?.toLowerCase()))}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li> )}
                    />

                    <RHFDatePicker inputFormat='dd/MM/yyyy' name="supportExpireDate" label="Support Expiry Date" />

                  </Box>

                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="machineConnection"
                    id="tags-outlined"
                    options={ machine?.machineConnections || [] }
                    getOptionLabel={(option) => `${option?.connectedMachine?.serialNo || ''} ${option?.connectedMachine?.name ? '-' : ''} ${option?.connectedMachine?.name || ''}`}
                    isOptionEqualToValue={(option, value) => option?.connectedMachine?._id === value?.connectedMachine?._id}
                    renderInput={(params) => ( <TextField  {...params}  label="Connected Machines"   placeholder="Search"  /> )}
                  />

                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="accountManager"
                    options={ activeSpContacts }
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
                    renderInput={(params) => <TextField {...params} label="Account Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />

                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="projectManager"
                    options={ activeSpContacts }
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
                    renderInput={(params) => <TextField {...params} label="Project Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />

                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="supportManager"
                    options={ activeSpContacts }
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>)}
                    renderInput={(params) => <TextField {...params} label="Support Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />
                  
                  <RHFTextField name="description" label="Description" minRows={3} multiline />

                  <Grid container direction="row" alignItems="center" spacing={2}  sx={{
                      p:2, whiteSpace: 'pre-line', wordBreak: 'break-word', flexWrap: 'wrap', 
                  }} >
                    <RHFCheckbox name="isAllSettings" label="All Settings"/>
                    <RHFCheckbox name="isAllTools" label="All Tools"/>
                    <RHFCheckbox name="isAllDrawings" label="All Drawings"/>
                    <RHFCheckbox name="isAllProfiles" label="All Profiles"/>
                    <RHFCheckbox name="isAllINIs" label="All INIs"/>
                  </Grid>

                  { activeMachineDocuments && activeMachineDocuments?.length > 0 && <FormLabel content='Machine Documents'/> }
                  { activeMachineDocuments && activeMachineDocuments?.length > 1 && 
                    <Grid sx={{display:"flex", alignItems:"center" }}>
                      <Checkbox onClick={ handleSelectAll } checked={ activeMachineDocuments?.length === machineDocuments?.length }/>
                      <Typography variant='body2'>Select all Documents</Typography> 
                    </Grid>
                  }
                
                <Grid >
                  {activeMachineDocuments && activeMachineDocuments.length > 0 && activeMachineDocuments?.map(( doc, index ) =>(
                    <Grid key={doc?._id}  item md={12} sx={{ display: "flex", alignItems:'center'}} >{`${Number(index)+1} - ` }<Checkbox key={doc?._id} onClick={()=> handleMachineDoc(doc?._id)} checked={ machineDocuments?.some((d)=> d === doc?._id )} /><Typography variant='body2'>{doc?.displayName}</Typography></Grid>
                  ))}
                </Grid>
                <AddFormButtons 
                  isSubmitting={isSubmitting} 
                  istrigger={ isTrigger }
                  handleSubmit={handleSubmit(onSubmit)}
                  saveTransferButtonName="Transfer" 
                  toggleCancel={()=>{ navigate(PATH_MACHINE.machines.view(machineId)) }} 
                />
            </Stack>
          </Card>
          </Grid>
          </Grid>
        </FormProvider>
      </Container>
  );
}

export default MachineTransfer;
