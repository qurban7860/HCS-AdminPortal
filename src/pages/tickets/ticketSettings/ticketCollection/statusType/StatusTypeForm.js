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
import { postTicketStatusType, patchTicketStatusType, getTicketStatusType, resetTicketStatusType } from '../../../../../redux/slices/ticket/ticketSettings/ticketStatusTypes';
import Iconify from '../../../../../components/iconify';
import { handleError } from '../../../../../utils/errorHandler';

export default function StatusTypeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { ticketStatusType } = useSelector((state) => state.ticketStatusTypes);

  const defaultValues = useMemo(
    () => ({
      name: id && ticketStatusType?.name || '',
      icon: id && ticketStatusType?.icon || '',
      color: id && ticketStatusType?.color || '',
      slug: id && ticketStatusType?.slug || '',
      description: id && ticketStatusType?.description || '',
      displayOrderNo: id && ticketStatusType?.displayOrderNo || '',
      isResolved: id && ticketStatusType?.isResolved || false,
      isDefault: id && ticketStatusType?.isDefault || false,
      isActive: id ? ticketStatusType?.isActive : true,
      createdAt: id && ticketStatusType?.createdAt || '',
    }),
    [id, ticketStatusType]
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

  const { icon, color } = watch();

  useEffect(() => {
    if (id) {
      dispatch(getTicketStatusType(id));
    }
    return () => {
      dispatch(resetTicketStatusType());
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id && ticketStatusType) {
      reset(defaultValues);
    }
  }, [id, ticketStatusType, defaultValues, reset]);

  useEffect(() => {
  }, [color]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await dispatch(patchTicketStatusType(id, data));
        enqueueSnackbar('Status Type Updated Successfully!');
        navigate(PATH_SUPPORT.settings.statusTypes.view(id));
      } else {
        await dispatch(postTicketStatusType(data));
        enqueueSnackbar('Status Type Added Successfully!');
        navigate(PATH_SUPPORT.settings.statusTypes.root);
      }
      reset();
    } catch (error) {
      enqueueSnackbar(handleError(error) || 'StatusType save failed!', { variant: 'error' });
      console.error(error);
    }
  };

  const toggleCancel = async () => {
    dispatch(resetTicketStatusType())
    await navigate(PATH_SUPPORT.settings.statusTypes.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={ticketStatusType?.name || 'New Status Type'} />
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
                    <RHFSwitch name="isResolved" label="Resolved" />
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
