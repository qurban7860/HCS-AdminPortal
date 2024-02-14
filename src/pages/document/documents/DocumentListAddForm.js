import PropTypes from 'prop-types';
import { useEffect, useState, useCallback , memo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { enc, MD5, lib } from 'crypto-js';
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
  checkDocument,
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
import DialogLabel from '../../../components/Dialog/DialogLabel';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import RadioButtons from '../../../components/DocumentForms/RadioButtons';
import ToggleButtons from '../../../components/DocumentForms/ToggleButtons';
import { DocRadioValue, DocRadioLabel, Snacks,} from '../../../constants/document-constants';
import DocumentCover from '../../../components/DocumentForms/DocumentCover';
import { FORMLABELS } from '../../../constants/default-constants';
import { documentSchema } from '../../schemas/document';
import ConfirmDialog from '../../../components/confirm-dialog';


// ----------------------------------------------------------------------
DocumentListAddForm.propTypes = {
  currentDocument: PropTypes.object,
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  drawingPage: PropTypes.bool,
  machineDrawings: PropTypes.bool,
  handleFormVisibility: PropTypes.func,
};

function DocumentListAddForm({
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
    resolver: yupResolver(),
    defaultValues:{
      files: [],
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

  const { files } = watch();

  useEffect( () => { // Get Active Document Types And Active Document Categoories
    if( !isDocumentCategoryLoaded && categoryBy ){
      dispatch( getActiveDocumentCategories( categoryBy ) );  dispatch( getActiveDocumentTypesWithCategory( null, categoryBy ) ) 
      setIsDocumentCategoryLoaded( true )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ categoryBy ] )


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
      setReadOnlyVal(true);
    }else if( documentHistoryAddFilesViewFormVisibility ){
      setReadOnlyDocument(true);
      setReadOnlyVal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ documentHistoryNewVersionFormVisibility, documentHistoryAddFilesViewFormVisibility, documentHistory ])

  useEffect(()=>{
    if( documentNewVersionFormVisibility ){
      setReadOnlyDocument(true);
      setReadOnlyVal(true);
    }else if( documentAddFilesViewFormVisibility ){
      setReadOnlyDocument(true);
      setReadOnlyVal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ documentNewVersionFormVisibility, documentAddFilesViewFormVisibility, document ])

  const onSubmit = async (data) => {
    try {
      if(drawingPage){
        data.machine = machine?._id;
      } else{
        data.machine = null;  
      }
        // Update versions Part
        await dispatch(addDocument( customerPage ? customer?._id : null, machinePage ? machine?._id : null, data));
        enqueueSnackbar(Snacks.updatedDoc);
        // Page Navigation conditions for update versions
        navigate(PATH_DOCUMENT.document.machineDrawings.list);
      setReadOnlyVal(false);
      setPreview(false);
      setPreviewVal('');
      reset();
    } catch (error) {
      enqueueSnackbar(Snacks.failedDoc, { variant: `error` });
      console.error(error);
    }
  };


  const handleClosePreview = () => setPreview(false);
  const [machineVal, setMachineVal] = useState(null);
  const [duplicate, setDuplicate] = useState(false);

  const hashFilesMD5 = async (_files) => {
    const hashPromises = _files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const wordArray = MD5(lib.WordArray.create(arrayBuffer));
        const hashHex = wordArray.toString(enc.Hex);
        resolve(hashHex);
      };
      reader.onerror = () => {
        reject(new Error(`Error reading file: ${file.name}`));
      };
      reader.readAsArrayBuffer(file);
    }));
    try {
      const hashes = await Promise.all(hashPromises);
      return hashes;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

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
  

  const handleDropMultiFile = async (acceptedFiles) => {
    console.log("acceptedFiles : ",acceptedFiles)
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    let _files = [];
    if (drawingPage || machineDrawings) {
      const _files_MD5 = await hashFilesMD5(acceptedFiles);
      _files = await dispatch(checkDocument(_files_MD5));
    }
    setDuplicate(_files.some((fff) => fff.status === 409));
    const newFiles = await Promise.all(acceptedFiles.map( async (file, index) => {
      const displayName = await removeFileExtension(file?.name);
      const referenceNumber = await getRefferenceNumber(file?.name);
      const versionNo = await getVersionNumber(file?.name);
      let stockNumber = '';
      if (file?.type?.indexOf('pdf') > -1) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDocument = await pdfjs.getDocument(arrayBuffer).promise;
        const page = await pdfDocument.getPage(1);
        const textContent = await page.getTextContent();
        try {
          textContent.items.forEach((item, indexx) => {
            if (item.str === 'DRAWN BY') {
              stockNumber = textContent.items[indexx + 2].str;
            }
          });
          if (!stockNumber) {
            textContent.items.forEach((item, indexx) => {
              if (item.str === 'APPROVED') {
                stockNumber = textContent.items[indexx - 2].str;
              }
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
      return {
        ...file,
        preview: URL.createObjectURL(file),
        found: _files[index]?.status === 200 ? null : _files[index],
        name: file.name || '',
        path: file.path || '',
        type: file.type || '',
        size: file.size || '',
        machine: machineVal?._id,
        displayName,
        referenceNumber,
        versionNo,
        stockNumber,
      };
    }));
    console.log("newFiles : ",newFiles)
    setValue('files', [ ...files, ...newFiles ] );
  }
  
  const toggleCancel = () => navigate(PATH_DOCUMENT.document.machineDrawings.list)


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
                  <Grid item xs={12} md={12} lg={12}>
                    <RHFUpload multiple rows name="files"
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
                      machine={machineVal}
                      drawingPage={drawingPage || machineDrawings}
                    />
                  </Grid>

                <AddFormButtons drawingPage={ !customerPage && !machinePage } isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
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
          alt='document_image'
          src={previewVal}
        />
      </Dialog>
      
      <ConfirmDialog
        open={duplicate}
        onClose={()=> setDuplicate(false)}
        title='Duplicate Files Detected'
        content='Kindly review the files that already exist.'
        SubButton="Close"
      />
    </FormProvider>
  )
}

export default memo(DocumentListAddForm)