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
import FormProvider, { RHFTextField, RHFSwitch, RHFColorPicker, RHFEditor, RHFIconPicker } from '../../../../../components/hook-form';
import { postTicketChangeType, patchTicketChangeType, getTicketChangeType, resetTicketChangeType } from '../../../../../redux/slices/ticket/ticketSettings/ticketChangeTypes';
import Iconify from '../../../../../components/iconify';
import { handleError } from '../../../../../utils/errorHandler';

export default function ChangeTypeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { ticketChangeType } = useSelector((state) => state.ticketChangeTypes);

  const defaultValues = useMemo(
    () => ({
      name: id && ticketChangeType?.name || '',
      icon: id && ticketChangeType?.icon || '',
      color: id && ticketChangeType?.color || '',
      slug: id && ticketChangeType?.slug || '',
      description: id && ticketChangeType?.description || '',
      displayOrderNo: id && ticketChangeType?.displayOrderNo || '',
      isDefault: id && ticketChangeType?.isDefault || false,
      isActive: id ? ticketChangeType?.isActive : true,
      createdAt: id && ticketChangeType?.createdAt || '',
    }),
    [id, ticketChangeType]
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
      dispatch(getTicketChangeType(id));
    }
    return () => {
      dispatch(resetTicketChangeType());
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id && ticketChangeType) {
      reset(defaultValues);
    }
  }, [id, ticketChangeType, defaultValues, reset]);

  useEffect(() => {
  }, [color]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await dispatch(patchTicketChangeType(id, data));
        enqueueSnackbar('Change Type Updated Successfully!');
        navigate(PATH_SUPPORT.settings.changeTypes.view(id));
      } else {
        await dispatch(postTicketChangeType(data));
        enqueueSnackbar('Change Type Added Successfully!');
        navigate(PATH_SUPPORT.settings.changeTypes.root);
      }
      reset();
    } catch (error) {
      enqueueSnackbar(handleError(error) || 'ChangeType save failed!', { variant: 'error' });
      console.error(error);
    }
  };

  const toggleCancel = async () => {
    dispatch(resetTicketChangeType())
    await navigate(PATH_SUPPORT.settings.changeTypes.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={ticketChangeType?.name || 'New Change Type'} />
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
                  {/* <RHFTextField
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start" >
                          <Iconify icon={icon} sx={{ width: 25, height: 25, color: color || 'black' }} />
                        </InputAdornment>
                      )
                    }}
                    name="icon"
                    label="Icon*"
                  /> */}
                  <RHFIconPicker name="icon" label="Icon*" color={color || 'black'} />

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
