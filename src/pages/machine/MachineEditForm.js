import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, TextField, Autocomplete, Typography } from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input';
import { DatePicker } from '@mui/x-date-pickers';
// hook
import { useForm } from 'react-hook-form';
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_MACHINE } from '../../routes/paths';
// slice
import { getSPContacts } from '../../redux/slices/customer/contact';
import { getCustomers, getActiveCustomers } from '../../redux/slices/customer/customer';
import { getSites, getActiveSites } from '../../redux/slices/customer/site';
import { getMachinestatuses, getActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { getMachineModels, getActiveMachineModels } from '../../redux/slices/products/model';
import { getSuppliers, getActiveSuppliers } from '../../redux/slices/products/supplier';
// global
import { CONFIG } from '../../config-global';
// slice
import {
  getActiveMachines,
  updateMachine,
  setMachineEditFormVisibility,
  setTransferMachineFlag,
} from '../../redux/slices/products/machine';
import { getMachineConnections } from '../../redux/slices/products/machineConnections';
// hooks
import { useSnackbar } from '../../components/snackbar';
// components
import FormProvider, { RHFTextField, RHFSwitch } from '../../components/hook-form';
import AddFormButtons from '../components/DocumentForms/AddFormButtons';
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
import BreadcrumbsProvider from '../components/Breadcrumbs/BreadcrumbsProvider';
import ToggleButtons from '../components/DocumentForms/ToggleButtons';
// styles
import { ListItem } from '../../theme/styles/default-styles';
// schema
import { EditMachineSchema } from '../schemas/machine';
// constants
import { BREADCRUMBS, FORMLABELS } from '../../constants/default-constants';

// ----------------------------------------------------------------------

export default function MachineEditForm() {
  const { users } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { activeMachines, machine } = useSelector((state) => state.machine);
  const { activeSuppliers } = useSelector((state) => state.supplier);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCustomers } = useSelector((state) => state.customer);
  const { activeSites } = useSelector((state) => state.site);
  const { activeMachineStatuses } = useSelector((state) => state.machinestatus);
  const { spContacts } = useSelector((state) => state.contact);
  const { machineConnections } = useSelector((state) => state.machineConnections);
  const [parMachineVal, setParMachineVal] = useState('');
  const [parMachSerVal, setParMachSerVal] = useState('');
  const [supplierVal, setSupplierVal] = useState('');
  const [statusVal, setStatusVal] = useState('');
  const [modelVal, setModelVal] = useState('');
  const [customerVal, setCustomerVal] = useState('');
  const [installVal, setInstallVal] = useState('');
  const [billingVal, setBillingVal] = useState('');
  const [shippingDate, setShippingDate] = useState(null);
  const [installationDate, setInstallationDate] = useState(null);
  const [disableInstallationDate, setInstallationDateToggle] = useState(true);
  const [disableShippingDate, setShippingDateToggle] = useState(true);
  const [accoVal, setAccoManVal] = useState('');
  const [projVal, setProjManVal] = useState('');
  const [suppVal, setSuppManVal] = useState('');
  const [currTag, setCurrTag] = useState('');
  const [chipData, setChipData] = useState([]);
  const [machineConnectionVal, setMachineConnectionVal] = useState([]);
  const [connections, setConnections] = useState([]);
  const [chips, setChips] = useState([]);
  const isMobile = useResponsive('sm', 'down');

  const defaultValues = useMemo(
    () => ({
      id: machine?._id || '',
      serialNo: machine?.serialNo || '',
      name: machine?.name || '',
      parentMachine: parMachineVal?._id || null,
      parentSerialNo: parMachSerVal?.serialNo || null,
      supplier: supplierVal?._id || null,
      machineModel: modelVal?._id || null,
      status: statusVal?._id || null,
      workOrderRef: machine?.workOrderRef || '',
      customer: customerVal?._id || null,
      instalationSite: installVal?._id || null,
      billingSite: billingVal?._id || null,
      siteMilestone: machine?.siteMilestone || '',
      installationDate,
      shippingDate,
      accountManager: accoVal?._id || null,
      projectManager: projVal?._id || null,
      supportManager: suppVal?._id || null,
      description: machine?.description || '',
      customerTags: chipData,
      isActive: machine?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(EditMachineSchema),
    defaultValues,
  });
  
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useLayoutEffect(() => {
    dispatch(getActiveCustomers());
    dispatch(getActiveMachines());
    dispatch(getActiveMachineModels());
    dispatch(getActiveSuppliers());
    dispatch(getActiveMachineStatuses());
    dispatch(getSPContacts());
    dispatch(getMachineConnections());
    setChips(machine?.alias);
    setParMachineVal(machine?.parentMachine);
    setParMachSerVal(machine?.parentMachine);
    setStatusVal(machine?.status);
    setModelVal(machine?.machineModel);
    setSupplierVal(machine?.supplier);
    setCustomerVal(machine?.customer);
    setInstallVal(machine?.instalationSite);
    setBillingVal(machine?.billingSite);
    setChipData(machine?.customerTags);
    setAccoManVal(machine?.accountManager);
    setProjManVal(machine?.projectManager);
    setSuppManVal(machine?.supportManager);
    setMachineConnectionVal(machine?.machineConnections);
    setConnections(machine?.machineConnections);
    // if(machine?.instalationSite){
    //   setInstallationDateToggle(false);
    //   setShippingDateToggle(false);
    // }
    setInstallationDate(machine?.installationDate);
    setShippingDate(machine?.shippingDate);
  }, [dispatch, machine]);

  useLayoutEffect(() => {
    if (customerVal !== null && customerVal?.id !== '') {
      dispatch(getActiveSites(customerVal?._id));
    }
    //   setInstallVal(null);
    //   setBillingVal(null);
  }, [dispatch, customerVal]);

  useEffect(() => {
    if (machine) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machine]);

  const toggleCancel = () => {
    dispatch(setMachineEditFormVisibility(false));
    dispatch(setTransferMachineFlag(false));
  };

  const onSubmit = async (data) => {
    // console.log('installationDate------->', installationDate);
    // console.log('shippingDate------->', shippingDate);
    if (chips && chips.length > 0) {
      data.alias = chips;
    }
    // data.parentMachine = parMachineVal?._id || null;
    // data.parentSerialNo = parMachSerVal?.serialNo || null;
    // data.customerTags = chipData

    data.supplier = supplierVal?._id || null;
    data.machineModel = modelVal?._id || null;
    data.status = statusVal?._id || null;
    data.customer = customerVal?._id || null;
    data.instalationSite = installVal?._id || null;
    data.billingSite = billingVal?._id || null;
    data.accountManager = accoVal?._id || null;
    data.projectManager = projVal?._id || null;
    data.supportManager = suppVal?._id || null;
    data.installationDate = installationDate;
    data.shippingDate = shippingDate;
    const idsOnly = machineConnectionVal.map((obj) => obj._id);
    data.machineConnections = idsOnly;
    try {
      await dispatch(updateMachine(data));
      enqueueSnackbar('Update success!');
      // setParMachineVal('');
      // setParMachSerVal('');
      setSupplierVal('');
      setModelVal('');
      setStatusVal('');
      setCustomerVal('');
      setInstallVal('');
      setBillingVal('');
      setAccoManVal('');
      setProjManVal('');
      setSuppManVal('');
      setChipData([]);
      setCurrTag('');
      setMachineConnectionVal([]);
      setShippingDate(null);
      setInstallationDate(null);
      reset();
    } catch (error) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(error);
    }
  };

  // ----------------------handle functions----------------------
  const handleDelete = (data, index) => {
    const arr = [...chipData];
    arr.splice(index, 1);
    setChipData(arr);
  };

  const handleKeyPress = (e) => {
    setCurrTag(currTag.trim());
    if (e.keyCode === 13 || e.key === 'Enter') {
      e.preventDefault();
      if (currTag.trim().length > 0) {
        currTag.trim();
        setChipData((oldState) => [...oldState, currTag.trim()]);
        setCurrTag('');
      }
    }
  };

  const handleChange = (e) => {
    setCurrTag(e.target.value);
  };

  const handleChipChange = (newChips) => {
    setChips(newChips);
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
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <RHFTextField name="serialNo" label="Serial No." disabled />
                  <RHFTextField name="name" label="Name" />
                </Box>
                <MuiChipsInput label="Alias" value={chips} onChange={handleChipChange} />
                {/* <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
              >

                <Autocomplete
                  // freeSolo
                  value={parMachSerVal || null}
                  options={activeMachines.filter(option => option.serialNo !== machine.serialNo)}
                  getOptionLabel={(option) => `${option.serialNo ? option.serialNo : ''}`}
                  isOptionEqualToValue={(option, value) => option.serialNo === value.serialNo}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setParMachineVal(newValue);
                      setParMachSerVal(newValue);
                      // setSupplierVal(newValue.supplier);
                      // setModelVal(newValue.machineModel);
                    } else {
                      setParMachineVal('');
                      setParMachSerVal('');
                      // setSupplierVal("");
                      // setModelVal("");
                    }
                  }}
                  id="controllable-states-demo"
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option._id}>{`${
                      option.serialNo ? option.serialNo : ''
                    }`}</Box>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="Previous Machine Serial No." />
                  )}
                  ChipProps={{ size: 'small' }}
                />

                <Autocomplete
                  // freeSolo
                  disabled
                  disablePortal
                  id="combo-box-demo"
                  value={parMachineVal || null}
                  options={activeMachines}
                  isOptionEqualToValue={(option, value) => option?.name === value.name}
                  getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                  onChange={(event, newValue) => {
                    if (newValue !== null) {
                      // setParMachineVal(newValue);
                      // setParMachSerVal(newValue);
                      // setSupplierVal(newValue.supplier);
                      // setModelVal(newValue.machineModel);
                    } else {
                      // setParMachineVal("");
                      // setParMachSerVal("");
                      // setSupplierVal("");
                      // setModelVal("");
                    }
                  }}
                  // id="controllable-states-demo"
                  renderOption={(props, option) => (
                    <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Previous Machine"
                      sx={{
                        '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000000' },
                      }}
                    />
                  )}
                  ChipProps={{ size: 'small' }}
                />
              </Box> */}
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <Autocomplete
                    // freeSolo
                    value={supplierVal || null}
                    options={activeSuppliers}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setSupplierVal(newValue);
                      } else {
                        setSupplierVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Supplier" />}
                    ChipProps={{ size: 'small' }}
                  />

                  <Autocomplete
                    // freeSolo
                    disabled={!!machine.machineModel}
                    value={modelVal || null}
                    options={activeMachineModels}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setModelVal(newValue);
                      } else {
                        setModelVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Model" />}
                    ChipProps={{ size: 'small' }}
                  />

                  <Autocomplete
                    multiple
                    name="connection"
                    id="tags-outlined"
                    value={machineConnectionVal || null}
                    options={machineConnections}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    filterSelectedOptions
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setMachineConnectionVal(newValue);
                      } else {
                        setMachineConnectionVal([]);
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Connected Machines" placeholder="Search" />
                    )}
                  />

                  <Autocomplete
                    // freeSolo
                    value={statusVal || null}
                    options={activeMachineStatuses}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    getOptionDisabled={(option) =>
                      option.slug === 'intransfer' || option.slug === 'transferred'
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setStatusVal(newValue);
                      } else {
                        setStatusVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Status" />}
                    ChipProps={{ size: 'small' }}
                  />
                  <RHFTextField name="workOrderRef" label="Work Order/ Purchase Order" />
                </Box>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
                >
                  <Autocomplete
                    value={customerVal || null}
                    options={activeCustomers}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setCustomerVal(newValue);
                        setStatusVal('');
                      } else {
                        setCustomerVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Customer" />}
                    ChipProps={{ size: 'small' }}
                  />
                </Box>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <Autocomplete
                    // freeSolo
                    value={installVal || null}
                    options={activeSites}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setInstallVal(newValue);
                        // setInstallationDateToggle(false);
                        // setShippingDateToggle(false);
                      } else {
                        setInstallVal('');
                        // setInstallationDateToggle(true);
                        // setShippingDateToggle(true);
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Installation Site" />}
                    ChipProps={{ size: 'small' }}
                  />
                  <Autocomplete
                    // freeSolo
                    value={billingVal || null}
                    options={activeSites}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setBillingVal(newValue);
                      } else {
                        setBillingVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Billing Site" />}
                    ChipProps={{ size: 'small' }}
                  />
                </Box>

                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <DatePicker
                    label="Installation Date"
                    value={installationDate}
                    // disabled={disableInstallationDate}
                    onChange={(newValue) => setInstallationDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <DatePicker
                    label="Shipping Date"
                    value={shippingDate}
                    // disabled={disableShippingDate}
                    onChange={(newValue) => setShippingDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>

                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
                >
                  <RHFTextField name="siteMilestone" label="Nearby Milestone" multiline />
                </Box>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <Autocomplete
                    // freeSolo
                    value={accoVal || null}
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) =>
                      `${option.firstName ? option.firstName : ''} ${
                        option.lastName ? option.lastName : ''
                      }`
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setAccoManVal(newValue);
                      } else {
                        setAccoManVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${
                        option.firstName ? option.firstName : ''
                      } ${option.lastName ? option.lastName : ''}`}</li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Account Manager" />}
                    ChipProps={{ size: 'small' }}
                  />
                  <Autocomplete
                    // freeSolo
                    value={projVal || null}
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) =>
                      `${option.firstName ? option.firstName : ''} ${
                        option.lastName ? option.lastName : ''
                      }`
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setProjManVal(newValue);
                      } else {
                        setProjManVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${
                        option.firstName ? option.firstName : ''
                      } ${option.lastName ? option.lastName : ''}`}</li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Project Manager" />}
                    ChipProps={{ size: 'small' }}
                  />
                  <Autocomplete
                    // freeSolo
                    value={suppVal || null}
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) =>
                      `${option.firstName ? option.firstName : ''} ${
                        option.lastName ? option.lastName : ''
                      }`
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setSuppManVal(newValue);
                      } else {
                        setSuppManVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${
                        option.firstName ? option.firstName : ''
                      } ${option.lastName ? option.lastName : ''}`}</li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Support Manager" />}
                    ChipProps={{ size: 'small' }}
                  />
                </Box>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
                >
                  <RHFTextField name="description" label="Description" minRows={8} multiline />
                </Box>
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
