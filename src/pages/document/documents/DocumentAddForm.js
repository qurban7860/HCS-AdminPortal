import PropTypes from 'prop-types';
import { useEffect, useState, useCallback , memo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { Box, Card, Grid, Stack, Dialog } from '@mui/material';
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
  setViewVisiilityNoOthers,
  setViewHistoryVisiilityNoOthers,
  setDrawingAndDocumentVisibility,
} from '../../../redux/slices/document/document';
import { getActiveDocumentCategories, resetActiveDocumentCategories } from '../../../redux/slices/document/documentCategory';
import { getActiveDocumentTypesWithCategory, resetActiveDocumentTypes } from '../../../redux/slices/document/documentType';
import { addDocumentVersion, updateDocumentVersion,} from '../../../redux/slices/document/documentVersion';
import { getActiveCustomers } from '../../../redux/slices/customer/customer';
import { getCustomerMachines, resetCustomerMachines} from '../../../redux/slices/products/machine';
import { getDrawings, resetDrawings, setDrawingAddFormVisibility } from '../../../redux/slices/products/drawing';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField, RHFUpload,} from '../../../components/hook-form';
// assets
import DialogLabel from '../../components/Dialog/DialogLabel';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import RadioButtons from '../../components/DocumentForms/RadioButtons';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import { DocRadioValue, DocRadioLabel, Snacks,} from '../../../constants/document-constants';
import DocumentCover from '../../components/DocumentForms/DocumentCover';
import { FORMLABELS } from '../../../constants/default-constants';
import { documentSchema } from '../../schemas/document';


// ----------------------------------------------------------------------
DocumentAddForm.propTypes = {
  currentDocument: PropTypes.object,
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  drawingPage: PropTypes.bool,
  machineDrawings: PropTypes.bool,
  handleFormVisibility: PropTypes.func,
};

