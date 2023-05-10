import * as Yup from 'yup';
import { useMemo } from 'react';
import { useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, Container } from '@mui/material';
// slice
import { addTechparamcategory} from '../../../redux/slices/products/machineTechParamCategory';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
// util
import {Cover} from '../../components/Cover';
import AddFormButtons from '../../components/AddFormButtons';
// ----------------------------------------------------------------------

export default function TechParamCategoryAddForm() {

  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddMachineSchema = Yup.object().shape({
    name: Yup.string().max(50).required('Name is required') ,
    description: Yup.string().max(2000),
    isActive : Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: ''  ,
      description:'',
      isActive: true,
      createdAt: '',
      
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddMachineSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    
      try{ 
        await dispatch(addTechparamcategory(data));
        reset();
        enqueueSnackbar('Create success!');
        navigate(PATH_MACHINE.techParam.list); 
      } catch(error){
        // enqueueSnackbar('Saving failed!');
        if(error?.message){
          enqueueSnackbar(error.message, { variant: `error` });
        }
        console.error(error);
      }
  };
      const toggleCancel = () => 
      {
        navigate(PATH_MACHINE.techParam.list);
      };

  return (
    <Container maxWidth={false }>
      <Card sx={{ mb: 3, height: 160, position: 'relative', }} >
        <Cover name='New Parameter Category' icon='ic:round-class' />
      </Card>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container>
        <Grid item xs={18} md={12} sx={{mt: 3}}>
          <Card sx={{ p: 3}}>
            <Stack spacing={3}>
              <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', }} >
                <RHFTextField name="name" label="Technical Parameter Category"  />
                <RHFTextField name="description" label="Description" minRows={7} multiline />
                <RHFSwitch name="isActive" labelPlacement="start" label={ <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active </Typography> } />
              </Box>
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
          </Card>
        </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}