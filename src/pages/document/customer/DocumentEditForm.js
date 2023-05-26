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
import ViewFormSWitch from '../../components/ViewFormSwitch';


// ----------------------------------------------------------------------

export default function DocumentEditForm() {

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
  const [files, setFiles] = useState([]);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(()=>{
    setNameVal(customerDocument?.displayName)
    setCustomerAccessVal(customerDocument?.customerAccess)
    setFileCategoryVal(customerDocument?.category)
    setDocumentNameVal(customerDocument?.documentName)
  },[customerDocument])

  const EditCustomerDocumentSchema = Yup.object().shape({
    displayName: Yup.string().max(50),
    description: Yup.string().max(1000),
    // image: Yup.mixed().required("Image Field is required!"),
    isActive : Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      displayName: nameVal,
      description: customerDocument?.description ? customerDocument?.description : "",
      // image: null,
      isActive: customerDocument?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customerDocument, nameVal]
  );

console.log("defaultValues : ",defaultValues)

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
        console.log("data : ", data);
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
              <TextField name="displayName" value={nameVal} label="Name" onChange={(e)=>{setNameVal(e.target.value)}} />
              <Box rowGap={3} columnGap={3} display="grid" gridTemplateColumns={{  xs: 'repeat(1, 1fr)',  sm: 'repeat(2, 1fr)', }} >

              <Autocomplete
                value={documentNameVal || null}
                options={documentNames}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  if(newValue){
                    setDocumentNameVal(newValue);
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
              
              </Box>

              <Grid container lg={12} justifyContent="flex-end">
                    <Grid item xs={6} sm={6} md={8} lg={2}>
                      <ViewFormSWitch
                        heading="Customer Access"
                        customerAccess={customerAccessVal}
                        onChange={handleChange}
                      />
                    </Grid>
              </Grid>
              <RHFTextField name="description" label="Description" minRows={8} multiline />
              {/* <RHFTextField name="description" label="Description" minRows={3} multiline /> */}

            <AddFormButtons sx={{mt:3}} isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
