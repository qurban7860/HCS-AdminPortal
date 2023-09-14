import * as Yup from 'yup';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Stack, Typography } from '@mui/material';
// routes
import { PATH_SETTING } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField } from '../../components/hook-form';
// slice
import { getModules, updateModule } from '../../redux/slices/module/module';
// current user
import AddFormButtons from '../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function ModuleEditForm() {
  const { module } = useSelector((state) => state.module);
  // const [selected, setSelected] = useState([]);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  /* eslint-disable */
  useLayoutEffect(() => {
    setSelected(module);
  }, [dispatch]);
  /* eslint-enable */


  const EditModuleSchema = Yup.object().shape({
    name: Yup.string().required('Name is required!').max(40, 'Name must not exceed 40 characters!'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  // const defaultValues = useMemo(
  //   () => ({
  //     name: module?.name || '',
  //     description: module?.description || '',
  //     isActive: module?.isActive || false,
  //   }),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   []
  // );

  // const methods = useForm({
  //   resolver: yupResolver(EditModuleSchema),
  //   defaultValues:defaultValues,
  // });

  const methods = useForm({
    resolver: yupResolver(EditModuleSchema),
    defaultValues:module,
  });
  
  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  watch();

  const toggleCancel = () => {
    navigate(PATH_SETTING.modules.view(module._id));
  };

  const onSubmit = async (data) => {
    try {
      console.log ("edit",data); 
     await dispatch(updateModule(data, module._id));
      dispatch(getModules(module._id));
      enqueueSnackbar('Module updated Successfully!');
      navigate(PATH_SETTING.modules.view(module._id));
      reset();
    } catch (err) {
      enqueueSnackbar('Module Updating failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  // const handleChange = (event, selectedOptions) => {
  //   setSelected(selectedOptions);
  // };
 
  //  const getModule = (moduleId) => {
  //   // Implementation of your getModule logic here
  // };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
       <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <RHFTextField name="name" label="Name" required/>
                {/* <Autocomplete
                   // ...
                  onChange={handleChange}
                  getOptionLabel={(option) => 
                    `(${option.value_code}) ${option.value_name}`
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select "
                    />
                  )}
                /> */}
            
                <RHFTextField name="description" label="Description" minRows={8} multiline />
                <Grid display="flex" alignItems="end">
                  <RHFSwitch
                    name="isActive"
                    labelPlacement="start"
                    label={
                      <Typography
                        variant="subtitle2"
                        sx={{
                          mx: 0,
                          width: 1,
                          justifyContent: 'space-between',
                          mb: 0.5,
                          color: 'text.secondary',
                        }}
                      >
                        {' '}
                        Active
                      </Typography>
                    }
                  />
                </Grid>
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
    </FormProvider>
  );
}