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
import { Switch, Box, Button, Card, Grid, Stack, Typography, Autocomplete, TextField, Link, InputLabel,MenuItem , FormControl, Dialog} from '@mui/material';
// PATH
import { PATH_MACHINE , PATH_DASHBOARD, PATH_DOCUMENT } from '../../../routes/paths';
// slice
import { addMachineDocument, setMachineDocumentFormVisibility } from '../../../redux/slices/document/machineDocument';
import { setDocumentCategoryFormVisibility , getDocumentCategories } from '../../../redux/slices/document/documentCategory';
import { setDocumentTypeFormVisibility , getDocumentTypes } from '../../../redux/slices/document/documentType';
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
import ViewFormSWitch from '../../components/ViewFormSwitch';

// ----------------------------------------------------------------------
DocumentAddForm.propTypes = {
  currentDocument: PropTypes.object,
};
export default function DocumentAddForm({currentDocument}) {

  const { documentTypes } = useSelector((state) => state.documentType);
  const { documentCategories } = useSelector((state) => state.documentCategory);
  const { machine  } = useSelector((state) => state.machine);
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
  const [ nameVal, setNameVal] = useState("")
  const [ preview, setPreview] = useState(false)
  const [ previewVal, setPreviewVal] = useState("")
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
 
  useEffect(()=>{
    setNameVal("")
    setDocumentTypeVal("")
    setDocumentCategoryVal("")
    setCustomerAccessVal(false)
    dispatch(getDocumentTypes());
    dispatch(getDocumentCategories());
  },[dispatch,machine._id])
 // a note can be archived.  
  const AddMachineDocumentSchema = Yup.object().shape({
    displayName: Yup.string().max(50),
    description: Yup.string().max(10000),
    images: Yup.mixed()
      .required("File is required!")
      .test(
        "fileType",
        "Only the following formats are accepted: .png, .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx,  .xls, .xlsx, .ppt, .pptx",
        (value) => {
          if (value && value?.name) {
            const allowedExtensions = ["png", "jpeg", "jpg", "gif", "bmp", "webp", "pdf", "doc", "docx",  "xls", "xlsx", "ppt", "pptx" ];
            const fileExtension = value?.name?.split(".").pop().toLowerCase();
            return allowedExtensions.includes(fileExtension);
          }
          return false;
        }
      )
      .nullable(true),
    isActive : Yup.boolean(),
  });
  const defaultValues = useMemo(
    () => ({
      displayName: nameVal,
      description: '',
      images: null,
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocument]
  );

  const methods = useForm({
    resolver: yupResolver(AddMachineDocumentSchema),
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
        data.displayName = nameVal
        if(documentCategoryVal){
          data.documentCategory = documentCategoryVal._id
        }
        if(customerAccessVal === true || customerAccessVal === "true" ){
          data.customerAccess = true
        }else{
          data.customerAccess = false
        }
        if(documentTypeVal){
          data.documentType = documentTypeVal._id
        }
        console.log("data : ", data)

        await dispatch(addMachineDocument(machine.customer._id, machine._id ,data));
        dispatch(setMachineDocumentFormVisibility(false));
        setDocumentCategoryVal("")
        setDocumentTypeVal("")
        setCustomerAccessVal("")
        setNameVal("")
        setPreview(false);
        setPreviewVal("")
        reset();
      } catch(error){
        enqueueSnackbar('Machine Document Save failed!');
        console.error(error);
      }
  };

  const toggleCancel = () => 
  {
    dispatch(setMachineDocumentFormVisibility(false));
  };
  const togleCategoryPage = ()=>{
    dispatch(setDocumentCategoryFormVisibility(true))
    dispatch(setMachineDocumentFormVisibility(false));
  }
  const togleDocumentNamePage = ()=>{
    dispatch(setDocumentTypeFormVisibility(true))
    dispatch(setMachineDocumentFormVisibility(false));
  }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const fileName = file.name.split(".");
      console.log("fileName: " , fileName);
      if(["png", "jpeg", "jpg", "gif", "bmp", "webp", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(fileName[fileName.length - 1])){
        setNameVal(fileName[0])
      }
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
      setPreviewVal(file.preview)
        setValue('images', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const previewHandle = () => {setPreview(true)};

  const handleClosePreview = () => { setPreview(false) };

  const handleRemoveFile = () => {
    setValue('images', "", { shouldValidate: true });
    setNameVal("")
  };

  const handleChange = () => {
    setCustomerAccessVal(!customerAccessVal);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }} >
            <Stack spacing={3}>
              <FormHeading heading='New Document'/>
              
              <Grid item xs={12} md={12} > 
                <RHFUpload
                  required
                  // sx={{ width: '300px'}}
                  // multiple
                  // thumbnail
                  onPreview={previewHandle}
                  name="images"
                  maxSize={30145728}
                  onDelete={handleRemoveFile}
                  onDrop={handleDrop}
                  onRemove={handleDrop}
                  // onRemoveAll={handleRemoveAllFiles}
                  // onUpload={() => console.log('ON UPLOAD')}
                  // onDelete={handleRemoveFile}
                  // onUpload={() => console.log('ON UPLOAD')}
                />
                </Grid>
              <RHFTextField name="displayName" value={nameVal} label="Name" onChange={(e)=>{setNameVal(e.target.value)}}/>
              <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >
              {/* <Grid item xs={12} sm={12} sx={{display:'flex'}}>
                  <Grid item xs={12} sm={6} sx={{display:'flex'}}>
                   <Typography variant="body1" sx={{ pl:2,pb:1, display:'flex', alignItems:'center' }}>
                        Customer Access
                      </Typography>
                    <Switch sx={{ mt: 1 }} checked={customerAccessVal} onChange={handleChange} />
                  </Grid>
                  <RHFSwitch sx={{mt:1}} name="isActive" labelPlacement="start" label={ <Typography variant="body1" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5 }}> Active</Typography> } />
              </Grid> */}

              <Grid>
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
              <Link  title="Add Document Name"  sx={{ color: 'blue' }}  component="button"  variant="body2"  onClick={togleDocumentNamePage} ><Typography variant="body" sx={{mt:1}}>Add new Document Name</Typography><Iconify icon="mdi:share" /></Link>
              </Grid>
              <Grid>
              <Autocomplete
                // freeSolo
                // disabled={fileCategory}
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
                renderInput={(params) => <TextField {...params} required  label="Document Category" />}
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
              {/* <Grid container lg={12} justifyContent="flex-end">
                <Grid item xs={6} sm={6} md={8} lg={2} justifyContent="flex-end">
                    <ViewFormSWitch
                      heading="Customer Access"
                      customerAccess={customerAccessVal}
                      onChange={handleChange}
                    /> 
                </Grid>
              </Grid> */}
              <Grid container lg={12} justifyContent="flex-end">
                <Grid  display="flex" justifyContent="flex-end">
                   <Typography variant="body1" sx={{ pl:2,pt:1, display:'flex', justifyContent:"flex-end", alignItems:'center' }}>
                        Customer Access
                      </Typography>
                    <Switch sx={{ mt: 1 }} checked={customerAccessVal} onChange={handleChange} />
                  </Grid>
              </Grid>
              <RHFTextField name="description" label="Description" minRows={3} multiline />
              
              {/* <RHFSwitch name="isActive" labelPlacement="start" label={ <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography> } /> */}
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
            </Stack>  
          </Card>
        </Grid>
        <Dialog
        maxWidth="md"
        open={preview}
        onClose={handleClosePreview}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        >
        <Grid
          container
          item
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            padding: '10px',
          }}
        >
          <Typography variant="h4" sx={{ px: 2 }}>
            {nameVal}
          </Typography>{' '}
          <Link onClick={() => handleClosePreview()} href="#" underline="none" sx={{ ml: 'auto' }}>
            {' '}
            <Iconify sx={{color:"white"}} icon="mdi:close-box-outline" />
          </Link>
        </Grid>
        {/* <Grid  > */}
        <Box
            component="img"
            sx={{minWidth:"400px", minHeight:"400px"}}
            alt={defaultValues?.name}
            src={previewVal}
            />
        {/* </Grid> */}
      </Dialog>
      </Grid>
    </FormProvider>
  );
}
