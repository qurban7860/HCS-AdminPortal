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
import FormProvider, { RHFTextField, RHFSwitch } from '../../../../../components/hook-form';
import { postTicketStatus, patchTicketStatus, getTicketStatus, resetTicketStatus } from '../../../../../redux/slices/ticket/ticketSettings/ticketStatuses';
import Iconify from '../../../../../components/iconify';
import { handleError } from '../../../../../utils/errorHandler';

export default function StatusForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const {  ticketStatus } = useSelector((state) => state.ticketStatuses);
  
  const defaultValues = useMemo(
    () => ({
      name: id && ticketStatus?.name || '',
      icon: id && ticketStatus?.icon || '',
      color: id && ticketStatus?.color || '',
      slug: id && ticketStatus?.slug || '',
      description: id && ticketStatus?.description || '',
      displayOrderNo: id && ticketStatus?.displayOrderNo || '',
      isDefault: id && ticketStatus?.isDefault || false,
      isActive: id ? ticketStatus?.isActive : true,
      createdAt: id && ticketStatus?.createdAt || '',
    }),
    [ id, ticketStatus ] 
  );

  const methods = useForm({
    resolver: yupResolver(TicketCollectionSchema),
    defaultValues,
  });

  const { 
    reset, 
    handleSubmit, 
    watch,
     formState: { isSubmitting }
    } = methods;
  
    const { icon, color } = watch()

    useEffect(() => {
    }, [color]);

  const onSubmit = async (data) => {
    try {
      if (id) { 
        await dispatch(patchTicketStatus(id, data)); 
        dispatch(getTicketStatus(id)); 
        enqueueSnackbar('Status Updated Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.statuses.view(id));
      } else {
        await dispatch(postTicketStatus(data));
        enqueueSnackbar('Status Added Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.statuses.root);
      }
      reset();
      dispatch(resetTicketStatus());
    } catch (error) {
      enqueueSnackbar( handleError( error ) || 'Status save failed!', { variant: 'error' });
      console.error(error);
    }
  };  
 
  const toggleCancel = async () => {
    dispatch(resetTicketStatus())
    await navigate(PATH_SUPPORT.ticketSettings.statuses.root);
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
                <RHFTextField name="name" label="Name*"/>
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
                <RHFTextField 
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start" />
                    )
                  }}
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
                  <RHFSwitch name="isDefault" label="Default" />
                  {id && (
                  <RHFSwitch name="isActive" label="Active" />
                  )}
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
