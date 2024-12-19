import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { Box, Card, Grid, Stack, Dialog, Container, Button, FormHelperText } from '@mui/material';
// PATH
import { PATH_MACHINE, PATH_MACHINE_DRAWING } from '../../routes/paths';
// slice
import { addDrawingsList } from '../../redux/slices/products/drawing';
import { getActiveDocumentCategories, resetActiveDocumentCategories } from '../../redux/slices/document/documentCategory';
import { getActiveDrawingTypes, resetActiveDocumentTypes } from '../../redux/slices/document/documentType';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFUpload, RHFAutocomplete } from '../../components/hook-form';
// assets
import DialogLabel from '../../components/Dialog/DialogLabel';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { Snacks } from '../../constants/document-constants';
import DocumentCover from '../../components/DocumentForms/DocumentCover';
import { FORMLABELS } from '../../constants/default-constants';
import FormLabel from '../../components/DocumentForms/FormLabel';
import ConfirmDialog from '../../components/confirm-dialog';
import FileRow from './FileRow';
import validateMultipleDrawingsFileType from './util/validateMultipleDrawingsFileType';
import LinearProgressWithLabel from '../../components/progress-bar/LinearProgressWithLabel';
import { hashFilesMD5, removeFileExtension, getRefferenceNumber, getVersionNumber } from './util/Util'

// ----------------------------------------------------------------------

DocumentListAddForm.propTypes = {
  currentDocument: PropTypes.object,
  customerPage: PropTypes.bool,
  machineDrawingPage: PropTypes.bool,
  drawingPage: PropTypes.bool,
  machineDrawings: PropTypes.bool,
};

