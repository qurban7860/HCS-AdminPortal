import { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
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
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete, RHFColorPicker, RHFEditor, RHFIconPicker } from '../../../../../components/hook-form';
import { postTicketStatus, patchTicketStatus, resetTicketStatus, getTicketStatus } from '../../../../../redux/slices/ticket/ticketSettings/ticketStatuses';
import { getActiveTicketStatusTypes, resetActiveTicketStatusTypes } from '../../../../../redux/slices/ticket/ticketSettings/ticketStatusTypes';
import Iconify from '../../../../../components/iconify';
import { handleError } from '../../../../../utils/errorHandler';
import { TicketCollectionSchema, isValidColor, normalizeColor } from '../utils/constant';

export default function StatusForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { ticketStatus } = useSelector((state) => state.ticketStatuses);
  const { activeTicketStatusTypes } = useSelector((state) => state.ticketStatusTypes);

  useEffect(() => {
    dispatch(getActiveTicketStatusTypes());
    return () => {
      dispatch(resetActiveTicketStatusTypes());
    }
  }, [dispatch]);

  const defaultValues = useMemo(
    () => ({
      name: id && ticketStatus?.name || '',
      statusType: id && ticketStatus?.statusType || null,
      icon: id && ticketStatus?.icon || '',
      color: id && ticketStatus?.color || '',
      slug: id && ticketStatus?.slug || '',
      description: id && ticketStatus?.description || '',
      displayOrderNo: id && ticketStatus?.displayOrderNo || '',
      isDefault: id && ticketStatus?.isDefault || false,
      isActive: id ? ticketStatus?.isActive : true,
      createdAt: id && ticketStatus?.createdAt || '',
    }),
    [id, ticketStatus]
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
      dispatch(getTicketStatus(id));
    }
    return () => {
      dispatch(resetTicketStatus());
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id && ticketStatus) {
      reset(defaultValues);
    }
  }, [id, ticketStatus, defaultValues, reset]);

  useEffect(() => {
  }, [color]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await dispatch(patchTicketStatus(id, data));
        enqueueSnackbar('Status Updated Successfully!');
        navigate(PATH_SUPPORT.settings.statuses.view(id));
      } else {
        await dispatch(postTicketStatus(data));
        enqueueSnackbar('Status Added Successfully!');
        navigate(PATH_SUPPORT.settings.statuses.root);
      }
      reset();
    } catch (error) {
      enqueueSnackbar(handleError(error) || 'Status save failed!', { variant: 'error' });
      console.error(error);
    }
  };

  const toggleCancel = async () => {
    dispatch(resetTicketStatus())
    await navigate(PATH_SUPPORT.settings.statuses.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={ticketStatus?.name || 'New Status'} />
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
                  <RHFAutocomplete
                    name="statusType"
                    label="Status Type*"
                    options={activeTicketStatusTypes || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li>)}
                  />
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
                  <RHFTextField name="slug" label="Slug" />
                  <RHFTextField name="displayOrderNo" label="Display Order No." />
                </Box>
                <RHFEditor name="description" label="Description" minRows={3} multiline />
                <Grid display="flex" alignItems="center">
                  {id && (
                    <RHFSwitch name="isActive" label="Active" />
                  )}
                  <RHFSwitch name="isDefault" label="Default" />
                </Grid>
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