function DocumentAddForm({
  currentDocument,
  customerPage,
  machinePage,
  drawingPage,
  machineDrawings,
  handleFormVisibility,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { machine, customerMachines } = useSelector((state) => state.machine);
  const { document ,documentHistory, activeDocuments, documentAddFilesViewFormVisibility, documentNewVersionFormVisibility, documentHistoryAddFilesViewFormVisibility, documentHistoryNewVersionFormVisibility } = useSelector((state) => state.document);
  const { customer, activeCustomers } = useSelector((state) => state.customer);

  // ------------------ document values states ------------------------------
  const [ categoryBy, setCategoryBy ] = useState(null);
  const [ isDocumentTypesLoaded, setIsDocumentTypesLoaded ] = useState( false );
  const [ isDocumentCategoryLoaded, setIsDocumentCategoryLoaded ] = useState( false );
  const [ previewVal, setPreviewVal ] = useState('');
  const [ preview, setPreview ] = useState(false);
  const [ readOnlyVal, setReadOnlyVal ] = useState(false);
  const [ readOnlyDocument, setReadOnlyDocument ] = useState(false);
  const [ selectedValue, setSelectedValue ] = useState('new');
  const [ selectedVersionValue, setSelectedVersionValue ] = useState('newVersion');
  
  const methods = useForm({
    resolver: yupResolver(documentSchema( selectedValue )),
    defaultValues:{
      documentCategory:  null,
      documentType:  null,
      displayName:  '',
      stockNumber:  '',
      referenceNumber:  '',
      versionNo:  null,
      documentVal:  null ,
      description:  '',
      files: null,
      isActive: true,
      customerAccess:false,
      customer: null,
      machine: null,
    },
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { documentCategory, documentType, displayName, versionNo, documentVal, files, isActive, customerAccess  } = watch();

  useEffect(() => {
    if( customerPage && !machinePage && !machineDrawings && !categoryBy ){ // customerPage
      setCategoryBy( {customer: true} )
      if( customer?._id && selectedValue === 'newVersion' ) dispatch(getCustomerDocuments(customer?._id));
    } else if ( machinePage && !customerPage && !machineDrawings && !categoryBy ) { // machinePage 
      setCategoryBy( { machine: true } )
      if (machine?._id && selectedValue === 'newVersion') dispatch(getMachineDocuments(machine?._id));
    } else if( machineDrawings && !customerPage && !machinePage && !categoryBy ){ //  machineDrawings 
      setCategoryBy( { drawing: true } )
      if( selectedValue === 'newVersion' ) dispatch(getMachineDrawingsDocuments());
    }
  }, [dispatch, categoryBy, customerPage, customer, machinePage, machine, machineDrawings, selectedValue]);
  

  useEffect( () => { // Get Active Document Types And Active Document Categoories
    if( !isDocumentCategoryLoaded && categoryBy ){
      dispatch( getActiveDocumentCategories( categoryBy ) );  dispatch( getActiveDocumentTypesWithCategory( null, categoryBy ) ) 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ categoryBy ] )

  useEffect(() => { // Set Default Document Type Value
    if( activeDocumentTypes?.length > 0 && activeDocumentCategories?.length > 0  && !isDocumentTypesLoaded ){
      if(activeDocumentTypes.find((el)=> el.isDefault === true )?._id === activeDocumentCategories.find((el)=> el.isDefault === true )?._id){
        setValue('documentType', activeDocumentTypes.find((el)=> el.isDefault === true ))
        setValue('documentCategory', activeDocumentCategories.find((el)=>  el.isDefault === true ))
      } else if (activeDocumentTypes.find((el)=> el.isDefault === true )){
        setValue('documentType', activeDocumentTypes.find((el)=> el.isDefault === true ))
        setValue('documentCategory', activeDocumentTypes.find((el)=> el.isDefault === true )?.docCategory || null )
      } else {
        setValue('documentCategory', activeDocumentCategories.find((el)=>  el.isDefault === true ))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ activeDocumentTypes, activeDocumentCategories ] )

  useEffect(()=>{ // Get Active Document Types Against Document Categoory
    if( documentCategory?._id && categoryBy ){ dispatch( getActiveDocumentTypesWithCategory( documentCategory?._id, categoryBy ) ); 
      if(!isDocumentTypesLoaded) setIsDocumentTypesLoaded( true ); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ documentCategory ])

  useEffect(() => {
    if (!documentNewVersionFormVisibility && !documentAddFilesViewFormVisibility && !documentHistoryNewVersionFormVisibility && !documentHistoryAddFilesViewFormVisibility) {
      reset();
      setSelectedValue('new');
      setReadOnlyDocument(false);
    }
    dispatch(resetActiveDocuments()); dispatch(resetCustomerMachines()); dispatch(getActiveCustomers());
    if (customerPage)  setValue('customer', customer?._id);
    if (machinePage)  setValue('machine', machine?._id);
    return () =>  { dispatch(resetActiveDocumentTypes()); dispatch(resetActiveDocumentCategories()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, customer, machine ]);

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

  const onSubmit = async (data) => {
    try {
      if(drawingPage){
        data.machine = machine?._id;
      } 
      if (selectedValue === 'new') {
        // New Document Part
        await dispatch(addDocument( customerPage ? customer?._id : null, machinePage ? machine?._id : null, data));
        enqueueSnackbar(drawingPage || machineDrawings ?Snacks.addedDrawing:Snacks.addedDoc);
        if( drawingPage ){
          dispatch(resetDrawings());
          dispatch(getDrawings(machine?._id));
          dispatch(setDrawingAddFormVisibility(false));
        } else if (  machineDrawings && !customerPage && !machinePage ) {
          navigate(PATH_DOCUMENT.document.machineDrawings.list);
        } else if( handleFormVisibility ){
          handleFormVisibility();
        }
      } else if (selectedVersionValue === 'newVersion') {
        // New versions Part
        await dispatch(addDocumentVersion(documentVal._id, data));
        enqueueSnackbar(Snacks.updatedDoc);
        // page Navigation conditions for new versions
        if ( machineDrawings && !customerPage && !machinePage && (documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility) ){
          dispatch(setDrawingAndDocumentVisibility())
          navigate(PATH_DOCUMENT.document.machineDrawings.view(documentHistory._id));
        } else if( machineDrawings && !customerPage && !machinePage && !documentHistoryNewVersionFormVisibility && !documentHistoryAddFilesViewFormVisibility ){
          navigate(PATH_DOCUMENT.document.machineDrawings.list);
        } else if( (documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility) && !customerPage && !machinePage && !machineDrawings ){
          dispatch(setDrawingAndDocumentVisibility())
          navigate(PATH_DOCUMENT.document.view(documentHistory._id));
        } else if( (documentNewVersionFormVisibility || documentAddFilesViewFormVisibility) && (customerPage  || machinePage) ){
          dispatch(setViewVisiilityNoOthers())
          dispatch(getDocument(documentVal._id))
        } else if( (documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility) && (customerPage  || machinePage) ){
          dispatch(setViewHistoryVisiilityNoOthers(false))
          dispatch(getDocumentHistory(documentVal._id))
        } else if( handleFormVisibility ){
          handleFormVisibility();
        }
      } else {
        // Update versions Part
        await dispatch(updateDocumentVersion(documentVal._id, documentVal?.documentVersions[0]?._id, data));
        enqueueSnackbar(Snacks.updatedDoc);
        // Page Navigation conditions for update versions
        if (machineDrawings && !customerPage && !machinePage && (documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility)) {
          dispatch(setDrawingAndDocumentVisibility())
          navigate(PATH_DOCUMENT.document.machineDrawings.view(documentHistory._id));
        } else if(!customerPage && !machinePage && !documentHistoryNewVersionFormVisibility && !documentHistoryAddFilesViewFormVisibility ){
          dispatch(setDrawingAndDocumentVisibility())
        }else if(!customerPage && !machinePage && !machineDrawings && (documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility)){
          dispatch(setDrawingAndDocumentVisibility())
          navigate(PATH_DOCUMENT.document.view(documentHistory._id));
        }else if((documentNewVersionFormVisibility || documentAddFilesViewFormVisibility) && (customerPage  || machinePage)){
          dispatch(setViewVisiilityNoOthers())
          dispatch(getDocument(documentVal._id))
        }else if((documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility) && (customerPage  || machinePage)){
          dispatch(setViewHistoryVisiilityNoOthers(false))
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
    if(drawingPage){
      dispatch(setDrawingAddFormVisibility(false));
    } else if (!drawingPage && !customerPage && !machinePage && !documentNewVersionFormVisibility && !documentAddFilesViewFormVisibility && !documentHistoryNewVersionFormVisibility && !documentHistoryAddFilesViewFormVisibility) {
      navigate(PATH_DOCUMENT.document.machineDrawings.list);
    } else if((documentNewVersionFormVisibility || documentAddFilesViewFormVisibility)  && (customerPage || machinePage)){
      dispatch(setViewVisiilityNoOthers())
    }else if((documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility) && (customerPage || machinePage) ){
      dispatch(setViewHistoryVisiilityNoOthers(false))
    }else if(machineDrawings && (documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility)){
      dispatch(setDrawingAndDocumentVisibility())
      navigate(PATH_DOCUMENT.document.machineDrawings.view(documentHistory._id))
    }else if(!machineDrawings && !customerPage && !machinePage){
      dispatch(setDrawingAndDocumentVisibility())
      navigate(PATH_DOCUMENT.document.view(documentHistory._id))
    }else if(handleFormVisibility && !documentNewVersionFormVisibility && !documentAddFilesViewFormVisibility && !documentHistoryNewVersionFormVisibility && !documentHistoryAddFilesViewFormVisibility){
      dispatch(setDrawingAndDocumentVisibility())
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
    async (acceptedFiles) => {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
        const pdfFile = acceptedFiles.find((f)=>f.type.indexOf('pdf')>-1);
        if(pdfFile) {
          const arrayBuffer = await pdfFile.arrayBuffer();
          const pdfDocument = await pdfjs.getDocument(arrayBuffer).promise;
          const page = await pdfDocument.getPage(1);
          const textContent = await page.getTextContent();
          try{
            let isFound = false;
            textContent.items.forEach((item,index) => {
              if(item.str==='DRAWN BY'){
                isFound = true;
                setValue('stockNumber', textContent.items[index+2].str)
              }

            });
            if(!isFound) {
              textContent.items.forEach((item,index) => {
                if(item.str==='APPROVED'){
                  isFound = true;
                  setValue('stockNumber', textContent.items[index-2].str)
                }

              });
            }


          }catch(e) {
            console.log(e)
          }
        }
      const docFiles = files || [];
      const newFiles = acceptedFiles.map((file, index) => {
          if(index===0 && docFiles.length===0 && !displayName){
            setValue('displayName', removeFileExtension(file.name))
            setValue('referenceNumber', getRefferenceNumber(file.name))
            setValue('versionNo', getVersionNumber(file.name))
          }
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        }
      );
      setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ files, displayName]
  );

  const removeFileExtension = (filename) => {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
  };

  const getRefferenceNumber = (filename) => {
    const words = removeFileExtension(filename).split(/\s+/);
    return words[0] || '';
  };

  const getVersionNumber = (filename) => {
    const lastDotIndex = filename.lastIndexOf('.');
    filename = filename.substring(0, lastDotIndex);
    const words = filename.split(/\s+/);
    let version = words[words.length - 1];
      if (version.toLowerCase().includes('v')) {
        version = version.replace(/[Vv]/g, '');
      }else{
        version = "1";
      }
    return version;
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {!customerPage && !machinePage && !drawingPage &&
        <DocumentCover content={machineDrawings ? FORMLABELS.COVER.ADD_MACHINE_DRAWINGSS :  FORMLABELS.COVER.ADD_DOCUMENTS} backLink={!customerPage && !machinePage && !machineDrawings} machineDrawingsBackLink={machineDrawings} generalSettings />
      }
      <Box column={12} rowGap={2} columnGap={2} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} mt={3} >
        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                {!drawingPage && 
                  <RadioButtons
                    radioDisaled={ documentNewVersionFormVisibility || documentAddFilesViewFormVisibility || documentHistoryNewVersionFormVisibility || documentHistoryAddFilesViewFormVisibility }
                    value={selectedValue} radioOnChange={handleRadioChange} 
                    newValue={DocRadioValue.new} newLabel={DocRadioLabel.new} 
                    secondValue={DocRadioValue.newVersion} secondLabel={DocRadioLabel.existing}
                  />
                }
                {selectedValue === 'newVersion' && (
                  <Grid container item lg={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={12}>
                        <RHFAutocomplete
                          label="Select Document*"
                          name="documentVal"
                          disabled={readOnlyDocument}
                          options={activeDocuments}
                          isOptionEqualToValue={( option, value ) => option._id === value._id }
                          getOptionLabel={(option) => `${option?.displayName || ''}`}
                          onChange={(event, newValue) => {
                            if (newValue) {;
                              setValue('displayName', newValue.displayName);
                              setValue('documentType', newValue.docType);
                              setValue('documentCategory', newValue.docCategory);
                              setValue('customerAccess', newValue.customerAccess);
                              setValue('isActive', newValue.isActive);
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
                          renderOption={(props, option) => ( <li {...props} key={option._id}>{`${ option.displayName || ''}`}</li> )}
                          id="controllable-states-demo"
                          ChipProps={{ size: 'small' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {/*  New Document */}
                {(selectedValue === 'new' || documentVal) && (
                      <Box rowGap={3} columnGap={2} display="grid"
                        gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                      >
                        <RHFAutocomplete
                          label="Document Category*"
                          name="documentCategory"
                          disabled={readOnlyVal}
                          options={activeDocumentCategories}
                          isOptionEqualToValue={( option, value ) => option._id === value._id }
                          getOptionLabel={(option) => `${option?.name || ''}`}
                          onChange={ (event, newValue) => {
                            if (newValue) {
                              setValue('documentCategory', newValue);
                              if (newValue?._id !== documentType?.docCategory?._id) {
                                dispatch(resetActiveDocumentTypes());
                                setValue('documentType', null);
                              }
                            } else {
                              setValue('documentCategory', null);
                              setValue('documentType', null);
                              dispatch(getActiveDocumentTypesWithCategory(null, categoryBy ));
                            }
                            }}
                          renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                          id="controllable-states-demo"
                          ChipProps={{ size: 'small' }}
                        />

                        <RHFAutocomplete
                          name="documentType"
                          label="Document Type*"
                          disabled={readOnlyVal}
                          options={activeDocumentTypes}
                          isOptionEqualToValue={( option, value ) => option._id === value._id }
                          getOptionLabel={(option) => `${option?.name || ''}`}
                          renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name || ''}`}</li>)}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setValue('documentType', newValue);
                              if (!documentCategory?._id || newValue?.docCategory?._id !== documentCategory?._id ) {
                              setValue('documentCategory', newValue?.docCategory );
                              }
                            } else {
                              setValue('documentType', null);
                            }
                            }}
                          id="controllable-states-demo"
                            ChipProps={{ size: 'small' }}
                        />

                        </Box>)}

                {documentVal && (
                  <RadioButtons value={selectedVersionValue} radioOnChange={handleVersionRadioChange} 
                  newValue={DocRadioValue.newVersion} newLabel={DocRadioLabel.newVersion} 
                  secondValue={DocRadioValue.existing} secondLabel={DocRadioLabel.currentVersion}
                  />
                )}

                {selectedValue === 'new' && (
                  <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ sm: '1fr', md: '3fr 1fr' }} >
                      <RHFTextField multiline name="displayName" id="displayName" label="Document Name*" />
                      <RHFTextField name='versionNo' label='Version Number'  InputLabelProps={{ shrink: versionNo }} />
                  </Box>
                )}

                {selectedValue === 'new' && !machineDrawings && (
                <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} >
                  <RHFTextField name='referenceNumber' label='Reference Number' />
                  <RHFTextField name='stockNumber' label='Stock Number' />
                </Box>)
                }

                {selectedValue === 'new' && machineDrawings && (
                  <>
                  <Box rowGap={0} columnGap={2} display="grid" sx={{mb:0}} gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}>
                    <RHFTextField name='referenceNumber' label='Reference Number' />
                    <RHFTextField name='stockNumber' label='Stock Number' />
                  </Box>

                    {!drawingPage && 
                      <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}>
                      <RHFAutocomplete
                        name="customer"
                        label="Customer"
                        options={activeCustomers}
                        isOptionEqualToValue={( option, value ) => option._id === value._id }
                        getOptionLabel={(option) => `${option?.name || ''}`}
                        renderOption={(props, option) => ( <li {...props} key={option._id}>{option?.name || ''}</li> )}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setValue('customer', newValue);
                            dispatch(getCustomerMachines(newValue?._id));
                          } else {
                            setValue('customer', null);
                            dispatch(resetCustomerMachines());
                          }
                        }}
                      />
                      <RHFAutocomplete
                        name="machine"
                        label="Machine"
                        options={customerMachines}
                        isOptionEqualToValue={( option, value ) => option._id === value._id }
                        getOptionLabel={(option) => `${ option.serialNo || '' } ${option?.name ? '-' : ''} ${option?.name || ''}`}
                        renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}</li> )}
                      />
                    </Box>
                    }
                  </>
                )}

                {(selectedValue === 'new' ||
                  (documentVal && selectedVersionValue !== 'existingVersion')) && (
                  <RHFTextField name="description" label="Description" minRows={3} multiline />
                )}

                {(selectedValue === 'new' || documentVal) && (
                  <Grid item xs={12} md={6} lg={12}>
                    <RHFUpload multiple thumbnail name="files"
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