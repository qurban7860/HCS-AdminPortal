// import PropTypes from 'prop-types';
// import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
// import { LoadingButton } from '@mui/lab';
import {
  Card,
  Grid,
  Stack,
  Container,
} from '@mui/material';
// schema
import { DocumentTypeSchema } from '../../../schemas/document';
// routes
import { PATH_MACHINE, PATH_SETTING } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete, RHFSwitch } from '../../../../components/hook-form';
import { getDocumentType, getDocumentTypes, resetDocumentType, updateDocumentType } from '../../../../redux/slices/document/documentType';
import { getActiveDocumentCategories } from '../../../../redux/slices/document/documentCategory';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import FormHeading from '../../../../components/DocumentForms/FormHeading';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { FORMLABELS } from '../../../../constants/default-constants';
import { FORMLABELS as formLABELS } from '../../../../constants/document-constants';

// ----------------------------------------------------------------------

export default function DocumentTypeEditForm() {


  const { documentType } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getDocumentType(id));
    dispatch(getActiveDocumentCategories());
    return () => {
      dispatch(resetDocumentType());
    };
  }, [id, dispatch]);

  const defaultValues = useMemo(
    () => ({
      category: documentType?.docCategory || null,
      name: documentType?.name || '',
      description: documentType?.description || '',
      isActive: documentType?.isActive,
      isPrimaryDrawing: documentType?.isPrimaryDrawing,
      isDefault: documentType?.isDefault || false,
      customerAccess: documentType?.customerAccess,
      isArchived: documentType?.isArchived,
    }),
    [documentType]);

  const methods = useForm({
    resolver: yupResolver(DocumentTypeSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (documentType) {
      reset(defaultValues);
    }
  }, [documentType, reset, defaultValues]);


  const toggleCancel = () => {
    navigate(PATH_MACHINE.documents.documentType.view(documentType._id));
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateDocumentType(documentType._id, data));
      navigate(PATH_MACHINE.documents.documentType.view(documentType._id));
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
        <Cover
          name={documentType?.name}
          backLink={() => navigate(PATH_MACHINE.documents.documentType.view(documentType._id))}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <FormHeading heading={FORMLABELS.COVER.EDIT_DOCUMENT_TYPE} />
                <RHFAutocomplete
                  name="category"
                  label={formLABELS.DOCUMENT_CATEGORY}
                  options={activeDocumentCategories}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                  renderOption={(props, option) => (<li {...props} key={option?._id}>{option.name}</li>)}
                  id="controllable-states-demo"
                  ChipProps={{ size: 'small' }}
                />
                <RHFTextField name={formLABELS.TYPE.name} label={formLABELS.TYPE.label} />
                <RHFTextField
                  name={FORMLABELS.DESC.name}
                  label={FORMLABELS.DESC.label}
                  minRows={8}
                  multiline
                />
                <Grid display='flex' alignItems="center" mt={1} >
                  <RHFSwitch name='isArchived' label='Archived' />
                  <RHFSwitch name='isActive' label='Active' />
                  <RHFSwitch name='isPrimaryDrawing' label='Primary Drawing' />
                  <RHFSwitch name='customerAccess' label='Customer Access' />
                  <RHFSwitch name='isDefault' label='Default' />
                </Grid>
              </Stack>
              <AddFormButtons archived={documentType?.isArchived} settingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
