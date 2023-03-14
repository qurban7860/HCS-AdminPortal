import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useLayoutEffect, useMemo, useCallback,  useState  } from 'react';
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
import { saveMachine } from '../../redux/slices/machine';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFAutocomplete,
  RHFTextField,
  RHFMultiSelect,
  RHFEditor,
  RHFUpload,
} from '../../components/hook-form';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
import MachineDashboardNavbar from './util/MachineDashboardNavbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';

import { useSettingsContext } from '../../components/settings';
// import Select from 'src/theme/overrides/Select';


// ----------------------------------------------------------------------

CustomerAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentCustomer: PropTypes.object,
};

export default function CustomerAddForm({ isEdit, readOnly, currentCustomer }) {

  const { userId, user } = useAuthContext();

  const { spContacts } = useSelector((state) => state.contact);

  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const [currTag, setCurrTag] = useState('');
  const [value, setValues] = useState('');
  const [chipData, setChipData] = useState([
    'The Shawshank Redemption',
'The Dark Knight', 
'12 Angry Men',
 "Schindler's List" ,
'Pulp Fiction',
'The Shawshank Redemption' ,
'The Dark Knight',
'12 Angry Men' ,
"Schindler's List" 
 ]);
  const AddMachineSchema = Yup.object().shape({
    serialNo: Yup.string(),
    name: Yup.string().min(5).max(40).required('Name is required')  ,
    parentMachine: Yup.string(),
    pserialNo: Yup.string(),
    supplier: Yup.string(),
    model: Yup.string(),
    status: Yup.string(),
    workOrder: Yup.string(),
    instalationSite: Yup.string(),
    billingSite: Yup.string(),
    accountManager: Yup.string(),
    projectManager: Yup.string(),
    supportManager: Yup.string(),
    tags: Yup.array(),
    desc: Yup.string(),
  });
console.log(value)
  const defaultValues = useMemo(
    () => ({
      serialNo: '',
      name: ''  ,
      parentMachine: '',
      pserialNo: '',
      supplier: '',
      model: '',
      status: '',
      workOrder: '',
      customere:'',
      instalationSite: '',
      billingSite: '',
      accountManager: '',
      projectManager: '',
      supportManager: '',
      tags:'',
      desc: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const top100Films = [
    { _id: 1,
      customer: 'The Shawshank Redemption', year: 1994 },
    { _id: 4,
      customer: 'The Dark Knight', year: 2008 },
    { _id: 5,
      customer: '12 Angry Men', year: 1957 },
    { _id: 6,
      customer: "Schindler's List", year: 1993 },
    { _id: 7,
      customer: 'Pulp Fiction', year: 1994 }
  ]
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

  useLayoutEffect(() => {
    // dispatch(getSPContacts());
  }, [dispatch]);

  const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  const onSubmit = async (data) => {
    console.log(data);
      try{
        // await dispatch(saveMachine(data));
        reset();
        enqueueSnackbar('Create success!');
        navigate(PATH_DASHBOARD.customer.view(null));
      } catch(error){
        enqueueSnackbar('Saving failed!');
        console.error(error);
      }
  };
  const handleDelete = (data,index) => {
    const arr = [...chipData]
    arr.splice(index,1)
    console.log(data)
    setChipData(arr)
  };

  const handleKeyPress = (e) => {
    setCurrTag(currTag.trim())
    if (e.keyCode === 13 || e.key === 'Enter') {
      console.log("eenter presed!")
      e.preventDefault();
      if(currTag.trim().length > 4){
        currTag.trim();
        setChipData((oldState) => [...oldState, currTag.trim()]);
        setCurrTag('')
      }
      // else{
      //   const AddTag = Yup.object().shape({
      //     tag: Yup.string().min(4).required('Tag is required')
      //   })
      //   yupResolver(AddTag)
      // }
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

              <RHFSelect native name="parentMachine" label="Parent Machine">
                      { 
                      spContacts.length > 0 && spContacts.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.firstName} {option.lastName}
                      </option>
                    ))}
              </RHFSelect>

              <RHFTextField name="pserialNo" label="Parent Machine Serial No." />
            </Box>

             <Box  rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >
             
{/* ------------------------start Searchable dropdown----------------------------------- */}
{/* <div>{`value: ${value !== null ? `'${value}'` : "null"}`}</div> */}

<Autocomplete

  // freeSolo
  value={top100Films[value] || null}
  options={top100Films}
  getOptionLabel={(option) => option.customer}
  onChange={(event, newValue) => {
    setValues(newValue?._id);
  }}
  id="controllable-states-demo"
  renderInput={(params) => <TextField {...params}  label="Supplier" />}
  ChipProps={{ size: 'small' }}
/>
{/* -------------------------------end Searchable dropdown---------------------------------- */}


              <RHFSelect native name="model" label="Model">
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
              
              <RHFSelect native name="status" label="Status">
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              <RHFTextField name="workOrder" label="Work Order/ Purchase Order" />
            </Box>

            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', }}  >
              <RHFSelect native name="customer" label="Customer" sx={{ my:-3}}>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
            </Box>

            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >
            
              <RHFSelect native name="instalationSite" label="Instalation Site">
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              <RHFSelect native name="billingSite" label="Billing Site">
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              <RHFSelect native name="accountManager" label="Account Manager">
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              <RHFSelect native name="projectManager" label="Project Manager">
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              <RHFSelect native name="supportManager" label="Support Manager">
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
              </Box>
              <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', }}  >
                <RHFTextField name="desc" label="Description" minRows={8} multiline sx={{ my:-3}}/>
              </Box>
{/* -------------------------start add chips------------------------- */}
<RHFTextField name="tags" sx={{mb:-3}} label="Tags"  value={currTag} onChange={handleChange} onKeyDown={handleKeyPress}/>

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
       {/* <TextField name="tag" sx={{borderColor:'light gray',
        borderWidth:'1px',}}   variant="standard"  
        InputProps={{disableUnderline: true,}} 
        placeholder='Tags...'   value={currTag} onChange={handleChange} onKeyDown={handleKeyPress}/> */}
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
