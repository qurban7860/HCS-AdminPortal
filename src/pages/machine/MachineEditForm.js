import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box,Button, Card, styled, Grid,Container, Stack,TextField,Autocomplete,Select, Chip, Typography, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// slice
import { getSPContacts } from '../../redux/slices/customer/contact';
import { getCustomers} from '../../redux/slices/customer/customer';
import { getSites } from '../../redux/slices/customer/site';
import { getMachinestatuses } from '../../redux/slices/products/statuses';
import { getMachinemodels} from '../../redux/slices/products/model';
import { getSuppliers } from '../../redux/slices/products/supplier';
// global
import { CONFIG } from '../../config-global';
// slice
import { getMachines,updateMachine, getMachine, setMachineEditFormVisibility } from '../../redux/slices/products/machine';
// import { getContacts } from '../../redux/slices/customer/contact';
// import { getSites } from '../../redux/slices/customer/site';


// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import Iconify from '../../components/iconify';

import FormProvider, {
  RHFSelect,
  RHFMultiSelect,
  RHFTextField,
  RHFSwitch
} from '../../components/hook-form';


// ----------------------------------------------------------------------


export default function MachineEditForm() {

  const { machine } = useSelector((state) => state.machine);
  const { users } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { spContacts } = useSelector((state) => state.contact);
  const { machines} = useSelector((state) => state.machine);
  const { suppliers} = useSelector((state) => state.supplier);
  const { machinemodels} = useSelector((state) => state.machinemodel);
  const { machinestatuses } = useSelector((state) => state.machinestatus);
  const { customers } = useSelector((state) => state.customer);
  const { sites} = useSelector((state) => state.site);
// console.log("machine Edit machine?.isDisabled : ",machine?.isDisabled)
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
  const [chipData, setChipData] = useState([]);

 useLayoutEffect(() => {
  dispatch(getCustomers());
  dispatch(getMachines());
  dispatch(getMachinestatuses());
  dispatch(getMachinemodels());
  dispatch(getSuppliers());
  dispatch(getSPContacts());

  setParMachineVal(machine.parentMachine);
  setParMachSerVal(machine.parentMachine);
  setStatusVal(machine.status)
  setModelVal(machine.machineModel)
  setSupplierVal(machine.supplier)
  setCustomerVal(machine.customer)
  setInstallVal(machine.instalationSite)
  setBillingVal(machine.billingSite)
  setChipData(machine.customerTags)
  setAccoManVal(machine.accountManager);
  setProjManVal(machine.projectManager);
  setSuppManVal(machine.supportManager);
}, [dispatch , machine]);

useLayoutEffect(() => {
  if(customerVal !== null && customerVal?.id !== ''){
    dispatch(getSites(customerVal?._id));
  }
//   setInstallVal(null);
//   setBillingVal(null);
}, [dispatch, customerVal]);

  const EditMachineSchema = Yup.object().shape({
    serialNo: Yup.string().required('Serial Number is required').max(100),
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
    description: Yup.string().max(1500),
    customerTags: Yup.array(),
    isActive : Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      id: machine?._id || '',
      serialNo: machine?.serialNo || '',
      name: machine?.name || '',
      parentMachine: parMachineVal?._id || null,
      parentSerialNo: parMachSerVal?.serialNo  || null,
      supplier: supplierVal?._id  || null,
      machineModel: modelVal?._id  || null,
      status: statusVal?._id  || null,
      workOrderRef: machine?.workOrderRef || '',
      customer:customerVal?._id  || null,
      instalationSite: installVal?._id  || null,
      billingSite: billingVal?._id || null,
      siteMilestone: machine?.siteMilestone || '',
      accountManager: accoVal?._id || null,
      projectManager: projVal?._id || null,
      supportManager: suppVal?._id || null,
      description: machine?.description || '',
      customerTags: chipData,
      isActive : machine?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
// console.log("default values of edits : ",defaultValues)
  const methods = useForm({
    resolver: yupResolver(EditMachineSchema),
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



  useEffect(() => {
    if (machine) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machine]);

  const toggleCancel = () => 
    {
      dispatch(setMachineEditFormVisibility(false));
    };

const onSubmit = async (data) => {
  data.parentMachine = parMachineVal?._id || null
  data.parentSerialNo = parMachSerVal?.serialNo || null
  data.supplier = supplierVal?._id || null
  data.machineModel = modelVal?._id || null
  data.status = statusVal?._id || null
  data.customer =customerVal?._id || null
  data.instalationSite = installVal?._id || null
  data.billingSite = billingVal?._id || null
  data.accountManager = accoVal?._id || null
  data.projectManager = projVal?._id || null
  data.supportManager = suppVal?._id || null
  // data.customerTags = chipData
    try{
      await dispatch(updateMachine(data));
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
      setChipData([]);
      setCurrTag('');
      reset();
      enqueueSnackbar('Update success!');
    } catch(error){
      enqueueSnackbar('Saving failed!');
      console.error(error);
    }
};

const handleDelete = (data,index) => {
  const arr = [...chipData]
  arr.splice(index,1)
  setChipData(arr)
};

const handleKeyPress = (e) => {
  setCurrTag(currTag.trim())
  if (e.keyCode === 13 || e.key === 'Enter') {
    e.preventDefault();
    if(currTag.trim().length > 0){
      currTag.trim();
      setChipData((oldState) => [...oldState, currTag.trim()]);
      setCurrTag('')
    }
  }
};

  const handleChange = (e) => {
		setCurrTag(e.target.value);
  };


//   const toggleCancel = () => 
//     {
//       dispatch(setMachineEditFormVisibility(false));
//     };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
          <Stack spacing={6}>
            <Box sx={{mb:-3}} rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >
              <RHFTextField name="serialNo" label="Serial No." />
              <RHFTextField name="name" label="Name" />

              <Autocomplete
                // freeSolo
                value={parMachSerVal || null}
                options={machines}
                getOptionLabel={(option) => option.serialNo}
                isOptionEqualToValue={(option, value) => option.serialNo === value.serialNo}
                onChange={(event, newValue) => {
                  if(newValue){
                    setParMachineVal(newValue);
                    setParMachSerVal(newValue);
                    // setSupplierVal(newValue.supplier);
                    // setModelVal(newValue.machineModel);
                  }
                  else{          
                    setParMachineVal("");
                    setParMachSerVal("");
                    // setSupplierVal("");
                    // setModelVal("");
                  }
                }}
                id="controllable-states-demo"
                renderOption={(props, option) => (<Box component="li" {...props} key={option.id}>{option.serialNo}</Box>)}
                renderInput={(params) => <TextField {...params}  label="Previous Machine Serial No." />}
                ChipProps={{ size: 'small' }}
              />

              <Autocomplete
                // freeSolo
                disabled
                disablePortal
                id="combo-box-demo"
                value={parMachineVal || null}
                options={machines}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                 
                onChange={(event, newValue) => {
                  if(newValue !== null){
                    // setParMachineVal(newValue);
                    // setParMachSerVal(newValue);
                    // setSupplierVal(newValue.supplier);
                    // setModelVal(newValue.machineModel);
                  }
                  else{          
                    // setParMachineVal("");
                    // setParMachSerVal("");
                    // setSupplierVal("");
                    // setModelVal("");
                  }
                }}
                // id="controllable-states-demo"
                renderOption={(props, option) => (<li  {...props} key={option.id}>{option.name}</li>)}
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
                getOptionLabel={(option) => option.name}
                 
                onChange={(event, newValue) => {
                if(newValue){
                  setSupplierVal(newValue);
                  }
                  else{ 
                  setSupplierVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option.id}>{option.name}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="Supplier" />}
                ChipProps={{ size: 'small' }}
              />
              
              <Autocomplete
                // freeSolo
                value={modelVal || null}
                options={machinemodels}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                 
                onChange={(event, newValue) => {
                  if(newValue){
                  setModelVal(newValue);
                  }
                  else{ 
                  setModelVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option.id}>{option.name}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="Model" />}
                ChipProps={{ size: 'small' }}
              />
              
              <Autocomplete
                // freeSolo
                value={statusVal || null}
                options={machinestatuses}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                 
                onChange={(event, newValue) => {
                  if(newValue){
                  setStatusVal(newValue);
                  }
                  else{ 
                  setStatusVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option.id}>{option.name}</li>)}
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
                getOptionLabel={(option) => option.name}
                 
                onChange={(event, newValue) => {
                  if(newValue){
                  setCustomerVal(newValue);
                  }
                  else{ 
                  setCustomerVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option.id}>{option.name}</li>)}
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
                getOptionLabel={(option) => option.name}
                 
                onChange={(event, newValue) => {
                  if(newValue){
                  setInstallVal(newValue);
                  }
                  else{ 
                  setInstallVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option.id}>{option.name}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Instalation Site" />}
                ChipProps={{ size: 'small' }}
              />
              <Autocomplete 
                // freeSolo
                value={billingVal || null}
                options={sites}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                 
                onChange={(event, newValue) => {
                  if(newValue){
                  setBillingVal(newValue);
                  }
                  else{ 
                  setBillingVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option.id}>{option.name}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Billing Site" />}
                ChipProps={{ size: 'small' }}
              />
              </Box>

              <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', }}  >
                <RHFTextField name="siteMilestone" label="Nearby Milestone"  multiline sx={{ my:-3}}/>
              </Box>
              <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >

              <Autocomplete 
                // freeSolo
                value={accoVal || null}
                options={spContacts}
                isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                 
                onChange={(event, newValue) => {
                  if(newValue){
                  setAccoManVal(newValue);
                  }
                  else{ 
                  setAccoManVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option.id}>{`${option.firstName} ${option.lastName}`}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Account Manager" />}
                ChipProps={{ size: 'small' }}
              />
              <Autocomplete 
                // freeSolo
                value={projVal || null}
                options={spContacts}
                isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                 
                onChange={(event, newValue) => {
                  if(newValue){
                  setProjManVal(newValue);
                  }
                  else{ 
                  setProjManVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option.id}>{`${option.firstName} ${option.lastName}`}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Project Manager" />}
                ChipProps={{ size: 'small' }}
              />
              <Autocomplete 
                // freeSolo
                value={suppVal || null}
                options={spContacts}
                isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                 
                onChange={(event, newValue) => {
                  if(newValue){
                  setSuppManVal(newValue);
                  }
                  else{ 
                  setSuppManVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option.id}>{`${option.firstName} ${option.lastName}`}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Support Manager" />}
                ChipProps={{ size: 'small' }}
              />
            
              </Box>
              <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', }}  >
                <RHFTextField name="description" label="Description" minRows={8} multiline sx={{ my:-3}}/>
              </Box>
{/* -------------------------start add chips------------------------- */}

{/* <Card
      sx={{ display: 'flex', borderColor:'light gray', borderWidth:'1px', boxShadow:'none', borderRadius:'7px', flexWrap: 'wrap', listStyle: 'none', p: 0.7, m: 0, mt:-3, }} component="ul" variant='outlined' >
      {chipData.map((data,index) => 
          <ListItem key={index}>
            <Chip
              label={data}
              onDelete={()=>handleDelete(data,index)}
            />
          </ListItem>
       )}
       <TextField name="tag" sx={{p:1}}   variant="standard"  
        InputProps={{disableUnderline: true,}} 
        placeholder='Tags...'   value={currTag} onChange={handleChange} onKeyDown={handleKeyPress}/>
    </Card> */}

    <RHFSwitch name="isActive" labelPlacement="start" label={
        <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography> } 
      />
{/* -------------------------end add chips------------------------- */}
<Box
                rowGap={5}
                columnGap={4}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(5, 1fr)',
                }}
              > 

                <LoadingButton 
                  type="submit" 
                  variant="contained" 
                  size="large" 
                  loading={isSubmitting}>
                    Save Changes
                </LoadingButton>

                <Button 
                  onClick={toggleCancel}
                  variant="outlined" 
                  size="large">
                    Cancel
                </Button>

            </Box>
              </Stack>

            
            
          </Card>

        </Grid>
      </Grid>
    </FormProvider>
  );
}
