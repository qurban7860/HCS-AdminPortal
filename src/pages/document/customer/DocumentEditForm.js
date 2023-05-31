import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo , useState, useLayoutEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Switch, Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link ,Autocomplete, TextField, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
// global
import { CONFIG } from '../../../config-global';
// routes
import { PATH_MACHINE , PATH_DASHBOARD, PATH_DOCUMENT } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch,
  RHFUpload
} from '../../../components/hook-form';
import AddFormButtons from '../../components/AddFormButtons';
import FormHeading from '../../components/FormHeading';
import ViewFormSWitch from '../../components/ViewFormSwitch';

// slice
import {  setCustomerDocumentFormVisibility, setCustomerDocumentEdit, setCustomerDocumentEditFormVisibility, updateCustomerDocument  } from '../../../redux/slices/document/customerDocument';

import { setDocumentCategoryFormVisibility  } from '../../../redux/slices/document/documentCategory';
import { setDocumentTypeFormVisibility } from '../../../redux/slices/document/documentType';
import { getMachines} from '../../../redux/slices/products/machine';
import { getCustomers } from '../../../redux/slices/customer/customer';
import { getContacts } from '../../../redux/slices/customer/contact';
import { getSites } from '../../../redux/slices/customer/site';

// ----------------------------------------------------------------------

export default function DocumentEditForm() {

  const { customerDocument } = useSelector((state) => state.customerDocument);
  const { documentTypes } = useSelector((state) => state.documentType);
  const { documentCategories } = useSelector((state) => state.documentCategory);
  // console.log("machine : " , machine)
  const { customer } = useSelector((state) => state.customer); 
  const { contacts } = useSelector((state) => state.contact); 
  const { sites } = useSelector((state) => state.site); 

  const [ documentTypeVal, setDocumentTypeVal] = useState('')
  const [ documentCategoryVal, setDocumentCategoryVal] = useState('')
  const [ machineVal, setMachineVal] = useState('')
  const [ customerVal, setCustomerVal] = useState('')
  const [ siteVal, setSiteVal] = useState('')
  const [ contactVal, setContactVal] = useState('')
  const [ customerAccessVal, setCustomerAccessVal] = useState(false)
  const [ nameVal, setNameVal] = useState("")

  const navigate = useNavigate();

  let documentAvailable 
  if(documentTypes && documentTypes.length){
    documentAvailable =  true 
  }else{
    documentAvailable =  true 
  }

  let documentCategory 
  if(documentCategories && documentCategories.length){
    documentCategory =  true 
  }else{
    documentCategory =  true 
  }

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

useEffect(()=>{
  setNameVal(customerDocument?.displayName)
  setCustomerAccessVal(customerDocument?.customerAccess)
  setDocumentCategoryVal(customerDocument?.docCategory)
  setDocumentTypeVal(customerDocument?.docType)
},[customerDocument])

  const EditCustomerDocumentSchema = Yup.object().shape({
    displayName: Yup.string().max(50),
    description: Yup.string().max(10000),
    // image: Yup.mixed().required("Image Field is required!"),
    isActive : Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      displayName: nameVal,
      description: customerDocument?.description || "",
      // image: null,
      isActive: customerDocument?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(EditCustomerDocumentSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  

  const onSubmit = async (data) => {
    try {
      data.customer = customer._id
      if(nameVal){
        data.displayName = nameVal
      }
      if(documentTypeVal){
        data.documentName = documentTypeVal
      }
      // if(fileCategoryVal){
      //   data.category = fileCategoryVal._id
      // }
      if(customerAccessVal === "true" || customerAccessVal === true){
        data.customerAccess = true
      }else{
        data.customerAccess = false
      }
      console.log("data : ",data)
      await dispatch(updateCustomerDocument(customerDocument?._id,data));
      reset();
    } catch (err) {
      enqueueSnackbar('Saving failed!');
      console.error(err.message);
    }
  };

  const toggleCancel = () => 
  {
    dispatch(setCustomerDocumentEditFormVisibility(false));
  };

  const togleCategoryPage = ()=>{
    dispatch(setCustomerDocumentEdit(true))
    dispatch(setDocumentCategoryFormVisibility(true))
    dispatch(setCustomerDocumentEditFormVisibility(false));
  }
  const togleDocumentNamePage = ()=>{
    dispatch(setCustomerDocumentEdit(true))
    dispatch(setDocumentTypeFormVisibility(true))
    dispatch(setCustomerDocumentEditFormVisibility(false));
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

  const handleChange = () => {
    setCustomerAccessVal(!customerAccessVal);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <FormHeading heading='Edit Document'/>
              <RHFTextField name="displayName" value={nameVal} label="Name" onChange={(e)=>{setNameVal(e.target.value)}}/>
            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >

              

              <Autocomplete
                // freeSolo
                // disabled
                value={documentTypeVal || null}
                options={documentTypes}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  if(newValue){
                    setDocumentTypeVal(newValue);
                  }
                  else{  
                    setDocumentTypeVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} required label="Document Type" />}
                ChipProps={{ size: 'small' }}
              />
              
              <Autocomplete
                // freeSolo
                readOnly
                value={documentCategoryVal || null}
                options={documentCategories}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  if(newValue){
                    setDocumentCategoryVal(newValue);
                  }
                  else{  
                    setDocumentCategoryVal("");
                  }
                }}
                renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} required label="Document Category" />}
                ChipProps={{ size: 'small' }}
              />
              
              
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
              <Grid container lg={12} justifyContent="flex-end">
                <Grid item xs={6} sm={6} md={8} lg={2} display="flex">
                   <Typography variant="body1" sx={{ pl:2,pt:1, display:'flex', alignItems:'center' }}>
                        Customer Access
                      </Typography>
                    <Switch sx={{ mt: 1 }} checked={customerAccessVal} onChange={handleChange} />
                  </Grid>
              </Grid>
              {/* <Grid container lg={12} justifyContent="flex-end">
                <Grid item xs={6} sm={6} md={8} lg={2} justifyContent="flex-end">
                    <ViewFormSWitch
                      heading="Customer Access"
                      customerAccess={customerAccessVal}
                      onChange={handleChange}
                    /> 
                </Grid>
              </Grid> */}
              <RHFTextField name="description" label="Description" minRows={8} multiline />
              {/* <RHFUpload 
                  name="image"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleDrop}
               /> */}
              {/* <RHFSwitch name="isActive" labelPlacement="start" label={ <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography> } /> */}
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
