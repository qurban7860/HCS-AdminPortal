import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, TextField, Autocomplete } from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input';
// hook
import { Controller, useForm } from 'react-hook-form';
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
// global
// import { CONFIG } from '../../config-global';
// slice
import {
  getActiveMachines,
  updateMachine,
  setMachineEditFormVisibility,
  setTransferMachineFlag,
} from '../../redux/slices/products/machine';
import { getMachineConnections, resetMachineConnections } from '../../redux/slices/products/machineConnections';
import { getActiveCategories } from '../../redux/slices/products/category';
// hooks
import { useSnackbar } from '../../components/snackbar';
// components
import FormProvider, { RHFTextField, RHFAutocomplete, RHFDatePicker } from '../../components/hook-form';
import AddFormButtons from '../components/DocumentForms/AddFormButtons';
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
import BreadcrumbsProvider from '../components/Breadcrumbs/BreadcrumbsProvider';
import ToggleButtons from '../components/DocumentForms/ToggleButtons';
// constants
import { BREADCRUMBS, FORMLABELS } from '../../constants/default-constants';
import { futureDate, pastDate, formatDate } from './util/index'

// ----------------------------------------------------------------------

export default function MachineEditForm() {
  // const { users } = useSelector((state) => state.user);
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

  const [chips, setChips] = useState([]);
  const isMobile = useResponsive('sm', 'down');

  const AddMachineSchema = Yup.object().shape({
    serialNo: Yup.string().max(6).required('Serial Number is required').nullable(),
    name: Yup.string().max(250),
    parentSerialNo: Yup.object().shape({
      serialNo: Yup.string()
    }).nullable(),
    previousMachine: Yup.string(),
    supplier: Yup.object().shape({
      serialNo: Yup.string()
    }).nullable(),
    machineModel: Yup.object().shape({
      name: Yup.string()
    }).nullable(),
    customer: Yup.object().shape({
      name: Yup.string()
    }).nullable().required("Customer Is Required!"),
    status: Yup.object().shape({
      name: Yup.string()
    }).nullable(),
    workOrderRef: Yup.string().max(50),

    shippingDate: Yup.date()
    .max(futureDate,`Shipping Date field must be at earlier than ${formatDate(futureDate)}!`)
    .min(pastDate,`Shipping Date field must be at after than ${formatDate(pastDate)}!`).nullable().label('Shipping Date'),

    installationDate: Yup.date()
    .max(futureDate,`Shipping Date field must be at earlier than ${formatDate(futureDate)}!`)
    .min(pastDate,`Shipping Date field must be at after than ${formatDate(pastDate)}!`).nullable().label('Installation Date'),

    instalationSite: Yup.object().shape({
      name: Yup.string()
    }).nullable(),
    billingSite: Yup.object().shape({
      name: Yup.string()
    }).nullable(),
    accountManager: Yup.object().shape({
      name: Yup.string()
    }).nullable(),
    projectManager: Yup.object().shape({
      name: Yup.string()
    }).nullable(),
    supportManager: Yup.object().shape({
      name: Yup.string()
    }).nullable(),
    siteMilestone: Yup.string().max(1500),
    description: Yup.string().max(1500),
    isActive: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(AddMachineSchema),
    defaultValues: {
      serialNo: machine.serialNo || '',
      name: machine.name || '',
      parentSerialNo: machine?.parentMachine || '',
      previousMachine: machine?.parentMachine?.name || '',
      supplier: machine.supplier || null,
      category: machine?.machineModel?.category || null,
      machineModel: machine?.machineModel || null,
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
      accountManager: machine.accountManager || null,
      projectManager: machine.projectManager || null,
      supportManager: machine.supportManager || null,
      supportExpireDate: machine.supportExpireDate || null,
      // customerTags: [],
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
    control,
  } = methods

  const {
    parentSerialNo,
    supplier,
    category,
    machineModel,
    status,
    customer,
    financialCompany,
    instalationSite,
    machineConnectionVal,
    accountManager,
    projectManager,
    supportManager,
  } = watch();

  // useEffect(() => {
  //   if(status && status?.slug === 'intransfer' ){
  //     setValue('status',null)
  //   }
  //    // eslint-disable-next-line react-hooks/exhaustive-deps
  // },[status])

  useEffect(() => {
    if(category === null && machineModel ){
      // dispatch(resetActiveMachineModels())
      dispatch(getActiveMachineModels());
      setValue('machineModel',null);
    }else if(category && category?._id !== machineModel?.category?._id){
      dispatch(getActiveMachineModels(category?._id));
      setValue('machineModel',null);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ category, machineModel ]);

  useEffect(() => {
    dispatch(getFinancialCompanies());
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
    setChips(machine?.alias);
  }, [dispatch, machine]);

  useEffect( () => {
    if (customer && customer?._id ) {
      dispatch(getActiveSites(customer?._id));
      dispatch(getMachineConnections(customer?._id));
    }
  }, [dispatch, customer]);



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
      data.alias = chips;
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

  // ----------------------handle functions----------------------

  const handleChipChange = (newChips) => {
    const array = [...new Set(newChips)]
    setChips(array);
  };
  // ----------------------end handle functions----------------------

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
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 2fr 6fr)', md: 'repeat(1, 1fr 5fr)' }}
                >

                {/* -------------------------- Machine Serial No -------------------------------------- */}

                  <RHFTextField name="serialNo" label="Serial No.*" disabled />

                {/* -------------------------- Machine Name -------------------------------------- */}

                  <RHFTextField name="name" label="Name" />

                </Box>

                {/* -------------------------- Alias -------------------------------------- */}

                  <MuiChipsInput label="Alias" value={chips} onChange={handleChipChange} />
                                  {/* -------------------------- Parent Machines Serial No -------------------------------------- */}
                  
                {parentSerialNo && (<Controller
                    name="parentSerialNo"
                    control={control}
                    defaultValue={parentSerialNo || null}
                    render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                     disabled
                        options={activeMachines}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id && option.isActive === true
                        }
                        getOptionLabel={(option) => `${option?.serialNo ? option?.serialNo : ''} ${option?.name ? '-' : ''} ${option?.name ? option?.name : ''}`}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            field.onChange(newValue);
                            setValue('previousMachine', newValue.name);
                            setValue('supplier', newValue.supplier);
                            setValue('model', newValue.machineModel);
                          } else {
                            field.onChange(null);
                            setValue('previousMachine', '');
                            setValue('supplier', null);
                            setValue('model', null);
                          }
                        }}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>{`${option.serialNo ? option.serialNo : ''}  ${option?.name ? '-' : ''} ${option?.name ? option?.name : ''} `}</li>
                        )}
                        renderInput={(params) => (
                          <TextField 
                          {...params} 
                          name="parentSerialNo"
                          id="parentSerialNo"
                          label="Previous Machine Serial No."  
                          error={!!error}
                          helperText={error?.message} 
                          inputRef={ref}
                          />
                        )}
                        ChipProps={{ size: 'small' }}
                      />
                    )}
                  />)}

                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >

                {/* ------------------------- Previous Machine Name --------------------------------------- */}

                {/* <RHFTextField name="previousMachine" label="Previous Machine" disabled/> */}


                    {/* ----------------------------- Filter Machine Model By Category ----------------------------------- */}

                    <RHFAutocomplete 
                      name="category"
                      label="Machine Category"
                      options={activeCategories}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                    />

                    {/* -------------------------------- Machine Model -------------------------------- */}

                    <RHFAutocomplete 
                      name="machineModel"
                      label="Machine Model"
                      options={activeMachineModels}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
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

                    {/* -------------------------------- Statuses -------------------------------- */}
                  
                <Controller
                  name="status"
                  control={control}
                  defaultValue={status || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    options={activeMachineStatuses}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    getOptionDisabled={(option) =>
                      option.slug === 'intransfer' || option.slug === 'transferred'
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                    id="controllable-states-demo"
                    onChange={(event, value) => field.onChange(value)}
                    renderInput={(params) => <TextField 
                        {...params} 
                        name="status"
                        id="status"   
                        label="Status" 
                        error={!!error}
                        helperText={error?.message} 
                        inputRef={ref}
                    />}
                    ChipProps={{ size: 'small' }}
                  />
                  )}
                />
                                {/* ------------------------- Previous Machine Supplier --------------------------------------- */}

                                <Controller
                    name="supplier"
                    control={control}
                    defaultValue={supplier || null}
                    render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        id="controllable-states-demo"
                        options={activeSuppliers}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                        )}
                        onChange={(event, value) => field.onChange(value)}
                        renderInput={(params) => (
                          <TextField 
                          {...params} 
                          name="supplier"
                          id="supplier"
                          label="Supplier"  
                          error={!!error}
                          helperText={error?.message} 
                          inputRef={ref} 
                          />
                        )}
                        ChipProps={{ size: 'small' }}
                      />
                    )}
                  />


                  <RHFAutocomplete
                    // multiple 
                    value={financialCompany}
                    name="financialCompany"
                    label="Financing Company"
                    options={financialCompanies}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

                  {/* -------------------------------- Work Order/ Purchase Order -------------------------------- */}

                  <RHFTextField name="workOrderRef" label="Work Order/ Purchase Order" />
                </Box>
                
                {/* -------------------------------- Customer -------------------------------- */}

                  <Controller
                    name="customer"
                    control={control}
                    defaultValue={customer || null}
                    render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        id="controllable-states-demo"
                        options={activeCustomers}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                        )}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            field.onChange(newValue);
                            if(customer?._id !== newValue._id) {
                            setValue('machineConnectionVal', []);
                            setValue('instalationSite', []);
                            setValue('billingSite', []);
                            }
                          } else {
                            field.onChange(null);
                            dispatch(resetMachineConnections());
                            setValue('machineConnectionVal', []);
                            setValue('instalationSite', []);
                            setValue('billingSite', []);
                            dispatch(resetActiveSites());
                          }
                        }}
                        renderInput={(params) => (
                          <TextField 
                          {...params} 
                          name="customer"
                          id="customer"
                          label="Customer*"  
                          error={!!error}
                          helperText={error?.message} 
                          inputRef={ref} 
                          />
                        )}
                        ChipProps={{ size: 'small' }}
                      />
                    )}
                  />

<Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >

                    {/* -------------------------------- Billing Site -------------------------------- */}

                    <Controller
                  name="billingSite"
                  control={control}
                  defaultValue={instalationSite || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    // freeSolo
                    {...field}
                    options={activeSites}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    onChange={(event, value) => field.onChange(value)}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField 
                      {...params} 
                      name="billingSite"
                      id="billingSite"     
                      label="Billing Site" 
                      error={!!error}
                      helperText={error?.message} 
                      inputRef={ref}
                    />}
                    ChipProps={{ size: 'small' }}
                  />
                  )}
                />

                    {/* -------------------------------- Shipping Date -------------------------------- */}
                    <RHFDatePicker inputFormat='dd/MM/yyyy'  name="shippingDate" label="Shipping Date" />

                    {/* -------------------------------- Installation Site -------------------------------- */}

                <Controller
                  name="instalationSite"
                  control={control}
                  defaultValue={instalationSite || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    // freeSolo
                    {...field}
                    options={activeSites}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                    id="controllable-states-demo"
                    onChange={(event, value) => field.onChange(value)}
                    renderInput={(params) => <TextField 
                        {...params} 
                        name="instalationSite"
                        id="instalationSite"    
                        label="Installation Site" 
                        error={!!error}
                        helperText={error?.message} 
                        inputRef={ref}
                    />}
                    ChipProps={{ size: 'small' }}
                  />
                  )}
                />

                    {/* -------------------------------- Installation Date -------------------------------- */}

                    <RHFDatePicker inputFormat='dd/MM/yyyy'  name="installationDate" label="Installation Date" />
                 
                </Box>

                {/* -------------------------------- Nearby Milestone -------------------------------- */}

                  <RHFTextField name="siteMilestone" label="Nearby Milestone" multiline />
   {/* -------------------------------- Machine Connections -------------------------------- */}

                  <Controller
                  name="machineConnectionVal"
                  control={control}
                  defaultValue={ machineConnectionVal || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    disableCloseOnSelect
                    {...field}
                    name="machineConnectionVal"
                    id="tags-outlined"
                    options={machineConnections?.filter((machinforConnection)=> machinforConnection?._id !== machine?._id)}
                    getOptionLabel={(option) => `${option?.connectedMachine?.serialNo ? option?.connectedMachine?.serialNo : option?.serialNo} ${option?.name ? '-' : ''} ${option?.name ? option.name : ''}`}
                    filterSelectedOptions
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    onChange={(event, value) => field.onChange(value)}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        name="machineConnectionVal"
                        id="machineConnectionVal"  
                        label="Connected Machines" 
                        placeholder="Search" 
                        error={!!error}
                        helperText={error?.message} 
                        inputRef={ref}
                        />
                    )}
                  />
                  )}
                />
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >

                 
                   

                {/* -------------------------------- Account Manager -------------------------------- */}

                <Controller
                  name="accountManager"
                  control={control}
                  defaultValue={accountManager || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    // freeSolo
                    {...field}
                    options={spContacts}
                    isOptionEqualToValue={(option, value) =>option._id === value._id}
                    getOptionLabel={(option) =>
                      `${option.firstName ? option.firstName : ''} ${
                        option.lastName ? option.lastName : ''
                      }`
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${
                        option.firstName ? option.firstName : ''
                      } ${option.lastName ? option.lastName : ''}`}</li>
                    )}
                    id="controllable-states-demo"
                    onChange={(event, value) => field.onChange(value)}
                    renderInput={(params) => <TextField 
                      {...params} 
                      label="Account Manager"
                      name="accountManager"
                      id="accountManager"     
                      error={!!error}
                      helperText={error?.message} 
                      inputRef={ref} 
                    />}
                    ChipProps={{ size: 'small' }}
                  />
                  )}
                />

                {/* -------------------------------- Project Manager -------------------------------- */}

                <Controller
                  name="projectManager"
                  control={control}
                  defaultValue={projectManager || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    // freeSolo
                    {...field}
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) =>
                      `${option.firstName ? option.firstName : ''} ${
                        option.lastName ? option.lastName : ''
                      }`
                    }
                    onChange={(event, value) => field.onChange(value)}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${
                        option.firstName ? option.firstName : ''
                      } ${option.lastName ? option.lastName : ''}`}</li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField 
                      {...params} 
                      label="Project Manager" 
                      name="projectManager"
                      id="projectManager"     
                      error={!!error}
                      helperText={error?.message} 
                      inputRef={ref}
                    />}
                    ChipProps={{ size: 'small' }}
                  />
                  )}
                />

                {/* -------------------------------- Support Manager -------------------------------- */}
                
                <Controller
                  name="supportManager"
                  control={control}
                  defaultValue={supportManager || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    // freeSolo
                    {...field}
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option._id === value._id }
                    getOptionLabel={(option) =>
                      `${option.firstName ? option.firstName : ''} ${
                        option.lastName ? option.lastName : ''
                      }`
                    }
                    onChange={(event, value) => field.onChange(value)}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${
                        option.firstName ? option.firstName : ''
                      } ${option.lastName ? option.lastName : ''}`}</li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField 
                    {...params} 
                      label="Support Manager" 
                      name="supportManager"
                      id="supportManager"     
                      error={!!error}
                      helperText={error?.message} 
                      inputRef={ref}
                    />}
                    ChipProps={{ size: 'small' }}
                  />
                  )}
                />

                  <RHFDatePicker inputFormat='dd/MM/yyyy'  name="supportExpireDate" label="Support Expire Date" />
              
                </Box>

                {/* -------------------------------- Description -------------------------------- */}

                  <RHFTextField name="description" label="Description" minRows={3} multiline />

                {/* -------------------------------- isActive -------------------------------- */}

                <ToggleButtons name={FORMLABELS.isACTIVE.name} isMachine />
              </Stack>

                {/* -------------------------------- Submit Buttons -------------------------------- */}

              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
