import { useMemo, useEffect } from 'react';
import * as Yup from 'yup';
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
import { handleError } from '../../../../../utils/errorHandler';
import FormProvider, { RHFTextField, RHFSwitch, RHFColorPicker } from '../../../../../components/hook-form';
import { postTicketFault, patchTicketFault, getTicketFault, resetTicketFault } from '../../../../../redux/slices/ticket/ticketSettings/ticketFaults';
import Iconify from '../../../../../components/iconify';

export default function FaultForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { ticketFault } = useSelector((state) => state.ticketFaults);

  const defaultValues = useMemo(
    () => ({
      name: id && ticketFault?.name || '',
      icon: id && ticketFault?.icon || '',
      color: id && ticketFault?.color || '',
      slug: id && ticketFault?.slug || '',
      description: id && ticketFault?.description || '',
      displayOrderNo: id && ticketFault?.displayOrderNo || '',
      isDefault: id && ticketFault?.isDefault || false,
      isActive: id ? ticketFault?.isActive : true,
      createdAt: id && ticketFault?.createdAt || '',
    }),
    [id, ticketFault]
  );
  
  const FaultSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name is required!'),
    icon: Yup.string().max(50),
    color: Yup.string().nullable().notRequired().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      {
        message: 'Invalid color!',
        excludeEmptyString: true,
      }),
    description: Yup.string().max(5000),
    isActive: Yup.boolean(),
    isDefault: Yup.boolean(),
    displayOrderNo: Yup.number()
      .typeError('Display Order No. must be a number')
      .nullable()
      .transform((_, val) => (val !== '' ? Number(val) : null)),
    slug: Yup.string().min(0).max(50).matches(/^(?!.*\s)[\S\s]{0,50}$/, 'Slug field cannot contain blankspaces'),
  });

  const methods = useForm({
    resolver: yupResolver(FaultSchema),
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
      dispatch(getTicketFault(id));
    }
    return () => {
      dispatch(resetTicketFault());
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id && ticketFault) {
      reset(defaultValues);
    }
  }, [id, ticketFault, defaultValues, reset]);

  useEffect(() => {
  }, [color]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await dispatch(patchTicketFault(id, data));
        enqueueSnackbar('Fault Updated Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.faults.view(id));
      } else {
        await dispatch(postTicketFault(data));
        enqueueSnackbar('Fault Added Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.faults.root);
      }
      reset();
    } catch (error) {
      enqueueSnackbar(handleError(error) || 'ChangeReason save failed!', { variant: 'error' });
      console.error(error);
    }
  };

  const toggleCancel = async () => {
    dispatch(resetTicketFault())
    await navigate(PATH_SUPPORT.ticketSettings.faults.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={ticketFault?.name || 'New Fault'} />
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
                    label="Icon"
                  />
                  <RHFColorPicker
                    name="color"
                    label="Color"
                  />
                </Box>
                <RHFTextField name="description" label="Description" minRows={3} multiline />
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
