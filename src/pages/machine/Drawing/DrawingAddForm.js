import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { TextField, Autocomplete, Box, Card, Grid, Stack } from '@mui/material';
// slice
import { addDrawing, setDrawingFormVisibility } from '../../../redux/slices/products/drawing';
import { getActiveDocumentCategories } from '../../../redux/slices/document/documentCategory';
import { getActiveDocumentTypesWithCategory, resetActiveDocumentTypes } from '../../../redux/slices/document/documentType';
import { resetActiveDocuments, getActiveDocumentsByType } from '../../../redux/slices/document/document';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {  RHFSwitch } from '../../../components/hook-form';
// util
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function DrawingAddForm() {
  const { machine } = useSelector((state) => state.machine);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocuments } = useSelector((state) => state.document);
  const { drawings } = useSelector((state) => state.drawing );
  const [ filteredDocuments, setFilteredDocuments ] = useState([])
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getActiveDocumentCategories({drawing: true}));
    setFilteredDocuments([]);
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
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { documentCategory, documentType, document} = watch();

  useEffect(() => {
    if(documentCategory?._id){
      dispatch(getActiveDocumentTypesWithCategory(documentCategory?._id, { drawing: true } ));
    }
  },[ dispatch, documentCategory ]);

  useEffect(() => {
    if(documentCategory?._id && documentType?._id){
      dispatch(getActiveDocumentsByType(documentCategory?._id, documentType?._id));
    }
  },[ dispatch, documentCategory, documentType ]);

    const onSubmit = async (data) => {
        try {
            data.machine = machine._id;
        await dispatch(addDrawing(data));
            reset();
            enqueueSnackbar('Create success!');
            dispatch(setDrawingFormVisibility(false));
        } catch (error) {
            enqueueSnackbar(error, {variant: 'error'});
            console.error( error);
        };
    }

  const toggleCancel = () => dispatch(setDrawingFormVisibility(false));

  return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12} sx={{ mt: 3 }}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                >
                <Controller
                  name="documentCategory"
                  clearOnBlur 
                  clearOnEscape 
                  control={control}
                  defaultValue={documentCategory || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
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
                        dispatch(resetActiveDocumentTypes())
                        dispatch(resetActiveDocuments())
                      }
                    }}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField 
                              {...params} 
                              id="documentCategory"  
                              name='documentCategory' 
                              label="Document Category*" 
                              error={!!error}
                              helperText={error?.message} 
                              inputRef={ref}
                              />}
                    ChipProps={{ size: 'small' }}
                  />
                  )}
                />

                <Controller
                  name="documentType"
                  clearOnBlur 
                  clearOnEscape 
                  control={control}
                  defaultValue={documentType || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    options={activeDocumentTypes}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => option.name}
                    
                    onChange={(event, newValue) => {
                          if (newValue) {
                            field.onChange(newValue);
                            if(newValue._id !== documentCategory._id){
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
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField 
                              {...params} 
                              id="documentType"  
                              name='documentType' 
                              label="Document Type*" 
                              error={!!error}
                              helperText={error?.message} 
                              inputRef={ref}
                              />}
                    ChipProps={{ size: 'small' }}
                  />
                  )}
                />



                </Box>

                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}>
                <Controller
                  name="document"
                  clearOnBlur 
                  clearOnEscape 
                  control={control}
                  defaultValue={document || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    options={filteredDocuments}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => option.displayName}
                    onChange={(event, value) => field.onChange(value)}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField 
                              {...params} 
                              id="document"  
                              name='document' 
                              label="Document*" 
                              error={!!error}
                              helperText={error?.message} 
                              inputRef={ref}
                              />}
                    ChipProps={{ size: 'small' }}
                  />
                  )}
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
