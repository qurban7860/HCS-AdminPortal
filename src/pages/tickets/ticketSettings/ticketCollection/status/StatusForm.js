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

export default function StatusForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const {  ticketStatus } = useSelector((state) => state.ticketStatuses);
  
  const defaultValues = useMemo(
    () => ({
      name: ticketStatus?.name || '',
      icon: ticketStatus?.icon || '',
      slug: ticketStatus?.slug || '',
      description: ticketStatus?.description || '',
      displayOrderNo: ticketStatus?.displayOrderNo || '',
      isDefault: ticketStatus?.isDefault || false,
      createdAt: ticketStatus?.createdAt || '',
    }),
    [ ticketStatus ] 
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
  
    const { icon } = watch()

    useEffect(() => {
    }, [icon]);

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
      enqueueSnackbar(error.message || 'An error occurred', { variant: 'error' });
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
                  <RHFTextField 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="end" >
                          <Iconify icon={icon} sx={{ width: 25, height: 25, }} />
                        </InputAdornment>
                      )
                    }}
                    name="icon" 
                    label="Icon*"
                  />
                  <RHFTextField name="slug" label="Slug" />
                  <RHFTextField name="displayOrderNo" label="Display Order No." />
                </Box>
                  <RHFTextField name="description" label="Description" minRows={3} multiline />
                  <Grid display="flex" alignItems="end">
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
