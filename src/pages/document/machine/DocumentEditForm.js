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
import { setMachineDocumentEdit, setMachineDocumentEditFormVisibility, updateMachineDocument  } from '../../../redux/slices/document/machineDocument';
import { setDocumentCategoryFormVisibility, getDocumentCategories } from '../../../redux/slices/document/documentCategory';
import { setDocumentTypeFormVisibility, getDocumentTypes } from '../../../redux/slices/document/documentType';
import { getMachines} from '../../../redux/slices/products/machine';
import { getCustomers } from '../../../redux/slices/customer/customer';
import { getContacts } from '../../../redux/slices/customer/contact';
import { getSites } from '../../../redux/slices/customer/site';

// ----------------------------------------------------------------------

export default function DocumentEditForm() {

  const { machineDocument } = useSelector((state) => state.machineDocument);
  const { documentTypes } = useSelector((state) => state.documentType);
  const { documentCategories } = useSelector((state) => state.documentCategory);
  const { machine , machines } = useSelector((state) => state.machine);
  // console.log("machine : " , machine)
  const { customers } = useSelector((state) => state.customer); 
  const { contacts } = useSelector((state) => state.contact); 
  const { sites } = useSelector((state) => state.site); 

  const [ documentTypeVal, setDocumentTypeVal] = useState('')
  const [ documentCategoryVal, setDocumentCategoryVal] = useState('')
  const [ machineVal, setMachineVal] = useState('')
  const [ customerVal, setCustomerVal] = useState('')
  const [ siteVal, setSiteVal] = useState('')
  const [ contactVal, setContactVal] = useState('')
  const [ customerAccessVal, setCustomerAccessVal] = useState(false)
  const [ isActive, setIsActive] = useState(false)

  const [ nameVal, setNameVal] = useState("")

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

useEffect(()=>{
  setNameVal(machineDocument?.displayName)
  setCustomerAccessVal(machineDocument?.customerAccess)
  setDocumentCategoryVal(machineDocument?.docCategory)
  setDocumentTypeVal(machineDocument?.docType)
  setIsActive(machineDocument?.isActive)
  // dispatch(getDocumentCategories())
  dispatch(getDocumentTypes())
},[dispatch, machineDocument])

  const EditMachineDocumentSchema = Yup.object().shape({
    displayName: Yup.string().max(50),
    description: Yup.string().max(10000),
    // image: Yup.mixed().required("Image Field is required!"),
    isActive : Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      displayName: nameVal,
      description: machineDocument?.description || "",
      // image: null,
      isActive: machineDocument?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(EditMachineDocumentSchema),
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
      data.customer = machine.customer._id
      if(nameVal){
        data.displayName = nameVal
      }
      if(documentTypeVal){
        data.documentType = documentTypeVal._id
      }
      // if(documentCategoryVal){
      //   data.category = documentCategoryVal._id
      // }
      data.customerAccess = customerAccessVal
      data.isActive = isActive
      // console.log("data : ",data)
      await dispatch(updateMachineDocument(machineDocument?._id , machine?._id ,data));
      reset();
    } catch (err) {
      enqueueSnackbar('Machine document save failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  const toggleCancel = () => 
  {
    dispatch(setMachineDocumentEditFormVisibility(false));
  };

  const togleCategoryPage = ()=>{
    dispatch(setMachineDocumentEdit(true))
    dispatch(setDocumentCategoryFormVisibility(true))
    dispatch(setMachineDocumentEditFormVisibility(false));
  }
  const togleDocumentNamePage = ()=>{
    dispatch(setMachineDocumentEdit(true))
    dispatch(setDocumentTypeFormVisibility(true))
    dispatch(setMachineDocumentEditFormVisibility(false));
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
                disabled
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
              </Box>

              <RHFTextField name="description" label="Description" minRows={8} multiline />

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
