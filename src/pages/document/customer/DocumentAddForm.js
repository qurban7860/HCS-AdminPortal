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
import { Box, Button, Card, Grid, Stack, Typography, Autocomplete, TextField ,Link} from '@mui/material';
// routes
import { PATH_MACHINE , PATH_DASHBOARD, PATH_DOCUMENT } from '../../../routes/paths';
// slice
import { addCustomerDocument, setCustomerDocumentFormVisibility  } from '../../../redux/slices/document/customerDocument';
import { getDocumentName, getDocumentNames , setDocumentNameFormVisibility, setDocumentNameEditFormVisibility} from '../../../redux/slices/document/documentName';
import { getFileCategories, setFileCategoryFormVisibility, setFileCategoryEditFormVisibility } from '../../../redux/slices/document/fileCategory';
import { getCustomers } from '../../../redux/slices/customer/customer';
import { getMachines} from '../../../redux/slices/products/machine';
import { getContacts } from '../../../redux/slices/customer/contact';
import { getSites } from '../../../redux/slices/customer/site';
// components
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';
// assets
import { countries } from '../../../assets/data';
import FormProvider, {RHFTextField,RHFSwitch, RHFUpload} from '../../../components/hook-form';
import { Upload } from '../../../components/upload';
import Cover from '../../components/Cover';
import FormHeading from '../../components/FormHeading';
import AddFormButtons from '../../components/AddFormButtons';

// ----------------------------------------------------------------------
DocumentAddForm.propTypes = {
  currentDocument: PropTypes.object,
};
export default function DocumentAddForm({currentDocument}) {
  const { documentNames } = useSelector((state) => state.documentName);
  const { fileCategories } = useSelector((state) => state.fileCategory);
  // console.log("fileCategories : ", fileCategories, " documentNames : ", documentNames)
  const { machines } = useSelector((state) => state.machine);
  const { customer, customers } = useSelector((state) => state.customer);
  const { contacts } = useSelector((state) => state.contact); 
  const { sites } = useSelector((state) => state.site);

  const [ documentNameVal, setDocumentNameVal] = useState('')
  const [ fileCategoryVal, setFileCategoryVal] = useState('')
  const [files, setFiles] = useState([]);
  const [ machineVal, setMachineVal] = useState('')
  const [ customerVal, setCustomerVal] = useState('')
  const [ siteVal, setSiteVal] = useState('')
  const [ contactVal, setContactVal] = useState('')

  const navigate = useNavigate();

  let documentAvailable 
  if(documentNames && documentNames.length){
    documentAvailable =  true 
  }else{
    documentAvailable =  true 
  }

  let fileCategory 
  if(fileCategories && fileCategories.length){
    fileCategory =  true 
  }else{
    fileCategory =  true 
  }

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
 // a note can be archived.  
  const AddCustomerDocumentSchema = Yup.object().shape({
    note: Yup.string().max(10000).required("Note Field is required!"),
    isActive : Yup.boolean(),
  });
  const defaultValues = useMemo(
    () => ({
      note: '',
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
        await dispatch(addCustomerDocument(customerVal._id,data));
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
    dispatch(setFileCategoryFormVisibility(true))
    dispatch(setCustomerDocumentFormVisibility(false));
  }
  const togleDocumentNamePage = ()=>{
    dispatch(setDocumentNameFormVisibility(true))
    dispatch(setCustomerDocumentFormVisibility(false));
  }
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );

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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {/* <Cover name="New Customer Document"/> */}
      <Grid container spacing={3}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }} >
            <Stack spacing={2}>
              <FormHeading heading='New Document'/>
              <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >

              <RHFTextField name="name" label="Name" />
              <Grid>
              <Autocomplete
                // freeSolo
                // disabled={documentAvailable}
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
              <Link  title="Add Document Name"  sx={{ color: 'blue' }}  component="button"  variant="body2"  onClick={togleDocumentNamePage} >Not Available! <Typography variant="body" sx={{mt:1}}>Add new Document Name</Typography><Iconify icon="mdi:share" /></Link>
              </Grid>
              <Grid>
              <Autocomplete
                // freeSolo
                // disabled={fileCategory}
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
              <Link  title="Add Category"  sx={{ color: 'blue' }}  component="button"  variant="body2"  onClick={togleCategoryPage} >Not Available! <Typography variant="body" >Add new Category</Typography><Iconify icon="mdi:share" /></Link>
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
              <RHFTextField name="description" label="Description" minRows={8} multiline />
              {/* <RHFUpload
                  multiple
                  thumbnail
                  name="images"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemoveFile}
                  onRemoveAll={handleRemoveAllFiles}
                  onUpload={() => console.log('ON UPLOAD')}
                  onDelete={handleRemoveFile}
                  // onUpload={() => console.log('ON UPLOAD')}
                /> */}
              <Upload files={files} name="document"  onDrop={handleDrop} onDelete={handleRemoveFile} />
              {/* {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )} */}
              <RHFSwitch name="isActive" labelPlacement="start" label={ <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography> } />
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
            </Stack>  
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