function DocumentListAddForm({
  currentDocument,
  customerPage,
  machineDrawingPage,
  drawingPage,
  machineDrawings,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machineId }= useParams();
  const { machine } = useSelector((state) => state.machine);
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const [ preview, setPreview ] = useState(false);
  const [ duplicate, setDuplicate ] = useState(false);
  const [ progress, setProgress ] = useState(0);
  const [ progressBar, setProgressBar ] = useState(false);
  const handleClosePreview = () => setPreview(false);

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
    files: Yup.array()
    .label('Files')
    .min(1,'Files required!')
    .test( 'fileType',
      'Only the following formats are accepted: jpeg, jpg, gif, bmp, webp, pdf, doc, xls, ppt',
      validateMultipleDrawingsFileType
    ).nullable(true),
  });

  const methods = useForm({
    resolver: yupResolver( documentSchema ),
    defaultValues:{
      docCategory: activeDocumentCategories?.find( f => f?.name?.toLowerCase()?.trim() === 'assembly drawings') || null,
      description: '',
      files: [],
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const {
    reset,
    watch,
    trigger,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;
  
  const { files, docCategory } = watch();
  
  useEffect(() => {
    if ( !docCategory?._id && activeDocumentCategories?.length > 0) {
      const defaultCategory = activeDocumentCategories.find(( c ) => c?.name?.toLowerCase()?.trim() === "assembly drawings" );
      if (defaultCategory) {
        setValue("docCategory", defaultCategory);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ activeDocumentCategories ]);
  
  const onSubmit = async (data) => {
    try {
      await dispatch(addDrawingsList( data));
      enqueueSnackbar(Snacks.addedDrawing);
      if (machineDrawings){
        navigate(PATH_MACHINE_DRAWING.root);
      } else if(machineDrawingPage){
        navigate(PATH_MACHINE.machines.drawings.root(machineId));
      }
      reset();
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const handleDropMultiFile = async (acceptedFiles) => {
    setProgressBar(true);
    const setProgressBarPercentage = async ( index ) => {
      await setProgress( acceptedFiles?.length ? Math.round( (100 / acceptedFiles.length ) * index / 10 ) * 10  : 0  );
    }
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    const defaultDocCategory = await activeDocumentCategories?.find( f => f?.name?.toLowerCase()?.trim() === 'assembly drawings');

      const _files_MD5 = await hashFilesMD5(acceptedFiles);
    const newFiles = await acceptedFiles.reduce(async (accumulatorPromise, file, index) => {
      await setProgressBarPercentage( index )
      const accumulator = await accumulatorPromise;
      const displayName = await removeFileExtension(file?.name);
      const referenceNumber = await getRefferenceNumber(file?.name);
      const versionNo = await getVersionNumber(file?.name);

      let stockNumber = '';
      const checkDocType = activeDocumentTypes.find((el) => displayName.trim().toLowerCase().includes(el.name.trim().toLowerCase()));

      let defaultDocType
      if( checkDocType?.docCategory?._id === defaultDocCategory?._id ){
        defaultDocType = checkDocType
      } else if( displayName.trim().toLowerCase().includes( 'frama' ) || displayName.trim().toLowerCase().includes( 'decoiler' )){
        defaultDocType = activeDocumentTypes.find((el) => el?.name?.trim()?.toLowerCase().includes( 'assembly' ))
      }
  
      if (file?.type?.indexOf('pdf') > -1) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDocument = await pdfjs.getDocument(arrayBuffer).promise;
        const page = await pdfDocument.getPage(1);
        const textContent = await page.getTextContent();
        try {
          textContent.items.some((item, indexx) => {
            if (item.str === 'DRAWN BY' && textContent?.items[indexx + 2]?.str?.length < 15) {
              stockNumber = textContent.items[indexx + 2].str;
              return true;
            }
            if (item.str === "STOCK NO." && textContent?.items[indexx + 2]?.str?.length < 15) {
              stockNumber = textContent.items[indexx + 2].str;
              return true;
            }
            if (item.str === 'APPROVED' && textContent?.items[indexx - 2]?.str?.length < 15) {
              stockNumber = textContent.items[indexx - 2].str;
              return true;
            }
            return false;
          });
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
      file.docType = defaultDocType;
      file.versionNo = versionNo?.replace(/[^\d.]+/g, "");
      file.referenceNumber = referenceNumber;
      file.stockNumber = stockNumber;
      return [...accumulator, file];
    }, Promise.resolve([]));
    setProgressBar(false);
    setProgress(0)
    if(files){
      setValue('files',[ ...files, ...newFiles] );
    } else {
      setValue('files',[ ...newFiles] );
    }
    trigger('files');
  }
  
  const toggleCancel = () => { 
    if(machineDrawings){
      navigate(PATH_MACHINE_DRAWING.root) 
    }else if(machineDrawingPage) {
      navigate(PATH_MACHINE.machines.drawings.root(machineId)) 
    } 
  }

  const onChangeDocCategory = (event, newValue) => {
    setValue('docCategory', newValue || null);
    if (Array.isArray(files) && files.length > 0){
      const shouldResetDocTypes = newValue?._id && files?.some(f => f?.docType?.docCategory?._id !== newValue?._id)
      if (shouldResetDocTypes || !newValue?._id ) {
        files.forEach((_, index) => setValue(`files[${index}].docType`, null));
      }
    }
  };

  return (
    <Container maxWidth={false} sx={{mb:3}}>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      { machineDrawings &&
        <DocumentCover content="Upload Multiple Drawings" backLink={!customerPage && !machineDrawingPage && !machineDrawings} machineDrawingsBackLink={machineDrawings} generalSettings />
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
                      onChange={onChangeDocCategory}
                    />
                  </Box>

                    <RHFUpload 
                      rows
                      multiple 
                      hideFiles
                      name="files"
                      onDrop={handleDropMultiFile}
                      drawingPage={drawingPage || machineDrawings}
                    />
                    { progressBar &&  
                      <Box sx={{ width: '100%' }} >
                        <LinearProgressWithLabel variant="buffer"  value={progress}  /> 
                      </Box>
                    }
                    { Array.isArray(files) && files?.length > 0 && files?.map( ( f, index ) => 
                        <FileRow  
                          key={index}
                          i={index} 
                          file={f}
                          docCategory={docCategory}
                          setValue={setValue}
                          trigger={trigger}
                          onRemove={(inputFile) => {
                            if (files?.length > 1) {
                                setValue('files', files?.filter((file) => file?.hashMD5 !== inputFile?.hashMD5));
                            } else {
                                setValue('files', null);
                            }
                            trigger('files')
                          }}
                        />
                      ) 
                    }
                    { errors?.files?.message && 
                      <FormHelperText error={ typeof errors?.files?.message === 'string' } sx={{ px: 2 }}>
                        {errors?.files?.message}
                      </FormHelperText>
                    }
                    <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{mt:1}}>
                      { Array.isArray(files) && files?.length > 0 && (
                        <Button color="error" variant="outlined" size="small" onClick={() => setValue('files', null ) }>
                          Remove all
                        </Button>
                      )} 
                    </Stack>
                <AddFormButtons drawingPage={ !customerPage && !machineDrawingPage } isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
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
          // src={previewVal}
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

export default DocumentListAddForm