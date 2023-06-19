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
import { Switch,Radio, RadioGroup,FormControlLabel,FormLabel, Box, Button, Card, Grid, Stack, Typography, Autocomplete, TextField ,Link, InputLabel,MenuItem , FormControl, Dialog, Container}  from '@mui/material';

// PATH
import { PATH_MACHINE , PATH_DASHBOARD, PATH_DOCUMENT } from '../../../../routes/paths';
// slice
import { getActiveDocuments, getDocuments, addDocument, getCustomerDocuments,getMachineDocuments, resetActiveDocuments} from '../../../../redux/slices/document/document';
import { setDocumentCategoryFormVisibility , getActiveDocumentCategories } from '../../../../redux/slices/document/documentCategory';
import { setDocumentTypeFormVisibility , getActiveDocumentTypes } from '../../../../redux/slices/document/documentType';
import { addDocumentVersion, updateDocumentVersion } from '../../../../redux/slices/document/documentVersion';
import { getActiveMachines, resetActiveMachines, getActiveModelMachines } from '../../../../redux/slices/products/machine';
import { getActiveMachineModels } from '../../../../redux/slices/products/model';
import { getActiveCustomers } from '../../../../redux/slices/customer/customer';
import { getActiveSites, resetActiveSites } from '../../../../redux/slices/customer/site';
// components
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFMultiSelect,
  RHFTextField,
  RHFSwitch,
  RHFUpload
} from '../../../../components/hook-form';
// assets
import FormHeading from '../../../components/FormHeading';
import AddFormButtons from '../../../components/AddFormButtons';
import {Cover} from '../../../components/Cover';

// ----------------------------------------------------------------------
DocumentAddForm.propTypes = {
  currentDocument: PropTypes.object,
};
export default function DocumentAddForm({currentDocument}) {

  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { activeMachines  } = useSelector((state) => state.machine);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeDocuments } = useSelector((state) => state.document);
