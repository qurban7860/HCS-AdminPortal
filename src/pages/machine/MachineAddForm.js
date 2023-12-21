import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { Controller ,useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Card,
  styled,
  Container,
  Grid,
  Stack,
  TextField,
  Autocomplete,
} from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input';
// slice
import { getSPContacts } from '../../redux/slices/customer/contact';
import { getActiveCustomers, getFinancialCompanies, setNewMachineCustomer } from '../../redux/slices/customer/customer';
import { getActiveSites, resetActiveSites } from '../../redux/slices/customer/site';
import  { addMachine, getActiveMachines } from '../../redux/slices/products/machine';
import { getActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { getActiveMachineModels } from '../../redux/slices/products/model';
import { getActiveSuppliers } from '../../redux/slices/products/supplier';
import { getMachineConnections } from '../../redux/slices/products/machineConnections';
import { getActiveCategories } from '../../redux/slices/products/category';
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
import { today, futureDate, pastDate, formatDate } from './util/index'

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

  const { enqueueSnackbar } = useSnackbar();
  const [chips, setChips] = useState([]);


  useEffect(() => {
    dispatch(getFinancialCompanies());
    dispatch(getActiveCustomers());
    dispatch(getActiveMachines());
    dispatch(getActiveMachineModels());
    dispatch(getActiveSuppliers());
    dispatch(getActiveMachineStatuses());
    dispatch(getActiveCategories());
    dispatch(getSPContacts());
  }, [dispatch]);

  // const futureDateValidator = Yup.date().nullable()
  // .test('is-future-date', 'Date must be in the future and within the next ten years', (value) => {
  //   if (!value) { return true }
  //   const currentDate = new Date();
  //   const tenYearsLater = new Date();
  //   tenYearsLater.setFullYear(currentDate.getFullYear() + 10);
  //   return value > currentDate && value <= tenYearsLater;
  // });

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
    .typeError('Date Should be Valid!')
    .max(futureDate,`Shipping Date field must be at earlier than ${formatDate(futureDate)}!`)
    .min(pastDate,`Shipping Date field must be at after than ${formatDate(pastDate)}!`).nullable().label('Shipping Date'),

    installationDate: Yup.date()
    .typeError('Date Should be Valid!')
    .max(futureDate,`Shipping Date field must be at earlier than ${formatDate(futureDate)}!`)
    .min(pastDate,`Shipping Date field must be at after than ${formatDate(pastDate)}!`).nullable().label('Installation Date'),

    supportExpireDate: Yup.date()
    .min(today,`Support Expiry Date field must be at after than ${formatDate(today)}!`).nullable().label('Support Expiry Date'),

    instalationSite: Yup.object().shape({
      name: Yup.string()
    }).nullable(),
    billingSite: Yup.object().shape({
      name: Yup.string()
    }).nullable(),

    accountManager: Yup.array(),
    projectManager: Yup.array(),
    supportManager: Yup.array(),
    
    siteMilestone: Yup.string().max(1500),
    description: Yup.string().max(5000),
    isActive: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(AddMachineSchema),
    defaultValues: {
      serialNo: '',
      name: '',
      parentSerialNo: null,
      previousMachine: '',
      supplier: activeSuppliers.find((element) => element?.isDefault === true) || null,
      category: null,
      machineModel: null,
      customer: null,
      financialCompany: null,
      machineConnectionVal: [],
      connection: [],
      status: activeMachineStatuses.find((element)=> element.isDefault === true) || null,
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
    control,
  } = methods;

  const {
    supplier,
    status,
    customer,
    instalationSite,
    category,
    machineModel,
    machineConnectionVal,
    installationDate,
    shippingDate,
    supportExpireDate,
    financialCompany,
  } = watch();

  useEffect(() => {
    if(newMachineCustomer){
      setValue('customer',newMachineCustomer);
    }
    return ()=>{ dispatch(setNewMachineCustomer(null)) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[newMachineCustomer, spContacts])


  useEffect(() => {
    if (customer !== null && customer._id !== undefined) {
      console.log("customer : ",customer)
      dispatch(getActiveSites(customer._id));
      dispatch(getMachineConnections(customer._id));
      setValue('accountManager', spContacts.filter(item => Array.isArray(customer?.accountManager) && customer?.accountManager.some(manager => manager._id === item?._id)))
      setValue('projectManager', spContacts.filter(item => Array.isArray(customer?.projectManager) && customer?.projectManager.some(manager => manager._id === item?._id)))
      setValue('supportManager', spContacts.filter(item => Array.isArray(customer?.supportManager) && customer?.supportManager.some(manager => manager._id === item?._id)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, customer]);

 styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  const onSubmit = async (data) => {

    if (chips && chips.length > 0) {
      data.alias = chips;
    }

    // data.installationDate = installationDate;
    // data.shippingDate = shippingDate;
    // data.supportExpireDate = supportExpireDate;
    
    try {
      await dispatch(addMachine(data));

      // setChipData([]);
      // setCurrTag('');
      // setShippingDate(null);
      // setInstallationDate(null);
      reset();
      enqueueSnackbar('Create success!');
      if(newMachineCustomer){
        navigate(PATH_CUSTOMER.view(customer._id));
      }else{
        navigate(PATH_MACHINE.machines.list);
      }
    } catch (error) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    if(newMachineCustomer){
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
    // CategoryValHandler(null, activeCategories.find((ele) => ele._id === activeMachineModels.find((element)=> element.isDefault === true)?.category?._id || ele?.isDefault === true) || null )
    MachineModelValHandler(null, activeMachineModels.find((element)=> element.isDefault === true) || null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ ])

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
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 2fr 6fr)', md: 'repeat(1, 1fr 5fr)' }}
                >

                {/* -------------------------- Machine Serial No -------------------------------------- */}

                  <RHFTextField name="serialNo" label="Serial No.*"  />

                {/* -------------------------- Machine Name -------------------------------------- */}

                  <RHFTextField name="name" label="Name" />

                </Box>

                {/* -------------------------- Alias -------------------------------------- */}

                  <MuiChipsInput label="Alias" value={chips} onChange={handleChipChange} />

                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >


                   {/* ----------------------------- Filter Machine Model By Category ----------------------------------- */}

                    <RHFAutocomplete 
                      name="category"
                      label="Machine Category"
                      options={activeCategories}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      onChange={(event, newValue) => CategoryValHandler(event, newValue)}
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
                      onChange={(event, newValue) => MachineModelValHandler(event, newValue)}
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

                    {/* -------------------------------- supplier -------------------------------- */}

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

                    {/* -------------------------------- Work Order/ Purchase Order -------------------------------- */}

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
                            setValue('instalationSite', null);
                            setValue('billingSite', null);
                            setValue('accountManager', spContacts.filter(item => Array.isArray(newValue?.accountManager) && newValue?.accountManager.includes(item?._id)))
                            setValue('projectManager', spContacts.filter(item => Array.isArray(newValue?.projectManager) && newValue?.projectManager.includes(item?._id)))
                            setValue('supportManager', spContacts.filter(item => Array.isArray(newValue?.supportManager) && newValue?.supportManager.includes(item?._id)))
                            }
                          } else {
                            field.onChange(null);
                            setValue('machineConnectionVal', []);
                            setValue('instalationSite', null);
                            setValue('billingSite', null);
                            // setValue('accountManager', null)
                            // setValue('productManager', null)
                            // setValue('supportManager', null)
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
                    rowGap={2}
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
                    <RHFDatePicker inputFormat='dd/MM/yyyy' name="installationDate" label="Installation Date" />
                    




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
                    options={machineConnections}
                    getOptionLabel={(option) => `${option.serialNo ? option.serialNo : ''} ${option.name ? '-' : ''} ${option.name ? option.name : ''}`}
                    filterSelectedOptions
                    isOptionEqualToValue={(option, value) => option._id === value._id}
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
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >

                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    name="accountManager"
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>
                    )}
                    renderInput={(params) => <TextField {...params} label="Account Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />

                  <RHFAutocomplete
                    // freeSolo
                    multiple
                    disableCloseOnSelect
                    name="projectManager"
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>
                    )}
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
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>
                    )}
                    renderInput={(params) => <TextField {...params} label="Support Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />

                <RHFDatePicker inputFormat='dd/MM/yyyy' name="supportExpireDate" label="Support Expiry Date" />
                    
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
    </Container>
  );
}
