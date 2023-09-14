import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
// slice
import {
  updateTechparamcategory,
  getTechparamcategory,
} from '../../../redux/slices/products/machineTechParamCategory';
// import { useSettingsContext } from '../../../components/settings';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function TechParamCategoryEditForm() {
  const { techparamcategory } = useSelector((state) => state.techparamcategory);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const EditToolSchema = Yup.object().shape({
    name: Yup.string().max(50).required('Name is required'),
    description: Yup.string().max(2000),
    isActive: Yup.boolean(),
  });
  const defaultValues = useMemo(
    () => ({
      name: techparamcategory?.name || '',
      description: techparamcategory?.description || '',
      isActive: techparamcategory.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [techparamcategory]
  );

  const methods = useForm({
    resolver: yupResolver(EditToolSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useLayoutEffect(() => {
    dispatch(getTechparamcategory(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (techparamcategory) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [techparamcategory]);

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.technicalParameterCategories.view(id));
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateTechparamcategory(data, id));
      reset();
      enqueueSnackbar('Update success!');
      navigate(PATH_MACHINE.machines.settings.technicalParameterCategories.view(id));
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <StyledCardContainer>
            <Cover name="Edit Parameter Category" icon="ic:round-class" />
          </StyledCardContainer>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
              >
                <RHFTextField name="name" label="Name*" />
                <RHFTextField name="description" label="Description" minRows={7} multiline />
                <RHFSwitch
                  name="isActive"
                  labelPlacement="start"
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                        mb: 0.5,
                        color: 'text.secondary',
                      }}
                    >
                      {' '}
                      Active
                    </Typography>
                  }
                />
              </Box>
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
