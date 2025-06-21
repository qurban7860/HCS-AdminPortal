import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, styled, Grid, Stack, TextField, Button, Link, lighten, darken, InputAdornment } from '@mui/material';
// slice
import { getActiveSPContacts, resetActiveSPContacts } from '../../redux/slices/customer/contact';
import { getActiveCustomers, setCustomerTab, setNewMachineCustomer } from '../../redux/slices/customer/customer';
import { getActiveSites, resetActiveSites } from '../../redux/slices/customer/site';
import  { addMachine, setConnectedMachineAddDialog, setNewConnectedMachines } from '../../redux/slices/products/machine';
import { getActiveCategories, resetActiveCategories } from '../../redux/slices/products/category';
import { getActiveMachineModels, resetActiveMachineModels } from '../../redux/slices/products/model';
import { getActiveMachineStatuses, resetActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { getActiveSuppliers, resetActiveSuppliers } from '../../redux/slices/products/supplier';
import { getMachineConnections, resetMachineConnections } from '../../redux/slices/products/machineConnections';
// routes
import { PATH_CRM, PATH_MACHINE } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete, RHFDatePicker, RHFChipsInput, RHFNumericField } from '../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import { FORMLABELS } from '../../constants/default-constants';
import { machineSchema } from '../schemas/machine'
import ConnectedMachineAddDialog from '../../components/Dialog/ConnectedMachineAddDialog';
import Iconify from '../../components/iconify';
import IconTooltip from '../../components/Icons/IconTooltip';
import IconButtonTooltip from '../../components/Icons/IconButtonTooltip';
import IconPopover from '../../components/Icons/IconPopover';
import { GroupHeader, GroupItems } from '../../theme/styles/default-styles';
import { handleError } from '../../utils/errorHandler';

MachineAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentCustomer: PropTypes.object,
};

