import * as Yup from 'yup';
import { useMemo,  useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Box, Card, Grid, Stack, Typography, Container,TextField, Autocomplete} from '@mui/material';
// slice
import { addTechparam } from '../../../redux/slices/products/machineTechParam';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
import { useSettingsContext } from '../../../components/settings';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// util
import {Cover} from '../../components/Cover';
import AddFormButtons from '../../components/AddFormButtons';
// ----------------------------------------------------------------------

export default function ParameterAddForm() {


  const { techparamcategories } = useSelector((state) => state.techparamcategory);

  const dispatch = useDispatch();

  const [paramCategoryVal, setParamCategoryVal] = useState(null);
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddMachineParameterSchema = Yup.object().shape({
    name: Yup.string().max(50).required('Name is required') ,
    description: Yup.string().max(2000),
    isActive : Yup.boolean(),
    code: Yup.string().required('Code is required') ,
  });

  const defaultValues = useMemo(
    () => ({
      name: ''  ,
      description:'',
      isActive: true,
      createdAt: '',
      code: '',
      
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddMachineParameterSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
      try{ 
        if(paramCategoryVal){
          data.category = paramCategoryVal?._id
        }
        await dispatch(addTechparam(data));
        reset();
        enqueueSnackbar('Create success!');
        navigate(PATH_MACHINE.parameters.list); 
      } catch(error){
        enqueueSnackbar(error?.message)
        console.error(error);
      }
  };
  const toggleCancel = () => 
      {
        navigate(PATH_MACHINE.parameters.list);
      };
  return (
    <>
    <Container maxWidth={false }>
      <Card sx={{ mb: 3, height: 160, position: 'relative', }} >
        <Cover name='New Parameter' icon='ic:round-flare' />
      </Card>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container >
        <Grid item xs={18} md={12} sx={{mt: 3}}>
          <Card sx={{ p: 3}}>
            <Stack spacing={3}>
              <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', }} >
                <Autocomplete
                  required
                  value={paramCategoryVal || null}
                  options={techparamcategories}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setParamCategoryVal(newValue);
                  }}
                  id="controllable-states-demo"
                  renderInput={(params) => <TextField {...params} label="Technical Parameter Categories" />}
                  ChipProps={{ size: 'small' }}
                />
              </Box>
              <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', }} >
                <RHFTextField name="name" label="Machine Technical Parameter"  />
                <RHFTextField name="code" label="Code"  />
              </Box>
              <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', }} >
                <RHFTextField name="description" label="Description" minRows={7} multiline />
                <RHFSwitch name="isActive" labelPlacement="start" label={
                    <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}>
                      Active
                    </Typography> }/>
              </Box>
            </Stack>
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
    </>
  );
}