import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack } from '@mui/material';
// slice
import {
  updateServiceCategory,
  setServiceCategoryEditFormVisibility,
  getServiceCategory,
} from '../../../../redux/slices/products/serviceCategory';
// routes
import { PATH_MACHINE } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import ToggleButtons from '../../../../components/DocumentForms/ToggleButtons';
import { FORMLABELS } from '../../../../constants/default-constants';
// ----------------------------------------------------------------------

export default function ServiceCategoryEditForm() {
  const { serviceCategory } = useSelector((state) => state.serviceCategory);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const defaultValues = useMemo(
    () => ({
      name: serviceCategory?.name || '',
      description: serviceCategory?.description || '',
      isActive: serviceCategory.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serviceCategory]
  );

  const ServiceCategorySchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name is required').trim(),
    description: Yup.string().max(5000).trim(),
    isActive: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(ServiceCategorySchema),
    defaultValues,
  });


  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

    watch();

  useLayoutEffect(() => {
    dispatch(getServiceCategory(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (serviceCategory) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceCategory]);
  const toggleCancel = () => {
    dispatch(setServiceCategoryEditFormVisibility(false));
    navigate(PATH_MACHINE.machines.settings.serviceCategories.view(id));
  };
  const onSubmit = async (data) => {
    try {
      await dispatch(updateServiceCategory(data, id));
      reset();
      dispatch(setServiceCategoryEditFormVisibility(false));
      enqueueSnackbar('Service Category Updated Successfully!');
      navigate(PATH_MACHINE.machines.settings.serviceCategories.view(id));
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };
  return (
    <>
      <StyledCardContainer><Cover name={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_CATEGORY_EDIT}/></StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}>
                  <RHFTextField name="name" label="Name*" />
                  <RHFTextField name="description" label="Description" minRows={7} multiline />
                  <ToggleButtons isMachine name={FORMLABELS.isACTIVE.name}/>
                </Box>
              </Stack>
              <AddFormButtons machineSettingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
