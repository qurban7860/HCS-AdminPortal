import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useState, useCallback , memo} from 'react';
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
} from '@mui/material';
// PATH
import { PATH_DOCUMENT } from '../../../routes/paths';
// slice
import {
  resetActiveDocuments,
  getDocument,
  getDocumentHistory,
  getCustomerDocuments,
  getMachineDocuments,
  getMachineDrawingsDocuments,
  addDocument,
  setDocumentViewFormVisibility,
  setDocumentHistoryViewFormVisibility,
  setDocumentFormVisibility,
  setDocumentAddFilesViewFormVisibility,
  setDocumentNewVersionFormVisibility,
  setDocumentHistoryAddFilesViewFormVisibility,
  setDocumentHistoryNewVersionFormVisibility,
} from '../../../redux/slices/document/document';
import {
  getActiveDocumentCategories,
} from '../../../redux/slices/document/documentCategory';
import {
  resetActiveDocumentTypes,
  getActiveDocumentTypesWithCategory,
} from '../../../redux/slices/document/documentType';
import {
  addDocumentVersion,
  updateDocumentVersion,
} from '../../../redux/slices/document/documentVersion';
import {
  resetActiveMachines
} from '../../../redux/slices/products/machine';
import { resetActiveSites } from '../../../redux/slices/customer/site';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUpload,
} from '../../../components/hook-form';
// assets
import DialogLabel from '../../components/Dialog/DialogLabel';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import RadioButtons from '../../components/DocumentForms/RadioButtons';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import {
  DocRadioValue,
  DocRadioLabel,
  Snacks,
} from '../../../constants/document-constants';
import DocumentCover from '../../components/DocumentForms/DocumentCover';
import { FORMLABELS } from '../../../constants/default-constants';
import { validateFileType } from './Utills/Util'

// ----------------------------------------------------------------------
DocumentAddForm.propTypes = {
  currentDocument: PropTypes.object,
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  machineDrawings: PropTypes.bool,
  handleFormVisibility: PropTypes.func,
};

