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
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../../../components/hook-form';
import { postTicketRequestType, patchTicketRequestType, getTicketRequestType, resetTicketRequestType } from '../../../../../redux/slices/ticket/ticketSettings/ticketRequestTypes';
import { getActiveTicketIssueTypes, resetActiveTicketIssueTypes } from '../../../../../redux/slices/ticket/ticketSettings/ticketIssueTypes';
import Iconify from '../../../../../components/iconify';
import { handleError } from '../../../../../utils/errorHandler';

export default function RequestTypeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { ticketRequestType } = useSelector((state) => state.ticketRequestTypes);
  const { activeTicketIssueTypes } = useSelector((state) => state.ticketIssueTypes);
  
  const RequestTypeSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name is required!'),
    issueType: Yup.object().nullable().required('Issue Type is required!'),
    icon: Yup.string().max(50).required('Icon is required!'),
    description: Yup.string().max(5000),
    isActive: Yup.boolean(),
      isDefault: Yup.boolean(),
      displayOrderNo: Yup.number()
      .typeError('Display Order No. must be a number')
      .nullable()
      .transform((_, val) => (val !== '' ? Number(val) : null)),
    slug: Yup.string().min(0).max(50).matches(/^(?!.*\s)[\S\s]{0,50}$/, 'Slug field cannot contain blankspaces'),
  });
  
  useEffect(() => {
    dispatch(getActiveTicketIssueTypes());
    return ()=> { 
      dispatch(resetActiveTicketIssueTypes());
    }
  }, [dispatch]);  

  const defaultValues = useMemo(
    () => ({
      name: id && ticketRequestType?.name || '',
      issueType: id && ticketRequestType?.issueType || null,
      icon: id && ticketRequestType?.icon || '',
      color: id && ticketRequestType?.color || '',
      slug: id && ticketRequestType?.slug || '',
      description: id && ticketRequestType?.description || '',
      displayOrderNo: id && ticketRequestType?.displayOrderNo || '',
      isDefault: id && ticketRequestType?.isDefault || false,
      isActive: id ? ticketRequestType?.isActive : true,
      createdAt: id && ticketRequestType?.createdAt || '',
    }),
    [ id, ticketRequestType ] 
  );

  const methods = useForm({
    resolver: yupResolver(RequestTypeSchema),
    defaultValues,
  });

  const { 
    reset, 
    handleSubmit, 
    watch,
    formState: { isSubmitting }
  } = methods;
  
  const { icon, color } = watch();
  
  useEffect(()=>{
    if(id){
      dispatch(getTicketRequestType(id));
    }
    return () => { 
      dispatch(resetTicketRequestType());
    }
  },[dispatch, id ])
  
  useEffect(() => {
    if (id && ticketRequestType) {
      reset(defaultValues);
    }
  }, [id, ticketRequestType, defaultValues, reset]);
  
  useEffect(() => {
  }, [color]);

  const onSubmit = async (data) => {
    try {
      if (id) { 
        await dispatch(patchTicketRequestType(id, data)); 
        enqueueSnackbar('Request Type Updated Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.requestTypes.view(id));
      } else {
        await dispatch(postTicketRequestType(data));
        enqueueSnackbar('Request Type Added Successfully!');
        navigate(PATH_SUPPORT.ticketSettings.requestTypes.root);
      }
      reset();
    } catch (error) {
      enqueueSnackbar( handleError( error ) || 'RequestType save failed!', { variant: 'error' });
      console.error(error);
    }
  };  
  
  const toggleCancel = async () => {
    dispatch(resetTicketRequestType())
    await navigate(PATH_SUPPORT.ticketSettings.requestTypes.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={ticketRequestType?.name || 'New Request Type'} />
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
                <RHFAutocomplete
                  name="issueType"
                  label="Issue Type*"
                  options={[...activeTicketIssueTypes].sort((a, b) => a.displayOrderNo - b.displayOrderNo || [])}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  getOptionLabel={(option) => `${option.name || ''}`}
                  renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li> )}
                />
                 
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
                <RHFTextField name="slug" label="Slug" />
                <RHFTextField name="displayOrderNo" label="Display Order No." />
                </Box>
                <RHFTextField name="description" label="Description" minRows={3} multiline />
                  <Grid display="flex" alignItems="center">
                    <RHFSwitch name="isDefault" label="Default" />
                    {id && (
                     <RHFSwitch name="isActive" label="Active" />
                    )}
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


