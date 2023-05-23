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
// slice
import { addCustomerDocument, updateCustomerDocument, getCustomerDocuments , setCustomerDocumentEdit, setCustomerDocumentEditFormVisibility, setCustomerDocumentFormVisibility , resetCustomerDocument } from '../../../redux/slices/document/customerDocument';
import { getDocumentName, getDocumentNames , setDocumentNameFormVisibility, setDocumentNameEditFormVisibility} from '../../../redux/slices/document/documentName';
import { getFileCategories, setFileCategoryFormVisibility, setFileCategoryEditFormVisibility } from '../../../redux/slices/document/fileCategory';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
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
import Cover from '../../components/Cover';
import { postAndGet } from '../../asset/dispatchRequests'


// ----------------------------------------------------------------------

export default function SettingEditForm() {

  const { customerDocument } = useSelector((state) => state.customerDocument);
  console.log("customerDocument : ",customerDocument)
  const { documentNames } = useSelector((state) => state.documentName);
  const { fileCategories } = useSelector((state) => state.fileCategory);
  // console.log("fileCategories : ", fileCategories, " documentNames : ", documentNames)
  const { machines } = useSelector((state) => state.machine);
  const { customer, customers } = useSelector((state) => state.customer);
  const { contacts } = useSelector((state) => state.contact); 
  const { sites } = useSelector((state) => state.site);

  const [ documentNameVal, setDocumentNameVal] = useState('')
  const [ fileCategoryVal, setFileCategoryVal] = useState('')
  const [ customerAccessVal, setCustomerAccessVal] = useState(false)
  const [ nameVal, setNameVal] = useState("")
  // console.log("customer access : ", customerAccessVal)
  const [files, setFiles] = useState([]);
  const [ machineVal, setMachineVal] = useState('')
  const [ customerVal, setCustomerVal] = useState('')
  const [ siteVal, setSiteVal] = useState('')
  const [ contactVal, setContactVal] = useState('')

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {

  }, [dispatch , ]);

  // useLayoutEffect(() => {
  //   const filterSetting = [];
  //   settings.map((setting)=>(filterSetting.push(setting.techParam._id)))
  //   const filteredsetting = techparamsByCategory.filter(item => !filterSetting.includes(item._id));
  //   setparamData(filteredsetting);
  //   }, [settings,techparamsByCategory]);
  // const EditSettingSchema = Yup.object().shape({
  //   techParamValue: Yup.string().max(20),
  // });

  useEffect(()=>{
    setNameVal(customerDocument?.name)
    setCustomerAccessVal(customerDocument?.customerAccess)
    setFileCategoryVal(customerDocument?.category)
    setDocumentNameVal(customerDocument?.documentName)
  },[customerDocument])
  const EditSettingSchema = Yup.object().shape({
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
    [customerDocument, nameVal]
  );
console.log("defaultValues : ",defaultValues)

  const methods = useForm({
    resolver: yupResolver(EditSettingSchema),
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

  // useEffect(() => {
  //   if (site) {
  //     reset(defaultValues);
  //   }
  // }, [site, reset, defaultValues]);


  const onSubmit = async (data) => {
    try {
        data.customer = customer._id
        if(nameVal){
          data.displayName = nameVal
        }
        if(fileCategoryVal){
          data.category = fileCategoryVal._id
        }
        if(customerAccessVal ){
          data.customerAccess = true
        }else{
          data.customerAccess = false
        }
        if(documentNameVal){
          data.documentName = documentNameVal._id
        }
        // console.log("data : ", data);
      await postAndGet(dispatch, enqueueSnackbar,updateCustomerDocument(customerDocument._id,data),getCustomerDocuments(customer._id));
      dispatch(resetCustomerDocument());
      dispatch(setCustomerDocumentEditFormVisibility(false));
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
  
  // const togleCategoryPage = ()=>{
  //   dispatch(setFileCategoryFormVisibility(true))
  //   dispatch(setCustomerDocumentFormVisibility(false));
  // }

  // const togleDocumentNamePage = ()=>{
  //   dispatch(setDocumentNameFormVisibility(true))
  //   dispatch(setCustomerDocumentEdit(true))
  //   dispatch(setCustomerDocumentFormVisibility(false));
  //   dispatch(setCustomerDocumentEditFormVisibility(false));
  // }

  const handleUpload = () => {
    console.log('ON UPLOAD');
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

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
  const handleChange = () => {
    setCustomerAccessVal(!customerAccessVal);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    {/* <Cover name="Edit Customer Document"/> */}
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <FormHeading heading='Edit Document'/>
              <Box rowGap={3} columnGap={3} display="grid" gridTemplateColumns={{  xs: 'repeat(1, 1fr)',  sm: 'repeat(2, 1fr)', }} >

              <RHFTextField name="displayName" value={nameVal} label="Name" onChange={(e)=>{setNameVal(e.target.value)}} />

              <Grid item xs={12} sm={12} sx={{display:'flex'}}>
                  <Grid item xs={12} sm={6} sx={{display:'flex'}}>
                   <Typography variant="body1" sx={{ pl:2,pb:1, display:'flex', alignItems:'center' }}>
                        Customer Access
                      </Typography>
                    <Switch sx={{ mt: 1 }} checked={customerAccessVal} onChange={handleChange} />
                  </Grid>
                  <RHFSwitch sx={{mt:1}} name="isActive" labelPlacement="start" label={ <Typography variant="body1" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5 }}> Active</Typography> } />
              </Grid>

              <Autocomplete
                // freeSolo
                disabled
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

              <Autocomplete
                // freeSolo
                disabled
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
              <RHFTextField name="description" label="Description" minRows={3} multiline />
              {/* <RHFUpload
              // sx={{ width: '300px'}}
                  // multiple
                  // thumbnail
                 
                  name="image"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleDrop}
                  // onRemoveAll={handleRemoveAllFiles}
                  // onUpload={() => console.log('ON UPLOAD')}
                  // onDelete={handleRemoveFile}
                  // onUpload={() => console.log('ON UPLOAD')}
                /> */}
              {/* <Upload files={files} name="image"  onDrop={handleDrop} onDelete={handleRemoveFile} /> */}
              {/* {!!files.length && (
                <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
                  Remove all
                </Button>
              )} */}

              {/* <RHFSwitch
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

            <AddFormButtons sx={{mt:3}} isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
