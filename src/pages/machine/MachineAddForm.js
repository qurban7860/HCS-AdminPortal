import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
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
  Grid,
  Container,
  Stack,
  TextField,
  Autocomplete,
  Typography,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { MuiChipsInput } from 'mui-chips-input';
// slice
import { getSPContacts } from '../../redux/slices/customer/contact';
import { getActiveCustomers } from '../../redux/slices/customer/customer';
import { getActiveSites, resetSites, resetActiveSites } from '../../redux/slices/customer/site';
import machine, { addMachine, getActiveMachines } from '../../redux/slices/products/machine';
import { getActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { getActiveMachineModels } from '../../redux/slices/products/model';
import { getSuppliers, getActiveSuppliers } from '../../redux/slices/products/supplier';
import { getMachineConnections, resetMachineConnections } from '../../redux/slices/products/machineConnections';
import { Cover } from '../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';

// routes
import { PATH_MACHINE } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../components/hook-form';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
import { useSettingsContext } from '../../components/settings';
import AddFormButtons from '../components/DocumentForms/AddFormButtons';
import ToggleButtons from '../components/DocumentForms/ToggleButtons';
import { FORMLABELS } from '../../constants/default-constants';

MachineAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentCustomer: PropTypes.object,
};

export default function MachineAddForm({ isEdit, readOnly, currentCustomer }) {
  const { userId, user } = useAuthContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMachines } = useSelector((state) => state.machine);
  const { activeSuppliers } = useSelector((state) => state.supplier);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCustomers } = useSelector((state) => state.customer);
  const { activeSites } = useSelector((state) => state.site);
  const { activeMachineStatuses } = useSelector((state) => state.machinestatus);
  const { spContacts } = useSelector((state) => state.contact);
  const { machineConnections } = useSelector((state) => state.machineConnections);

  const { enqueueSnackbar } = useSnackbar();
  const [parMachineVal, setParMachineVal] = useState('');
  const [parMachSerVal, setParMachSerVal] = useState('');
  const [supplierVal, setSupplierVal] = useState('');
  const [statusVal, setStatusVal] = useState('');
  const [modelVal, setModelVal] = useState('');
  const [customerVal, setCustomerVal] = useState('');
  const [installVal, setInstallVal] = useState('');
  const [billingVal, setBillingVal] = useState('');
  const [accoVal, setAccoManVal] = useState('');
  const [projVal, setProjManVal] = useState('');
  const [suppVal, setSuppManVal] = useState('');
  const [currTag, setCurrTag] = useState('');
  const [shippingDate, setShippingDate] = useState(null);
  const [installationDate, setInstallationDate] = useState(null);
  const [disableInstallationDate, setInstallationDateToggle] = useState(true);
  const [disableShippingDate, setShippingDateToggle] = useState(true);

  const [chipData, setChipData] = useState([]);
  const [chips, setChips] = useState([]);


  useLayoutEffect(() => {
    dispatch(getActiveCustomers());
    dispatch(getActiveMachines());
    dispatch(getActiveMachineModels());
    dispatch(getActiveSuppliers());
    dispatch(getActiveMachineStatuses());
    dispatch(getSPContacts());
  }, [dispatch]);


  const AddMachineSchema = Yup.object().shape({
    serialNo: Yup.string().max(6).required('Serial Number is required').nullable(),
    name: Yup.string().max(40),
    parentSerialNo: Yup.object().shape({
      serialNo: Yup.string()
    }).nullable(),
    previousMachine: Yup.string(),
    supplier: Yup.object().shape({
      serialNo: Yup.string()
    }).nullable(),
    model: Yup.object().shape({
      name: Yup.string()
    }).nullable(),
    customer: Yup.object().shape({
      name: Yup.string()
    }).nullable().required("Customer Is Required!"),
    status: Yup.object().shape({
      name: Yup.string()
    }).nullable(),
    workOrderRef: Yup.string().max(50),
    // installationDate: Yup.date().nullable(),
    // shippingDate: Yup.date().nullable(),
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
      serialNo: '',
      name: '',
      parentSerialNo: null,
      previousMachine: '',
      supplier: null,
      model: null,
      customer: null,
      machineConnectionVal: [],
      connection: [],
      status: null,
      workOrderRef: '',
      instalationSite: null,
      billingSite: null,
      // installationDate: null,
      // shippingDate: null,
      siteMilestone: '',
      accountManager: null,
      projectManager: null,
      supportManager: null,
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
  } = methods

  const {
    serialNo,
    name,
    previousMachine,
    parentSerialNo,
    supplier,
    model,
    status,
    connection,
    workOrderRef,
    customer,
    instalationSite,
    billingSite,
    machineConnectionVal,
    // installationDate,
    // shippingDate,
    siteMilestone,
    accountManager,
    projectManager,
    supportManager,
    customerTags,
    description,
    isActive,
  } = watch();

  useEffect(() => {
    if (customer !== null && customer._id !== undefined) {
      dispatch(getActiveSites(customer._id));
  dispatch(getMachineConnections(customer._id));
    }
    setInstallVal(null);
    setBillingVal(null);
  }, [dispatch, customer]);

  const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));
  const onSubmit = async (data) => {
    console.log("data : " , data)

    if (chips && chips.length > 0) {
      data.alias = chips;
    }

    data.installationDate = installationDate;
    data.shippingDate = shippingDate;

    try {
      await dispatch(addMachine(data));

      // setChipData([]);
      // setCurrTag('');
      setShippingDate(null);
      setInstallationDate(null);
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_MACHINE.machines.list);
    } catch (error) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(error);
    }
  };

  // const handleDelete = (data,index) => {
  //   const arr = [...chipData]
  //   arr.splice(index,1)
  //   setChipData(arr)
  // };

  // const handleKeyPress = (e) => {
  //   setCurrTag(currTag.trim())
  //   if (e.keyCode === 13 || e.key === 'Enter') {
  //     e.preventDefault();
  //     if(currTag.trim().length > 0){
  //       currTag.trim();
  //       setChipData((oldState) => [...oldState, currTag.trim()]);
  //       setCurrTag('')
  //     }
  //   }
  // };

  const handleChange = (e) => {
    setCurrTag(e.target.value);
  };

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.list);
  };
  const handleChipChange = (newChips) => {
    setChips(newChips);
  };
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <StyledCardContainer>
          <Cover name="New Machine" icon="material-symbols:list-alt-outline" setting="enable" />
        </StyledCardContainer>
        <Grid container>
          <Grid item xs={18} md={12} sx={{ mt: 3 }}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >

                {/* -------------------------- Machine Serial No -------------------------------------- */}

                  <RHFTextField name="serialNo" label="Serial No.*"  />

                {/* -------------------------- Machine Name -------------------------------------- */}

                  <RHFTextField name="name" label="Name" />

                </Box>

                {/* -------------------------- Alias -------------------------------------- */}

                  <MuiChipsInput label="Alias" value={chips} onChange={handleChipChange} />

                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >

                {/* -------------------------- Parent Machines Serial No -------------------------------------- */}
                  
                  <Controller
                    name="parentSerialNo"
                    clearOnBlur 
                    clearOnEscape 
                    control={control}
                    defaultValue={parentSerialNo || null}
                    render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        options={activeMachines}
                        isOptionEqualToValue={(option, value) =>
                          option.serialNo === value.serialNo && option.isActive === true
                        }
                        getOptionLabel={(option) => `${option?.serialNo ? option?.serialNo : ''} ${option?.name ? '-' : ''} ${option?.name ? option?.name : ''}`}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            field.onChange(newValue);
                            setValue('previousMachine', `${newValue.serialNo} ${newValue?.name ? '-' : ''} ${newValue?.name ? newValue?.name : ''}`);
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
                  />

                {/* ------------------------- Previous Machine Name --------------------------------------- */}

                <RHFTextField name="previousMachine" label="Previous Machine" disabled/>

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
                        isOptionEqualToValue={(option, value) => option.name === value.name}
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

                    {/* -------------------------------- Machine Model -------------------------------- */}

                    <Controller
                    name="model"
                    control={control}
                    defaultValue={supplier || null}
                    render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        disabled={!!parentSerialNo?.machineModel}
                        id="controllable-states-demo"
                        options={activeMachineModels}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                        )}
                        onChange={(event, value) => field.onChange(value)}
                        renderInput={(params) => (
                          <TextField 
                          {...params} 
                          name="model"
                          id="model"
                          label="Model"  
                          error={!!error}
                          helperText={error?.message} 
                          inputRef={ref} 
                          />
                        )}
                        ChipProps={{ size: 'small' }}
                      />
                    )}
                  />

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
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                        )}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            field.onChange(newValue);
                            if(customer._id !== newValue._id) {
                              setValue('machineConnectionVal', []);
                              setValue('instalationSite', []);
                              setValue('billingSite', []);
                            }
                          } else {
                            field.onChange(null);
                            setValue('machineConnectionVal', []);
                            setValue('instalationSite', []);
                            setValue('billingSite', []);
                            dispatch(resetMachineConnections());
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

                    {/* -------------------------------- Machine Connections -------------------------------- */}

                <Controller
                  name="machineConnectionVal"
                  control={control}
                  defaultValue={ machineConnectionVal || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    {...field}
                    name="machineConnectionVal"
                    id="tags-outlined"
                    options={machineConnections}
                    getOptionLabel={(option) => `${option.serialNo ? option.serialNo : ''} ${option.name ? '-' : ''} ${option.name ? option.name : ''}`}
                    filterSelectedOptions
                    isOptionEqualToValue={(option, value) => option.serialNo === value.serialNo}
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

                    {/* -------------------------------- Statuses -------------------------------- */}

                <Controller
                  name="status"
                  control={control}
                  defaultValue={status || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    options={activeMachineStatuses}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
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

                    {/* -------------------------------- Work Order/ Purchase Order -------------------------------- */}

                  <RHFTextField name="workOrderRef" label="Work Order/ Purchase Order" />

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
                    isOptionEqualToValue={(option, value) => option.name === value.name}
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
                    isOptionEqualToValue={(option, value) => option.name === value.name}
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

                    {/* -------------------------------- Installation Date -------------------------------- */}

                    <DatePicker
                    label="Installation Date"
                    value={installationDate}
                    // disabled={disableInstallationDate}
                    onChange={(newValue) => setInstallationDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                 
                {/* <Controller
                  name="installationDate"
                  control={control}
                  defaultValue={installationDate || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Installation Date"
                    value={installationDate}
                    // disabled={disableInstallationDate}
                    onChange={(event, value) => field.onChange(value)}
                    renderInput={(params) => <TextField 
                    {...params} 
                    name="installationDate"
                    id="installationDate"     
                    error={!!error}
                    helperText={error?.message} 
                    type="search"
                    inputRef={ref}
                    />}
                  />
                  )}
                /> */}

                    {/* -------------------------------- Shipping Date -------------------------------- */}
                    
                    <DatePicker
                    label="Shipping Date"
                    value={shippingDate}
                    // disabled={disableShippingDate}
                    onChange={(newValue) => setShippingDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                {/* <Controller
                  name="shippingDate"
                  control={control}
                  defaultValue={shippingDate || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <DatePicker
                    label="Shipping Date"
                    value={shippingDate}
                    // disabled={disableShippingDate}
                    onChange={(event, value) => field.onChange(value)}
                    renderInput={(params) => <TextField 
                    {...params} 
                      name="shippingDate"
                    />}
                  />
                  )}
                /> */}
                </Box>

                {/* -------------------------------- Nearby Milestone -------------------------------- */}

                  <RHFTextField name="siteMilestone" label="Nearby Milestone" multiline />

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
                </Box>

                {/* -------------------------------- Description -------------------------------- */}

                  <RHFTextField name="description" label="Description" minRows={8} multiline />

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
