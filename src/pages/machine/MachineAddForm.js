import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useLayoutEffect, useMemo, useCallback,  useState, useEffect  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, styled, Grid,Container, Stack,TextField,Autocomplete,Select, Chip, Typography, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// slice
// import { getSPContacts } from '../../redux/slices/contact';
import { getCustomers} from '../../redux/slices/customer/customer';
import { getSites } from '../../redux/slices/customer/site';
import { saveMachine,   getMachines } from '../../redux/slices/products/machine';
import { getMachinestatuses } from '../../redux/slices/products/statuses';
import { getMachinemodels} from '../../redux/slices/products/model';
import { getSuppliers } from '../../redux/slices/products/supplier';
import { getContacts} from '../../redux/slices/customer/contact';


// routes
import { PATH_DASHBOARD, PATH_MACHINE } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {RHFSelect,RHFAutocomplete,RHFTextField,RHFMultiSelect,RHFEditor,RHFUpload,} from '../../components/hook-form';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
import MachineDashboardNavbar from './util/MachineDashboardNavbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';

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
  const { machinemodels} = useSelector((state) => state.machinemodel);
  const { machinestatuses } = useSelector((state) => state.machinestatus);
  const { customers } = useSelector((state) => state.customer);
  const { sites} = useSelector((state) => state.site);

  const { enqueueSnackbar } = useSnackbar();
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
}, [dispatch]);

useLayoutEffect(() => {
  if(customerVal !== null && customerVal._id !== undefined){
    dispatch(getSites(customerVal._id));
  }
  setInstallVal(null);
  setBillingVal(null);
}, [dispatch, customerVal]);

// console.log(machineVal)

// useEffect(()=>{
//   setMachSerVal()
//   setMachSerVal(machSerVal?.serialNo);
// },[machineVal])

  const AddMachineSchema = Yup.object().shape({
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
      serialNo: '',
      name: ''  ,
      parentMachine: machineVal._id,
      pserialNo: machineVal?.serialNo,
      supplier: supplierVal?._id,
      model: modelVal?._id,
      status: statusVal?._id,
      workOrder: '',
      customere:customerVal._id,
      instalationSite: installVal?._id,
      billingSite: billingVal?._id,
      accountManager: accoVal?._id,
      projectManager: projVal?._id,
      supportManager: suppVal?._id,
      customerTags: chipData,
      desc: '',
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

  console.log("Machines : ",machines);
    try{
      await dispatch(saveMachine(data));
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
      enqueueSnackbar('Create success!');
      navigate(PATH_MACHINE.machine.list);
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
  const { themeStretch } = useSettingsContext();

  return (
    <>
     <Container maxWidth={themeStretch ? false : 'xl'}>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* <MachineDashboardNavbar/> */}
      </Grid>
      <CustomBreadcrumbs
            heading=" New Machine "
            sx={{ mb: -2, mt: 3 }}
          />
      <Grid item xs={18} md={12} sx={{mt: 3}}>
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
       <TextField name="tag" sx={{pt:1}}   variant="standard"  
        InputProps={{disableUnderline: true,}} 
        placeholder='Tags...'   value={currTag} onChange={handleChange} onKeyDown={handleKeyPress}/>
    </Card>
{/* -------------------------end add chips------------------------- */}
              </Stack>

            <Stack alignItems="flex-start" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Save Machine
              </LoadingButton>
            </Stack>
            </Card>
          </Grid>
        {/* </Grid> */}
    </FormProvider>
    </Container>
    </>
  );
}
