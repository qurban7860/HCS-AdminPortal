import * as Yup from 'yup';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { TextField, Autocomplete, Box, Card, Grid, Stack, Typography } from '@mui/material';
// slice
import { updateDrawing, setDrawingFormVisibility, setDrawingEditFormVisibility } from '../../../redux/slices/products/drawing';
import { getActiveDocumentCategories , resetActiveDocumentCategories } from '../../../redux/slices/document/documentCategory';
import { getActiveDocumentTypesWithCategory, resetActiveDocumentTypes } from '../../../redux/slices/document/documentType';
import { getMachineDrawingsDocuments, resetActiveDocuments } from '../../../redux/slices/document/document';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
// util
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function DrawingEditForm() {
    const { machine } = useSelector((state) => state.machine);
    const { activeDocumentTypes } = useSelector((state) => state.documentType);
    const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
    const { activeDocuments } = useSelector((state) => state.document);
    const { drawing } = useSelector((state) => state.drawing );

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        dispatch(getActiveDocumentCategories());
    }, [dispatch]);

    const DrawingAddSchema = Yup.object().shape({
        document: Yup.object().required('Document is required'),
        documentCategory: Yup.object().required('Document Category is required'),
        documentType: Yup.object().required('Document Type is required'),
        isActive: Yup.boolean(),
    });

    const methods = useForm({
        resolver: yupResolver(DrawingAddSchema),
        defaultValues:{
            document: null,
            documentCategory: null,
            documentType: null,
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

    const onSubmit = async (data) => {
        try {
            data.machine = machine._id;
            const response = await dispatch(updateDrawing(data));
            reset();
            enqueueSnackbar('Create success!');
        } catch (error) {
            enqueueSnackbar('Create failed!');
            console.error( error);
        };
    }

    const toggleCancel = () => {};

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
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    onChange={(event, newValue) => {
                      if(newValue){
                      setValue("documentCategory", newValue);
                      }else{
                        setValue("documentType", null);
                        setValue("document", null);
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
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => option.name}
                    
                    onChange={(event, newValue) => {
                          if (newValue) {
                            field.onChange(newValue);
                          } else {
                            setValue("documentType", null);
                            setValue("document", null);
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

                <Controller
                  name="document"
                  clearOnBlur 
                  clearOnEscape 
                  control={control}
                  defaultValue={document || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    options={activeDocuments}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => option.name}
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
                  <RHFSwitch
                        name="isActive"
                        labelPlacement="start"
                        label={
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    mx: 0,
                                    width: 1,
                                    justifyContent: 'space-between',
                                    mb: 0.5,
                                    color: 'text.secondary',
                                }}
                            >
                                Active
                            </Typography>
                        }
                    />

                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
  );
}
