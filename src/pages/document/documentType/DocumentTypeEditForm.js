import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  DialogTitle,
  Dialog,
  InputAdornment,
  Link,
  Autocomplete,
  TextField,
  Container,
} from '@mui/material';
// schema
import { EditDocumentNameSchema } from '../../schemas/document';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { getDocumentTypes, updateDocumentType } from '../../../redux/slices/document/documentType';
import { getActiveDocumentCategories } from '../../../redux/slices/document/documentCategory';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import FormHeading from '../../components/DocumentForms/FormHeading';
import { Cover } from '../../components/Defaults/Cover';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { FORMLABELS } from '../../../constants/default-constants';
import { FORMLABELS as formLABELS } from '../../../constants/document-constants';

// ----------------------------------------------------------------------

export default function DocumentTypeEditForm() {
  const { documentType } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const [documentCategoryVal, setDocumentCategoryVal] = useState('');

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getActiveDocumentCategories());
    setDocumentCategoryVal(documentType.docCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const defaultValues = useMemo(
    () => ({
      name: documentType?.name || '',
      description: documentType?.description || '',
      isActive: documentType?.isActive,
      customerAccess: documentType?.customerAccess,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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

  const toggleCancel = () => {
    navigate(PATH_SETTING.documentType.view(documentType._id));
  };

  const onSubmit = async (data) => {
    try {
      if (documentCategoryVal) {
        data.docCategory = documentCategoryVal._id;
      }
      await dispatch(updateDocumentType(documentType._id, data));
      dispatch(getDocumentTypes(documentType._id));
      navigate(PATH_SETTING.documentType.view(documentType._id));
      enqueueSnackbar('Document Type updated Successfully!');
      reset();
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={documentType?.name} />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <FormHeading heading={FORMLABELS.COVER.EDIT_DOCUMENT_TYPE} />
                <Autocomplete
                  // freeSolo
                  value={documentCategoryVal || null}
                  options={activeDocumentCategories}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  getOptionLabel={(option) => `${option.name ? option.name : ''}`}
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
                  renderInput={(params) => (
                    <TextField {...params} required label={formLABELS.DOCUMENT_CATEGORY} />
                  )}
                  ChipProps={{ size: 'small' }}
                />
                <RHFTextField name={formLABELS.TYPE.name} label={formLABELS.TYPE.label} />
                <RHFTextField
                  name={FORMLABELS.DESC.name}
                  label={FORMLABELS.DESC.label}
                  minRows={8}
                  multiline
                />
                <ToggleButtons
                  isMachine
                  isRHF
                  name={FORMLABELS.isACTIVE.name}
                  RHFName={FORMLABELS.isCUSTOMER_ACCESS.name}
                />
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
