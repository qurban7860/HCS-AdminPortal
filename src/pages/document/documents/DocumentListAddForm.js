import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState, memo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { enc, MD5, lib } from 'crypto-js';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { Box, Card, Grid, Stack, Dialog, Container } from '@mui/material';
// PATH
import { PATH_DOCUMENT } from '../../../routes/paths';
// slice
import { checkDocument } from '../../../redux/slices/document/document';
import { addDrawingsList, setDrawingListAddFormVisibility } from '../../../redux/slices/products/drawing';
import { getActiveDocumentCategories, resetActiveDocumentCategories } from '../../../redux/slices/document/documentCategory';
import { getActiveDrawingTypes, resetActiveDocumentTypes } from '../../../redux/slices/document/documentType';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFUpload, RHFTextField, RHFAutocomplete } from '../../../components/hook-form';
// assets
import DialogLabel from '../../../components/Dialog/DialogLabel';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { Snacks } from '../../../constants/document-constants';
import DocumentCover from '../../../components/DocumentForms/DocumentCover';
import { FORMLABELS } from '../../../constants/default-constants';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import ConfirmDialog from '../../../components/confirm-dialog';
import validateFileType from '../util/validateFileType';

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

  const { machine } = useSelector((state) => state.machine);
  const { customer } = useSelector((state) => state.customer);
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);

  // ------------------ document values states ------------------------------

  const [ previewVal, setPreviewVal ] = useState('');
  const [ preview, setPreview ] = useState(false);

  useLayoutEffect( () => { 
    dispatch( getActiveDocumentCategories({drawing: true}) );  
    dispatch( getActiveDrawingTypes() ) 
      return ()=>{ 
      dispatch( resetActiveDocumentCategories() );  
      dispatch( resetActiveDocumentTypes() ) 
      }
}, [ dispatch ] )