// console.log("activeMachineModels : ",activeMachineModels)
  const { activeCustomers,  } = useSelector((state) => state.customer); 
  const { activeContacts } = useSelector((state) => state.contact); 
  const { activeSites } = useSelector((state) => state.site);  
  // ------------------ document values states ------------------------------
  const [ documentTypeVal, setDocumentTypeVal] = useState('')
  const [ documentCategoryVal, setDocumentCategoryVal] = useState('')
  const [ documentVal, setDocumentVal] = useState('')
  console.log("documentVal : ", documentVal)
  const [ selectedValue, setSelectedValue] = useState('new')
  const [ selectedVersionValue, setSelectedVersionValue] = useState("newVersion")
  const [ descriptionVal, setDescriptionVal] = useState("")
  const [ readOnlyVal, setReadOnlyVal] = useState(false)
  const [ siteDisabled, setSiteDisabled] = useState(false)
  const [ contactDisabled, setContactDisabled] = useState(false)

  const [ customerAccessVal, setCustomerAccessVal] = useState(false)
  const [ documentDependency, setDocumentDependency] = useState("customer")

  // ------------------ customer values states ------------------------------
  const [ customerVal, setCustomerVal] = useState("")
  const [ customerSiteVal, setCustomerSiteVal] = useState("")
  // ------------------ machine values states ------------------------------
  const [ machineVal, setMachineVal] = useState("")
  const [ machineModelVal, setMachineModelVal] = useState("")
  const [ isActive, setIsActive] = useState(true)
  const [ nameVal, setNameVal] = useState("")
  const [ displayNameVal, setDisplayNameVal] = useState("")

  const [ previewVal, setPreviewVal] = useState("")
  const [ preview, setPreview] = useState(false)
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
 
  useEffect(()=>{
    setDocumentVal("")
    setSelectedValue("new")
    setSelectedVersionValue("newVersion")
    setNameVal("")
    setDocumentTypeVal("")
    setDocumentCategoryVal("")
    setCustomerAccessVal(false)
    setCustomerSiteVal("")
    setCustomerVal("")
    setReadOnlyVal(false)
    setDescriptionVal("")
    setMachineVal("")
    setMachineModelVal("")
    dispatch(getActiveDocumentTypes());
    dispatch(getActiveDocumentCategories());
    // dispatch(getActiveCustomers());
    // dispatch(getActiveMachines());
    // dispatch(getActiveMachineModels());
  },[dispatch,])

  useEffect(()=>{
    if(documentDependency === "machine" ){
      // dispatch(getActiveMachines());
      dispatch(getActiveMachineModels());
    }
    if(documentDependency === "customer" ){
      dispatch(getActiveCustomers());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch ,documentDependency])

  useEffect(()=>{
    if(documentDependency === "machine" && machineModelVal ){
      dispatch(getActiveModelMachines(machineModelVal._id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch, machineModelVal])

  useEffect(()=>{
    if(customerVal?._id){
      dispatch(getActiveSites(customerVal._id))
    }
  },[dispatch ,customerVal])
// ------------------------- customer documents ---------------------------------------
  useEffect(()=>{
    if(customerVal?._id && selectedValue === "newVersion"){
      dispatch(getCustomerDocuments(customerVal._id))
    }
  },[dispatch , customerVal , selectedValue]);

  useEffect(()=>{
    if(machineVal?._id && selectedValue === "newVersion"){
      dispatch(getMachineDocuments(machineVal._id))
    }
  },[dispatch , machineVal , selectedValue]);

  const AddDocumentSchema = Yup.object().shape({
    displayName: Yup.string().max(50),
    description: Yup.string().max(10000),
    images: Yup.mixed()
      .required("File is required!")
      .test(
        "fileType",
        "Only the following formats are accepted: .png, .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx,  .xls, .xlsx, .ppt, .pptx",
        (value) => {
          if (value && value?.name) {
            const allowedExtensions = [  'png', 'jpeg', 'jpg', 'gif', 'bmp', 'webp', 'djvu', 'heic', 'heif', 'ico', 'jfif', 'jp2', 'jpe', 'jpeg', 'jpg', 'jps', 'mng', 'nef', 'nrw', 'orf', 'pam', 'pbm', 'pcd', 'pcx', 'pef', 'pes', 'pfm', 'pgm', 'picon', 'pict', 'png', 'pnm', 'ppm', 'psd', 'raf', 'ras', 'rw2', 'sfw', 'sgi', 'svg', 'tga', 'tiff', 'psd', 'jxr', 'wbmp', 'x3f', 'xbm', 'xcf', 'xpm', 'xwd', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt', 'odp', 'ods', 'odt', 'ott', 'rtf', 'txt'];
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
    resolver: yupResolver(AddDocumentSchema),
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
        data.name = nameVal
        data.displayName = displayNameVal
        data.isActive = isActive;
        data.customerAccess = customerAccessVal
        if(customerVal ){
          data.customer = customerVal._id
        }
        if(customerSiteVal){
          data.site = customerSiteVal._id
        } 
        if(machineModelVal && !machineVal){
          data.machineModel = machineModelVal._id
        }
        if(machineVal){
          data.machine= machineVal._id
        }
        if(documentCategoryVal){
          data.documentCategory = documentCategoryVal?._id
        }
        if(documentTypeVal){
          data.documentType = documentTypeVal?._id
        }
        if(descriptionVal){
          data.description = descriptionVal;
        }
        if(selectedValue === "new"){
          await dispatch(addDocument(customerVal?._id, machineVal._id ,data));
          enqueueSnackbar('Machine document save successfully!');
          navigate(PATH_DASHBOARD.document.dashboard);
        }else if (selectedVersionValue === "newVersion"){
            await dispatch(addDocumentVersion(documentVal._id,data));
          enqueueSnackbar('Machine document version updated successfully!');
          navigate(PATH_DASHBOARD.document.dashboard);
        }else{
          await dispatch(updateDocumentVersion(documentVal._id,documentVal?.documentVersions[0]?._id,data));
          enqueueSnackbar('Machine document updated successfully!');
          navigate(PATH_DASHBOARD.document.dashboard);
          }
          dispatch(getDocuments())
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
        setMachineVal("")
        setMachineModelVal("")
        setCustomerVal("")
        setCustomerSiteVal("")
        reset();
      } catch(error){
        enqueueSnackbar('Machine Document Save failed!', { variant: `error` });
        console.error(error);
      }
  };

  const toggleCancel = () => 
  {
    navigate(PATH_DASHBOARD.document.dashboard)
  };

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

  const previewHandle = () => {setPreview(true)};

  const handleClosePreview = () => { setPreview(false) };

  const handleRemoveFile = () => {
    setValue('images', "", { shouldValidate: true });
    setNameVal("")
  };

  const handleChange = () => {
    setCustomerAccessVal(!customerAccessVal);
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
  };

  const handleDependencyChange = (event) => {
    setDocumentDependency(event.target.value);

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
    // if(event.target.value === "newVersion"){
      setDocumentVal('');
      setCustomerVal("");
      setCustomerSiteVal("");
      setMachineModelVal("");
      setMachineVal('');
      dispatch(resetActiveSites());
      dispatch(resetActiveMachines())
      dispatch(resetActiveDocuments())
    // }
  }
  const handleVersionRadioChange = (event) => {
    setSelectedVersionValue(event.target.value);
  };

  const handleChangeDescription = (event) => {
    setDescriptionVal(event.target.value);
  };

 const handleIsActiveChange = () => {
    setIsActive(!isActive);
  };

  return (
  <Container maxWidth={false}>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
            // mt: '24px',
          }}
        >
          <Cover
            name="New Document"
            icon="ph:users-light"
          />
        </Card>
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
                <FormControl >
                    <RadioGroup
                      row
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={documentDependency}
                      onChange={handleDependencyChange}
                    >
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel item sm={6} value="customer" control={<Radio />} label="Customer" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel item sm={6} value="machine" control={<Radio />} label="Machine" />
                    </Grid>
                    </RadioGroup>
                  </FormControl>
                  { documentDependency === "customer" &&
                <Grid container lg={12}>
                  <Grid container spacing={2}>
                    <Grid item lg={6}>
                      <Autocomplete
                        // freeSolo
                        value={customerVal || null}
                        options={activeCustomers}
                        // isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) =>  `${option.name ? option.name : ""}`}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setCustomerVal(newValue);
                            setContactDisabled(false);
                            setSiteDisabled(false);
                            setCustomerSiteVal("");
                            setMachineVal("");
                            setMachineModelVal("");
                            dispatch(resetActiveSites())
                            setDocumentVal('');
                            dispatch(resetActiveDocuments())
                          } else {
                            setCustomerVal('');
                            setContactDisabled(false);
                            setSiteDisabled(false);
                            setCustomerSiteVal("");
                            dispatch(resetActiveSites())
                            setDocumentVal('');
                            dispatch(resetActiveDocuments())
                          }
                        }}
                        // renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
                        id="controllable-states-demo"
                        renderInput={(params) => <TextField {...params} required label="Customer" />}
                        ChipProps={{ size: 'small' }}
                      />
                    </Grid>
                    <Grid item lg={6}>
                        <Autocomplete
                          // freeSolo
                          disabled={siteDisabled}
                          value={customerSiteVal|| null}
                          options={activeSites}
                          isOptionEqualToValue={(option, value) => option.name === value.name}
                          getOptionLabel={(option) => `${option.name ? option.name : ""}`}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setCustomerSiteVal(newValue);
                              // setContactDisabled(true);
                            } else {
                              setCustomerSiteVal('');
                              // setContactDisabled(false);

                            }
                          }}
                          renderOption={(props, option) => (
                            <li {...props} key={option._id}>
                              {option.name}
                            </li>
                          )}
                          id="controllable-states-demo"
                          renderInput={(params) => <TextField {...params} label="Site" />}
                          ChipProps={{ size: 'small' }}
                        />
                      </Grid>
                  </Grid>
                </Grid>}

                { documentDependency === "machine" &&
                <Grid container lg={12}>
                  <Grid container spacing={2}>
                  <Grid item lg={6}>
                      <Autocomplete
                        // freeSolo
                        disabled={readOnlyVal}
                        // readOnly={readOnlyVal}
                        value={machineModelVal || null}
                        options={activeMachineModels}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => `${option.name ? option.name : ""}`}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setMachineModelVal(newValue);
                            setMachineVal("")
                            setCustomerVal("");
                            setCustomerSiteVal("");
                            dispatch(resetActiveMachines())
                            setDocumentVal('');
                            dispatch(resetActiveDocuments())
                          } else {
                            setMachineModelVal('');
                            setMachineVal("")
                            dispatch(resetActiveMachines())
                            setDocumentVal('');
                            dispatch(resetActiveDocuments())
                          }
                        }}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>
                            {option.name}
                          </li>
                        )}
                        id="controllable-states-demo"
                        renderInput={(params) => <TextField {...params} required label="Model" />}
                        ChipProps={{ size: 'small' }}
                      />
                    </Grid>

                    <Grid item lg={6}>
                      <Autocomplete
                        // freeSolo
                        value={machineVal || null}
                        options={activeMachines}
                        // isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) =>  `${option.serialNo ? option.serialNo : ''}`}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setMachineVal(newValue);
                          } else {
                            setMachineVal('');
                            setDocumentVal('');
                            dispatch(resetActiveDocuments())
                          }
                        }}
                        // renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
                        id="controllable-states-demo"
                        renderInput={(params) => <TextField {...params}  label="Machine" />}
                        ChipProps={{ size: 'small' }}
                      />
                    </Grid>
                    
                  </Grid>
                </Grid>}

              {/* { selectedValue === "new" && */}
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
                  {/* } */}

                  { selectedValue === "newVersion" &&
                  <Grid container lg={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={6}>
                      <Autocomplete
                          // freeSolo
                          // disabled={documentAvailable}
                          value={documentVal || null}
                          options={activeDocuments}
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
                            }
                          }}
                          renderOption={(props, option) => (<li  {...props} key={option._id}>{`${option.displayName ? option.displayName : ""}`}</li>)}
                          id="controllable-states-demo"
                          renderInput={(params) => <TextField {...params} required label="Documents" />}
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
                            <FormControlLabel value="existingVersion" control={<Radio />} label="Existing Version" />
                          </Grid>
                      </RadioGroup>
                  </FormControl>}

                { selectedValue === "new"   &&
                <RHFTextField
                    required
                    disabled={readOnlyVal}
                    name="name"   
                    value={displayNameVal}
                    label="Document Name"
                    onChange={(e) => {
                      setDisplayNameVal(e.target.value);
                    }}
                  />}

                { selectedValue === "new" &&
                <Grid container lg={12}>
                  <Grid container spacing={2}>
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
                </Grid>}

                        
                { (selectedValue === "new" || (documentVal && selectedVersionValue !== "existingVersion") ) && <RHFTextField   value={descriptionVal} name="description" onChange={handleChangeDescription} label="Description" minRows={3} multiline />}

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
                { (selectedValue === "new") &&
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
    </FormProvider>
  </Container>
  );
}
