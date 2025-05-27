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
import AddFormButtons from '../../../../../components/DocumentForms/AddFormButtons';
import { TicketCollectionSchema } from '../utils/constant';
import { handleError } from '../../../../../utils/errorHandler';
import FormProvider, { RHFTextField, RHFSwitch, RHFColorPicker, RHFEditor } from '../../../../../components/hook-form';
import { postTicketChangeReason, patchTicketChangeReason, getTicketChangeReason, resetTicketChangeReason } from '../../../../../redux/slices/ticket/ticketSettings/ticketChangeReasons';
import Iconify from '../../../../../components/iconify';

export default function ChangeReasonForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { ticketChangeReason } = useSelector((state) => state.ticketChangeReasons);

  const defaultValues = useMemo(
    () => ({
      name: id && ticketChangeReason?.name || '',
      icon: id && ticketChangeReason?.icon || '',
      color: id && ticketChangeReason?.color || '',
      slug: id && ticketChangeReason?.slug || '',
      description: id && ticketChangeReason?.description || '',
      displayOrderNo: id && ticketChangeReason?.displayOrderNo || '',
      isDefault: id && ticketChangeReason?.isDefault || false,
      isActive: id ? ticketChangeReason?.isActive : true,
      createdAt: id && ticketChangeReason?.createdAt || '',
    }),
    [id, ticketChangeReason]
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
      dispatch(getTicketChangeReason(id));
    }
    return () => {
      dispatch(resetTicketChangeReason());
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id && ticketChangeReason) {
      reset(defaultValues);
    }
  }, [id, ticketChangeReason, defaultValues, reset]);

  useEffect(() => {
  }, [color]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await dispatch(patchTicketChangeReason(id, data));
        enqueueSnackbar('Change Reason Updated Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.changeReasons.view(id));
      } else {
        await dispatch(postTicketChangeReason(data));
        enqueueSnackbar('Change Reason Added Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.changeReasons.root);
      }
      reset();
    } catch (error) {
      enqueueSnackbar(handleError(error) || 'ChangeReason save failed!', { variant: 'error' });
      console.error(error);
    }
  };

  const toggleCancel = async () => {
    dispatch(resetTicketChangeReason())
    await navigate(PATH_SUPPORT.ticketSettings.changeReasons.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={ticketChangeReason?.name || 'New Change Reason'} />
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
