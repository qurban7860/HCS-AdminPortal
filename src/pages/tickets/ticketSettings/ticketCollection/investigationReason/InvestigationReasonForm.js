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
import { TicketCollectionSchema, isValidColor, normalizeColor } from '../utils/constant';
import AddFormButtons from '../../../../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFTextField, RHFSwitch, RHFColorPicker, RHFEditor, RHFIconPicker } from '../../../../../components/hook-form';
import { postTicketInvestigationReason, patchTicketInvestigationReason, getTicketInvestigationReason, resetTicketInvestigationReason } from '../../../../../redux/slices/ticket/ticketSettings/ticketInvestigationReasons';
import Iconify from '../../../../../components/iconify';
import { handleError } from '../../../../../utils/errorHandler';

export default function InvestigationReasonForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { ticketInvestigationReason } = useSelector((state) => state.ticketInvestigationReasons);

  const defaultValues = useMemo(
    () => ({
      name: id && ticketInvestigationReason?.name || '',
      icon: id && ticketInvestigationReason?.icon || '',
      color: id && ticketInvestigationReason?.color || '',
      slug: id && ticketInvestigationReason?.slug || '',
      description: id && ticketInvestigationReason?.description || '',
      displayOrderNo: id && ticketInvestigationReason?.displayOrderNo || '',
      isDefault: id && ticketInvestigationReason?.isDefault || false,
      isActive: id ? ticketInvestigationReason?.isActive : true,
      createdAt: id && ticketInvestigationReason?.createdAt || '',
    }),
    [id, ticketInvestigationReason]
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
      dispatch(getTicketInvestigationReason(id));
    }
    return () => {
      dispatch(resetTicketInvestigationReason());
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id && ticketInvestigationReason) {
      reset(defaultValues);
    }
  }, [id, ticketInvestigationReason, defaultValues, reset]);

  useEffect(() => {
  }, [color]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await dispatch(patchTicketInvestigationReason(id, data));
        enqueueSnackbar('Investigation Reason Updated Successfully!');
        navigate(PATH_SUPPORT.settings.investigationReasons.view(id));
      } else {
        await dispatch(postTicketInvestigationReason(data));
        enqueueSnackbar('Investigation Reason Added Successfully!');
        navigate(PATH_SUPPORT.settings.investigationReasons.root);
      }
      reset();
    } catch (error) {
      enqueueSnackbar(handleError(error) || 'Investigation reason save failed!', { variant: 'error' });
      console.error(error);
    }
  };

  const toggleCancel = async () => {
    dispatch(resetTicketInvestigationReason())
    await navigate(PATH_SUPPORT.settings.investigationReasons.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={ticketInvestigationReason?.name || 'New Investigation Reason'} />
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