export default function MachineAddForm({ isEdit, readOnly, currentCustomer }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const configs = JSON.parse( localStorage.getItem('configurations'))

  const { connectedMachineAddDialog, newConnectedMachines } = useSelector((state) => state.machine);
  const { activeSuppliers } = useSelector((state) => state.supplier);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCustomers, newMachineCustomer } = useSelector((state) => state.customer);
  const { activeSites } = useSelector((state) => state.site);
  const { activeMachineStatuses } = useSelector((state) => state.machinestatus);
  const { activeSpContacts } = useSelector((state) => state.contact);
  const { machineConnections } = useSelector((state) => state.machineConnections);
  const { activeCategories } = useSelector((state) => state.category);
  const { enqueueSnackbar } = useSnackbar();
  const [ landToCustomerMachinePage, setLandToCustomerMachinePage ] = useState(false);

  const machineGenerations = configs
    ?.find((item) => item?.name?.trim()?.toLowerCase() === 'machine_generations')
    ?.value.split(',')
    .map((type) => type.trim());

  useEffect(() => {
    dispatch(getActiveCustomers());
    dispatch(getActiveCategories());
    dispatch(getActiveMachineModels());
    dispatch(getActiveSuppliers());
    dispatch(getActiveMachineStatuses());
    dispatch(getActiveSPContacts());
    return ()=> { 
      dispatch(resetActiveMachineModels()); 
      dispatch(resetActiveCategories()); 
      dispatch(resetActiveMachineStatuses()); 
      dispatch(resetActiveSuppliers())
      dispatch(setNewMachineCustomer(null)); 
      dispatch(setNewConnectedMachines([]));
    }
  }, [dispatch]);  

  const decoilerCategories = activeCategories.filter(cat => cat?.connections);
  const decoilerModels = activeMachineModels.filter(model => decoilerCategories.some(cat => cat?._id === model?.category?._id));

  const methods = useForm({
    resolver: yupResolver(machineSchema),
    defaultValues: {
      serialNo: '',
      name: '',
      generation: '',
      efficiency: '',
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
      decommissionedDate: null,
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
  } = watch();

  useEffect(() => {
    dispatch(resetMachineConnections());
    dispatch(resetActiveSites());
    if(customer?._id){
      dispatch(getActiveSites(customer?._id));
      dispatch(getMachineConnections(customer?._id));
    }
  },[dispatch, customer, activeSpContacts, setValue])

  useEffect(() => {
    if(newMachineCustomer){
      setValue('customer',newMachineCustomer);
      setLandToCustomerMachinePage(true);
      setValue('accountManager', activeSpContacts.filter(item => Array.isArray(customer?.accountManager) && customer?.accountManager.some(manager => manager._id === item?._id)))
      setValue('projectManager', activeSpContacts.filter(item => Array.isArray(customer?.projectManager) && customer?.projectManager.some(manager => manager._id === item?._id)))
      setValue('supportManager', activeSpContacts.filter(item => Array.isArray(customer?.supportManager) && customer?.supportManager.some(manager => manager._id === item?._id)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[newMachineCustomer, activeSpContacts ])

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
      enqueueSnackbar('Machine created successfully!');
      reset();
      if( landToCustomerMachinePage && customer._id ){
        await navigate(PATH_CRM.customers.machines.root(customer?._id));
      }else if(response?.data?.Machine?._id){
        await navigate(PATH_MACHINE.machines.view(response?.data?.Machine?._id));
      } else {
        await navigate(PATH_MACHINE.machines.root);
      }
    } catch (error) {
      enqueueSnackbar( handleError( error ) || 'Machine save failed!', { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = async() => {
    if(landToCustomerMachinePage){
      await dispatch(setCustomerTab('machines'));
      navigate(PATH_CRM.customers.machines.root(newMachineCustomer._id));
    }else{
      navigate(PATH_MACHINE.machines.root);
    }
  };

  const hanldeAddNewConnectedMachine = () => {
    dispatch(setConnectedMachineAddDialog(true))
  };

  useEffect(() => {
    const currentValue = watch('machineConnectionVal') || [];
    const filteredValue = currentValue.filter(machine => machine?.customer); // Remove previously added machine
    setValue('machineConnectionVal', [...filteredValue, ...newConnectedMachines]);
  }, [setValue, watch, newConnectedMachines]);

  let connectedMachinesOption = [];
  connectedMachinesOption = connectedMachinesOption.concat(newConnectedMachines, machineConnections);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
        <Grid container>
          <Grid item xs={12} md={12} >
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
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                      onChange={(event, newValue) =>{
                          if(newValue){
                            setValue('category',newValue)
                            if(newValue?._id !== machineModel?.category?._id){
                              setValue('machineModel',null)
                            }
                          } else {
                            setValue('machineModel',null )
                            setValue('category',null )
                          }
                        }
                      }
                    />

                    <RHFAutocomplete 
                      name="machineModel"
                      label="Machine Model"
                      options={activeMachineModels.filter(el => (el.category && category) ? el.category._id === category._id : !category)}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                      onChange={(event, newValue) =>{
                        if(newValue){
                          setValue('machineModel',newValue)
                          if(!category ){
                            setValue('category',newValue?.category)
                          }
                        } else {
                          setValue('machineModel',null )
                        }
                      }
                    }
                    />
                    {Array.isArray(machineGenerations) && machineGenerations.length > 0 && (
                      <RHFAutocomplete 
                        name="generation"
                        label="Machine Generation"
                        options={machineGenerations}
                        isOptionEqualToValue={(option, value) => option === value}
                        getOptionLabel={option => option || ''}
                        renderOption={(props, option) => ( <li {...props} key={option}>{`${option || ''}`}</li> )}
                      />
                    )}
                    <RHFNumericField
                      name="efficiency"
                      label="Efficiency"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">m/hr</InputAdornment>,
                      }}
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
                        setValue('accountManager', activeSpContacts.filter(item => Array.isArray(newValue?.accountManager) && newValue?.accountManager.includes(item?._id)))
                        setValue('projectManager', activeSpContacts.filter(item => Array.isArray(newValue?.projectManager) && newValue?.projectManager.includes(item?._id)))
                        setValue('supportManager', activeSpContacts.filter(item => Array.isArray(newValue?.supportManager) && newValue?.supportManager.includes(item?._id)))
                      }
                    }}
                    ChipProps={{ size: 'small' }}
                  />

                  <RHFAutocomplete
                    name="financialCompany"
                    label="Financing Company"
                    options={activeCustomers.filter(el => el?.isFinancialCompany )}
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
                <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}>
                  <RHFDatePicker inputFormat='dd/MM/yyyy'  name="shippingDate" label="Shipping Date" />
                  <RHFDatePicker inputFormat='dd/MM/yyyy' name="installationDate" label="Installation Date" />
                </Box>
                <Box display="flex" columnGap={2} justifyContent='flex-end'>
                  <RHFAutocomplete
                    fullWidth
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="machineConnectionVal"
                    id="tags-outlined"
                    defaultValue={newConnectedMachines}
                    options={connectedMachinesOption}
                    groupBy={(option) => option?.group}
                    getOptionLabel={(option) => `${option?.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    onChange={(event, value) => {
                      if (value && value.length && value.some(option => option._id === 0)) {
                        dispatch(setConnectedMachineAddDialog(true));
                      } else {
                        setValue('machineConnectionVal', value);
                      }
                    }}
                    renderInput={(params) => ( <TextField  {...params}  label="Select Connected Machine (decoilers, etc.)" placeholder="Search"  /> )}
                    renderGroup={(params) => (
                      <li key={params.key} style={{borderBottom:params.group==='New'?'1px solid #ababab':'', borderRadius:'10px'}}>
                        {params.group && <GroupHeader>{params.group}</GroupHeader>}
                        <GroupItems>{params.children}</GroupItems>
                      </li>
                    )}
                  />
                  {customer && <IconTooltip title='New Connectable Machine' icon='mdi:plus' onClick={()=> hanldeAddNewConnectedMachine()} />}
                </Box>
                <RHFAutocomplete
                  name="status" 
                  label="Status" 
                  options={activeMachineStatuses}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.name || ''}`}
                  getOptionDisabled={(option) => option.slug === 'intransfer' || option.slug === 'transferred' || option.slug === 'decommissioned' }
                  renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.name || ''}`}</li> )}
                  id="controllable-states-demo"
                  ChipProps={{ size: 'small' }}
                />
                <Box rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >

                  {/* <RHFDatePicker inputFormat='dd/MM/yyyy' name="decommissionedDate" label="De-Commissioned Date" /> */}

                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="accountManager"
                    options={activeSpContacts}
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
                    options={activeSpContacts}
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
                    options={activeSpContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>)}
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
      <ConnectedMachineAddDialog activeCategories={decoilerCategories} activeMachineModels={decoilerModels} />
    </>
  );
}
