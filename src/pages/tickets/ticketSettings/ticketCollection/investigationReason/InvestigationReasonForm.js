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
import { postTicketInvestigationReason, patchTicketInvestigationReason, getTicketInvestigationReason, resetTicketInvestigationReason } from '../../../../../redux/slices/ticket/ticketSettings/ticketInvestigationReasons';
import Iconify from '../../../../../components/iconify';

export default function InvestigationReasonForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const {  ticketInvestigationReason } = useSelector((state) => state.ticketInvestigationReasons);
  
  const defaultValues = useMemo(
    () => ({
      name: ticketInvestigationReason?.name || '',
      icon: ticketInvestigationReason?.icon || '',
      slug: ticketInvestigationReason?.slug || '',
      description: ticketInvestigationReason?.description || '',
      displayOrderNo: ticketInvestigationReason?.displayOrderNo || '',
      isDefault: ticketInvestigationReason?.isDefault ?? false,
      createdAt: ticketInvestigationReason?.createdAt || '',
    }),
    [ ticketInvestigationReason ] 
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
        await dispatch(patchTicketInvestigationReason(id, data)); 
        dispatch(getTicketInvestigationReason(id)); 
        enqueueSnackbar('Investigation Reason Updated Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.investigationReasons.view(id));
      } else {
        await dispatch(postTicketInvestigationReason(data));
        enqueueSnackbar('Investigation Reason Added Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.investigationReasons.root);
      }
      reset();
      dispatch(resetTicketInvestigationReason());
    } catch (error) {
      enqueueSnackbar(error.message || 'An error occurred', { variant: 'error' });
      console.error(error);
    }
  };  
  
  const toggleCancel = async () => {
    dispatch(resetTicketInvestigationReason())
    await navigate(PATH_SUPPORT.ticketSettings.investigationReasons.root);
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
                  <RHFTextField name="name" label="Name*"/>
                  <RHFTextField 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" >
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
