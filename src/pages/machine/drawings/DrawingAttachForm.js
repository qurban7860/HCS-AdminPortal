import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack } from '@mui/material';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// slice
import { addDrawing } from '../../../redux/slices/products/drawing';
import { getActiveDocumentCategories, resetActiveDocumentCategories } from '../../../redux/slices/document/documentCategory';
import { getActiveDocumentTypes, resetActiveDocumentTypes } from '../../../redux/slices/document/documentType';
import { getActiveDocumentsByType, resetActiveDocuments } from '../../../redux/slices/document/document';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFSwitch } from '../../../components/hook-form';
// util
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function DrawingAttachForm() {
  const navigate = useNavigate(); 
  const { machineId } = useParams();
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocuments } = useSelector((state) => state.document);
  const { drawings } = useSelector((state) => state.drawing );
  const [ filteredDocuments, setFilteredDocuments ] = useState([])
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getActiveDocumentCategories({drawing: true}));
    dispatch(getActiveDocumentTypes());
    setFilteredDocuments([]);
    return ()=> {
      dispatch(resetActiveDocumentCategories())
      dispatch(resetActiveDocumentTypes())
      dispatch(resetActiveDocuments())
    }
  },[dispatch]);

  useEffect(() => {
    if (drawings) {
      const filteredArray = activeDocuments.filter(obj1 => !drawings.some(obj2 => obj1?._id === obj2?.document?._id));
      setFilteredDocuments(filteredArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDocuments, drawings]);

  const DrawingAddSchema = Yup.object().shape({
    document: Yup.object().required('Document is required').nullable(),
    documentCategory: Yup.object().required('Document Category is required').nullable(),
    documentType: Yup.object().required('Document Type is required').nullable(),
    isActive: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(DrawingAddSchema),
    defaultValues:{
        document: null,
        documentCategory: activeDocumentCategories.find((element)=> element?._id === activeDocumentTypes.find((ele)=>  ele.isDefault === true)?.docCategory?._id || element.isDefault === true) || null,
        documentType: activeDocumentTypes.find((element)=>  element.isDefault === true) || null,
        isActive: true,
    },
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { documentCategory, documentType } = watch();

  // useEffect(() => {
  //   if(documentCategory?._id){
  //     dispatch(getActiveDocumentTypesWithCategory(documentCategory?._id, { drawing: true } ));
  //   }
  // },[ dispatch, documentCategory ]);

  useEffect(() => {
    if(documentCategory?._id && documentType?._id){
      dispatch(getActiveDocumentsByType(documentCategory?._id, documentType?._id));
    }
  },[ dispatch, documentCategory, documentType ]);

    const onSubmit = async (data) => {
        try {
            data.machine = machineId;
        await dispatch(addDrawing(data));
            reset();
            enqueueSnackbar('Drawing created successfully!');
            navigate(PATH_MACHINE.machines.drawings.root(machineId));
        } catch (error) {
            enqueueSnackbar(error, {variant: 'error'});
            console.error( error);
        };
    }

  const toggleCancel = () => navigate(PATH_MACHINE.machines.drawings.root(machineId));

  return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12} >
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                >
                  <RHFAutocomplete
                    name="documentCategory"
                    label="Document Category*" 
                    clearOnBlur 
                    clearOnEscape 
                    options={activeDocumentCategories}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    onChange={(event, newValue) => {
                      if(newValue){
                        setValue("documentCategory", newValue);
                        if(newValue._id !== documentCategory?._id){
                        setValue("documentType", null);
                        setValue("document", null);
                        setFilteredDocuments([]);
                        }
                      }else{
                        setValue("documentCategory", null);
                        setValue("documentType", null);
                        setValue("document", null);
                        setFilteredDocuments([]);
                        // dispatch(resetActiveDocumentTypes())
                        dispatch(resetActiveDocuments())
                      }
                    }}
                  />

                  <RHFAutocomplete
                    name="documentType"
                    label="Document Type*" 
                    clearOnBlur 
                    clearOnEscape 
                    options={activeDocumentTypes?.filter(el => ( el?.docCategory?._id && documentCategory) ? el?.docCategory?._id === documentCategory?._id : !documentCategory)}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                    onChange={(event, newValue) => {
                          if (newValue) {
                            setValue("documentType", newValue);
                            if(newValue?._id !== documentCategory?._id){
                            setValue("documentCategory", newValue?.docCategory);
                            setValue("document", null);
                            setFilteredDocuments([]);
                            }
                          } else {
                            setValue("documentType", null);
                            setValue("document", null);
                            setFilteredDocuments([]);
                            dispatch(resetActiveDocuments())
                          }
                        }}
                  />

                </Box>

                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }} >

                  <RHFAutocomplete
                    name="document"
                    clearOnBlur 
                    clearOnEscape 
                    label="Document*" 
                    options={filteredDocuments}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => option.displayName}
                  />
                  
                </Box>

                <RHFSwitch name="isActive" label="Active"/>

                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
  );
}
