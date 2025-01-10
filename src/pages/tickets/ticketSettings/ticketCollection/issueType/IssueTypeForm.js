
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Container, Card, Grid, Stack } from '@mui/material';
// components
import { Cover } from '../../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../../theme/styles/default-styles';
import { PATH_SUPPORT } from '../../../../../routes/paths';
import { useSnackbar } from '../../../../../components/snackbar';
import AddFormButtons from '../../../../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../../../components/hook-form';
import { postTicketIssueType, patchTicketIssueType, getTicketIssueType, resetTicketIssueType } from '../../../../../redux/slices/ticket/ticketSettings/ticketIssueTypes';

export default function IssueTypeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const {  ticketIssueType } = useSelector((state) => state.ticketIssueTypes);
  
  const defaultValues = useMemo(
    () => ({
      name: ticketIssueType?.name || '',
      description: ticketIssueType?.description || '',
      displayOrderNo: ticketIssueType?.displayOrderNo || '',
      isDefault: ticketIssueType?.isDefault ?? false,
      createdAt: ticketIssueType?.createdAt || '',
    }),
    [ ticketIssueType ] 
  );
  
  const TicketCollectionSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name is required!'),
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
    resolver: yupResolver(TicketCollectionSchema),
    defaultValues,
  });

  const { reset, handleSubmit, formState: { isSubmitting }} = methods;
  
  const onSubmit = async (data) => {
    try {
      if (id) { 
        await dispatch(patchTicketIssueType(id, data)); 
        dispatch(getTicketIssueType(id)); 
        enqueueSnackbar('Issue Type Updated Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.issueTypes.view(id));
      } else {
        await dispatch(postTicketIssueType(data));
        enqueueSnackbar('Issue Type Added Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.issueTypes.root);
      }
      reset();
      dispatch(resetTicketIssueType());
    } catch (error) {
      enqueueSnackbar(error.message || 'An error occurred', { variant: 'error' });
      console.error(error);
    }
  };  
  
  const toggleCancel = async () => {
    // dispatch(resetTicket())
    await navigate(PATH_SUPPORT.ticketSettings.issueTypes.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="New Issue Type" />
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
                </Box>
                  <RHFTextField name="displayOrderNo" label="Display Order No." />
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
