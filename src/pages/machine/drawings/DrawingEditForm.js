import * as Yup from 'yup';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { TextField, Autocomplete, Box, Card, Grid, Stack } from '@mui/material';
// 
import { useNavigate, useParams } from 'react-router-dom';
// slice
import { updateDrawing } from '../../../redux/slices/products/drawing';
import { getActiveDocumentCategories  } from '../../../redux/slices/document/documentCategory';
import {  resetActiveDocumentTypes } from '../../../redux/slices/document/documentType';
import {  resetActiveDocuments } from '../../../redux/slices/document/document';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSwitch } from '../../../components/hook-form';
// util
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { PATH_MACHINE } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function DrawingEditForm() {
    const { machine } = useSelector((state) => state.machine);
    const { machineId, id } = useParams();
    const { activeDocumentTypes } = useSelector((state) => state.documentType);
    const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
    const { activeDocuments } = useSelector((state) => state.document);
    useSelector((state) => state.drawing );
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
             await dispatch(updateDrawing(data));
            reset();
            enqueueSnackbar('Drawing Updated successfully!');
        } catch (error) {
            enqueueSnackbar(error, { variant: 'error' });
            console.error( error);
        };
    }

    const toggleCancel = () => navigate(PATH_MACHINE.machines.drawings.view(machineId, id));

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
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
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

                </Box>

                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                >
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
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
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

                  <RHFSwitch name="isActive" label="Active"/>

                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
  );
}
