import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, TextField } from '@mui/material';
// hook
import { useForm } from 'react-hook-form';
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_MACHINE } from '../../routes/paths';
// slice
import { getSPContacts } from '../../redux/slices/customer/contact';
import { getActiveCustomers, getFinancialCompanies } from '../../redux/slices/customer/customer';
import { getActiveSites, resetActiveSites } from '../../redux/slices/customer/site';
import { getActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { getActiveMachineModels, resetActiveMachineModels } from '../../redux/slices/products/model';
import { getActiveSuppliers } from '../../redux/slices/products/supplier';
// slice
import { getActiveMachines, updateMachine, setMachineEditFormVisibility, setTransferMachineFlag } from '../../redux/slices/products/machine';
import { getMachineConnections, resetMachineConnections } from '../../redux/slices/products/machineConnections';
import { getActiveCategories } from '../../redux/slices/products/category';
// hooks
import { useSnackbar } from '../../components/snackbar';
// components
import FormProvider, { RHFTextField, RHFAutocomplete, RHFDatePicker, RHFChipsInput } from '../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import BreadcrumbsLink from '../../components/Breadcrumbs/BreadcrumbsLink';
import AddButtonAboveAccordion from '../../components/Defaults/AddButtonAboveAcoordion';
import BreadcrumbsProvider from '../../components/Breadcrumbs/BreadcrumbsProvider';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
// constants
import { BREADCRUMBS, FORMLABELS } from '../../constants/default-constants';
import { machineSchema } from '../schemas/machine'

// ----------------------------------------------------------------------

export default function MachineEditForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { activeMachines, machine } = useSelector((state) => state.machine);
  const { activeSuppliers } = useSelector((state) => state.supplier);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCustomers, financialCompanies } = useSelector((state) => state.customer);
  const { activeSites } = useSelector((state) => state.site);
  const { activeMachineStatuses } = useSelector((state) => state.machinestatus);
  const { spContacts } = useSelector((state) => state.contact);
  const { machineConnections } = useSelector((state) => state.machineConnections);
  const { activeCategories } = useSelector((state) => state.category);
  const isMobile = useResponsive('sm', 'down');

  const methods = useForm({
    resolver: yupResolver(machineSchema),
    defaultValues: {
      serialNo: machine.serialNo || '',
      name: machine.name || '',
      alias: machine.alias || [],
      parentSerialNo: machine?.parentMachine || '',
      previousMachine: machine?.parentMachine?.name || '',
      supplier: machine.supplier || null,
      category: machine?.machineModel?.category || null,
      machineModel: machine?.machineModel || null,
      manufactureDate: machine?.manufactureDate || null,
      customer: machine.customer || null,
      financialCompany: machine?.financialCompany || null,
      machineConnectionVal: machine?.machineConnections?.map((connection)=> connection?.connectedMachine) || [],
      status: machine.status || null,
      workOrderRef: machine.workOrderRef || '',
      instalationSite: machine.instalationSite || null,
      billingSite: machine.billingSite || null,
      installationDate: machine.installationDate || null,
      shippingDate: machine.shippingDate || null,
      siteMilestone: machine.siteMilestone || '',
      projectManager: machine?.projectManager || [],
      supportManager: machine?.supportManager || [],
      accountManager: machine?.accountManager || [],
      supportExpireDate: machine.supportExpireDate || null,
      description: machine.description || '',
      isActive: machine.isActive || false,
    },
  });

  const {
    reset,
    watch,
    handleSubmit,
    setError,
    formState: { isSubmitting },
    setValue,
  } = methods

  const {
    parentSerialNo,
    category,
    machineModel,
    customer,
    financialCompany,
  } = watch();

  useEffect(() => {
      dispatch(resetMachineConnections());
      dispatch(resetActiveSites());
      dispatch(getActiveSites(customer?._id));
      dispatch(getMachineConnections(customer?._id));
  },[dispatch, customer, spContacts, setValue])

  useEffect(() => {
    if(category === null && machineModel ){
      dispatch(getActiveMachineModels());
      setValue('machineModel',null);
    }else if(category && category?._id !== machineModel?.category?._id){
      dispatch(getActiveMachineModels(category?._id));
      setValue('machineModel',null);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ category, machineModel ]);

  useEffect(() => {
    dispatch(getActiveSuppliers());
    dispatch(getActiveCategories());
    dispatch(resetActiveMachineModels());
    if(machine?.machineModel?.category?._id){
      dispatch(getActiveMachineModels(machine?.machineModel?.category?._id));
    }
    dispatch(getActiveMachineStatuses());
    dispatch(getActiveCustomers());
    dispatch(getActiveMachines());
    dispatch(getSPContacts());
  }, [dispatch, machine]);

  useEffect(()=>{
    dispatch(getFinancialCompanies());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ activeCustomers ])

  const toggleCancel = () => {
    dispatch(setMachineEditFormVisibility(false));
    navigate(PATH_MACHINE.machines.view(machine._id));
    dispatch(setTransferMachineFlag(false));
  };

  const onSubmit = async (data) => {
    if (data?.status?.slug === 'intransfer') {
      setError('status', {
        type: 'manual',
        message: 'Please change status In-Transfer is not acceptable',
      });
    }else{
      try {
        await dispatch(updateMachine(machine._id ,data));
        enqueueSnackbar('Machine updated successfully!');
        reset();
        navigate(PATH_MACHINE.machines.view(machine._id));
      } catch (error) {
        enqueueSnackbar('Saving failed!', { variant: `error` });
        console.error(error);
      }
    }
  };
  
  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} md={6}>
          <BreadcrumbsProvider>
            <BreadcrumbsLink to={PATH_MACHINE.machines.list} name={BREADCRUMBS.MACHINES} />
            <BreadcrumbsLink to={PATH_MACHINE.machines.view(machine._id)} name={machine.serialNo} />
          </BreadcrumbsProvider>
        </Grid>
        {!isMobile && <AddButtonAboveAccordion isCustomer />}
      </Grid>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12} sx={{ mt: 3 }}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box rowGap={3} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 2fr 6fr)', md: 'repeat(1, 1fr 5fr)' }}
                >
                  <RHFTextField name="serialNo" label="Serial No.*" disabled />
                  <RHFTextField name="name" label="Name" />
                </Box>
                  <RHFChipsInput name="alias" label="Alias" />
                {parentSerialNo && (
                      <RHFAutocomplete
                        disabled
                        name="parentSerialNo"
                        label="Previous Machine Serial No."  
                        options={activeMachines}
                        isOptionEqualToValue={(option, value) => option._id === value._id && option.isActive === true }
                        getOptionLabel={(option) => `${option?.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setValue('parentSerialNo',newValue)
                            setValue('previousMachine', newValue.name);
                            setValue('supplier', newValue.supplier);
                            setValue('model', newValue.machineModel);
                          } else {
                            setValue('parentSerialNo',null)
                            setValue('previousMachine', '');
                            setValue('supplier', null);
                            setValue('model', null);
                          }
                        }}
                        renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.serialNo || ''}  ${option?.name ? '-' : ''} ${option?.name || ''} `}</li> )}
                        ChipProps={{ size: 'small' }}
                      />)}
                <Box rowGap={3} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                    <RHFAutocomplete 
                      name="category"
                      label="Machine Category"
                      options={activeCategories}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                    />

                    <RHFAutocomplete 
                      name="machineModel"
                      label="Machine Model"
                      options={activeMachineModels}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                      onChange={(event, newValue) => {
                          if (newValue) {
                            setValue('machineModel', newValue);
                            if(category === null){
                            dispatch(getActiveMachineModels(newValue?.category?._id));
                            setValue('category', newValue?.category);
                            }
                          } else {
                            setValue('machineModel', null);
                          }
                        }}
                    />

                  <RHFDatePicker inputFormat='dd/MM/yyyy' name="manufactureDate" label="Manufacture Date" />

                  <RHFAutocomplete
                    name="status"
                    label="Status" 
                    options={activeMachineStatuses}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    getOptionDisabled={(option) => option.slug === 'intransfer' || option.slug === 'transferred' }
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                    id="controllable-states-demo"
                    ChipProps={{ size: 'small' }}
                  />

                  <RHFAutocomplete
                    name="supplier"
                    label="Supplier"
                    id="controllable-states-demo"
                    options={activeSuppliers}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                    ChipProps={{ size: 'small' }}
                  />

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
                      setValue('instalationSite', null);
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
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || '' }`}</li> )}
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
                    name="instalationSite"
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
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >

                  <RHFDatePicker inputFormat='dd/MM/yyyy'  name="shippingDate" label="Shipping Date" />

                  <RHFDatePicker inputFormat='dd/MM/yyyy'  name="installationDate" label="Installation Date" />

                </Box>
                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    name="machineConnectionVal"
                    label="Connected Machines" 
                    id="tags-outlined"
                    options={machineConnections?.filter((machinforConnection)=> machinforConnection?._id !== machine?._id)}
                    getOptionLabel={(option) => `${option?.connectedMachine?.serialNo ? option?.connectedMachine?.serialNo : option?.serialNo} ${option?.name ? '-' : ''} ${option?.name ? option.name : ''}`}
                    filterSelectedOptions
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  />
                <Box rowGap={3} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
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
                    name="supportManager"
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => (  <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
                    renderInput={(params) => <TextField {...params} label="Support Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />
                  <RHFDatePicker inputFormat='dd/MM/yyyy'  name="supportExpireDate" label="Support Expire Date" />
                </Box>
                  <RHFTextField name="description" label="Description" minRows={3} multiline />
                <ToggleButtons name={FORMLABELS.isACTIVE.name} isMachine />
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
