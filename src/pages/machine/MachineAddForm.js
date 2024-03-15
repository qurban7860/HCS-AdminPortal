import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, styled, Grid, Stack, TextField } from '@mui/material';
// slice
import { getSPContacts } from '../../redux/slices/customer/contact';
import { getActiveCustomers, getFinancialCompanies, setCustomerTab, setNewMachineCustomer } from '../../redux/slices/customer/customer';
import { getActiveSites, resetActiveSites } from '../../redux/slices/customer/site';
import  { addMachine, getActiveMachines } from '../../redux/slices/products/machine';
import { getActiveCategories, resetActiveCategories } from '../../redux/slices/products/category';
import { getActiveMachineModels, resetActiveMachineModels } from '../../redux/slices/products/model';
import { getActiveMachineStatuses, resetActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { getActiveSuppliers, resetActiveSuppliers } from '../../redux/slices/products/supplier';
import { getMachineConnections, resetMachineConnections } from '../../redux/slices/products/machineConnections';
// routes
import { PATH_CUSTOMER, PATH_MACHINE } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete, RHFDatePicker, RHFChipsInput } from '../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
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
  const [ landToCustomerMachinePage, setLandToCustomerMachinePage ] = useState(false);

  useEffect(() => {
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
      dispatch(setNewMachineCustomer(null)); 
    }
  }, [dispatch]);

  useEffect(()=>{
    dispatch(getFinancialCompanies());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ activeCustomers ])

  const methods = useForm({
    resolver: yupResolver(machineSchema),
    defaultValues: {
      serialNo: '',
      name: '',
      alias: [],
      parentSerialNo: null,
      previousMachine: '',
      category: null,
      machineModel: null,
      manufactureDate: null,
      purchaseDate: null,
      supplier: null,
      status: null,
      customer: null,
      financialCompany: null,
      machineConnectionVal: [],
      connection: [],
      workOrderRef: '',
      installationSite: null,
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
    dispatch(resetMachineConnections());
    dispatch(resetActiveSites());
    dispatch(getActiveSites(customer?._id));
    dispatch(getMachineConnections(customer?._id));
  },[dispatch, customer, spContacts, setValue])

  useEffect(() => {
    if(newMachineCustomer){
      setValue('customer',newMachineCustomer);
      setLandToCustomerMachinePage(true);
      setValue('accountManager', spContacts.filter(item => Array.isArray(customer?.accountManager) && customer?.accountManager.some(manager => manager._id === item?._id)))
      setValue('projectManager', spContacts.filter(item => Array.isArray(customer?.projectManager) && customer?.projectManager.some(manager => manager._id === item?._id)))
      setValue('supportManager', spContacts.filter(item => Array.isArray(customer?.supportManager) && customer?.supportManager.some(manager => manager._id === item?._id)))
    }
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

 styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(addMachine(data));
      reset();
      enqueueSnackbar('Machine created successfully!');
      if( landToCustomerMachinePage && customer._id ){
        await navigate(PATH_CUSTOMER.machines.root(customer?._id));
      }else if(response?.data?.Machine?._id){
        await navigate(PATH_MACHINE.machines.view(response?.data?.Machine?._id));
      } else {
        await navigate(PATH_MACHINE.machines.list);
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = async() => {
    if(landToCustomerMachinePage){
      await dispatch(setCustomerTab('machines'));
      navigate(PATH_CUSTOMER.machines.root(newMachineCustomer._id));
    }else{
      navigate(PATH_MACHINE.machines.list);
    }
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
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
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
                <RHFChipsInput name="alias" label="Alias" />
                <Box rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                    <RHFAutocomplete 
                      name="category"
                      label="Machine Category"
                      options={activeCategories}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      onChange={(event, newValue) => CategoryValHandler(event, newValue)}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                    />

                    <RHFAutocomplete 
                      name="machineModel"
                      label="Machine Model"
                      options={activeMachineModels}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                      onChange={(event, newValue) => MachineModelValHandler(event, newValue)}
                    />

                  <RHFDatePicker inputFormat='dd/MM/yyyy' name="manufactureDate" label="Manufacture Date" />

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

                  <RHFDatePicker inputFormat='dd/MM/yyyy' name="purchaseDate" label="Purchase Date" />
                  <RHFTextField name="workOrderRef" label="Work Order/ Purchase Order" />

                  <RHFAutocomplete
                    name="customer"
                    label="Customer*"  
                    id="controllable-states-demo"
                    options={activeCustomers}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                    onChange={async (event, newValue) => {
                      setValue('customer',newValue);
                      setValue('installationSite', null);
                      setValue('billingSite', null);
                      setValue('machineConnectionVal', []);
                      setValue('accountManager', [])
                      setValue('projectManager', [])
                      setValue('supportManager', [])  
                      
                      if(newValue){
                        // setValue('customer',newValue);
                        setValue('accountManager', spContacts.filter(item => Array.isArray(newValue?.accountManager) && newValue?.accountManager.includes(item?._id)))
                        setValue('projectManager', spContacts.filter(item => Array.isArray(newValue?.projectManager) && newValue?.projectManager.includes(item?._id)))
                        setValue('supportManager', spContacts.filter(item => Array.isArray(newValue?.supportManager) && newValue?.supportManager.includes(item?._id)))
                      }
                    }}
                    ChipProps={{ size: 'small' }}
                  />

                  <RHFAutocomplete
                    value={financialCompany}
                    name="financialCompany"
                    label="Financing Company"
                    options={financialCompanies}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                  />

                  <RHFAutocomplete
                    name="billingSite"    
                    label="Billing Site" 
                    options={activeSites}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                    id="controllable-states-demo"
                    ChipProps={{ size: 'small' }}
                  />

                  <RHFAutocomplete
                    name="installationSite"  
                    label="Installation Site" 
                    options={activeSites}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                    id="controllable-states-demo"
                    ChipProps={{ size: 'small' }}
                  />
                </Box>

                  <RHFTextField name="siteMilestone" label="Landmark for Installation site" multiline />
                  
                <Box rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  
                  <RHFDatePicker inputFormat='dd/MM/yyyy'  name="shippingDate" label="Shipping Date" />

                  <RHFDatePicker inputFormat='dd/MM/yyyy' name="installationDate" label="Installation Date" />

                </Box>

                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="machineConnectionVal"
                    id="tags-outlined"
                    options={machineConnections}
                    getOptionLabel={(option) => `${option.serialNo || ''} ${option.name ? '-' : ''} ${option.name || ''}`}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    renderInput={(params) => ( <TextField  {...params}  label="Connected Machines"   placeholder="Search"  /> )}
                  />
                  
                <Box rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <RHFAutocomplete
                    name="status" 
                    label="Status" 
                    options={activeMachineStatuses}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    getOptionDisabled={(option) => option.slug === 'intransfer' || option.slug === 'transferred' }
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.name || ''}`}</li> )}
                    id="controllable-states-demo"
                    ChipProps={{ size: 'small' }}
                  />

                  <RHFDatePicker inputFormat='dd/MM/yyyy' name="supportExpireDate" label="Support Expiry Date" />

                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="accountManager"
                    options={spContacts}
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
                    options={spContacts}
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
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>)}
                    renderInput={(params) => <TextField {...params} label="Support Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />
                  
                </Box>
                  <RHFTextField name="description" label="Description" minRows={3} multiline />
                  <ToggleButtons name={FORMLABELS.isACTIVE.name} isMachine />
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
  );
}
