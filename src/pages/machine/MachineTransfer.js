import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Grid, TextField, Card, Stack, Checkbox, Typography, Link } from '@mui/material';
import { PATH_MACHINE, PATH_CUSTOMER } from '../../routes/paths';
import { setMachineTransferDialog, transferMachine , getMachine} from '../../redux/slices/products/machine';
import { getActiveMachineStatuses, resetActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { getActiveCustomers, getFinancialCompanies, resetActiveCustomers, resetFinancingCompanies, getCustomer, setCustomerDialog } from '../../redux/slices/customer/customer';
import { getActiveSites, resetActiveSites } from '../../redux/slices/customer/site';
import { getActiveMachineDocuments, resetActiveMachineDocuments } from '../../redux/slices/document/machineDocument';
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
import CustomerDialog from '../../components/Dialog/CustomerDialog';

function MachineTransfer() {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  
  const axiosToken = () => axios.CancelToken.source();
  const cancelTokenSource = axiosToken();
  const navigate = useNavigate();

  const { machine, isLoading } = useSelector((state) => state.machine);
  const { activeMachineStatuses } = useSelector((state) => state.machinestatus);
  const { activeCustomers, financialCompanies, customerDialog } = useSelector((state) => state.customer);
  const { activeSites } = useSelector((state) => state.site);
  const { activeMachineDocuments } = useSelector((state) => state.machineDocument );
  const [machineDoc, setMachineDoc] = useState([]);

  useEffect(()=> {
    dispatch(getActiveMachineStatuses(cancelTokenSource))
    dispatch(getActiveCustomers(cancelTokenSource))
    return ()=>{  
      // cancelTokenSource.cancel()
      dispatch(resetActiveCustomers())
      dispatch(resetActiveSites())
      dispatch(resetActiveMachineDocuments()) 
      dispatch(resetActiveMachineStatuses())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ dispatch])

  useEffect(()=> {
    if(id){
      dispatch(getMachine(id))
      dispatch(getActiveMachineDocuments(id, cancelTokenSource))
    } 
    return ()=>{  
      dispatch(resetActiveMachineDocuments()) 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ dispatch, id ])

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
      billingSite: null,
      installationSite: null,
      shippingDate: null,
      installationDate: null,
      status: null,
      isAllSettings: false,
      isAllTools: false,
      isAllDrawings: false,
      isAllProfiles: false,
      isAllINIs: false,
      machineConnection: [],
      isSelectAllDocs: false,
    },
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { customer } =watch();

  const handleMachineDialog = ()=>{ dispatch(setMachineTransferDialog(false)) }

  const onSubmit = async (data) => {
      try {
        data.machineDocuments = machineDoc
        const response = await dispatch(transferMachine( id, data ));
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
  
  const handleSelectAll = (inputString) => {
    if(activeMachineDocuments?.length > 0) {
      if(activeMachineDocuments?.length === machineDoc?.length ){
        setMachineDoc([]);
      }else{
        setMachineDoc(() => activeMachineDocuments?.map((d) => d?._id));
      }
    }
  };

  const handleMachineDoc = (inputString) => {
    setMachineDoc((prevArray) => {
      if (prevArray.includes(inputString)) {
        return prevArray.filter(item => item !== inputString);
      } 
        return [...prevArray, inputString];
    });
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
  console.log("machineDoc : ",machineDoc)
  return (
    <Container maxWidth={false} sx={{mb:3}}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
        <StyledCardContainer>
          <Cover name="Machine Transfer" setting />
        </StyledCardContainer>
          <Card sx={{ p: 3 }} >
            <Stack spacing={2} >
              <FormLabel content='Machine Information'/>
              <Grid container>
                <ViewFormField isLoading={isLoading} sm={4} variant='h4' heading="Serial No" param={machine?.serialNo} />
                <ViewFormField isLoading={isLoading} sm={4} variant='h4' heading="Machine Model" param={machine?.machineModel?.name} />
                <ViewFormField isLoading={isLoading} sm={4} variant='h4' heading="Customer"
                  node={
                    machine?.customer && (
                      <>
                      <Link onClick={(event)=> handleCustomerDialog(event, machine?.customer?._id)} underline="none" sx={{ cursor: 'pointer'}}>
                        {machine?.customer?.name}
                      </Link>
                        <OpenInNewPage onClick={()=> window.open( PATH_CUSTOMER.view(machine?.customer?._id), '_blank' ) }/>
                      </>
                    )
                  }
                />
              </Grid>
              <Grid container>
                {/* <ViewFormField isLoading={isLoading} sm={6 } heading="Name" param={defaultValues?.name} />
                <ViewFormField isLoading={isLoading} sm={6} heading="Manufacture Date" param={fDate(defaultValues?.manufactureDate)} />
                { defaultValues?.parentSerialNo ? <ViewFormField isLoading={isLoading} sm={6} heading="Previous Machine" param={defaultValues?.parentSerialNo} /> : " "}
                <ViewFormField isLoading={isLoading} sm={6} heading="Alias" chips={defaultValues?.alias} />
                <ViewFormField isLoading={isLoading} sm={6} heading="Supplier" param={defaultValues?.supplier} /> */}
                <ViewFormField isLoading={isLoading} sm={4} heading="Status" param={machine?.status?.name || ''} />
                <ViewFormField isLoading={isLoading} sm={8} variant='h4' heading="Profile" param={`${machine?.machineProfile?.defaultName || ''} ${(machine?.machineProfile?.web && machine?.machineProfile?.flange )? `(${machine?.machineProfile?.web || '' } X ${machine?.machineProfile?.flange || '' })` :""}`} />
              </Grid>
              <FormLabel content='Machine Transfer Information'/>
                <RHFTextField name="name" label="Machine Name" />
                <Box rowGap={2} columnGap={2} display="grid"
                    gridTemplateColumns={{ md: 'repeat(2, 1fr)', sm: 'repeat(1, 1fr)' }}
                  >
                    <RHFAutocomplete
                      name="customer"
                      label="Customer"
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

                    <RHFDatePicker inputFormat='dd/MM/yyyy' name="shippingDate" label="Shipping Date" />

                    <RHFDatePicker inputFormat='dd/MM/yyyy' name="installationDate" label="Installation Date" />

                    <RHFAutocomplete
                      name="status"
                      label="Status"
                      options={activeMachineStatuses.filter(st => !['intransfer', 'transferred'].includes(st?.slug?.toLowerCase()))}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li> )}
                    />
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

                  <Grid container direction="row" alignItems="center" spacing={2}  sx={{
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

                  { activeMachineDocuments && activeMachineDocuments?.length > 0 && <FormLabel content='Machine Documents'/> }
                  { activeMachineDocuments && activeMachineDocuments?.length > 1 && 
                    <Grid sx={{display:"flex", alignItems:"center" }}>
                      <Checkbox onClick={ handleSelectAll } checked={ activeMachineDocuments?.length === machineDoc?.length }/>
                      <Typography variant='body2'>Select all Documents</Typography> 
                    </Grid>
                  }
                
                <Grid >
                  {activeMachineDocuments && activeMachineDocuments.length > 0 && activeMachineDocuments?.map(( doc, index ) =>(
                    <Grid key={doc?._id}  item md={12} sx={{ display: "flex", alignItems:'center'}} >{`${Number(index)+1} - ` }<Checkbox key={doc?._id} onClick={()=> handleMachineDoc(doc?._id)} checked={machineDoc?.some((d)=> d === doc?._id )} /><Typography variant='body2'>{doc?.displayName}</Typography></Grid>
                  ))}
                </Grid>
                <AddFormButtons isSubmitting={isSubmitting} saveButtonName="Transfer" toggleCancel={()=>{ navigate(PATH_MACHINE.machines.view(id)) }} />
            </Stack>
          </Card>
      { customerDialog  && <CustomerDialog />}
        </FormProvider>
      </Container>
  );
}

export default MachineTransfer;
