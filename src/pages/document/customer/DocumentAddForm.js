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
import { addCustomerDocument, updateCustomerDocument, getCustomerDocuments, setCustomerDocumentFormVisibility  } from '../../../redux/slices/document/customerDocument';
import { getActiveDocumentTypesWithCategory, resetActiveDocumentTypes } from '../../../redux/slices/document/documentType';
import { getActiveDocumentCategories, resetDocumentCategories} from '../../../redux/slices/document/documentCategory';
import { updateDocumentVersion, addDocumentVersion } from '../../../redux/slices/document/documentVersion';

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

// ----------------------------------------------------------------------

DocumentAddForm.propTypes = {
  currentDocument: PropTypes.object,
};
export default function DocumentAddForm({currentDocument}) {
  const { activeDocumentTypes, documentTypeFormVisibility } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { customerDocuments } = useSelector((state) => state.customerDocument);
  const { machines } = useSelector((state) => state.machine);
  const { customer, customers } = useSelector((state) => state.customer);
  const { contacts } = useSelector((state) => state.contact);
  const { sites } = useSelector((state) => state.site);

  const [ documentTypeVal, setDocumentTypeVal] = useState('')
  const [ documentCategoryVal, setDocumentCategoryVal] = useState('')
  const [ documentVal, setDocumentVal] = useState('')
  // console.log("documentVal : ",documentVal)
  const [ selectedValue, setSelectedValue] = useState('new')
  const [ selectedVersionValue, setSelectedVersionValue] = useState("newVersion")
  const [ descriptionVal, setDescriptionVal] = useState("")
  const [ readOnlyVal, setReadOnlyVal] = useState(false)
  const [ customerAccessVal, setCustomerAccessVal] = useState(false)
  const [ isActive, setIsActive] = useState(true)
  const [ nameVal, setNameVal] = useState("")
  const [ displayNameVal, setDisplayNameVal] = useState('')
  const [ previewVal, setPreviewVal] = useState("")
  const [ preview, setPreview] = useState(false)

  const [files, setFiles] = useState([]);
  const [ machineVal, setMachineVal] = useState('')
  const [ customerVal, setCustomerVal] = useState('')
  const [ siteVal, setSiteVal] = useState('')
  const [ contactVal, setContactVal] = useState('')
  const allowedExtension = ["png", "jpeg", "jpg", "gif", "bmp", "webp", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];
  const navigate = useNavigate();


  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  
  useEffect(()=>{
    setDocumentVal("")
    setSelectedValue("new")
    setSelectedVersionValue("newVersion")
    setNameVal("")
    setDisplayNameVal("")
    setDocumentTypeVal("")
    setDocumentCategoryVal("")
    setCustomerAccessVal(false)
    setReadOnlyVal(false)
    setDescriptionVal("")
    dispatch(resetActiveDocumentTypes());
    dispatch(getActiveDocumentCategories())
    // dispatch(getActiveDocumentTypes())
  },[dispatch,customer])

useEffect(()=>{
  if(documentCategoryVal?._id){
    dispatch(getActiveDocumentTypesWithCategory(documentCategoryVal?._id))
  }
},[documentCategoryVal, dispatch])

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
      displayName: displayNameVal,
      description: descriptionVal,
      images: null,
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocument]
  );
  // const updatedDefaultValues = useMemo(() => {
  //   return {
  //     ...defaultValues, // Spread the existing properties
  //     description: description, // Assign the new value
  //   };
  // }, [description, defaultValues]);

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
        data.displayName = displayNameVal
        data.name = nameVal
        // if(nameVal){
        // }
        if(documentCategoryVal){
          data.documentCategory = documentCategoryVal._id
        }
        data.isActive= isActive
        if(customerAccessVal === true || customerAccessVal === "true" ){
          data.customerAccess = true
        }else{
          data.customerAccess = false
        }
        if(documentTypeVal){
          data.documentType = documentTypeVal._id
        }
        if(descriptionVal){
          data.description = descriptionVal;
        }
        if(selectedValue === "new"){
          await dispatch(addCustomerDocument(customer._id,data));
        }else if (selectedVersionValue === "newVersion"){
            await dispatch(addDocumentVersion(documentVal._id,data));
        }else{
          await dispatch(updateDocumentVersion(documentVal._id,documentVal?.documentVersions[0]?._id,data));
          }
        enqueueSnackbar('Customer document save successfully!');
        dispatch(getCustomerDocuments(customer?._id))
        dispatch(setCustomerDocumentFormVisibility(false));
        setDocumentCategoryVal("")
        setDocumentTypeVal("")
        setCustomerAccessVal("")
        setNameVal("")
        setDisplayNameVal("")
        setReadOnlyVal(false)
        setDocumentVal("")
        setSelectedValue("new")
        setSelectedVersionValue("newVersion")
        setReadOnlyVal(false)
        setPreview(false);
        setPreviewVal("")
        setDescriptionVal("")
        reset();
      } catch(error){
        enqueueSnackbar('Customer document save failed!', { variant: `error` });
        console.error(error);
      }
  };

  const toggleCancel = () =>
  {
    dispatch(setCustomerDocumentFormVisibility(false));
  };


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
  const handleIsActiveChange = () => {
    setIsActive(!isActive);
  };
  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
    if(event.target.value === "new"){
      setReadOnlyVal(false)
      setDocumentVal('');
      setNameVal('');
      setDisplayNameVal('');
      setDocumentTypeVal('');
      setDocumentCategoryVal("");
      setDescriptionVal('');
      setCustomerAccessVal(false);
      setReadOnlyVal(false)
    }
    setValue('images', "");
  };
  const handleVersionRadioChange = (event) => {
    setSelectedVersionValue(event.target.value);
  };
  const handleChangeDescription = (event) => {
    setDescriptionVal(event.target.value);
  };
  const objComparator = function(a, b) {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
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
                  <FormControl >
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
                      <FormControlLabel item sm={6} value="newVersion" control={<Radio />} label="Upload new file against existing Document" />
                    </Grid>
                    </RadioGroup>
                  </FormControl>
                  { selectedValue === "newVersion" &&
                  <Grid container lg={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={6}>
                    <Autocomplete
                        // freeSolo
                        // disabled={documentAvailable}
                        value={documentVal || null}
                        options={customerDocuments}
                        // isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) =>  `${option.displayName ? option.displayName : ""}`}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            const { _id, displayName } = newValue;
                            setDocumentVal(newValue);
                            setDisplayNameVal(newValue.displayName);
                            setDocumentTypeVal(newValue.docType);
                            setDocumentCategoryVal(newValue.docCategory);
                            setCustomerAccessVal(newValue.customerAccess);
                            // setDescriptionVal(newValue.description);
                            setReadOnlyVal(true)
                          } else {
                            setDocumentVal('');
                            setDisplayNameVal('');
                            setDocumentTypeVal('');
                            setDocumentCategoryVal("");
                            setDescriptionVal('');
                            setCustomerAccessVal(false);
                            setReadOnlyVal(false)
                            dispatch(resetActiveDocumentTypes());
                          }
                        }}
                        renderOption={(props, option) => (<li  {...props} key={option._id}>{`${option.displayName ? option.displayName : ""}`}</li>)}
                        id="controllable-states-demo"
                        renderInput={(params) => <TextField {...params} required label="Select Document" />}
                        ChipProps={{ size: 'small' }}
                      />
                    </Grid>
                    {documentVal && <Grid item xs={12} lg={6}>
                      <Autocomplete
                        // freeSolo
                        disabled={readOnlyVal}
                        // readOnly={readOnlyVal}
                        value={documentTypeVal || null}
                        options={activeDocumentTypes}
                        // isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) =>  `${option.name ? option.name : ""}`}
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
                    </Grid>}
                    </Grid>
                    </Grid>
                      }
                  { documentVal &&  <FormControl >
                      <RadioGroup
                            row
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={selectedVersionValue}
                            onChange={handleVersionRadioChange}
                          >
                          <Grid item xs={12} sm={6}>
                            <FormControlLabel value="newVersion" control={<Radio />} label="New Version" />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControlLabel value="existingVersion" control={<Radio />} label="Current Version" />
                          </Grid>
                      </RadioGroup>
                  </FormControl>}
                  { selectedValue === "new"  &&
                <RHFTextField
                    required
                    disabled={readOnlyVal}
                    name="name"
                    value={displayNameVal}
                    label="Name"
                    onChange={(e) => {
                      setDisplayNameVal(e.target.value);
                    }}
                  />}
                { selectedValue === "new"  &&
                <Grid container lg={12}>
                  <Grid container spacing={2}>
                    <Grid item lg={6}>
                      <Autocomplete
                        // freeSolo
                        disabled={readOnlyVal}
                        // readOnly={readOnlyVal}
                        value={documentCategoryVal || null}
                        options={activeDocumentCategories}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => `${option.name ? option.name : ""}`}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setDocumentCategoryVal(newValue);
                          } else {
                            setDocumentCategoryVal('');
                            dispatch(resetActiveDocumentTypes());
                            setDocumentTypeVal('');
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
                    <Grid item lg={6}>
                      <Autocomplete
                        // freeSolo
                        disabled={readOnlyVal}
                        // readOnly={readOnlyVal}
                        value={documentTypeVal || null}
                        options={activeDocumentTypes}
                        // isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) =>  `${option.name ? option.name : ""}`}
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
                  </Grid>
                </Grid>}
                        
                { (selectedValue === "new" || (documentVal && selectedVersionValue !== "existingVersion") ) && <RHFTextField  value={descriptionVal} name="description" onChange={handleChangeDescription} label="Description" minRows={3} multiline />}
                { (selectedValue === "new" || documentVal ) &&
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
                  </Grid>}
                { (selectedValue === "new" ) &&
                <Grid container lg={12} display="flex">
                  <Grid  display="flex" >
                     <Typography variant="body1" sx={{ pl:2,pt:1, display:'flex', justifyContent:"flex-end", alignItems:'center' }}>
                          Customer Access
                        </Typography>
                      <Switch sx={{ mt: 1 }} checked={customerAccessVal} onChange={handleChange} />
                    </Grid>
                    <Grid  display="flex" >
                     <Typography variant="body1" sx={{ pl:2,pt:1, display:'flex', justifyContent:"flex-end", alignItems:'center' }}>
                          isActive
                        </Typography>
                      <Switch sx={{ mt: 1 }} checked={isActive} onChange={handleIsActiveChange} />
                    </Grid>
                </Grid>}


                {/* <Upload multiple files={files} name="image"  onDrop={handleDrop} onDelete={handleRemoveFile} />
                {!!files.length && (
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
