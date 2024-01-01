import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, styled, Container, Grid, Stack, TextField } from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input';
// slice
import { getSPContacts } from '../../redux/slices/customer/contact';
import { getActiveCustomers, getFinancialCompanies, setNewMachineCustomer } from '../../redux/slices/customer/customer';
import { getActiveSites, resetActiveSites } from '../../redux/slices/customer/site';
import  { addMachine, getActiveMachines } from '../../redux/slices/products/machine';
import { getActiveCategories, resetActiveCategories } from '../../redux/slices/products/category';
import { getActiveMachineModels, resetActiveMachineModels } from '../../redux/slices/products/model';
import { getActiveMachineStatuses, resetActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { getActiveSuppliers, resetActiveSuppliers } from '../../redux/slices/products/supplier';
import { getMachineConnections } from '../../redux/slices/products/machineConnections';
import { Cover } from '../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
// routes
import { PATH_CUSTOMER, PATH_MACHINE } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete, RHFDatePicker } from '../../components/hook-form';
import AddFormButtons from '../components/DocumentForms/AddFormButtons';
import ToggleButtons from '../components/DocumentForms/ToggleButtons';
import { FORMLABELS } from '../../constants/default-constants';
import { machineSchema } from '../schemas/machine'

MachineAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentCustomer: PropTypes.object,
};

