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
import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link ,Autocomplete, TextField} from '@mui/material';
// global
import { CONFIG } from '../../../config-global';
// slice
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch
} from '../../../components/hook-form';
import { setDocumentTypeEditFormVisibility,  updateDocumentType } from '../../../redux/slices/document/documentType';
import AddFormButtons from '../../components/AddFormButtons';
import FormHeading from '../../components/FormHeading';

// ----------------------------------------------------------------------

export default function DocumentTypeEditForm() {

  const { documentType } = useSelector((state) => state.documentType);
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();



  const defaultValues = useMemo(
    () => ({
      name: documentType?.name || '',
      isActive : documentType?.isActive ,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const EditDocumentNameSchema = Yup.object().shape({
    name: Yup.string().max(50),
    isActive : Yup.boolean(),
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
    dispatch(setDocumentTypeEditFormVisibility(false));
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateDocumentType(documentType._id,data));
      enqueueSnackbar('Document saved Successfully!');
      reset();
    } catch (err) {
      enqueueSnackbar('Saving failed!');
      console.error(err.message);
    }
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <FormHeading heading='Edit Document Name'/>
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="description" label="Description" minRows={8} multiline />
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

            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
          </Card>

        </Grid>
      </Grid>
    </FormProvider>
  );
}
