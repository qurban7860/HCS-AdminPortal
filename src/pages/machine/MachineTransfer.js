import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Grid, TextField, Card, Stack, Checkbox, Typography } from '@mui/material';
import { PATH_MACHINE } from '../../routes/paths';
import { setMachineTransferDialog, transferMachine } from '../../redux/slices/products/machine';
import { getActiveMachineStatuses, resetActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { getActiveCustomers, getFinancialCompanies, resetActiveCustomers, resetFinancingCompanies } from '../../redux/slices/customer/customer';
import { getActiveSites, resetActiveSites } from '../../redux/slices/customer/site';
import { getMachineConnections, resetMachineConnections } from '../../redux/slices/products/machineConnections';
import { getActiveMachineDocuments, resetActiveMachineDocuments } from '../../redux/slices/document/machineDocument';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFCheckbox, RHFDatePicker } from '../../components/hook-form';
import { machineTransferSchema } from '../schemas/machine'
import { Snacks } from '../../constants/machine-constants';
import FormLabel from '../../components/DocumentForms/FormLabel';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';

function MachineTransfer() {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  
  const axiosToken = () => axios.CancelToken.source();
  const cancelTokenSource = axiosToken();
  const navigate = useNavigate();

  const { machine } = useSelector((state) => state.machine);
  const { machineConnections } = useSelector((state) => state.machineConnections);
  const { activeMachineStatuses } = useSelector((state) => state.machinestatus);
  const { activeCustomers, financialCompanies } = useSelector((state) => state.customer);
  const { activeSites } = useSelector((state) => state.site);
  const { activeMachineDocuments } = useSelector((state) => state.machineDocument );
  const [machineDoc, setMachineDoc] = useState([]);

  useEffect(()=> {
    dispatch(getActiveMachineStatuses(cancelTokenSource))
    dispatch(getActiveCustomers(cancelTokenSource))
    dispatch(getFinancialCompanies(cancelTokenSource))
    if(id) dispatch(getActiveMachineDocuments(id, cancelTokenSource))
    return ()=>{  
      // cancelTokenSource.cancel()
      dispatch(resetActiveCustomers())
      dispatch(resetFinancingCompanies())
      dispatch(resetActiveSites())
      dispatch(resetMachineConnections())
      dispatch(resetActiveMachineDocuments()) 
      dispatch(resetActiveMachineStatuses())
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
  
  console.log("machineDoc : ",machineDoc)
  console.log("activeMachineDocuments?.length",activeMachineDocuments?.length , "machineDoc?.length ",machineDoc?.length)

  const handleSelectAll = (inputString) => {
    console.log("activeMachineDocuments?.length , machineDoc?.length ",activeMachineDocuments?.length, machineDoc?.length)
    if(activeMachineDocuments?.length > 0) {
      setMachineDoc(() => activeMachineDocuments?.map((d) => d?._id));
    }
  };

  const handleMachineDoc = (inputString) => {
    setMachineDoc((prevArray) => {
      const index = prevArray.indexOf(inputString);
      if (index !== -1) {
        const newArray = [...prevArray];
        newArray.splice(index, 1);
        return newArray;
      } 
        return [...prevArray, inputString];
    });
  };

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
    <Container maxWidth={false} sx={{mb:3}}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
        <StyledCardContainer>
          <Cover name="Machine Transfer" setting />
        </StyledCardContainer>
          <Card sx={{ p: 3 }} >
            <Stack spacing={2} >
              <FormLabel content='Customer and Machine Information'/>

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
                      renderOption={(props, option) => ( <li {...props} key={option._id}> {option.name && option.name} </li> )}
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
                      name="billingSite"
                      label="Billing Site"
                      options={activeSites}
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

                    <RHFDatePicker size="small" inputFormat='dd/MM/yyyy' name="shippingDate" label="Shipping Date" />

                    <RHFDatePicker size="small" inputFormat='dd/MM/yyyy' name="installationDate" label="Installation Date" />

                    <RHFAutocomplete
                      size="small"
                      name="status"
                      label="Status"
                      options={activeMachineStatuses.filter((st) => st?.slug !== 'intransfer')}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => (<li {...props} key={option._id}> {option.name && option.name} </li> )}
                    />
                  </Box>

                  <RHFAutocomplete
                    size="small"
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="machineConnection"
                    id="tags-outlined"
                    options={machineConnections}
                    getOptionLabel={(option) => `${option.serialNo || ''} ${option.name ? '-' : ''} ${option.name || ''}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
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

                <FormLabel content='Machine Documents'/>
                  
                  <Grid sx={{display:"flex", alignItems:"center" }}><Checkbox onClick={ handleSelectAll } checked={ activeMachineDocuments?.length === machineDoc?.length }/><Typography variant='body2'>Select all Documents</Typography> </Grid>
                
                <Grid >
                  {activeMachineDocuments?.map(( doc, index ) =>(
                    <Grid item md={12} sx={{ display: "flex", alignItems:'center'}} >{`${Number(index)+1} - ` }<Checkbox onClick={()=> handleMachineDoc(doc?._id)} checked={machineDoc?.find((d)=> d === doc?._id)} /><Typography variant='body2'>{doc?.displayName}</Typography></Grid>
                  ))}
                </Grid>
                <AddFormButtons isSubmitting={isSubmitting} saveButtonName="Transfer" toggleCancel={()=>{ navigate(PATH_MACHINE.machines.view(id)) }} />
            </Stack>
          </Card>
        </FormProvider>
      </Container>
  );
}

export default MachineTransfer;
