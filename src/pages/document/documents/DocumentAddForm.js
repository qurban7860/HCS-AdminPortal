import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Card,
  Grid,
  Stack,
  Autocomplete,
  TextField,
  Dialog,
  Container,
  Typography,
} from '@mui/material';
// PATH
import { PATH_MACHINE, PATH_DASHBOARD, PATH_DOCUMENT } from '../../../routes/paths';
// slice
import {
  getActiveDocuments,
  getDocuments,
  addDocument,
  getCustomerDocuments,
  getMachineDocuments,
  getMachineDrawingsDocuments,
  resetActiveDocuments,
  getCustomerSiteDocuments,
  setDocumentAddFilesViewFormVisibility,
  setDocumentNewVersionFormVisibility,
  setDocumentHistoryViewFormVisibility,
  setDocumentFormVisibility,
  getDocumentHistory
} from '../../../redux/slices/document/document';
import {
  setDocumentCategoryFormVisibility,
  getActiveDocumentCategories,
} from '../../../redux/slices/document/documentCategory';
import {
  setDocumentTypeFormVisibility,
  getActiveDocumentTypes,
  resetActiveDocumentTypes,
  getActiveDocumentTypesWithCategory,
} from '../../../redux/slices/document/documentType';
import {
  addDocumentVersion,
  updateDocumentVersion,
} from '../../../redux/slices/document/documentVersion';
import {
  getActiveMachines,
  resetActiveMachines,
  getActiveModelMachines,
} from '../../../redux/slices/products/machine';
import { getActiveMachineModels } from '../../../redux/slices/products/model';
import { getActiveCustomers } from '../../../redux/slices/customer/customer';
import { getActiveSites, resetActiveSites } from '../../../redux/slices/customer/site';
// components
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFMultiSelect,
  RHFTextField,
  RHFName,
  RHFSwitch,
  RHFUpload,
} from '../../../components/hook-form';
// assets
import DialogLabel from '../../components/Dialog/DialogLabel';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import RadioButtons from '../../components/DocumentForms/RadioButtons';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import {
  fileTypesArray,
  fileTypesMessage,
  allowedExtensions,
  DocRadioValue,
  DocRadioLabel,
  Snacks,
} from '../../../constants/document-constants';
import DocumentCover from '../../components/DocumentForms/DocumentCover';
import DocumentMachineAddForm from '../archived/documents/DocumentAddForms/DocumentMachineAddForm';
import { FORMLABELS } from '../../../constants/default-constants';
// import { validateFileType } from './Utills/Util'

// ----------------------------------------------------------------------
DocumentAddForm.propTypes = {
  currentDocument: PropTypes.object,
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  machineDrawings: PropTypes.bool,
  handleFormVisibility: PropTypes.func,
};

