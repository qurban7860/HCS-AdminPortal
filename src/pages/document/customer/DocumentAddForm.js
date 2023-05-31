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
import { Switch,Radio, RadioGroup,FormControlLabel,FormLabel, Box, Button, Card, Grid, Stack, Typography, Autocomplete, TextField ,Link, InputLabel,MenuItem , FormControl, Dialog}  from '@mui/material';
// routes
import ViewFormField from '../../components/ViewFormField';
import ViewFormSWitch from '../../components/ViewFormSwitch';
import { PATH_MACHINE , PATH_DASHBOARD, PATH_DOCUMENT } from '../../../routes/paths';
// slice
import { addCustomerDocument, getCustomerDocuments, setCustomerDocumentFormVisibility  } from '../../../redux/slices/document/customerDocument';
import { getDocumentTypes , setDocumentTypeFormVisibility } from '../../../redux/slices/document/documentType';
import { getDocumentCategories, setDocumentCategoryFormVisibility, } from '../../../redux/slices/document/documentCategory';
import { getCustomers } from '../../../redux/slices/customer/customer';
import { getMachines} from '../../../redux/slices/products/machine';
import { getContacts } from '../../../redux/slices/customer/contact';
import { getSites } from '../../../redux/slices/customer/site';
// components
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';
// assets
import { countries } from '../../../assets/data';
import FormProvider, {RHFTextField,RHFSwitch, RHFUpload, RHFSelect} from '../../../components/hook-form';
import { Upload } from '../../../components/upload';
import Cover from '../../components/Cover';
import FormHeading from '../../components/FormHeading';
import AddFormButtons from '../../components/AddFormButtons';
import { postAndGet } from '../../asset/dispatchRequests'
// ----------------------------------------------------------------------
DocumentAddForm.propTypes = {
  currentDocument: PropTypes.object,
};
export default function DocumentAddForm({currentDocument}) {
  const { documentTypes } = useSelector((state) => state.documentType);
  const { documentCategories } = useSelector((state) => state.documentCategory);
  // console.log("fileCategories : ", fileCategories, " documentNames : ", documentNames)
  const { machines } = useSelector((state) => state.machine);
  const { customer, customers } = useSelector((state) => state.customer);
  const { contacts } = useSelector((state) => state.contact);
  const { sites } = useSelector((state) => state.site);

  const [ documentTypeVal, setDocumentTypeVal] = useState('')
  const [ documentCategoryVal, setDocumentCategoryVal] = useState('')
  const [ selectedValue, setSelectedValue] = useState('new')
  const [ customerAccessVal, setCustomerAccessVal] = useState(false)
  const [ nameVal, setNameVal] = useState("")
  const [ previewVal, setPreviewVal] = useState("")
  const [ preview, setPreview] = useState(false)

  // console.log("custom.previe
  const [files, setFiles] = useState([]);
  const [ machineVal, setMachineVal] = useState('')
  const [ customerVal, setCustomerVal] = useState('')
  const [ siteVal, setSiteVal] = useState('')
  const [ contactVal, setContactVal] = useState('')
  const allowedExtension = ["png", "jpeg", "jpg", "gif", "bmp", "webp", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];

  const navigate = useNavigate();

  // let documentAvailable
  // if(documentNames && documentNames.length){
  //   documentAvailable =  true
  // }else{
  //   documentAvailable =  true
  // }

  // let fileCategory
  // if(fileCategories && fileCategories.length){
  //   fileCategory =  true
  // }else{
  //   fileCategory =  true
  // }


  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  
  useEffect(()=>{
    setNameVal("")
    setDocumentTypeVal("")
    setDocumentCategoryVal("")
    setCustomerAccessVal(false)
    dispatch(getDocumentTypes())
    dispatch(getDocumentCategories())
  },[dispatch,customer])

  const AddCustomerDocumentSchema = Yup.object().shape({
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
    isActive: Yup.boolean(),
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
        data.customer = customer._id
        data.displayName = nameVal
        if(nameVal){
          data.name = nameVal
        }
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
        console.log("data : ",data)
        await postAndGet( dispatch, enqueueSnackbar ,addCustomerDocument(customer._id,data), getCustomerDocuments(customer._id));
        dispatch(setCustomerDocumentFormVisibility(false));
        setDocumentCategoryVal("")
        setDocumentTypeVal("")
        setCustomerAccessVal("")
        setNameVal("")
        setPreview(false);
        setPreviewVal("")
        reset();
      } catch(error){
        enqueueSnackbar('Note Save failed!');
        console.error(error);
      }
  };

  const toggleCancel = () =>
  {
    dispatch(setCustomerDocumentFormVisibility(false));
  };
  const togleCategoryPage = ()=>{
    dispatch(setDocumentCategoryFormVisibility(true))
    dispatch(setCustomerDocumentFormVisibility(false));
  }
  const togleDocumentNamePage = ()=>{
    dispatch(setDocumentTypeFormVisibility(true))
    dispatch(setCustomerDocumentFormVisibility(false));
  }
  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     const newFiles = acceptedFiles.map((file) =>
  //       Object.assign(file, {
  //         preview: URL.createObjectURL(file),
  //       })
  //     );

  //     setFiles([...files, ...newFiles]);
  //   },
  //   [files]
  // );

  const handleClosePreview = () => { setPreview(false) };

  const handleRemoveFile = () => {
    setValue('images', "");
    setNameVal("")
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const previewHandle = () => {setPreview(true)};

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const fileName = file.name.split(".");

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

  const handleChange = () => {
    setCustomerAccessVal(!customerAccessVal);
  };
  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {/* <Cover name="New Customer Document"/> */}
      <Box
        column={12}
        rowGap={3}
        columnGap={2}
        // display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
      >
        <Grid container xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Grid container lg={12}>
                  <FormHeading heading="New Document" />
                </Grid>
                  <FormControl>
                    {/* <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel> */}
                    <RadioGroup
                      row
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={selectedValue}
                      onChange={handleRadioChange}
                    >
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel item sm={6} value="new" control={<Radio />} label="New Document" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel item sm={6} value="newVersion" control={<Radio />} label="Upload new document against existing Document (Under Construction!)" />
                    </Grid>
                    </RadioGroup>
                  </FormControl>
                <Grid item xs={12} md={6} lg={12}>
                  <RHFUpload
                    required
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
                <RHFTextField
                  required
                  name="name"
                  value={nameVal}
                  label="Name"
                  onChange={(e) => {
                    setNameVal(e.target.value);
                  }}
                />
                <Grid container lg={12}>
                  <Grid container spacing={2}>
                    <Grid item lg={6}>
                      <Autocomplete
                        // freeSolo
                        // disabled={documentAvailable}
                        value={documentTypeVal || null}
                        options={documentTypes}
                        // isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setDocumentTypeVal(newValue);
                          } else {
                            setDocumentTypeVal('');
                          }
                        }}
                        // renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
                        id="controllable-states-demo"
                        renderInput={(params) => <TextField {...params} required label="Document Type" />}
                        ChipProps={{ size: 'small' }}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <Autocomplete
                        // freeSolo
                        // disabled={fileCategory}
                        value={documentCategoryVal || null}
                        options={documentCategories}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setDocumentCategoryVal(newValue);
                          } else {
                            setDocumentCategoryVal('');
                          }
                        }}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>
                            {option.name}
                          </li>
                        )}
                        id="controllable-states-demo"
                        renderInput={(params) => <TextField {...params} required label="Document Category" />}
                        ChipProps={{ size: 'small' }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {/* <Grid container lg={12} justifyContent="flex-end">
                    <Grid item xs={6} sm={6} md={8} lg={2}>
                      <ViewFormSWitch
                        heading="Customer Access"
                        customerAccess={customerAccessVal}
                        onChange={handleChange}
                      />
                    </Grid>
                </Grid> */}
                <Grid container item lg={12} justifyContent="flex-end">
                  <Grid item xs={6} sm={6} md={8} lg={3} sx={{display:'flex'}}>
                   <Typography variant="body1" sx={{ display:'flex', alignItems:'center' }}>
                        Customer Access
                      </Typography>
                    <Switch  checked={customerAccessVal} onChange={handleChange} />
                  </Grid>
                </Grid>
                {/* <Grid container lg={6} spacing={3}>
                  <Grid item>
                    <Link
                      title="Add Document Name"
                      sx={{ color: 'blue' }}
                      component="button"
                      variant="body2"
                      onClick={togleDocumentNamePage}
                    >
                      <Typography variant="body" sx={{ mt: 1 }}>
                        Add new Document Name
                      </Typography>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      title="Add Category"
                      sx={{ color: 'blue' }}
                      component="button"
                      variant="body2"
                      onClick={togleCategoryPage}
                    >
                      <Typography variant="body">Add new Category</Typography>
                    </Link>
                  </Grid>
                </Grid> */}

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

                <RHFTextField name="description" label="Description" minRows={3} multiline />

                {/* <Upload files={files} name="image"  onDrop={handleDrop} onDelete={handleRemoveFile} /> */}
                {/* {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )} */}
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
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
            <Iconify sx={{ color: 'white' }} icon="mdi:close-box-outline" />
          </Link>
        </Grid>
        {/* <Grid  > */}
        <Box component="img" alt={defaultValues?.name} src={previewVal} />
        {/* </Grid> */}
      </Dialog>
    </FormProvider>
  );
}
