import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo , useState, useLayoutEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link ,Autocomplete, TextField, Container} from '@mui/material';
// global
import { CONFIG } from '../../../config-global';
// slice
// routes
import { PATH_DASHBOARD, PATH_DOCUMENT } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch
} from '../../../components/hook-form';
import { getDocumentTypes,  updateDocumentType } from '../../../redux/slices/document/documentType';
import { getActiveDocumentCategories } from '../../../redux/slices/document/documentCategory';
import AddFormButtons from '../../components/AddFormButtons';
import FormHeading from '../../components/FormHeading';
import { Cover } from '../../components/Cover';


// ----------------------------------------------------------------------

export default function DocumentTypeEditForm() {

  const { documentType } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const [ documentCategoryVal, setDocumentCategoryVal] = useState('')

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getActiveDocumentCategories())
    setDocumentCategoryVal(documentType.docCategory)
    // eslint-disable-next-line react-hooks/exhaustive-deps
},[dispatch]);

  const defaultValues = useMemo(
    () => ({
      name: documentType?.name || '',
      description: documentType?.description || '',
      isActive : documentType?.isActive ,
      customerAccess: documentType?.customerAccess,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const EditDocumentNameSchema = Yup.object().shape({
    name: Yup.string().max(40),
    description: Yup.string().max(1500),
    isActive : Yup.boolean(),
    customerAccess: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(EditDocumentNameSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // useEffect(() => {
  //   if (site) {
  //     reset(defaultValues);
  //   }
  // }, [site, reset, defaultValues]);

  const toggleCancel = () => 
  {
    navigate(PATH_DOCUMENT.documentType.view(documentType._id))

  };

  const onSubmit = async (data) => {
    try {
      if(documentCategoryVal){
        data.docCategory = documentCategoryVal._id
      }
      await dispatch(updateDocumentType(documentType._id,data));
      dispatch(getDocumentTypes(documentType._id));
      navigate(PATH_DOCUMENT.documentType.view(documentType._id))
      enqueueSnackbar('Document Type updated Successfully!');
      reset();
    } catch (err) {
      enqueueSnackbar('Document Type Updating failed!', { variant: `error` });
      console.error(err.message);
    }
  };


  return (
    <Container maxWidth={false }>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
            // mt: '24px',
          }}
        >
          <Cover name={documentType?.name} /> 
        </Card>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={18} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <FormHeading heading='Edit Document Type'/>
                  <Autocomplete
                        // freeSolo
                        value={documentCategoryVal || null}
                        options={activeDocumentCategories}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => `${option.name ? option.name : ""}`}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setDocumentCategoryVal(newValue);
                          } else {
                            setDocumentCategoryVal('');
                          }
                        }}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>
                            {option.name}
                          </li>
                        )}
                        id="controllable-states-demo"
                        renderInput={(params) => <TextField {...params} required label="Document Category" />}
                        ChipProps={{ size: 'small' }}
                      />
                  <RHFTextField name="name" label="Name" />
                  <RHFTextField name="description" label="Description" minRows={8} multiline />
                  <Grid display="flex">
                  <RHFSwitch
                    name="customerAccess"
                    labelPlacement="start"
                    label={
                      <>
                        <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}>
                          Customer Access
                        </Typography>
                      </>
                    } 
                  />
                  <RHFSwitch
                    name="isActive"
                    labelPlacement="start"
                    label={
                      <>
                        <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}>
                          Active
                        </Typography>
                      </>
                    } 
                  />
                  
                  </Grid>
                </Stack>
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
              </Card>
                  
            </Grid>
          </Grid>
        </FormProvider>
    </Container>
  );
}
