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
import { PATH_DASHBOARD, PATH_DOCUMENT, PATH_SETTING } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch
} from '../../../components/hook-form';
import { getDocumentCategory,  updateDocumentCategory } from '../../../redux/slices/document/documentCategory';
import AddFormButtons from '../../components/AddFormButtons';
import FormHeading from '../../components/FormHeading';
import { Cover } from '../../components/Cover';


// ----------------------------------------------------------------------

export default function DocumentCategoryeEditForm() {

  const { documentCategory } = useSelector((state) => state.documentCategory);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      name: documentCategory?.name || '',
      description: documentCategory?.description || '',
      isActive : documentCategory?.isActive ,
      customerAccess: documentCategory?.customerAccess,
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
    navigate(PATH_SETTING.documentCategory.view(documentCategory._id))

  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateDocumentCategory(documentCategory._id,data));
      dispatch(getDocumentCategory(documentCategory._id));
      navigate(PATH_SETTING.documentCategory.view(documentCategory._id))
      enqueueSnackbar('Document Category updated Successfully!');
      reset();
    } catch (err) {
      enqueueSnackbar('Document Category Update failed!', { variant: `error` });
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
          <Cover name={documentCategory?.name} generalSettings backLink={PATH_SETTING.documentCategory.view(documentCategory?._id)}/> 
        </Card>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={18} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <FormHeading heading='Edit Document Category'/>
                  <RHFTextField name="name" label="Category Name" />
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
