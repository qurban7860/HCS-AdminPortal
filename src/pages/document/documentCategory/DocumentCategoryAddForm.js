import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Stack, Typography, Container, FormControl, RadioGroup, Radio, FormControlLabel } from '@mui/material';
// hooks
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../../../components/snackbar';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// schema
import { AddDocumentCategorySchema } from '../../schemas/document';
// slice
import { addDocumentCategory } from '../../../redux/slices/document/documentCategory';
// components
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../components/Defaults/Cover';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
// assets
import { countries } from '../../../assets/data';
// styles
import { StyledCardContainer } from '../../../theme/styles/default-styles';
// constants
import { FORMLABELS } from '../../../constants/default-constants';
import { Snacks, FORMLABELS as formLABELS } from '../../../constants/document-constants';

// ----------------------------------------------------------------------
DocumentCategoryAddForm.propTypes = {
  currentDocument: PropTypes.object,
};
export default function DocumentCategoryAddForm({ currentDocument }) {
  const navigate = useNavigate();
  const [radioValue, setRadioValue] = useState('customer');
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      isActive: true,
      customerAccess: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocument]
  );

  const methods = useForm({
    resolver: yupResolver(AddDocumentCategorySchema),
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
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    try {
      data.type = radioValue
      await dispatch(addDocumentCategory(data));
      reset();
      enqueueSnackbar(Snacks.docSaved);
      navigate(PATH_SETTING.documentCategory.list);
    } catch (error) {
      enqueueSnackbar(Snacks.failedSaveDoc, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SETTING.documentCategory.list);
  };
  const radioOnChange = (event) => {
    setRadioValue(event.target.value);
  };
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={FORMLABELS.COVER.NEW_DOCUMENT_CATEGORY} // New Document Category
          generalSettings
          backLink={PATH_SETTING.documentCategory.list}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
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
