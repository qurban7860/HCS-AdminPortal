import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, InputAdornment, Stack, TextField } from '@mui/material';
// hook
import { useForm } from 'react-hook-form';
// routes
import { PATH_MACHINE } from '../../routes/paths';
// slice
import { getActiveSPContacts, resetActiveSPContacts } from '../../redux/slices/customer/contact';
import { getActiveCustomers, resetActiveCustomers } from '../../redux/slices/customer/customer';
import { getActiveSites, resetActiveSites } from '../../redux/slices/customer/site';
import { getActiveMachineStatuses, resetActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { getActiveMachineModels, resetActiveMachineModels } from '../../redux/slices/products/model';
import { getActiveSuppliers, resetActiveSuppliers } from '../../redux/slices/products/supplier';
// slice
import { updateMachine, getActiveMachines, resetActiveMachines, getMachine } from '../../redux/slices/products/machine';
import { getMachineConnections, resetMachineConnections } from '../../redux/slices/products/machineConnections';
import { getActiveCategories, resetActiveCategories } from '../../redux/slices/products/category';
// hooks
import { useSnackbar } from '../../components/snackbar';
// components
import FormProvider, { RHFTextField, RHFAutocomplete, RHFSwitch, RHFDatePicker, RHFChipsInput, RHFNumericField } from '../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
// constants
import { FORMLABELS } from '../../constants/default-constants';
import { editMachineSchema } from '../schemas/machine'
import { handleError } from '../../utils/errorHandler'
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function MachineEditForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuthContext()
  const allowedRoles = ['SuperAdmin', 'Sales Manager', 'Technical Manager']
  const { enqueueSnackbar } = useSnackbar();
  const configs = JSON.parse( localStorage.getItem('configurations'))

  const { activeMachines, machine } = useSelector((state) => state.machine);
  const { activeSuppliers } = useSelector((state) => state.supplier);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCustomers } = useSelector((state) => state.customer);
  const { activeSites } = useSelector((state) => state.site);
  const { activeSpContacts } = useSelector((state) => state.contact);
  const { machineConnections } = useSelector((state) => state.machineConnections);
  const { activeCategories } = useSelector((state) => state.category);

    const machineGenerations = configs
    ?.find((item) => item?.name?.trim()?.toLowerCase() === 'machine_generations')
    ?.value.split(',')
    .map((type) => type.trim());

  const methods = useForm({
    resolver: yupResolver(editMachineSchema),
    defaultValues: {
      serialNo: machine.serialNo || '',
      name: machine.name || '',
      generation: machine.generation || '',
      efficiency: machine.efficiency || '',
      alias: machine.alias || [],
      parentSerialNo: machine?.parentMachine || '',
      previousMachine: machine?.parentMachine?.name || '',
      supplier: machine.supplier || null,
      category: machine?.machineModel?.category || null,
      machineModel: machine?.machineModel || null,
      manufactureDate: machine?.manufactureDate || null,
      purchaseDate: machine?.purchaseDate || null,
      customer: machine.customer || null,
      financialCompany: machine?.financialCompany || null,
      machineConnectionVal: machine?.machineConnections?.map((connection) => connection?.connectedMachine) || [],
      status: machine.status || null,
      workOrderRef: machine.workOrderRef || '',
      installationSite: machine.instalationSite || null,
      billingSite: machine.billingSite || null,
      installationDate: machine.installationDate || null,
      shippingDate: machine.shippingDate || null,
      siteMilestone: machine.siteMilestone || '',
      projectManager: machine?.projectManager || [],
      supportManager: machine?.supportManager || [],
      accountManager: machine?.accountManager || [],
      isUpdateConnectedMachines: false,
      supportExpireDate: machine.supportExpireDate || null,
      decommissionedDate: machine.decommissionedDate || null,
      description: machine.description || '',
      isActive: machine.isActive || false,
    },
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods

  const {
    parentSerialNo,
    category,
    customer,
  } = watch();

  useEffect(() => {
    if (customer?._id) {
      dispatch(getActiveSites(customer?._id));
      dispatch(getMachineConnections(customer?._id));
    }
    return () => {
      dispatch(resetActiveSites());
      dispatch(resetMachineConnections());
    }
  }, [dispatch, customer?._id])


  useEffect(() => {
    dispatch(getActiveSuppliers());
    dispatch(getActiveCategories());
    dispatch(getActiveMachineModels());
    dispatch(getActiveMachineStatuses());
    dispatch(getActiveCustomers());
    dispatch(getActiveMachines());
    dispatch(getActiveSPContacts());

    return () => {
      dispatch(resetActiveSuppliers());
      dispatch(resetActiveCategories());
      dispatch(resetActiveMachineModels());
      dispatch(resetActiveMachineStatuses());
      dispatch(resetActiveCustomers());
      dispatch(resetActiveMachines());
      dispatch(resetActiveSPContacts());
    }

  }, [dispatch]);

  const toggleCancel = () => navigate(PATH_MACHINE.machines.view(machine._id));

  const onSubmit = async (data) => {
    try {
      await dispatch(updateMachine(machine._id, data));
      await dispatch(getMachine(machine._id));
      enqueueSnackbar('Machine updated successfully!');
      reset();
      navigate(PATH_MACHINE.machines.view(machine._id));
    } catch (error) {
      enqueueSnackbar(handleError(error) || 'Saving failed!', { variant: `error` });
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
      <Grid container>
        <Grid item xs={12} md={12} >
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box rowGap={2} columnGap={2} display="grid"
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
                  isOptionEqualToValue={(option, value) => option._id === value._id && option.isActive === true}
                  getOptionLabel={(option) => `${option?.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setValue('parentSerialNo', newValue)
                      setValue('previousMachine', newValue.name);
                      setValue('supplier', newValue.supplier);
                      setValue('model', newValue.machineModel);
                    } else {
                      setValue('parentSerialNo', null)
                      setValue('previousMachine', '');
                      setValue('supplier', null);
                      setValue('model', null);
                    }
                  }}
                  renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.serialNo || ''}  ${option?.name ? '-' : ''} ${option?.name || ''} `}</li>)}
                  ChipProps={{ size: 'small' }}
                />)}
              <Box rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <RHFAutocomplete
                  name="category"
                  label="Machine Category"
                  options={activeCategories}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.name || ''}`}
                  renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name || ''}`}</li>)}
                />

                <RHFAutocomplete
                  name="machineModel"
                  label="Machine Model"
                  options={activeMachineModels.filter(el => (el.category && category) ? el.category._id === category._id : !category)}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.name || ''}`}
                  renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name || ''}`}</li>)}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setValue('machineModel', newValue);
                      if (!category) {
                        setValue('category', newValue?.category)
                      }
                    } else {
                      setValue('machineModel', null);
                    }
                  }}
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
                  options={activeSuppliers}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.name || ''}`}
                  renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name || ''}`}</li>)}
                  ChipProps={{ size: 'small' }}
                />

                <RHFDatePicker inputFormat='dd/MM/yyyy' name="purchaseDate" label="Purchase Date" />

                <RHFTextField name="workOrderRef" label="Work Order/ Purchase Order" />

                <RHFAutocomplete
                  name="customer"
                  label="Customer*"
                  id="controllable-states-demo"
                  disabled={!user.roles?.some(r => allowedRoles?.includes(r?.name))}
                  options={activeCustomers}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.name || ''}`}
                  renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name || ''}`}</li>)}
                  onChange={async (event, newValue) => {
                    setValue('customer', newValue);
                    setValue('installationSite', null);
                    setValue('billingSite', null);
                    setValue('machineConnectionVal', []);
                    setValue('accountManager', [])
                    setValue('projectManager', [])
                    setValue('supportManager', [])

                    if (newValue) {
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
                  options={activeCustomers.filter(el => el?.isFinancialCompany)}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.name || ''}`}
                  renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name || ''}`}</li>)}
                />

                <RHFAutocomplete
                  name="billingSite"
                  label="Billing Site"
                  options={activeSites}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.name || ''}`}
                  renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name || ''}`}</li>)}
                  id="controllable-states-demo"
                  ChipProps={{ size: 'small' }}
                />

                <RHFAutocomplete
                  name="installationSite"
                  label="Installation Site"
                  options={activeSites}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.name || ''}`}
                  renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name || ''}`}</li>)}
                  id="controllable-states-demo"
                  ChipProps={{ size: 'small' }}
                />
              </Box>

              <RHFTextField name="siteMilestone" label="Landmark for Installation site" multiline />

              <Box rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >

                <RHFDatePicker inputFormat='dd/MM/yyyy' name="shippingDate" label="Shipping Date" />

                <RHFDatePicker inputFormat='dd/MM/yyyy' name="installationDate" label="Installation Date" />

              </Box>
              <RHFAutocomplete
                multiple
                disableCloseOnSelect
                filterSelectedOptions
                name="machineConnectionVal"
                label="Connected Machines"
                id="tags-outlined"
                options={machineConnections?.filter((machinforConnection) => machinforConnection?._id !== machine?._id)}
                getOptionLabel={(option) => `${option?.connectedMachine?.serialNo ? option?.connectedMachine?.serialNo : option?.serialNo} ${option?.name ? '-' : ''} ${option?.name ? option.name : ''}`}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
              />
              {/* <RHFAutocomplete
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
                    
                    
                  <RHFDatePicker inputFormat='dd/MM/yyyy'  name="decommissionedDate" label="De-Commissioned Date" /> */}

              <RHFAutocomplete
                multiple
                disableCloseOnSelect
                filterSelectedOptions
                name="accountManager"
                options={activeSpContacts}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''}`}
                renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>)}
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
                getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''}`}
                renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>)}
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
                getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''}`}
                renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>)}
                renderInput={(params) => <TextField {...params} label="Support Manager" />}
                ChipProps={{ size: 'small' }}
                id="controllable-states-demo"
              />
              <RHFSwitch name="isUpdateConnectedMachines" label="Update Connected Machines" />
              <RHFDatePicker inputFormat='dd/MM/yyyy' name="supportExpireDate" label="Support Expiry Date" />
              <RHFTextField name="description" label="Description" minRows={3} multiline />
              <RHFSwitch name={FORMLABELS.isACTIVE.name} label={FORMLABELS.isACTIVE.label} />
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
