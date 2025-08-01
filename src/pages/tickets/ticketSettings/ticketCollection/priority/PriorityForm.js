import { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Container, Card, Grid, Stack } from '@mui/material';
// components
import { Cover } from '../../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../../theme/styles/default-styles';
import { PATH_SUPPORT } from '../../../../../routes/paths';
import { useSnackbar } from '../../../../../components/snackbar';
import { TicketCollectionSchema, isValidColor, normalizeColor } from '../utils/constant';
import AddFormButtons from '../../../../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFTextField, RHFSwitch, RHFColorPicker, RHFEditor, RHFIconPicker } from '../../../../../components/hook-form';
import { postTicketPriority, patchTicketPriority, getTicketPriority, resetTicketPriority } from '../../../../../redux/slices/ticket/ticketSettings/ticketPriorities';
import { handleError } from '../../../../../utils/errorHandler';

export default function PriorityForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { ticketPriority } = useSelector((state) => state.ticketPriorities);

  const defaultValues = useMemo(
    () => ({
      name: id && ticketPriority?.name || '',
      icon: id && ticketPriority?.icon || '',
      color: id && ticketPriority?.color || '',
      slug: id && ticketPriority?.slug || '',
      description: id && ticketPriority?.description || '',
      displayOrderNo: id && ticketPriority?.displayOrderNo || '',
      isDefault: id && ticketPriority?.isDefault || false,
      isActive: id ? ticketPriority?.isActive : true,
      createdAt: id && ticketPriority?.createdAt || '',
    }),
    [id, ticketPriority]
  );

  const methods = useForm({
    resolver: yupResolver(TicketCollectionSchema),
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting }
  } = methods;

  const { color } = watch()

  useEffect(() => {
    if (id) {
      dispatch(getTicketPriority(id));
    }
    return () => {
      dispatch(resetTicketPriority());
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id && ticketPriority) {
      reset(defaultValues);
    }
  }, [id, ticketPriority, defaultValues, reset]);

  useEffect(() => {
  }, [color]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await dispatch(patchTicketPriority(id, data));
        enqueueSnackbar('Priority Updated Successfully!');
        navigate(PATH_SUPPORT.settings.priorities.view(id));
      } else {
        await dispatch(postTicketPriority(data));
        enqueueSnackbar('Priority Added Successfully!');
        navigate(PATH_SUPPORT.settings.priorities.root);
      }
      reset();
    } catch (error) {
      enqueueSnackbar(handleError(error) || 'Priority save failed!', { variant: 'error' });
      console.error(error);
    }
  };

  const toggleCancel = async () => {
    dispatch(resetTicketPriority())
    await navigate(PATH_SUPPORT.settings.priorities.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={ticketPriority?.name || 'New priority'} />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <RHFTextField name="name" label="Name*" />
                  <RHFTextField name="slug" label="Slug" />
                  <RHFIconPicker name="icon" label="Icon*" color={isValidColor(normalizeColor(color)) ? normalizeColor(color) : 'black'} />

                  <RHFColorPicker
                    name="color"
                    label="Color"
                  />
                </Box>
                <RHFEditor name="description" label="Description" minRows={3} multiline />
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <RHFTextField name="displayOrderNo" label="Display Order No." />
                  <Grid display="flex" alignItems="center">
                    {id && (
                      <RHFSwitch name="isActive" label="Active" />
                    )}
                    <RHFSwitch name="isDefault" label="Default" />
                  </Grid>
                </Box>
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