export default function MachineAddForm({ isEdit, readOnly, currentCustomer }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeSuppliers } = useSelector((state) => state.supplier);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCustomers, financialCompanies, newMachineCustomer } = useSelector((state) => state.customer);
  const { activeSites } = useSelector((state) => state.site);
  const { activeMachineStatuses } = useSelector((state) => state.machinestatus);
  const { spContacts } = useSelector((state) => state.contact);
  const { machineConnections } = useSelector((state) => state.machineConnections);
  const { activeCategories } = useSelector((state) => state.category);
  const [ hasEffectRun, setHasEffectRun ] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [ chips, setChips ] = useState([]);
  const [ landToCustomerMachinePage, setLandToCustomerMachinePage ] = useState(false);

  useEffect(() => {
    dispatch(getFinancialCompanies());
    dispatch(getActiveCustomers());
    dispatch(getActiveMachines());
    dispatch(getActiveCategories());
    dispatch(getActiveMachineModels());
    dispatch(getActiveSuppliers());
    dispatch(getActiveMachineStatuses());
    dispatch(getSPContacts());
    return ()=> { 
      dispatch(resetActiveMachineModels()); 
      dispatch(resetActiveCategories()); 
      dispatch(resetActiveMachineStatuses()); 
      dispatch(resetActiveSuppliers()) 
    }
  }, [dispatch]);

  const methods = useForm({
    resolver: yupResolver(machineSchema),
    defaultValues: {
      serialNo: '',
      name: '',
      parentSerialNo: null,
      previousMachine: '',
      category: null,
      machineModel: null,
      supplier: null,
      status: null,
      customer: null,
      financialCompany: null,
      machineConnectionVal: [],
      connection: [],
      workOrderRef: '',
      instalationSite: null,
      billingSite: null,
      installationDate: null,
      shippingDate: null,
      siteMilestone: '',
      accountManager: [],
      projectManager: [],
      supportManager: [],
      supportExpireDate: null,
      customerTags: [],
      description: '',
      isActive: true,
    },
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const {
    customer,
    category,
    machineModel,
    financialCompany,
  } = watch();

  useEffect(() => {
    if(newMachineCustomer){
      setValue('customer',newMachineCustomer);
      setLandToCustomerMachinePage(true);
      setValue('accountManager', spContacts.filter(item => Array.isArray(customer?.accountManager) && customer?.accountManager.some(manager => manager._id === item?._id)))
      setValue('projectManager', spContacts.filter(item => Array.isArray(customer?.projectManager) && customer?.projectManager.some(manager => manager._id === item?._id)))
      setValue('supportManager', spContacts.filter(item => Array.isArray(customer?.supportManager) && customer?.supportManager.some(manager => manager._id === item?._id)))
    }
    return ()=>{ dispatch(setNewMachineCustomer(null)) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[newMachineCustomer, spContacts])

  useEffect(() => {
    setValue('supplier', activeSuppliers.find((element) => element?.isDefault === true) )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ activeSuppliers ])

  useEffect(() => {
    setValue('status', activeMachineStatuses.find((element)=> element.isDefault === true) )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ activeMachineStatuses ])

  useEffect(() => {
    if (customer !== null && customer._id !== undefined) {
      dispatch(getActiveSites(customer._id));
      dispatch(getMachineConnections(customer._id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, customer]);

 styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  const onSubmit = async (data) => {
    try {
      if (chips && chips.length > 0) {
        data.alias = chips;
      }
      await dispatch(addMachine(data));
      reset();
      enqueueSnackbar('Create success!');
      if(landToCustomerMachinePage){
        await navigate(PATH_CUSTOMER.view(customer._id));
      }else{
        await  navigate(PATH_MACHINE.machines.list);
      }
    } catch (error) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    if(landToCustomerMachinePage){
      navigate(PATH_CUSTOMER.view(customer._id));
    }else{
      navigate(PATH_MACHINE.machines.list);
    }
  };
  
  const handleChipChange = (newChips) => {
    const array = [...new Set(newChips)]
    setChips(array);
  };

  const CategoryValHandler = (event, newValue) => {
    if (newValue) {
      setValue('category', newValue);
      dispatch(getActiveMachineModels(newValue?._id));
      if(  machineModel?.category?._id !== newValue?._id ){
        setValue('machineModel', null);
      }
    } else {
      setValue('category', null);
      setValue('machineModel', null);
      dispatch(getActiveMachineModels());
    }
  }

  const MachineModelValHandler = (event, newValue) => {
    if (newValue) {
      setValue('machineModel', newValue);
      if(category === null){
      dispatch(getActiveMachineModels(newValue?.category?._id));
      setValue('category', newValue?.category);
      }
    } else {
      setValue('machineModel', null);
    }
  }

  useEffect(() => {
    if(activeMachineModels.length > 0 && activeCategories.length > 0 ){
      if(!hasEffectRun){
        if ( activeCategories.find((ele) => ele?.isDefault === true) === activeMachineModels.find((ele)=> ele.isDefault === true)?.category?._id || !activeMachineModels.some((ele)=> ele.isDefault === true) ){
          CategoryValHandler(null, activeCategories.find((ele) => ele?.isDefault === true) ) 
        } else {
          MachineModelValHandler(null, activeMachineModels.find((element)=> element.isDefault === true) )
        }
      }
      setHasEffectRun(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[activeMachineModels, activeCategories, hasEffectRun])

  return (
    <Container maxWidth={false} sx={{mb:3}}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <StyledCardContainer>
          <Cover name="New Machine" setting />
        </StyledCardContainer>
        <Grid container>
          <Grid item xs={18} md={12} >
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 2fr 6fr)', md: 'repeat(1, 1fr 5fr)' }}
                >
                  <RHFTextField name="serialNo" label="Serial No.*"  />
                  <RHFTextField name="name" label="Name" />
                </Box>
                <MuiChipsInput label="Alias" value={chips} onChange={handleChipChange} />
                <Box rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                    <RHFAutocomplete 
                      name="category"
                      label="Machine Category"
                      options={activeCategories}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      onChange={(event, newValue) => CategoryValHandler(event, newValue)}
                      renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option.name || ''}`}</li> )}
                    />
                    <RHFAutocomplete 
                      name="machineModel"
                      label="Machine Model"
                      options={activeMachineModels}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option.name || ''}`}</li> )}
                      onChange={(event, newValue) => MachineModelValHandler(event, newValue)}
                    />

                  <RHFAutocomplete
                    name="status" 
                    label="Status" 
                    options={activeMachineStatuses}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    getOptionDisabled={(option) => option.slug === 'intransfer' || option.slug === 'transferred' }
                    renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option?.name || ''}`}</li> )}
                    id="controllable-states-demo"
                    ChipProps={{ size: 'small' }}
                  />
                  <RHFAutocomplete
                    name="supplier"
                    label="Supplier"
                    id="controllable-states-demo"
                    options={activeSuppliers}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option?.name || ''}`}</li> )}
                    ChipProps={{ size: 'small' }}
                  />
                  <RHFAutocomplete
                    value={financialCompany}
                    name="financialCompany"
                    label="Financing Company"
                    options={financialCompanies}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option.name || ''}`}</li> )}
                  />
                  <RHFTextField name="workOrderRef" label="Work Order/ Purchase Order" />
                </Box>
                      <RHFAutocomplete
                        name="customer"
                        label="Customer*"  
                        id="controllable-states-demo"
                        options={activeCustomers}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        getOptionLabel={(option) => `${option.name || ''}`}
                        renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option.name || ''}`}</li> )}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setValue('customer',newValue);
                            if(customer?._id !== newValue._id) {
                            setValue('machineConnectionVal', []);
                            setValue('instalationSite', null);
                            setValue('billingSite', null);
                            setValue('accountManager', spContacts.filter(item => Array.isArray(newValue?.accountManager) && newValue?.accountManager.includes(item?._id)))
                            setValue('projectManager', spContacts.filter(item => Array.isArray(newValue?.projectManager) && newValue?.projectManager.includes(item?._id)))
                            setValue('supportManager', spContacts.filter(item => Array.isArray(newValue?.supportManager) && newValue?.supportManager.includes(item?._id)))
                            }
                          } else {
                            setValue('customer',null);
                            setValue('machineConnectionVal', []);
                            setValue('instalationSite', null);
                            setValue('billingSite', null);
                            dispatch(resetActiveSites());
                          }
                        }}
                        ChipProps={{ size: 'small' }}
                      />
                <Box rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <RHFAutocomplete
                    name="billingSite"    
                    label="Billing Site" 
                    options={activeSites}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option.name || ''}`}</li> )}
                    id="controllable-states-demo"
                    ChipProps={{ size: 'small' }}
                  />
                  <RHFDatePicker inputFormat='dd/MM/yyyy'  name="shippingDate" label="Shipping Date" />
                  <RHFAutocomplete
                    name="instalationSite"  
                    label="Installation Site" 
                    options={activeSites}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option.name || ''}`}</li> )}
                    id="controllable-states-demo"
                    ChipProps={{ size: 'small' }}
                  />
                  <RHFDatePicker inputFormat='dd/MM/yyyy' name="installationDate" label="Installation Date" />
                </Box>
                  <RHFTextField name="siteMilestone" label="Nearby Milestone" multiline />
                  <RHFAutocomplete
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
                <Box rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    name="accountManager"
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
                    renderInput={(params) => <TextField {...params} label="Account Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />
                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    name="projectManager"
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
                    renderInput={(params) => <TextField {...params} label="Project Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />
                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    name="supportManager"
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>)}
                    renderInput={(params) => <TextField {...params} label="Support Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />
                  <RHFDatePicker inputFormat='dd/MM/yyyy' name="supportExpireDate" label="Support Expiry Date" />
                </Box>
                  <RHFTextField name="description" label="Description" minRows={3} multiline />
                  <ToggleButtons name={FORMLABELS.isACTIVE.name} isMachine />
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
