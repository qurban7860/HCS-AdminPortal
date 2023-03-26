import PropTypes from 'prop-types';
import * as Yup from 'yup';
import axios from 'axios';
import { useLayoutEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Container,TextField, Autocomplete,Checkbox, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// slice
import { getTechparams, createTechparams } from '../../../redux/slices/products/parameters';
// routes
import { PATH_DASHBOARD, PATH_MACHINE } from '../../../routes/paths';
import { useSettingsContext } from '../../../components/settings';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFAutocomplete,
  RHFTextField,
  RHFSwitch,
  RHFMultiSelect,
  RHFEditor,
  RHFUpload,
} from '../../../components/hook-form';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// asset
import { countries } from '../../../assets/data';
// util
import MachineDashboardNavbar from '../util/MachineDashboardNavbar';


// ----------------------------------------------------------------------

export default function MachineTechParam() {


  const { userId, user } = useAuthContext();

  const { techparamcategories } = useSelector((state) => state.techparamcategory);

  const dispatch = useDispatch();

  const [paramCategoryVal, setParamCategoryVal] = useState(null);
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddMachineSchema = Yup.object().shape({
    name: Yup.string().min(2).max(25).required('Name is required') ,
    description: Yup.string().min(2).max(2000),
    isDisabled : Yup.boolean(),
    createdAt: Yup.string(),
    code: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: ''  ,
      description:'',
      isDisabled: true,
      createdAt: '',
      code: '',
      
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

  const values = watch();

  const onSubmit = async (data) => {
    if(paramCategoryVal !== null && paramCategoryVal !== ""){
      data.category = paramCategoryVal?._id
    }
      try{ 
        await dispatch(createTechparams(data));
        reset();
        enqueueSnackbar('Create success!');
        navigate(PATH_MACHINE.parameters.list); 
        console.log(PATH_MACHINE.parameters.list)
      } catch(error){
        // enqueueSnackbar('Saving failed!');
        enqueueSnackbar(error?.message)
        console.error(error);
      }
  };

  const { themeStretch } = useSettingsContext();
  return (
    <>
    <Container maxWidth={themeStretch ? false : 'xl'}>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Helmet>
        <title> Machine: Tech Params | Machine ERP</title>
      </Helmet>
      <CustomBreadcrumbs 
          heading="Tech Param"
          sx={{ mb: -2, mt: 3 }}
        />

        <Grid item xs={18} md={12} sx={{mt: 3}}>
          <Card sx={{ p: 3}}>
            <Stack spacing={3}>
            <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >

              <RHFTextField name="name" label="Machine Technical Parameter" required />
              <RHFTextField name="code" label="Code" required />
              </Box>
              <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField name="description" label="Description" minRows={7} multiline />
              <Autocomplete
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
              <RHFSwitch
              name="isDisabled"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}>
                    Active
                  </Typography>
                </>
              } 
            />
             </Box>
             
              </Stack>

            <Stack alignItems="flex-start" sx={{ mt:1 }}>
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Save Tech Param
              </LoadingButton>
            </Stack>
                        
            </Card>
          
          </Grid>
        
    </FormProvider>
    </Container>
    </>
  );
}