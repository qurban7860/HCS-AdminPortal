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
import FormProvider, { RHFTextField, RHFSwitch } from '../../../../../components/hook-form';
import { postTicketChangeType, patchTicketChangeType, getTicketChangeType, resetTicketChangeType } from '../../../../../redux/slices/ticket/ticketSettings/ticketChangeTypes';
import Iconify from '../../../../../components/iconify';

export default function ChangeTypeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const {  ticketChangeType } = useSelector((state) => state.ticketChangeTypes);
  
  const defaultValues = useMemo(
    () => ({
      name: ticketChangeType?.name || '',
      icon: ticketChangeType?.icon || '',
      slug: ticketChangeType?.slug || '',
      description: ticketChangeType?.description || '',
      displayOrderNo: ticketChangeType?.displayOrderNo || '',
      isDefault: ticketChangeType?.isDefault ?? false,
      createdAt: ticketChangeType?.createdAt || '',
    }),
    [ ticketChangeType ] 
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
        await dispatch(patchTicketChangeType(id, data)); 
        dispatch(getTicketChangeType(id)); 
        enqueueSnackbar('Change Type Updated Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.changeTypes.view(id));
      } else {
        await dispatch(postTicketChangeType(data));
        enqueueSnackbar('Change Type Added Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.changeTypes.root);
      }
      reset();
      dispatch(resetTicketChangeType());
    } catch (error) {
      enqueueSnackbar(error.message || 'An error occurred', { variant: 'error' });
      console.error(error);
    }
  };  
  
  const toggleCancel = async () => {
    dispatch(resetTicketChangeType())
    await navigate(PATH_SUPPORT.ticketSettings.changeTypes.root);
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
