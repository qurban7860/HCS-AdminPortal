import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Stack, Typography, Container, FormControl, RadioGroup, Radio, FormControlLabel } from '@mui/material';
// hooks
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../../../components/snackbar';
// schema
import { EditDocumentNameSchema } from '../../schemas/document';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// components
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import {
  getDocumentCategory,
  updateDocumentCategory,
} from '../../../redux/slices/document/documentCategory';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import FormHeading from '../../components/DocumentForms/FormHeading';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import { Cover } from '../../components/Defaults/Cover';
// styles
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { FORMLABELS } from '../../../constants/default-constants';
import { Snacks, FORMLABELS as formLABELS } from '../../../constants/document-constants';

// ----------------------------------------------------------------------

export default function DocumentCategoryeEditForm() {
  const { documentCategory } = useSelector((state) => state.documentCategory);
  const [radioValue, setRadioValue] = useState('customer');
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const defaultValues = useMemo(
    () => ({
      name: documentCategory?.name || '',
      description: documentCategory?.description || '',
      isActive: documentCategory?.isActive,
      customerAccess: documentCategory?.customerAccess,
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
    navigate(PATH_SETTING.documentCategory.view(documentCategory._id));
  };

  const onSubmit = async (data) => {
    try {
      data.type = radioValue
      await dispatch(updateDocumentCategory(documentCategory._id, data));
      dispatch(getDocumentCategory(documentCategory._id));
      navigate(PATH_SETTING.documentCategory.view(documentCategory._id));
      enqueueSnackbar(Snacks.addedDocCategory, { variant: `success` });
      reset();
    } catch (err) {
      enqueueSnackbar(Snacks.failedSaveDocCategory, { variant: `error` });
      console.error(err.message);
    }
  };

  const radioOnChange = (event) => {
    setRadioValue(event.target.value);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={documentCategory?.name}
          generalSettings
          backLink={PATH_SETTING.documentCategory.view(documentCategory?._id)}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <FormHeading heading={FORMLABELS.COVER.EDIT_DOCUMENT_CATEGORY} />
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={radioValue}
                  onChange={radioOnChange}
                  >
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel item sm={6} value="customer" control={<Radio />} label="Customer" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel item sm={6} value="machine" control={<Radio />} label="Machine"/>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel item sm={6} value="drawing" control={<Radio />} label="Drawings"/>
                  </Grid>
                </RadioGroup>
              </FormControl>
                <RHFTextField name={formLABELS.CATEGORY.name} label={formLABELS.CATEGORY.label} />
                <RHFTextField
                  name={formLABELS.CATEGORY_DESC.name}
                  label={formLABELS.CATEGORY_DESC.label}
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
