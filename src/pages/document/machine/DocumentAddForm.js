import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box, Button, Card, Grid, Stack, Typography, Autocomplete, TextField, Link, InputLabel,MenuItem , FormControl} from '@mui/material';
// PATH
import { PATH_MACHINE , PATH_DASHBOARD, PATH_DOCUMENT } from '../../../routes/paths';
// slice
import { addMachineDocument, setMachineDocumentFormVisibility  } from '../../../redux/slices/document/machineDocument';
import { addFileCategory, setFileCategoryFormVisibility , setFileCategoryEditFormVisibility ,getFileCategories } from '../../../redux/slices/document/fileCategory';
import { addDocumentName, setDocumentNameFormVisibility , setDocumentNameEditFormVisibility , getDocumentNames } from '../../../redux/slices/document/documentName';
import { setCustomerDocumentEditFormVisibility } from '../../../redux/slices/document/customerDocument';
import { getMachines} from '../../../redux/slices/products/machine';
import { getCustomers } from '../../../redux/slices/customer/customer';
import { getContacts } from '../../../redux/slices/customer/contact';
import { getSites } from '../../../redux/slices/customer/site';
// components
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFMultiSelect,
  RHFTextField,
  RHFSwitch,
  RHFUpload
} from '../../../components/hook-form';
// assets
import { countries } from '../../../assets/data';
import FormHeading from '../../components/FormHeading';
import AddFormButtons from '../../components/AddFormButtons';

// ----------------------------------------------------------------------
DocumentAddForm.propTypes = {
  currentDocument: PropTypes.object,
};
export default function DocumentAddForm({currentDocument}) {

  const { documentNames } = useSelector((state) => state.documentName);
  const { fileCategories } = useSelector((state) => state.fileCategory);
  const { machine , machines } = useSelector((state) => state.machine);
  // console.log("machine : " , machine)
  const { customers } = useSelector((state) => state.customer); 
  const { contacts } = useSelector((state) => state.contact); 
  const { sites } = useSelector((state) => state.site); 

  const [ documentNameVal, setDocumentNameVal] = useState('')
  const [ fileCategoryVal, setFileCategoryVal] = useState('')
  const [ machineVal, setMachineVal] = useState('')
  const [ customerVal, setCustomerVal] = useState('')
  const [ siteVal, setSiteVal] = useState('')
  const [ contactVal, setContactVal] = useState('')
  const [ customerAccessVal, setCustomerAccessVal] = useState(false)
  const [ nameVal, setNameVal] = useState("")

  const navigate = useNavigate();

  let documentAvailable 
  if(documentNames && documentNames.length){
    documentAvailable =  true 
  }else{
    documentAvailable =  true 
  }

  let fileCategory 
  if(fileCategories && fileCategories.length){
    fileCategory =  true 
  }else{
    fileCategory =  true 
  }

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(()=>{
    dispatch(getDocumentNames());
    dispatch(getFileCategories());
  },[dispatch,machine._id])
 // a note can be archived.  
  const AddCustomerDocumentSchema = Yup.object().shape({
    name: Yup.string().max(50),
    description: Yup.string().max(10000),
    image: Yup.mixed().required("Image Field is required!"),
    isActive : Yup.boolean(),
  });
  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      image: null,
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocument]
  );

  const methods = useForm({
    resolver: yupResolver(AddCustomerDocumentSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
      reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const onSubmit = async (data) => {
      try{
        if(fileCategoryVal){
          data.category = fileCategoryVal._id
        }
        if(customerAccessVal === true || customerAccessVal === "true" ){
          data.customerAccess = true
        }else{
          data.customerAccess = false
        }
        if(documentNameVal){
          data.documentName = documentNameVal._id
        }
        await dispatch(addMachineDocument(machine.customer._id, machine._id ,data));
        setFileCategoryVal("")
        setDocumentNameVal("")
        setCustomerAccessVal("")
        setNameVal("")
        reset();
      } catch(error){
        enqueueSnackbar('Note Save failed!');
        console.error(error);
      }
  };

  const toggleCancel = () => 
  {
    dispatch(setMachineDocumentFormVisibility(false));
  };
  const togleCategoryPage = ()=>{
    dispatch(setFileCategoryFormVisibility(true))
    dispatch(setMachineDocumentFormVisibility(false));
  }
  const togleDocumentNamePage = ()=>{
    dispatch(setDocumentNameFormVisibility(true))
    dispatch(setMachineDocumentFormVisibility(false));
  }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = () => {
    setValue('cover', null);
  };

  const handleChange = (event) => {
    setCustomerAccessVal(event.target.value);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }} >
            <Stack spacing={2}>
              {/* <FormHeading heading='New Note'/> */}
              <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >
              <RHFTextField name="name" value={nameVal} label="Name" onChange={(e)=>{setNameVal(e.target.value)}}/>
              <FormControl >
                <InputLabel id="demo-simple-select-helper-label">Customer Access</InputLabel>
                <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" value={customerAccessVal} label="Customer Access" onChange={handleChange} >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value={false}  >No</MenuItem>
                </Select>
              </FormControl>
              <Grid>
              <Autocomplete
                // freeSolo
                // disabled={documentAvailable}
                value={documentNameVal || null}
                options={documentNames}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  if(newValue){
                    setDocumentNameVal(newValue);
                    setNameVal(newValue.name);
                  }
                  else{  
                    setDocumentNameVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="Document Name" />}
                ChipProps={{ size: 'small' }}
              />
              <Link  title="Add Document Name"  sx={{ color: 'blue' }}  component="button"  variant="body2"  onClick={togleDocumentNamePage} ><Typography variant="body" sx={{mt:1}}>Add new Document Name</Typography><Iconify icon="mdi:share" /></Link>
              </Grid>
              <Grid>
              <Autocomplete
                // freeSolo
                // disabled={fileCategory}
                value={fileCategoryVal || null}
                options={fileCategories}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  if(newValue){
                    setFileCategoryVal(newValue);
                  }
                  else{  
                    setFileCategoryVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="File Category" />}
                ChipProps={{ size: 'small' }}
              />
              <Link  title="Add Category"  sx={{ color: 'blue' }}  component="button"  variant="body2"  onClick={togleCategoryPage}><Typography variant="body" >Add new Category</Typography><Iconify icon="mdi:share" /></Link>
              </Grid>
              {/* <Autocomplete
                // freeSolo
                value={machineVal || null}
                options={machines}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  if(newValue){
                    setMachineVal(newValue);
                  }
                  else{  
                    setMachineVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{option.serialNo}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="Machine" />}
                ChipProps={{ size: 'small' }}
              /> */}
              
              {/* <Autocomplete 
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
                renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Customer" />}
                ChipProps={{ size: 'small' }}
              /> */}

              {/* <Autocomplete 
                // freeSolo
                value={siteVal || null}
                options={sites}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  if(newValue){
                  setSiteVal(newValue);
                  }
                  else{ 
                  setSiteVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Site" />}
                ChipProps={{ size: 'small' }}
              />

              <Autocomplete 
                // freeSolo
                value={contactVal || null}
                options={contacts}
                isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                onChange={(event, newValue) => {
                  if(newValue){
                  setContactVal(newValue);
                  }
                  else{ 
                  setContactVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{`${option.firstName || ''} ${option.lastName || ''}`}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Contact" />}
                ChipProps={{ size: 'small' }}
              /> */}
              </Box>
              <RHFTextField name="description" label="Description" minRows={8} multiline />
              <RHFUpload 
                  name="image"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleDrop}
               />
              <RHFSwitch name="isActive" labelPlacement="start" label={ <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography> } />
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
            </Stack>  
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
