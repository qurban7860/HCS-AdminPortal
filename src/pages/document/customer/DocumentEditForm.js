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
  RHFDescriptionTextField,
  RHFAutocomplete,
  RHFSwitch,
  RHFUpload
} from '../../../components/hook-form';
import AddFormButtons from '../../components/AddFormButtons';
import FormHeading from '../../components/FormHeading';
import ViewFormSWitch from '../../components/ViewFormSwitch';

// slice
import {  setCustomerDocumentFormVisibility, setCustomerDocumentEdit, setCustomerDocumentEditFormVisibility, updateCustomerDocument  } from '../../../redux/slices/document/customerDocument';

import { setDocumentCategoryFormVisibility, getActiveDocumentCategories } from '../../../redux/slices/document/documentCategory';
import { setDocumentTypeFormVisibility, getActiveDocumentTypes, getActiveDocumentTypesWithCategory} from '../../../redux/slices/document/documentType';
import { getMachines} from '../../../redux/slices/products/machine';
import { getCustomers } from '../../../redux/slices/customer/customer';
import { getContacts } from '../../../redux/slices/customer/contact';
import { getSites } from '../../../redux/slices/customer/site';

// ----------------------------------------------------------------------

export default function DocumentEditForm() {

  const { customerDocument } = useSelector((state) => state.customerDocument);
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { customer } = useSelector((state) => state.customer); 
  const { contacts } = useSelector((state) => state.contact); 
  const { sites } = useSelector((state) => state.site); 

  const [ documentTypeVal, setDocumentTypeVal] = useState('')
  const [ documentCategoryVal, setDocumentCategoryVal] = useState('')
  const [ machineVal, setMachineVal] = useState('')
  const [ customerVal, setCustomerVal] = useState('')
  const [ siteVal, setSiteVal] = useState('')
  const [ contactVal, setContactVal] = useState('')
  const [ descriptionVal, setDescriptionVal] = useState("")
  const [ customerAccessVal, setCustomerAccessVal] = useState(false)
  const [ isActive, setIsActive] = useState(false)

  const [ nameVal, setNameVal] = useState("")

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

useEffect(()=>{
  setNameVal(customerDocument?.displayName)
  setCustomerAccessVal(customerDocument?.customerAccess)
  setIsActive(customerDocument?.isActive)
  setDocumentCategoryVal(customerDocument?.docCategory)
  setDocumentTypeVal(customerDocument?.docType)
  setDescriptionVal(customerDocument?.description)
  // dispatch(getActiveDocumentCategories())
  // dispatch(getActiveDocumentTypes())
},[dispatch,customerDocument])

  const EditCustomerDocumentSchema = Yup.object().shape({
    displayName: Yup.string().max(40),
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
        data.documentType = documentTypeVal._id
      }
      // if(fileCategoryVal){
      //   data.category = fileCategoryVal._id
      // }
      if(descriptionVal){
        data.description = descriptionVal
      }
        data.customerAccess = customerAccessVal
        data.isActive = isActive
      await dispatch(updateCustomerDocument(customerDocument?._id,data,customer._id));
      enqueueSnackbar('Document saved successfully!');
      setDescriptionVal("")
      setNameVal("")
      setDocumentCategoryVal("")
      setDocumentTypeVal("")
      reset();
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
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
  const handleIsActiveChange = () => {
    setIsActive(!isActive);
  };

  const handleChangeDescription = (event) => {
    setDescriptionVal(event.target.value);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <FormHeading heading='Edit Document'/>
              <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >
                <Autocomplete
                  // freeSolo
                  disabled
                  value={documentCategoryVal || null}
                  options={activeDocumentCategories}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    if(newValue){
                      setDocumentCategoryVal(newValue);
                      // dispatch(getActiveDocumentTypesWithCategory(newValue?._id))
                      // setDocumentTypeVal("");
                    }
                    else{  
                      setDocumentCategoryVal("");
                      // setDocumentTypeVal("");
                      // dispatch(getActiveDocumentTypes())
                    }
                  }}
                  renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
                  id="controllable-states-demo"
                  renderInput={(params) => <TextField {...params} required label="Document Category" />}
                  ChipProps={{ size: 'small' }}
                />
                <Autocomplete
                  // freeSolo
                  disabled
                  value={documentTypeVal || null}
                  options={activeDocumentTypes}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    if(newValue){
                      setDocumentTypeVal(newValue);
                      // if(!documentCategoryVal){
                      //   setDocumentCategoryVal(newValue?.docCategory);
                      // }
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
              </Box>
              <RHFTextField name="displayName" value={nameVal} label="Name" onChange={(e)=>{setNameVal(e.target.value)}}/>
              <RHFDescriptionTextField value={descriptionVal} schema={EditCustomerDocumentSchema} name="description" label="Description" onChange={handleChangeDescription} minRows={3} multiline />
              <Grid container lg={12} >
                <Grid  display="flex" justifyContent="flex-end">
                   <Typography variant="body1" sx={{ pt:1, display:'flex', justifyContent:"flex-end", alignItems:'center' }}>
                        Customer Access
                      </Typography>
                    <Switch sx={{ mt: 1 }} checked={customerAccessVal} onChange={handleChange} />
                  </Grid>

                  <Grid  display="flex" justifyContent="flex-end">
                   <Typography variant="body1" sx={{ pt:1, display:'flex', justifyContent:"flex-end", alignItems:'center' }}>
                        isActive
                      </Typography>
                    <Switch sx={{ mt: 1 }} checked={isActive} onChange={handleIsActiveChange} />
                  </Grid>
              </Grid>
              
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
