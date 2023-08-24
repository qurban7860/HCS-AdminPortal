import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, Autocomplete, TextField, Container } from '@mui/material';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// schema
import { AddDocumentTypeSchema } from '../../schemas/document';
// slice
import {
  addDocumentType,
  setDocumentTypeFormVisibility,
} from '../../../redux/slices/document/documentType';
import { setMachineDocumentFormVisibility } from '../../../redux/slices/document/machineDocument';
import { setCustomerDocumentFormVisibility } from '../../../redux/slices/document/customerDocument';
import { getActiveDocumentCategories } from '../../../redux/slices/document/documentCategory';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import { Cover } from '../../components/Defaults/Cover';
// constants
import { FORMLABELS } from '../../../constants/default-constants';
import { Snacks, FORMLABELS as formLABELS } from '../../../constants/document-constants';
// styles
import { StyledCardContainer } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------
DocumentTypeAddForm.propTypes = {
  currentDocument: PropTypes.object,
};
export default function DocumentTypeAddForm({ currentDocument }) {
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);

  const [documentCategoryVal, setDocumentCategoryVal] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      category: '',
      name: '',
      description: '',
      isActive: true,
      customerAccess: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocument]
  );

  const methods = useForm({
    resolver: yupResolver(AddDocumentTypeSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    dispatch(getActiveDocumentCategories());
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      if (documentCategoryVal) {
        data.docCategory = documentCategoryVal._id;
      }
      const response = await dispatch(addDocumentType(data));
      reset();
      enqueueSnackbar(Snacks.docSaved);
      navigate(PATH_SETTING.documentType.list);
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SETTING.documentType.list);
    dispatch(setDocumentTypeFormVisibility(false));
    dispatch(setMachineDocumentFormVisibility(true));
    dispatch(setCustomerDocumentFormVisibility(true));
  };
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={FORMLABELS.COVER.EDIT_DOCUMENT_TYPE} />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                {/* <Grid item lg={6}> */}
                
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
