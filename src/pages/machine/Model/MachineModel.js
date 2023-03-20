import PropTypes from 'prop-types';
import * as Yup from 'yup';
import axios from 'axios';
import { useLayoutEffect, useMemo, useCallback, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// form
// import Select from "react-select";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { TextField, Autocomplete, Box, Card, Grid, Stack, Typography, Container} from '@mui/material';
// slice
import { getMachinemodels, createMachinemodels } from '../../../redux/slices/products/model';
import { getCategories } from '../../../redux/slices/products/category';
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

export default function MachineModel() {


  const { userId, user } = useAuthContext();

  const { categories } = useSelector((state) => state.category);

  const dispatch = useDispatch();
  
  const navigate = useNavigate();
  const [modelVal, setModelVal] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const AddMachineSchema = Yup.object().shape({
    name: Yup.string().min(2).max(25).required('Name is required') ,
    description: Yup.string().min(2).max(2000),
    isDisabled : Yup.boolean(),
    createdAt: Yup.string(),
    category: Yup.string().required('Category is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: ''  ,
      description:'',
      isDisabled: false,
      createdAt: '',
      category: '',
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

  useLayoutEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);


  const onSubmit = async (data) => {
    data.category = modelVal
      try{ 
        await dispatch(createMachinemodels(data));
        reset();
        enqueueSnackbar('Create success!');
        navigate(PATH_MACHINE.machineModel.list); 
        console.log(PATH_MACHINE.machineModel.list)
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
        <title> Machine: Models | Machine ERP</title>
      </Helmet>

      <CustomBreadcrumbs 
          heading="Model"
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
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >

              <RHFTextField name="name" label="Machine Model" required />
              <RHFTextField name="description" label="Description" minRows={7} multiline />

              <Autocomplete
                value={modelVal || null}
                options={categories}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setModelVal(newValue);
                }}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Categories" />}
                ChipProps={{ size: 'small' }}
              />



              {/* <Autocomplete
                freeSolo
                options={categories}
                onChange={(event, newValue) => {
                  setValues(newValue?._id);
                }}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params}  label="Categories" />}
                ChipProps={{ size: 'small' }}
              /> */}



              {/* <RHFSelect native name="category" label="Category">
                    <option value="" defaultValue/>
                    { 
                    categories.length > 0 && categories.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
              </RHFSelect> */}
              
              {/* <Select 
                // sx={{ paddingTop: '75%', borderRadius: 1.5 }} 
                // name="category"
                label="Category"
                // options={categories.map((option) => ({
                //   value: option._id,
                //   label: option.name,
                // }))}
                // isClearable
                // defaultValue={null}
                // onChange={(option) => setValue("category", option?.value)}
                // // sx={{ 
                // //   borderColor: "hsl(210deg 13% 88%)",
                // //   borderRadius: "8px",
                // //   p: 8,
                // //    }}
              /> */}


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
                Save 
              </LoadingButton>
            </Stack>
                        
            </Card>
          
          </Grid>
        
    </FormProvider>
    </Container>
    </>
  );
}