function DocumentAddForm({
  currentDocument,
  customerPage,
  machinePage,
  machineDrawings,
  handleFormVisibility,
}) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { machine } = useSelector((state) => state.machine);
  const { document ,documentHistory, activeDocuments, documentAddFilesViewFormVisibility, documentNewVersionFormVisibility, documentHistoryAddFilesViewFormVisibility, documentHistoryNewVersionFormVisibility } = useSelector((state) => state.document);
  const { customer } = useSelector((state) => state.customer);

  // ------------------ document values states ------------------------------

  const [selectedValue, setSelectedValue] = useState('new');
  const [selectedVersionValue, setSelectedVersionValue] = useState('newVersion');
  const [readOnlyVal, setReadOnlyVal] = useState(false);
  const [readOnlyDocument, setReadOnlyDocument] = useState(false);
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
      documentType: null,
      documentCategory: null,
      displayName:  '',
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
  const {
    reset,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const {  documentType, documentCategory, displayName, documentVal, files, isActive, customerAccess,  } = watch();

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
    if( documentHistoryNewVersionFormVisibility ){
      setReadOnlyDocument(true);
      setSelectedValue('newVersion');
      setSelectedVersionValue('newVersion');
      setValue('documentVal',documentHistory)
      setValue('displayName', documentHistory.displayName);
      setValue('documentType', documentHistory.docType);
      setValue('documentCategory', documentHistory.docCategory);
      setValue('customerAccess', documentHistory.customerAccess);
      setValue('isActive', documentHistory.isActive);
      setReadOnlyVal(true);
    }else if( documentHistoryAddFilesViewFormVisibility ){
      setReadOnlyDocument(true);
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
  },[ documentHistoryNewVersionFormVisibility, documentHistoryAddFilesViewFormVisibility, documentHistory ])

  useEffect(()=>{
    if( documentNewVersionFormVisibility ){
      setReadOnlyDocument(true);
      setSelectedValue('newVersion');
      setSelectedVersionValue('newVersion');
      setValue('documentVal',document)
      setValue('displayName', document.displayName);
      setValue('documentType', document.docType);
      setValue('documentCategory', document.docCategory);
      setValue('customerAccess', document.customerAccess);
      setValue('isActive', document.isActive);
      setReadOnlyVal(true);
    }else if( documentAddFilesViewFormVisibility ){
      setReadOnlyDocument(true);
      setSelectedVersionValue('existingVersion');
      setSelectedValue('newVersion');
      setValue('documentVal',document)
      setValue('displayName', document.displayName);
      setValue('documentType', document.docType);
      setValue('documentCategory', document.docCategory);
      setValue('customerAccess', document.customerAccess);
      setValue('isActive', document.isActive);
      setReadOnlyVal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ documentNewVersionFormVisibility, documentAddFilesViewFormVisibility, document ])

  useEffect(() => {
    if (!documentNewVersionFormVisibility && !documentAddFilesViewFormVisibility && !documentHistoryNewVersionFormVisibility && !documentHistoryAddFilesViewFormVisibility) {
      reset();
      setSelectedValue('new');
      setReadOnlyDocument(false);
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
  

  const onSubmit = async (data) => {
    try {
      if (selectedValue === 'new') {
        // New Document Part
        await dispatch(addDocument( customerPage ? customer?._id : null, machinePage ? machine?._id : null, data));
        enqueueSnackbar(Snacks.addedDoc);
        if (!customerPage && !machinePage && machineDrawings) {
          navigate(PATH_DOCUMENT.document.machineDrawings.list);
        }else if(handleFormVisibility){
          handleFormVisibility();
        }
      } else if (selectedVersionValue === 'newVersion') {
        // New versions Part
        await dispatch(addDocumentVersion(documentVal._id, data));
        enqueueSnackbar(Snacks.updatedDoc);
        // page Navigation conditions for new versions
        if (!customerPage && !machinePage && machineDrawings && (documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility)) {
          dispatch(setDocumentHistoryAddFilesViewFormVisibility(false))
          dispatch(setDocumentHistoryNewVersionFormVisibility(false))
          dispatch(setDocumentAddFilesViewFormVisibility(false))
          dispatch(setDocumentNewVersionFormVisibility(false))
          navigate(PATH_DOCUMENT.document.machineDrawings.view(documentHistory._id));
        } else if(!customerPage && !machinePage && !documentHistoryNewVersionFormVisibility && !documentHistoryAddFilesViewFormVisibility  && machineDrawings ){
          navigate(PATH_DOCUMENT.document.machineDrawings.list);
        }else if(!customerPage && !machinePage && !machineDrawings && (documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility)){
          dispatch(setDocumentHistoryAddFilesViewFormVisibility(false))
          dispatch(setDocumentHistoryNewVersionFormVisibility(false))
          dispatch(setDocumentAddFilesViewFormVisibility(false))
          dispatch(setDocumentNewVersionFormVisibility(false))
          navigate(PATH_DOCUMENT.document.view(documentHistory._id));
        }else if((documentNewVersionFormVisibility || documentAddFilesViewFormVisibility) && (customerPage  || machinePage)){
          dispatch(setDocumentHistoryAddFilesViewFormVisibility(false))
          dispatch(setDocumentHistoryNewVersionFormVisibility(false))
          dispatch(setDocumentAddFilesViewFormVisibility(false))
          dispatch(setDocumentNewVersionFormVisibility(false))
          dispatch(setDocumentViewFormVisibility(true))
          dispatch(setDocumentFormVisibility(false))
          dispatch(getDocument(documentVal._id))
        }else if((documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility) && (customerPage  || machinePage)){
          dispatch(setDocumentHistoryAddFilesViewFormVisibility(false))
          dispatch(setDocumentHistoryNewVersionFormVisibility(false))
          dispatch(setDocumentAddFilesViewFormVisibility(false))
          dispatch(setDocumentNewVersionFormVisibility(false))
          dispatch(setDocumentHistoryViewFormVisibility(true))
          dispatch(setDocumentFormVisibility(false))
          dispatch(getDocumentHistory(documentVal._id))
        }else if(handleFormVisibility){
          handleFormVisibility();
        }
      } else {
        // Update versions Part
        await dispatch(updateDocumentVersion(documentVal._id, documentVal?.documentVersions[0]?._id, data));
        enqueueSnackbar(Snacks.updatedDoc);
        // Page Navigation conditions for update versions
        if (!customerPage && !machinePage && machineDrawings && (documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility)) {
          dispatch(setDocumentHistoryAddFilesViewFormVisibility(false))
          dispatch(setDocumentHistoryNewVersionFormVisibility(false))
          dispatch(setDocumentAddFilesViewFormVisibility(false))
          dispatch(setDocumentNewVersionFormVisibility(false))
          navigate(PATH_DOCUMENT.document.machineDrawings.view(documentHistory._id));
        } else if(!customerPage && !machinePage && !documentHistoryNewVersionFormVisibility && !documentHistoryAddFilesViewFormVisibility  && machineDrawings ){
          dispatch(setDocumentHistoryAddFilesViewFormVisibility(false))
          dispatch(setDocumentHistoryNewVersionFormVisibility(false))
          dispatch(setDocumentAddFilesViewFormVisibility(false))
          dispatch(setDocumentNewVersionFormVisibility(false))
          navigate(PATH_DOCUMENT.document.machineDrawings.list);
        }else if(!customerPage && !machinePage && !machineDrawings && (documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility)){
          dispatch(setDocumentHistoryAddFilesViewFormVisibility(false))
          dispatch(setDocumentHistoryNewVersionFormVisibility(false))
          dispatch(setDocumentAddFilesViewFormVisibility(false))
          dispatch(setDocumentNewVersionFormVisibility(false))
          navigate(PATH_DOCUMENT.document.view(documentHistory._id));
        }else if((documentNewVersionFormVisibility || documentAddFilesViewFormVisibility) && (customerPage  || machinePage)){
          dispatch(setDocumentHistoryAddFilesViewFormVisibility(false))
          dispatch(setDocumentHistoryNewVersionFormVisibility(false))
          dispatch(setDocumentAddFilesViewFormVisibility(false))
          dispatch(setDocumentNewVersionFormVisibility(false))
          dispatch(setDocumentViewFormVisibility(true))
          dispatch(setDocumentFormVisibility(false))
          dispatch(getDocument(documentVal._id))
        }else if((documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility) && (customerPage  || machinePage)){
          dispatch(setDocumentHistoryAddFilesViewFormVisibility(false))
          dispatch(setDocumentHistoryNewVersionFormVisibility(false))
          dispatch(setDocumentAddFilesViewFormVisibility(false))
          dispatch(setDocumentNewVersionFormVisibility(false))
          dispatch(setDocumentHistoryViewFormVisibility(true))
          dispatch(setDocumentFormVisibility(false))
          dispatch(getDocumentHistory(documentVal._id))
        }else if(handleFormVisibility){
          handleFormVisibility();
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
    if (!customerPage && !machinePage && !documentNewVersionFormVisibility && !documentAddFilesViewFormVisibility && !documentHistoryNewVersionFormVisibility && !documentHistoryAddFilesViewFormVisibility) {
      navigate(PATH_DOCUMENT.document.machineDrawings.list);
    } else if((documentNewVersionFormVisibility || documentAddFilesViewFormVisibility)  && (customerPage || machinePage)){
      dispatch(setDocumentHistoryAddFilesViewFormVisibility(false))
      dispatch(setDocumentHistoryNewVersionFormVisibility(false))
      dispatch(setDocumentAddFilesViewFormVisibility(false))
      dispatch(setDocumentNewVersionFormVisibility(false))
      dispatch(setDocumentViewFormVisibility(true))
      dispatch(setDocumentFormVisibility(false))
    }else if((documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility) && (customerPage || machinePage) ){
      dispatch(setDocumentHistoryAddFilesViewFormVisibility(false))
      dispatch(setDocumentHistoryNewVersionFormVisibility(false))
      dispatch(setDocumentAddFilesViewFormVisibility(false))
      dispatch(setDocumentNewVersionFormVisibility(false))
      dispatch(setDocumentHistoryViewFormVisibility(true))
      dispatch(setDocumentFormVisibility(false))
    }else if(machineDrawings && (documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility)){
      dispatch(setDocumentHistoryAddFilesViewFormVisibility(false))
      dispatch(setDocumentHistoryNewVersionFormVisibility(false))
      dispatch(setDocumentAddFilesViewFormVisibility(false))
      dispatch(setDocumentNewVersionFormVisibility(false))
      navigate(PATH_DOCUMENT.document.machineDrawings.view(documentHistory._id))
    }else if(!machineDrawings && !customerPage && !machinePage){
      dispatch(setDocumentHistoryAddFilesViewFormVisibility(false))
      dispatch(setDocumentHistoryNewVersionFormVisibility(false))
      dispatch(setDocumentAddFilesViewFormVisibility(false))
      dispatch(setDocumentNewVersionFormVisibility(false))
      navigate(PATH_DOCUMENT.document.view(documentHistory._id))
    }else if(handleFormVisibility && !documentNewVersionFormVisibility && !documentAddFilesViewFormVisibility && !documentHistoryNewVersionFormVisibility && !documentHistoryAddFilesViewFormVisibility){
      dispatch(setDocumentHistoryAddFilesViewFormVisibility(false))
      dispatch(setDocumentHistoryNewVersionFormVisibility(false))
      dispatch(setDocumentAddFilesViewFormVisibility(false))
      dispatch(setDocumentNewVersionFormVisibility(false))
      handleFormVisibility();
    }
  }

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
                <RadioButtons
                  radioDisaled={ documentNewVersionFormVisibility || documentAddFilesViewFormVisibility || documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility }
                  value={selectedValue}
                  radioOnChange={handleRadioChange}
                  newValue={DocRadioValue.new}
                  newLabel={DocRadioLabel.new}
                  secondValue={DocRadioValue.newVersion}
                  secondLabel={DocRadioLabel.existing}
                />

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
                          disabled={readOnlyDocument}
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
                        files.length > 1 ?
                        setValue(
                          'files',
                          files &&
                            files?.filter((file) => file !== inputFile),
                          { shouldValidate: true }
                        ): setValue('files', '', { shouldValidate: true })
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

export default memo(DocumentAddForm)