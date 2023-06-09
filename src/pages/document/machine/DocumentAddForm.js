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

// PATH
import { PATH_MACHINE , PATH_DASHBOARD, PATH_DOCUMENT } from '../../../routes/paths';
// slice
import { addMachineDocument,updateMachineDocument, setMachineDocumentFormVisibility, getMachineDocuments } from '../../../redux/slices/document/machineDocument';
import { setDocumentCategoryFormVisibility , getActiveDocumentCategories } from '../../../redux/slices/document/documentCategory';
import { setDocumentTypeFormVisibility , getActiveDocumentTypes } from '../../../redux/slices/document/documentType';
import { addDocumentVersion, updateDocumentVersion } from '../../../redux/slices/document/documentVersion';
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

  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { machine  } = useSelector((state) => state.machine);
  const { machineDocuments  } = useSelector((state) => state.machineDocument);

  // console.log("machine : " , machine)
  const { customers,  } = useSelector((state) => state.customer); 
  const { contacts } = useSelector((state) => state.contact); 
  const { sites } = useSelector((state) => state.site); 

  const [ documentTypeVal, setDocumentTypeVal] = useState('')
  const [ documentCategoryVal, setDocumentCategoryVal] = useState('')
  const [ documentVal, setDocumentVal] = useState('')
  const [ selectedValue, setSelectedValue] = useState('new')
  const [ selectedVersionValue, setSelectedVersionValue] = useState("newVersion")
  const [ descriptionVal, setDescriptionVal] = useState("")
  const [ readOnlyVal, setReadOnlyVal] = useState(false)
  const [ customerAccessVal, setCustomerAccessVal] = useState(false)
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
    setReadOnlyVal(false)
    setDescriptionVal("")
    dispatch(getActiveDocumentTypes());
    dispatch(getActiveDocumentCategories());
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
            const allowedExtensions = [  'png',
            'jpeg',
            'jpg',
            'gif',
            'bmp',
            'webp',
            'djvu',
            'heic',
            'heif',
            'ico',
            'jfif',
            'jp2',
            'jpe',
            'jpeg',
            'jpg',
            'jps',
            'mng',
            'nef',
            'nrw',
            'orf',
            'pam',
            'pbm',
            'pcd',
            'pcx',
            'pef',
            'pes',
            'pfm',
            'pgm',
            'picon',
            'pict',
            'png',
            'pnm',
            'ppm',
            'psd',
            'raf',
            'ras',
            'rw2',
            'sfw',
            'sgi',
            'svg',
            'tga',
            'tiff',
            'psd',
            'jxr',
            'wbmp',
            'x3f',
            'xbm',
            'xcf',
            'xpm',
            'xwd',
            'pdf',
            'doc',
            'docx',
            'xls',
            'xlsx',
            'ppt',
            'pptx',
            'csv',
            'txt',
            'odp',
            'ods',
            'odt',
            'ott',
            'rtf',
            'txt'];
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
        // if(machine?.customer?._id){
        //   data.customer = machine?.customer?._id
        // }
    
        // if(nameVal){
        // }
        data.name = nameVal
        data.displayName = displayNameVal
        data.isActive = isActive;
        if(documentCategoryVal){
          data.documentCategory = documentCategoryVal?._id
        }
        if(customerAccessVal === true || customerAccessVal === "true" ){
          data.customerAccess = true
        }else{
          data.customerAccess = false
        }
        if(documentTypeVal){
          data.documentType = documentTypeVal?._id
        }
        if(descriptionVal){
          data.description = descriptionVal;
        }
        // console.log("data : ", data)

        if(selectedValue === "new"){
          await dispatch(addMachineDocument(machine?.customer?._id, machine._id ,data));
          enqueueSnackbar('Machine document save successfully!');
        }else if (selectedVersionValue === "newVersion"){
            await dispatch(addDocumentVersion(documentVal._id,data));
          enqueueSnackbar('Machine document version updated successfully!');
        }else{
          await dispatch(updateDocumentVersion(documentVal._id,documentVal?.documentVersions[0]?._id,data));
          enqueueSnackbar('Machine document updated successfully!');
          }
          dispatch(getMachineDocuments(machine._id))
          dispatch(setMachineDocumentFormVisibility(false))
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
        enqueueSnackbar('Machine Document Save failed!', { variant: `error` });
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
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                        options={machineDocuments}
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
                    label="Name"
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
  );
}
