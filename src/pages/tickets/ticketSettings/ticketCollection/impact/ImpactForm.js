import { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Container, Card, Grid, Stack, InputAdornment } from '@mui/material';
// components
import { Cover } from '../../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../../theme/styles/default-styles';
import { PATH_SUPPORT } from '../../../../../routes/paths';
import { useSnackbar } from '../../../../../components/snackbar';
import { TicketCollectionSchema } from '../utils/constant';
import AddFormButtons from '../../../../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFTextField, RHFSwitch, RHFColorPicker, RHFEditor } from '../../../../../components/hook-form';
import { postTicketImpact, patchTicketImpact, getTicketImpact, resetTicketImpact } from '../../../../../redux/slices/ticket/ticketSettings/ticketImpacts';
import Iconify from '../../../../../components/iconify';
import { handleError } from '../../../../../utils/errorHandler';

export default function ImpactForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { ticketImpact } = useSelector((state) => state.ticketImpacts);

  const defaultValues = useMemo(
    () => ({
      name: id && ticketImpact?.name || '',
      icon: id && ticketImpact?.icon || '',
      color: id && ticketImpact?.color || '',
      slug: id && ticketImpact?.slug || '',
      description: id && ticketImpact?.description || '',
      displayOrderNo: id && ticketImpact?.displayOrderNo || '',
      isDefault: id && ticketImpact?.isDefault || false,
      isActive: id ? ticketImpact?.isActive : true,
      createdAt: id && ticketImpact?.createdAt || '',
    }),
    [id, ticketImpact]
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

  const { icon, color } = watch()

  useEffect(() => {
    if (id) {
      dispatch(getTicketImpact(id));
    }
    return () => {
      dispatch(resetTicketImpact());
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id && ticketImpact) {
      reset(defaultValues);
    }
  }, [id, ticketImpact, defaultValues, reset]);

  useEffect(() => {
  }, [color]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await dispatch(patchTicketImpact(id, data));
        enqueueSnackbar('Impact Updated Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.impacts.view(id));
      } else {
        await dispatch(postTicketImpact(data));
        enqueueSnackbar('Impact Added Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.impacts.root);
      }
      reset();
    } catch (error) {
      enqueueSnackbar(handleError(error) || 'Impact save failed!', { variant: 'error' });
      console.error(error);
    }
  };

  const toggleCancel = async () => {
    dispatch(resetTicketImpact())
    await navigate(PATH_SUPPORT.ticketSettings.impacts.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={ticketImpact?.name || 'New Impact'} />
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
                  <RHFTextField
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start" >
                          <Iconify icon={icon} sx={{ width: 25, height: 25, color: color || 'black' }} />
                        </InputAdornment>
                      )
                    }}
                    name="icon"
                    label="Icon*"
                  />
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