const documentSchema = Yup.object().shape({
  docCategory: Yup.object().label('Document Category').required().nullable(),
  description: Yup.string().max(10000),
  files: Yup.mixed().required('Files required!')
  .test( 'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    validateFileType
  ).nullable(true),
});

  const methods = useForm({
    resolver: yupResolver( documentSchema ),
    defaultValues:{
      docCategory: null,
      description: '',
      files: null,
    },
  });

  const {
    reset,
    watch,
    trigger,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { files, docCategory } = watch();

  useEffect(()=>{ 
      trigger('files');
  },[ files, trigger ])

  useEffect(() => {
    if(docCategory){
      files?.map( ( f, index ) => setValue(`files[${index}].docCategory`, docCategory ))
    }else{
      files?.map( ( f, index ) =>   setValue(`files[${index}].docCategory`, null ) )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ docCategory?._id ]);

const onChangeDocCategory = ( index, event, value ) => {
  if( value ){
    setValue(`files[${index}].docCategory`, value );
    if( value?._id !== files[index]?.docType?.docCategory?._id ){
      setValue(`files[${index}].docType`, null );
    }
  } else {
    setValue(`files[${index}].docType`, null );
    setValue(`files[${index}].docCategory`, null );
  }
}

const onChangeDocType = ( index, event, value ) => {
  if( value ){
    setValue(`files[${index}].docType`, value );
    if( !files[index].docCategory || !files[index].docCategory?._id !== value?.docCategory?._id  ){
      setValue(`files[${index}].docCategory`, value?.docCategory );
    }
  } else {
    setValue(`files[${index}].docType`, null );
  }
}

const onChangeVersionNo = (index, value) => setValue(`files[${index}].versionNo`, value);
const onChangeDisplayName = (index, value) => setValue(`files[${index}].displayName`, value);
const onChangeReferenceNumber = (index, value) => setValue(`files[${index}].referenceNumber`, value);
const onChangeStockNumber = (index, value) => setValue(`files[${index}].stockNumber`, value);   

  const onSubmit = async (data) => {
    try {
      await dispatch(addDrawingsList( data));
      enqueueSnackbar(Snacks.addedDrawing);
      if (machineDrawings){
        navigate(PATH_DOCUMENT.document.machineDrawings.list);
      } else{
        await dispatch(setDrawingListAddFormVisibility(false));
      }
      reset();
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
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
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    let defaultDocCategory = await activeDocumentCategories.find((el)=>  el.isDefault === true )
    const defaultDocType = await activeDocumentTypes.find((el)=> el.isDefault === true )
    if( defaultDocType?.docCategory?._id !== defaultDocCategory?._id ){
      defaultDocCategory = activeDocumentCategories.find((el)=>  el?._id === defaultDocType?.docCategory?._id )
    }
      const _files_MD5 = await hashFilesMD5(acceptedFiles);
    const newFiles = await acceptedFiles.reduce(async (accumulatorPromise, file, index) => {
      const accumulator = await accumulatorPromise;
      const displayName = await removeFileExtension(file?.name);
      const referenceNumber = await getRefferenceNumber(file?.name);
      const versionNo = await getVersionNumber(file?.name);
      let stockNumber = '';
      const fileUrl = URL.createObjectURL(file);
      
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
      if (files?.some(f => f?.hashMD5 === _files_MD5[index] )) {
        return accumulator;
      }
      file.drawingMachine = machine?._id;
      file.hashMD5 = _files_MD5[index];
      file.displayName = displayName;
      file.docCategory = defaultDocCategory;
      file.docType = defaultDocType;
      file.versionNo = versionNo;
      file.referenceNumber = referenceNumber;
      file.stockNumber = stockNumber;
      return [...accumulator, file];
    }, Promise.resolve([]));
    if(files){
      setValue('files',[ ...files, ...newFiles] );
    } else {
      setValue('files',[ ...newFiles] );
    }
  }
  
  const toggleCancel = () => { 
    if(machineDrawings){
      navigate(PATH_DOCUMENT.document.machineDrawings.list) 
    }else {
      dispatch(setDrawingListAddFormVisibility(false));
    } 
  }

  return (
    <Container maxWidth={false} sx={{mb:3}}>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      { machineDrawings &&
        <DocumentCover content="Upload Multiple Drawings" backLink={!customerPage && !machinePage && !machineDrawings} machineDrawingsBackLink={machineDrawings} generalSettings />
      }
      <Box column={12} rowGap={2} columnGap={2} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} mt={3} >
        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
              { !machineDrawings && <FormLabel content={FORMLABELS.ADDMULTIPLEDRAWING } /> }
                  <Box rowGap={2} columnGap={2} display="grid"  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}>
                    <RHFAutocomplete
                      name="docCategory"
                      label="Document Category"
                      options={activeDocumentCategories}
                      isOptionEqualToValue={( option, value ) => option._id === value._id }
                      getOptionLabel={(option) => `${option?.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                    />
                  </Box>
                    <RHFTextField name="description" label="Description" minRows={3} multiline />

                    <RHFUpload multiple rows name="files"
                      onDrop={handleDropMultiFile}
                      onRemove={(inputFile) =>
                        files?.length > 1 
                        ? setValue( 'files', files && files?.filter((file) => file?.hashMD5 !== inputFile?.hashMD5 ) )
                        : setValue('files', null )
                      }
                      onRemoveAll={() => setValue('files', null )}
                      // machine={machineVal}
                      onChangeDocType={onChangeDocType}
                      // onChangeDocCategory={onChangeDocCategory}
                      onChangeVersionNo={onChangeVersionNo}
                      onChangeDisplayName={onChangeDisplayName}
                      onChangeReferenceNumber={onChangeReferenceNumber}
                      onChangeStockNumber={onChangeStockNumber}
                      drawingPage={drawingPage || machineDrawings}
                    />

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
    </Container>
  )
}

export default memo(DocumentListAddForm)