export default function DocumentAddForm({
  currentDocument,
  customerPage,
  machinePage,
  machineDrawings,
  handleFormVisibility,
}) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();


  const validateFileType = (value, options) => {
    const { path, createError } = options;
    if (value && Array.isArray(value)) {
      if (value.length > 10) {
        return createError({
          message: 'Maximum 10 files can be uploaded at a time.',
          path,
          value,
        });
      }
      const invalidFiles = value.filter((file) => {
        const fileExtension = file?.name?.split('.').pop().toLowerCase();
        return !allowedExtensions.includes(fileExtension);
      });
      if (invalidFiles.length > 0) {
        const invalidFileNames = invalidFiles.map((file) => file.name).join(', ');
        return createError({
          message: `Invalid file(s) detected: ${invalidFileNames}`,
          path,
          value,
        });
      }
      return true;
    }
    return createError({
      message: 'File is required!',
      path,
      value,
    });
  };

  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { activeMachines, machine } = useSelector((state) => state.machine);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { documentHistory, activeDocuments, documentAddFilesViewFormVisibility, documentNewVersionFormVisibility } = useSelector((state) => state.document);
  const { activeCustomers, customer } = useSelector((state) => state.customer);
  const { activeContacts } = useSelector((state) => state.contact);
  const { activeSites } = useSelector((state) => state.site);

  // ------------------ document values states ------------------------------
  const [selectedValue, setSelectedValue] = useState('new');
  const [selectedVersionValue, setSelectedVersionValue] = useState('newVersion');
  const [readOnlyVal, setReadOnlyVal] = useState(false);
  // const [contactDisabled, setContactDisabled] = useState(false);
  const [documentDependency, setDocumentDependency] = useState('customer');
  const [previewVal, setPreviewVal] = useState('');
  const [preview, setPreview] = useState(false);
  const [categoryBy, setCategoryBy] = useState('');

  const AddDocumentSchema = Yup.object().shape({
    documentVal: Yup.object().when({
      is: () => selectedValue === "newVersion",
      then: Yup.object().nullable().required().label('Document'),
      otherwise: Yup.object().nullable(), 
    }),
    documentCategory: Yup.object().when( {
      is: () => selectedValue === "new",
      then: Yup.object().nullable().required().label('Document Category'),
      otherwise: Yup.object().nullable(), 
    }),
    documentType: Yup.object().when( {
      is: () => selectedValue === "new",
      then: Yup.object().nullable().required().label('Document Type'),
      otherwise: Yup.object().nullable(), 
    }),
    displayName: Yup.string().when( {
      is: () => selectedValue === "new",
      then: Yup.string().nullable().required().label('Document Name'),
      otherwise: Yup.string().nullable(), 
    }),
    files: Yup.mixed()
    .required('File is required!')
    .test(
      'fileType',
      'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
      validateFileType
    ).nullable(true),
    referenceNumber: Yup.string().max(20)
    .test('Reference number', 'Reference number can not have spaces', numValue =>!(numValue.includes(' '))),
    versionNo: Yup.number()
    .typeError('Version number must be a number')
    .transform((value, originalValue) => {
    if (originalValue.trim() === '') return undefined;
    return parseFloat(value);
    })
    .positive("Version number must be a positive number!")
    .integer("Version number can't include a decimal point")
    .test('no-spaces', 'Version number cannot have spaces', value => !(value && value.toString().includes(' ')))
    .max(1000, 'Version number must be less than or equal to 1000').nullable(),
    description: Yup.string().max(10000),
    isActive: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(AddDocumentSchema),
    defaultValues:{
      documentType: (documentHistory?.documentType && documentNewVersionFormVisibility )|| null,
      documentCategory: ( documentHistory?.documentCategory && documentNewVersionFormVisibility ) || null,
      displayName: ( documentHistory?.displayName && documentNewVersionFormVisibility ) || '',
      referenceNumber:  '',
      versionNo:  '',
      documentVal:  null ,
      description:  '',
      files: null,
      isActive: true,
      customerAccess:false,
      customerVal: '',
      machineVal: '',
    },
  });
  // (documentAddFilesViewFormVisibility ||documentNewVersionFormVisibility) ? document :
  const {
    reset,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const {  documentType, documentCategory, displayName, referenceNumber, versionNo, documentVal, description, files, isActive, customerAccess, customerVal, machineVal } = watch();

  useEffect(()=>{
    if(customerPage){
      setCategoryBy({customer: true});
    }else if(machinePage){
      setCategoryBy({machine: true});
    }
    else if(machineDrawings){
      setCategoryBy({drawing: true});
    }
  },[customerPage, machinePage, machineDrawings ])

  useEffect(() => {
    if(categoryBy){
      dispatch(getActiveDocumentCategories(categoryBy));
    }
  },[dispatch, categoryBy])

  useEffect(()=>{
    if( documentNewVersionFormVisibility ){
      setSelectedValue('newVersion');
      setSelectedVersionValue('newVersion');
      setValue('documentVal',documentHistory)
      setValue('displayName', documentHistory.displayName);
      setValue('documentType', documentHistory.docType);
      setValue('documentCategory', documentHistory.docCategory);
      setValue('customerAccess', documentHistory.customerAccess);
      setValue('isActive', documentHistory.isActive);
      setReadOnlyVal(true);
    }else if( documentAddFilesViewFormVisibility ){
      setSelectedVersionValue('existingVersion');
      setSelectedValue('newVersion');
      setValue('documentVal',documentHistory)
      setValue('displayName', documentHistory.displayName);
      setValue('documentType', documentHistory.docType);
      setValue('documentCategory', documentHistory.docCategory);
      setValue('customerAccess', documentHistory.customerAccess);
      setValue('isActive', documentHistory.isActive);
      setReadOnlyVal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ documentNewVersionFormVisibility, documentAddFilesViewFormVisibility, documentHistory ])

  useEffect(() => {
    if (!documentNewVersionFormVisibility && !documentAddFilesViewFormVisibility) {
      reset();
      setSelectedValue('new');
    }
    dispatch(resetActiveDocuments());
    dispatch(resetActiveMachines);
    dispatch(resetActiveSites);
    dispatch(resetActiveDocumentTypes());
    // dispatch(getActiveDocumentTypes());
    // dispatch(getActiveCustomers());
    // dispatch(getActiveMachines());
    // dispatch(getActiveMachineModels());
    if (customerPage) {
      setValue('customerVal', customer?._id);
    }
    if (machinePage) {
      setValue('machineVal', machine?._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (documentCategory?._id) {
      dispatch(getActiveDocumentTypesWithCategory(documentCategory?._id));
    }
  }, [documentCategory, dispatch]);

  // useEffect(() => {
  //   if (documentDependency === 'machine' && machineModelVal) {
  //     dispatch(getActiveModelMachines(machineModelVal._id));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch, machineModelVal]);

  // useEffect(() => {
  //   if (customerVal?._id) {
  //     dispatch(getActiveSites(customerVal._id));
  //   }
  // }, [dispatch, customerVal]);

  // ------------------------- customer documents ---------------------------------------
  // useEffect(() => {
  //   if (!customerSiteVal && customerVal?._id && selectedValue === 'newVersion') {
  //     dispatch(getCustomerDocuments(customerVal._id));
  //   }
  // }, [dispatch, customerVal, customerSiteVal, selectedValue]);

  // -------------------------get forCustomer documents ---------------------------------------
  useEffect(() => {
    if ( customerPage && !machinePage && !machineDrawings ) {
      if(customerPage && customer?._id && selectedValue === 'newVersion'){
        dispatch(getCustomerDocuments(customer?._id));
      }
    }
  }, [dispatch, customer, customerPage, machineDrawings, machinePage, selectedValue ]);

  // ------------------------- customer Site documents ---------------------------------------
  // useEffect(() => {
  //   if (customerSiteVal?._id && selectedValue === 'newVersion') {
  //     dispatch(getCustomerSiteDocuments(customerSiteVal._id));
  //     console.log('customerSiteVal._id : ', customerSiteVal._id);
  //   }
  // }, [dispatch, customerSiteVal, selectedValue]);

  // ------------------------- get forMachine documents ---------------------------------------
  useEffect(() => {
    if ( !customerPage && machinePage && !machineDrawings) {
      if(machinePage && machine?._id && selectedValue === 'newVersion'){
        dispatch(getMachineDocuments(machine?._id));
      }
    }
  }, [dispatch, machine, customerPage, machineDrawings, machinePage, selectedValue]);

    // ------------------------- get forMachineDrawings documents ---------------------------------------
    useEffect(() => {
      if ( !customerPage && !machinePage && machineDrawings && selectedValue === 'newVersion') {
          dispatch(getMachineDrawingsDocuments());
      }
    }, [dispatch, customerPage, machineDrawings, machinePage, selectedValue]);
  
  // ------------------------- machine documents ---------------------------------------
  // useEffect(() => {
  //   if (machineVal?._id && selectedValue === 'newVersion') {
  //     dispatch(getMachineDocuments(machineVal._id, machineModelVal._id));
  //   }
  //   if (machineModelVal._id && !machineVal && selectedValue === 'newVersion') {
  //     dispatch(getMachineDocuments(null, machineModelVal._id));
  //   }
  // }, [dispatch, machineVal, machineModelVal, selectedValue]);


  const onSubmit = async (data) => {
    try {
      console.log("data : " , data);
      if (selectedValue === 'new') {
        await dispatch(
          addDocument( customerPage ? customer?._id : null, machinePage ? machine?._id : null, data)
        );
        enqueueSnackbar(Snacks.addedDoc);
        if (!customerPage && !machinePage && machineDrawings) {
          navigate(PATH_DOCUMENT.document.machineDrawings.list);
        } else {
          handleFormVisibility();
        }
      } else if (selectedVersionValue === 'newVersion') {
        console.log('newVersion ');
        await dispatch(addDocumentVersion(documentVal._id, data));
        enqueueSnackbar(Snacks.updatedDoc);
        if (!customerPage && !machinePage && machineDrawings ) {
          navigate(PATH_DOCUMENT.document.machineDrawings.list);
        } else if(!documentNewVersionFormVisibility && !documentAddFilesViewFormVisibility){
          handleFormVisibility();
          }else{
            dispatch(setDocumentAddFilesViewFormVisibility(false))
            dispatch(setDocumentNewVersionFormVisibility(false))
            dispatch(setDocumentHistoryViewFormVisibility(true))
            dispatch(setDocumentFormVisibility(false))
            dispatch(getDocumentHistory(documentVal._id))
          }
      } else {
        await dispatch(
          updateDocumentVersion(documentVal._id, documentVal?.documentVersions[0]?._id, data)
        );

        enqueueSnackbar(Snacks.updatedDoc);
        if (!customerPage && !machinePage && machineDrawings) {
          navigate(PATH_DOCUMENT.document.machineDrawings.list);
        } else if(!documentNewVersionFormVisibility && !documentAddFilesViewFormVisibility){
          handleFormVisibility();
          }else{
            dispatch(setDocumentAddFilesViewFormVisibility(false))
            dispatch(setDocumentNewVersionFormVisibility(false))
            dispatch(setDocumentHistoryViewFormVisibility(true))
            dispatch(setDocumentFormVisibility(false))
            dispatch(getDocumentHistory(documentVal._id))
          }
      }
      setReadOnlyVal(false);
      setPreview(false);
      setPreviewVal('');
      reset();
    } catch (error) {
      enqueueSnackbar(Snacks.failedDoc, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    if (!customerPage && !machinePage) {
      navigate(PATH_DOCUMENT.document.machineDrawings.list);
    } else if(!documentNewVersionFormVisibility && !documentAddFilesViewFormVisibility){
      handleFormVisibility();
      }else{
        dispatch(setDocumentAddFilesViewFormVisibility(false))
        dispatch(setDocumentNewVersionFormVisibility(false))
        dispatch(setDocumentHistoryViewFormVisibility(true))
        dispatch(setDocumentFormVisibility(false))
      }
    }

  const previewHandle = () => setPreview(true);
  const handleClosePreview = () => setPreview(false);
  const handleChange = () => setValue('customerAccess' ,!customerAccess);

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
    if (event.target.value === 'new') {
      setReadOnlyVal(false);
      reset();
    }
  };
  const handleVersionRadioChange = (event) => setSelectedVersionValue(event.target.value);
  const handleDependencyChange = (event) => {
    setDocumentDependency(event.target.value);

    if (event.target.value === 'new') {
      setReadOnlyVal(false);
    }
    // if(event.target.value === "newVersion"){
    dispatch(resetActiveSites());
    dispatch(resetActiveMachines());
    dispatch(resetActiveDocuments());
  };



  const handleIsActiveChange = () => setValue('isActive' ,!isActive);

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      const docFiles = files || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
    },
    [setValue, files ]
  );


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {!customerPage && !machinePage && 
        <DocumentCover content={machineDrawings ? FORMLABELS.COVER.ADD_MACHINE_DRAWINGSS :  FORMLABELS.COVER.ADD_DOCUMENTS} backLink={!customerPage && !machinePage && !machineDrawings} machineDrawingsBackLink={machineDrawings} generalSettings />
      }
      <Box
        column={12}
        rowGap={3}
        columnGap={2}
        // display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
        mt={3}
      >
        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* {!(customerPage || machinePage) && (
                  <RadioButtons
                    value={documentDependency}
                    radioOnChange={handleDependencyChange}
                    newLabel={DocRadioLabel.customer}
                    newValue={DocRadioValue.customer}
                    secondLabel={DocRadioLabel.machine}
                    secondValue={DocRadioValue.machine}
                  />
                )} */}

                {/* {documentDependency === 'customer' && !(customerPage || machinePage) && (
                  <Grid container item lg={12}>
                    <Grid container spacing={2}>
                      <Grid item lg={6}>

                        <Autocomplete
                          // freeSolo
                          value={customerVal || null}
                          options={activeCustomers}
                          // isOptionEqualToValue={(option, value) => option.name === value.name}
                          getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setCustomerVal(newValue);
                              setContactDisabled(false);
                              setSiteDisabled(false);
                              setCustomerSiteVal('');
                              setMachineVal('');
                              setMachineModelVal('');
                              dispatch(resetActiveSites());
                              setDocumentVal('');
                              dispatch(resetActiveDocuments());
                            } else {
                              setCustomerVal('');
                              setContactDisabled(false);
                              setSiteDisabled(false);
                              setCustomerSiteVal('');
                              dispatch(resetActiveSites());
                              setDocumentVal('');
                              dispatch(resetActiveDocuments());
                            }
                          }}
                          // renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
                          id="controllable-states-demo"
                          renderInput={(params) => (
                            <TextField {...params} required label="Select Customer" />
                          )}
                          ChipProps={{ size: 'small' }}
                        />

                      </Grid>
                      <Grid item lg={6}>

                        <Autocomplete
                          // freeSolo
                          disabled={siteDisabled}
                          value={customerSiteVal || null}
                          options={activeSites}
                          isOptionEqualToValue={(option, value) => option.name === value.name}
                          getOptionLabel={(option) => `${option.name ? option.name : ''}`}
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
                          renderInput={(params) => <TextField {...params} label="Select Site" />}
                          ChipProps={{ size: 'small' }}
                        />

                      </Grid>
                    </Grid>
                  </Grid>
                )} */}

                {/* Machine */}
                {/* will write a better way */}
                {/* {documentDependency === 'machine' && !(customerPage || machinePage) && (
                  <DocumentMachineAddForm
                    disabled={readOnlyVal}
                    value={machineModelVal || null}
                    options={activeMachineModels}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setMachineModelVal(newValue);
                        setMachineVal('');
                        setCustomerVal('');
                        setCustomerSiteVal('');
                        dispatch(resetActiveMachines());
                        setDocumentVal('');
                        dispatch(resetActiveDocuments());
                      } else {
                        setMachineModelVal('');
                        setMachineVal('');
                        dispatch(resetActiveMachines());
                        setDocumentVal('');
                        dispatch(resetActiveDocuments());
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} required label="Select Model" />
                    )}
                    SubValue={machineVal || null}
                    SubOptions={activeMachines}
                    SubOnChange={(event, newValue) => {
                      if (newValue) {
                        setMachineVal(newValue);
                      } else {
                        setMachineVal('');
                        setDocumentVal('');
                        dispatch(resetActiveDocuments());
                      }
                    }}
                    SubRenderInput={(params) => <TextField {...params} label="Select Machine" />}
                  />
                )} */}

                <RadioButtons
                  value={selectedValue}
                  radioOnChange={handleRadioChange}
                  newValue={DocRadioValue.new}
                  newLabel={DocRadioLabel.new}
                  secondValue={DocRadioValue.newVersion}
                  secondLabel={DocRadioLabel.existing}
                />

                {/* New Version */}
                {selectedValue === 'newVersion' && (
                  <Grid container item lg={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={12}>
                      <Controller
                        name="documentVal"
                        control={control}
                        defaultValue={documentVal || null}
                        render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                        <Autocomplete
                          {... field}
                          options={activeDocuments}
                          isOptionEqualToValue={(option, value) => option?._id === value?._id}
                          getOptionLabel={(option) =>
                            `${option.displayName ? option.displayName : ''}`
                          }
                          onChange={(event, value) => {
                            field.onChange(value)
                            if (value) {;
                              setValue('displayName', value.displayName);
                              setValue('documentType', value.docType);
                              setValue('documentCategory', value.docCategory);
                              setValue('customerAccess', value.customerAccess);
                              setValue('isActive', value.isActive);
                              setReadOnlyVal(true);
                              setSelectedVersionValue('newVersion');
                            } else {
                              setValue('documentVal', null );
                              setValue('displayName', '');
                              setValue('documentType', null);
                              setValue('documentCategory', null);
                              setValue('customerAccess',false);
                              setReadOnlyVal(false);
                            }
                          }}
                          renderOption={(props, option) => ( <li {...props} key={option._id}>{`${ option.displayName ? option.displayName : ''}`}</li> )}
                          id="controllable-states-demo"
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              label="Select  Document*" 
                              name="documentVal"
                              id="documentVal"
                              error={!!error}
                              helperText={error?.message} 
                              inputRef={ref}
                            />
                          )}
                          ChipProps={{ size: 'small' }}
                        />
                        )}
                      />
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {/*  New Document */}
                {(selectedValue === 'new' || documentVal) && (
                      <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                      >

                      <Controller
                        name="documentCategory"
                        control={control}
                        defaultValue={documentCategory || null}
                        render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                        <Autocomplete
                          {...field}
                          disabled={readOnlyVal}
                          options={activeDocumentCategories}
                          isOptionEqualToValue={(option, value) => option?._id === value?._id}
                          getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                          onChange={(event, value) => {
                            field.onChange(value)
                            if (value) {
                              if (value?._id !== documentCategory?._id) {
                              dispatch(resetActiveDocumentTypes());
                              setValue('documentType', null);
                              }
                            } else {
                              setValue('documentCategory', null);
                              dispatch(resetActiveDocumentTypes());
                              setValue('documentType', null);
                            }
                            }}
                          renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li> )}
                          id="controllable-states-demo"
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              label="Document Category*" 
                              name="documentCategory"
                              id="documentCategory" 
                              error={!!error}
                              helperText={error?.message} 
                              inputRef={ref}
                            />
                          )}
                          ChipProps={{ size: 'small' }}
                        />
                        )}
                      />

                      <Controller
                        name="documentType"
                        control={control}
                        defaultValue={documentType || null}
                        render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                        <Autocomplete
                          {...field}
                          disabled={readOnlyVal}
                          options={activeDocumentTypes}
                          isOptionEqualToValue={(option, value) => option?._id === value?._id}
                          getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                          onChange={(event, value) => field.onChange(value)}
                          renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>)}
                          id="controllable-states-demo"
                          renderInput={(params) => (
                            <TextField 
                            {...params} 
                            name="documentType"
                            id="documentType" 
                            label="Document Type*" 
                            error={!!error}
                            helperText={error?.message} 
                            inputRef={ref}
                            />
                          )}
                            ChipProps={{ size: 'small' }}
                        />
                        )}
                      />

                        </Box>
                )}

                {documentVal && (
                  <RadioButtons
                    value={selectedVersionValue}
                    radioOnChange={handleVersionRadioChange}
                    newValue={DocRadioValue.newVersion}
                    newLabel={DocRadioLabel.newVersion}
                    secondValue={DocRadioValue.existing}
                    secondLabel={DocRadioLabel.currentVersion}
                  />
                )}

                {selectedValue === 'new' && (
                      <RHFTextField  
                        multiline 
                        name="displayName" 
                        id="displayName" 
                        label="Document Name*" 
                        />
                 
                )}

                {selectedValue === 'new' && (
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                >
                  <RHFTextField name='referenceNumber' label='Reference Number' />
                  <RHFTextField name='versionNo' label='Version Number' />
                </Box>)}

                {(selectedValue === 'new' ||
                  (documentVal && selectedVersionValue !== 'existingVersion')) && (
                  <RHFTextField name="description" label="Description" minRows={3} multiline />
                )}

                {(selectedValue === 'new' || documentVal) && (
                  <Grid item xs={12} md={6} lg={12}>
                    <RHFUpload
                      multiple
                      thumbnail
                      name="files"
                      // maxSize={3145728}
                      onDrop={handleDropMultiFile}
                      onRemove={(inputFile) =>
                        setValue(
                          'files',
                          files &&
                            files?.filter((file) => file !== inputFile),
                          { shouldValidate: true }
                        )
                      }
                      onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
                    />
                  </Grid>
                )}

                {selectedValue === 'new' && (
                  <ToggleButtons
                    isDocument
                    customerAccessVal={customerAccess}
                    handleChange={handleChange}
                    isActive={isActive}
                    handleIsActiveChange={handleIsActiveChange}

                  />
                )}

                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* dialog preview */}
      <Dialog
        maxWidth="md"
        open={preview}
        onClose={handleClosePreview}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogLabel onClick={() => handleClosePreview()} />
        <Box
          component="img"
          sx={{ minWidth: '400px', minHeight: '400px' }}
          alt={displayName}
          src={previewVal}
        />
      </Dialog>
    </FormProvider>
  );
}
