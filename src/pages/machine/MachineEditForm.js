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
// import { getSPContacts } from '../../redux/slices/contact';
import { getCustomers} from '../../redux/slices/customer/customer';
import { getSites } from '../../redux/slices/customer/site';
import { getMachinestatuses } from '../../redux/slices/products/statuses';
import { getMachinemodels} from '../../redux/slices/products/model';
import { getSuppliers } from '../../redux/slices/products/supplier';
import { getContacts} from '../../redux/slices/customer/contact';
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

} from '../../components/hook-form';


// ----------------------------------------------------------------------


export default function CustomerEditForm() {

  const { machine } = useSelector((state) => state.machine);
// console.log("Machine : ",machine)
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

  const [machineVal, setMachineVal] = useState('');
  const [machSerVal, setMachSerVal] = useState('');
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

  setMachineVal(machine.parentMachine);
  setStatusVal(machine.status)
  setModelVal(machine.machineModel)
  setSupplierVal(machine.supplier)
  setCustomerVal(machine.customer)
  setInstallVal(machine.instalationSite)
  setBillingVal(machine.billingSite)
  setChipData(machine.customerTags)
}, [dispatch , machine]);

useLayoutEffect(() => {
  if(customerVal !== null && customerVal._id !== undefined){
    dispatch(getSites(customerVal._id));
  }
//   setInstallVal(null);
//   setBillingVal(null);
}, [dispatch, customerVal]);

  const EditMachineSchema = Yup.object().shape({
    serialNo: Yup.string().required('Serial Number is required'),
    name: Yup.string().min(5).max(40),
    parentMachine: Yup.string(),
    pserialNo: Yup.string(),
    supplier: Yup.string(),
    model: Yup.string(),
    status: Yup.string(),
    workOrder: Yup.string(),
    customere:Yup.string(),
    instalationSite: Yup.string(),
    billingSite: Yup.string(),
    accountManager: Yup.string(),
    projectManager: Yup.string(),
    supportManager: Yup.string(),
    customerTags: Yup.array(),
    desc: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      id: machine?._id || '',
      serialNo: machine?.serialNo || '',
      name: machine?.name || '',
      parentMachine: machineVal._id,
      pserialNo: machineVal?.serialNo,
      supplier: supplierVal?._id,
      model: modelVal?._id,
      status: statusVal?._id,
      workOrder: machine?.workOrderRef || '',
      customere:customerVal._id,
      instalationSite: installVal?._id,
      billingSite: billingVal?._id,
      accountManager: accoVal?._id,
      projectManager: projVal?._id,
      supportManager: suppVal?._id,
      desc: machine?.description || '',
      customerTags: chipData,
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
  data.parentMachine = machineVal?._id || null
  data.pserialNo = machineVal?.serialNo || null
  data.supplier = supplierVal?._id || null
  data.model = modelVal?._id || null
  data.status = statusVal?._id || null
  data.customer =customerVal._id || null
  data.instalationSite = installVal?._id || null
  data.billingSite = billingVal?._id || null
  data.accountManager = accoVal?._id || null
  data.projectManager = projVal?._id || null
  data.supportManager = suppVal?._id || null
  data.customerTags = chipData

  console.log("Machines Edit : ",data);
    try{
      await dispatch(updateMachine(data));
      setMachineVal('');
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
  // console.log(data)
  setChipData(arr)
};

const handleKeyPress = (e) => {
  setCurrTag(currTag.trim())
  if (e.keyCode === 13 || e.key === 'Enter') {
    // console.log("Enter presed!") 
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
                value={machineVal || null}
                options={machines}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setMachineVal(newValue);
                  console.log(newValue);
                  if(newValue){
                    setSupplierVal(newValue.supplier);
                    setModelVal(newValue.machineModel);
                  }
                  else{             
                    setSupplierVal("");
                    setModelVal("");
                  }
                }}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="Parent Machine" />}
                ChipProps={{ size: 'small' }}
              />
              {/* <RHFTextField name="pserialNo" value={machineVal?.serialNo} label="Parent Machine Serial No." /> */}
              <Autocomplete
                // freeSolo
                disabled
                value={machineVal || null}
                options={machineVal}
                getOptionLabel={(option) => option.serialNo}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="Parent Machine Serial No." />}
                ChipProps={{ size: 'small' }}
              />
            </Box>
            <Box  rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >
              <Autocomplete
                // freeSolo
                value={supplierVal || null}
                options={suppliers}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setSupplierVal(newValue);
                }}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="Supplier" />}
                ChipProps={{ size: 'small' }}
              />
              
              <Autocomplete
                // freeSolo
                value={modelVal || null}
                options={machinemodels}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setModelVal(newValue);
                }}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="Model" />}
                ChipProps={{ size: 'small' }}
              />
              
              <Autocomplete
                // freeSolo
                value={statusVal || null}
                options={machinestatuses}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setStatusVal(newValue);
                }}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="Status" />}
                ChipProps={{ size: 'small' }}
              />
              <RHFTextField name="workOrder" label="Work Order/ Purchase Order" />
            </Box>
            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', }}  >
              <Autocomplete sx={{ my:-3}}
                value={customerVal || null}
                options={customers}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setCustomerVal(newValue);
                }}
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
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setInstallVal(newValue);
                }}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Instalation Site" />}
                ChipProps={{ size: 'small' }}
              />
              <Autocomplete 
                // freeSolo
                value={billingVal || null}
                options={sites}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setBillingVal(newValue);
                }}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Billing Site" />}
                ChipProps={{ size: 'small' }}
              />
              <Autocomplete 
                // freeSolo
                value={accoVal || null}
                options={spContacts}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setBillingVal(newValue?._id);
                }}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Account Manager" />}
                ChipProps={{ size: 'small' }}
              />
              <Autocomplete 
                // freeSolo
                value={projVal || null}
                options={spContacts}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setBillingVal(newValue?._id);
                }}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Project Manager" />}
                ChipProps={{ size: 'small' }}
              />
              <Autocomplete 
                // freeSolo
                value={suppVal || null}
                options={spContacts}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setBillingVal(newValue?._id);
                }}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Support Manager" />}
                ChipProps={{ size: 'small' }}
              />
            
              </Box>
              <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', }}  >
                <RHFTextField name="desc" label="Description" minRows={8} multiline sx={{ my:-3}}/>
              </Box>
{/* -------------------------start add chips------------------------- */}
{/* <RHFTextField name="tags" sx={{mb:-3}} label="Tags"  value={currTag} onChange={handleChange} onKeyDown={handleKeyPress}/> */}

<Card
      sx={{
        display: 'flex',
        borderColor:'light gray',
        borderWidth:'1px',
        boxShadow:'none',
        borderRadius:'7px',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.7,
        m: 0,
        mt:-3,
      }}
      component="ul"
      variant='outlined'
    >
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
    </Card>
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
