import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useLayoutEffect, useMemo,  useState  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, styled, Grid,Container, Stack,TextField,Autocomplete,Select, Chip, Typography, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// slice
import { getSPContacts } from '../../redux/slices/customer/contact';
import { getCustomers} from '../../redux/slices/customer/customer';
import { getSites , resetSites } from '../../redux/slices/customer/site';
import machine, { addMachine,   getMachines } from '../../redux/slices/products/machine';
import { getMachinestatuses } from '../../redux/slices/products/statuses';
import { getMachineModels} from '../../redux/slices/products/model';
import { getSuppliers } from '../../redux/slices/products/supplier';
import { getMachineConnections } from '../../redux/slices/products/machineConnections';

import { Cover } from '../components/Cover';

// routes
import { PATH_DASHBOARD, PATH_MACHINE } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {RHFSelect,RHFAutocomplete,RHFTextField,RHFMultiSelect,RHFEditor,RHFUpload,RHFSwitch} from '../../components/hook-form';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
import MachineDashboardNavbar from './util/MachineDashboardNavbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import AddFormButtons from '../components/AddFormButtons';

MachineAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentCustomer: PropTypes.object,
};

export default function MachineAddForm({ isEdit, readOnly, currentCustomer }) {
  const { userId, user } = useAuthContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { spContacts } = useSelector((state) => state.contact);
  const { machines} = useSelector((state) => state.machine);
  const { suppliers} = useSelector((state) => state.supplier);
  const { machineModels} = useSelector((state) => state.machinemodel);
  const { machinestatuses } = useSelector((state) => state.machinestatus);
  const { customers } = useSelector((state) => state.customer);
  const { sites } = useSelector((state) => state.site);
  const { machineConnections } = useSelector((state) => state.machineConnections);
  // console.log("machineConnections : " , machineConnections );
  // console.log("machines : " , machines );

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
  const [machineConnectionVal, setMachineConnectionVal] = useState([]);

  const [chipData, setChipData] = useState([]);

 useLayoutEffect(() => {
  dispatch(getCustomers());
  dispatch(getMachines());
  dispatch(getMachinestatuses());
  dispatch(getMachineModels());
  dispatch(getSuppliers());
  dispatch(getSPContacts());
  dispatch(getMachineConnections());
}, [dispatch]);

useLayoutEffect(() => {
  if(customerVal !== null && customerVal._id !== undefined){
    dispatch(getSites(customerVal._id));
  }
  setInstallVal(null);
  setBillingVal(null);
}, [dispatch, customerVal]);


// useEffect(()=>{
//   setMachSerVal()
//   setMachSerVal(machSerVal?.serialNo);
// },[machineVal])

  const AddMachineSchema = Yup.object().shape({
    serialNo: Yup.string().max(100).required('Serial Number is required'),
    name: Yup.string().max(50),
    // parentMachine: Yup.string(),
    // parentSerialNo: Yup.string(),
    // supplier: Yup.string(),
    // machineModel: Yup.string(),
    // status: Yup.string(),
    workOrderRef: Yup.string().max(50),
    // customer:Yup.string(),
    // instalationSite: Yup.string(),
    // billingSite: Yup.string(),
    // accountManager: Yup.string(),
    // projectManager: Yup.string(),
    // supportManager: Yup.string(),
    siteMilestone: Yup.string().max(1500),
    customerTags: Yup.array(),
    description: Yup.string().max(1500),
    isActive : Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      serialNo: '',
      name: ''  ,
      parentMachine: parMachineVal._id || null,
      parentSerialNo: parMachSerVal?.serialNo || null,
      supplier: supplierVal?._id || null,
      machineModel: modelVal?._id || null,
      connection: [],
      status: statusVal?._id || null,
      workOrderRef: '',
      customer:customerVal._id || null,
      instalationSite: installVal?._id || null,
      billingSite: billingVal?._id || null,
      siteMilestone: '',
      accountManager: accoVal?._id || null,
      projectManager: projVal?._id || null,
      supportManager: suppVal?._id || null,
      customerTags: chipData,
      description: '',
      isActive : true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddMachineSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));
const onSubmit = async (data) => {
  data.parentMachine = parMachineVal?._id || null
  data.parentSerialNo = parMachSerVal?.serialNo || null
  data.supplier = supplierVal?._id || null
  data.machineModel = modelVal?._id || null
  data.status = statusVal?._id || null
  data.customer =customerVal._id || null
  data.instalationSite = installVal?._id || null
  data.billingSite = billingVal?._id || null
  data.accountManager = accoVal?._id || null
  data.projectManager = projVal?._id || null
  data.supportManager = suppVal?._id || null
  // data.customerTags = chipData
  const idsOnly = machineConnectionVal.map(obj => obj._id);
  data.machineConnections = idsOnly
    try{
      await dispatch(addMachine(data));
      setParMachineVal('');
      setParMachSerVal('');
      setSupplierVal('');
      setModelVal('');
      setStatusVal('');
      setCustomerVal('');
      setInstallVal('');
      setBillingVal('');
      setAccoManVal('');
      setProjManVal('');
      setSuppManVal('');
      setMachineConnectionVal("")
      // setChipData([]);
      setCurrTag('');
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_MACHINE.machine.list);
    } catch(error){
      enqueueSnackbar('Saving failed!');
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

  const toggleCancel = () => { navigate(PATH_MACHINE.machine.list); };

  const { themeStretch } = useSettingsContext();

  return (
    <>
     <Container maxWidth={themeStretch ? false : 'xl'}>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ mb: 3, height: 150, position: 'relative', mt: '24px', }} >
          <Cover name='New Machine' icon='material-symbols:list-alt-outline' setting="enable"/>
        </Card>
        <Grid container >
        <Grid item xs={18} md={12} sx={{mt: 3}}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={6}>
            <Box sx={{mb:-3}} rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >
              <RHFTextField name="serialNo" label="Serial No." />
              <RHFTextField name="name" label="Name" />
              <Autocomplete
                // freeSolo
                value={parMachSerVal || null}
                options={machines}
                isOptionEqualToValue={(option, value) => option.serialNo === value.serialNo}
                getOptionLabel={(option) => `${ option.serialNo ? option.serialNo : ""}`}
                id="controllable-states-demo"
                onChange={(event, newValue) => {
                  
                  if(newValue){
                    setParMachineVal(newValue);
                    setParMachSerVal(newValue);
                    setSupplierVal(newValue.supplier);
                    setModelVal(newValue.machineModel);
                  }
                  else{  
                    setParMachineVal("");
                    setParMachSerVal("");           
                    setSupplierVal("");
                    setModelVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{`${ option.serialNo ? option.serialNo : ""}`}</li>)}
                renderInput={(params) => <TextField {...params}  label="Previous Machine Serial No." />}
                ChipProps={{ size: 'small' }}
              />
              <Autocomplete
                // freeSolo
                readOnly
                value={parMachineVal || null}
                options={machines}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => `${option.serialNo ? option.serialNo : ""}`}
                onChange={(event, newValue) => {
                  if(newValue){
                    setParMachineVal(newValue);
                    setParMachSerVal(newValue);
                    setSupplierVal(newValue.supplier);
                    setModelVal(newValue.machineModel);
                  }
                  else{  
                    setParMachineVal("");
                    setParMachSerVal("");           
                    setSupplierVal("");
                    setModelVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{option.serialNo}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="Previous Machine" />}
                ChipProps={{ size: 'small' }}
              />
              
            </Box>
            <Box  rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >
              <Autocomplete
                // freeSolo
                value={supplierVal || null}
                options={suppliers}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => `${option.name ? option.name : ""}`}
                onChange={(event, newValue) => {
                  if(newValue){
                  setSupplierVal(newValue);
                  }
                  else{ 
                  setSupplierVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{`${option.name ? option.name : ""}`}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="Supplier" />}
                ChipProps={{ size: 'small' }}
              />
              
              <Autocomplete
                // freeSolo
                value={modelVal || null}
                options={machineModels}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => `${option.name ? option.name : ""}`}
                onChange={(event, newValue) => {
                  if(newValue){
                  setModelVal(newValue);
                  }
                  else{ 
                  setModelVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{`${option.name ? option.name : ""}`}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="Model" />}
                ChipProps={{ size: 'small' }}
              />
              
              <Autocomplete
                multiple
                name="connection"
                id="tags-outlined"
                value={ machineConnectionVal || null}
                options={machineConnections}
                getOptionLabel={(option) => `${option.name ? option.name : ""}`}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) => option.name === value.name}
                onChange={(event, newValue) => {
                  if(newValue){
                  setMachineConnectionVal(newValue);
                  }
                  else{ 
                  setMachineConnectionVal([]);
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{`${option.name ? option.name : ""}`}</li>)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Connected Machines"
                    placeholder="Search"
                  />
                )}
              />
              
              {/* <Autocomplete
                // freeSolo
                value={ machineConnectionVal || null}
                options={machineConnections}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  if(newValue){
                  setMachineConnectionVal(newValue);
                  }
                  else{ 
                  setMachineConnectionVal("");
                  }
                }}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      label={option.title}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="Machine Connections" />}
                ChipProps={{ size: 'small' }}
              /> */}

              <Autocomplete
                // freeSolo
                value={statusVal || null}
                options={machinestatuses}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => `${option.name ? option.name : ""}`}
                onChange={(event, newValue) => {
                  if(newValue){
                  setStatusVal(newValue);
                  }
                  else{ 
                  setStatusVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{`${option.name ? option.name : ""}`}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="Status" />}
                ChipProps={{ size: 'small' }}
              />
              <RHFTextField name="workOrderRef" label="Work Order/ Purchase Order" />
            </Box>
            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', }}  >
              <Autocomplete sx={{ my:-3}}
                value={customerVal || null}
                options={customers}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => `${option.name ? option.name : ""}`}
                onChange={(event, newValue) => {
                  if(newValue){
                  setCustomerVal(newValue);
                  }
                  else{ 
                  setCustomerVal("");
                  dispatch(resetSites());
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{`${option.name ? option.name : ""}`}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Customer" />}
                ChipProps={{ size: 'small' }}
              />
            </Box>

            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >
            
              <Autocomplete 
                // freeSolo
                value={installVal || null}
                options={sites}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => `${option.name ? option.name : ""}`}
                onChange={(event, newValue) => {
                  if(newValue){
                  setInstallVal(newValue);
                  }
                  else{ 
                  setInstallVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{`${option.name ? option.name : ""}`}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Instalation Site" />}
                ChipProps={{ size: 'small' }}
              />

              <Autocomplete 
                // freeSolo
                sx={{mb:-3}}
                value={billingVal || null}
                options={sites}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => `${option.name ? option.name : ""}`}
                onChange={(event, newValue) => {
                  if(newValue){
                  setBillingVal(newValue);
                  }
                  else{ 
                  setBillingVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{`${option.name ? option.name : ""}`}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Billing Site" />}
                ChipProps={{ size: 'small' }}
              />
              </Box>

              <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', }} sx={{mt:-3}} >
                <RHFTextField name="siteMilestone" label="Nearby Milestone"  multiline sx={{ my:-3}}/>
              </Box>
            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >
              <Autocomplete 
                // freeSolo
                value={accoVal || null}
                options={spContacts}
                isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                getOptionLabel={(option) => `${option.firstName ? option.firstName : ""} ${option.lastName  ? option.lastName :""}`}
                onChange={(event, newValue) => {
                  if(newValue){
                  setAccoManVal(newValue);
                  }
                  else{ 
                  setAccoManVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{`${option.firstName ? option.firstName : ""} ${option.lastName  ? option.lastName :""}`}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Account Manager" />}
                ChipProps={{ size: 'small' }}
              />
              <Autocomplete 
                // freeSolo
                value={projVal || null}
                options={spContacts}
                isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                getOptionLabel={(option) => `${option.firstName ? option.firstName : ""} ${option.lastName  ? option.lastName :""}`}
                onChange={(event, newValue) => {
                  if(newValue){
                  setProjManVal(newValue);
                  }
                  else{ 
                  setProjManVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{`${option.firstName ? option.firstName : ""} ${option.lastName  ? option.lastName :""}`}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Project Manager" />}
                ChipProps={{ size: 'small' }}
              />
              <Autocomplete 
                // freeSolo
                value={suppVal || null}
                options={spContacts}
                isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                getOptionLabel={(option) => `${option.firstName ? option.firstName : ""} ${option.lastName  ? option.lastName :""}`}
                onChange={(event, newValue) => {
                  if(newValue){
                  setSuppManVal(newValue);
                  }
                  else{ 
                  setSuppManVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{`${option.firstName ? option.firstName : ""} ${option.lastName  ? option.lastName :""}`}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Support Manager" />}
                ChipProps={{ size: 'small' }}
              />
            
              </Box>
              <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', }} sx={{ mb:-3}} >
                <RHFTextField name="description" label="Description" minRows={8} multiline sx={{ mt:-3}}/>
              </Box>
                {/* -------------------------start add chips------------------------- */}
                {/* <RHFTextField name="tags" sx={{mb:-3}} label="Tags"  value={currTag} onChange={handleChange} onKeyDown={handleKeyPress}/> */}

                {/* <Card 
                      sx={{ di  splay: 'flex', borderColor:'light gray', borderWidth:'1px', boxShadow:'none', borderRadius:'7px', flexWrap: 'wrap', listStyle: 'none', p: 0.7, m: 0, mt:-3, }} component="ul" variant='outlined' >
                      {chipDat  a.map((data,index) => 
                          <Lis  tItem key={index}>
                            <C  hip
                                label={data}
                                onDelete={()=>handleDelete(data,index)}
                            />  
                          </Li  stItem>
                       )} 
                       <TextFi  eld name="tag" sx={{p:1}}   variant="standard"  
                        InputP  rops={{disableUnderline: true,}} 
                        placeholder='Tags...'   value={currTag} onChange={handleChange} onKeyDown={handleKeyPress}/>
                    </Card>
                <RHFSwitch
                sx={{mt:-3}}
                  name="isActive"
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}>
                        Active
                      </Typography>
                    </>
                  } 
                /> */}
                {/* -------------------------end add chips------------------------- */}
              <RHFSwitch
                sx={{my:-3}}
                  name="isActive"
                  labelPlacement="start"
                  label={
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}>
                        Active
                      </Typography>
                  } 
                />
              </Stack>

            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
            </Card>
          </Grid>
        </Grid>
    </FormProvider>
    </Container>
    </>
  );
}
