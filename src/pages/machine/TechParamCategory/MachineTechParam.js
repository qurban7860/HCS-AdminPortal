import PropTypes from 'prop-types';
import * as Yup from 'yup';
import axios from 'axios';
import { useLayoutEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Container,Checkbox, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// slice
import { getTechparamcategories, saveTechparamcategory} from '../../../redux/slices/products/machineTechParamCategory';
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
import {Cover} from '../../components/Cover';
import AddFormButtons from '../../components/AddFormButtons';
// ----------------------------------------------------------------------

export default function MachineTechParam() {


  const { userId, user } = useAuthContext();

  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddMachineSchema = Yup.object().shape({
    name: Yup.string().max(50).required('Name is required') ,
    description: Yup.string().max(2000),
    isDisabled : Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: ''  ,
      description:'',
      isDisabled: true,
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

  const values = watch();

  // useLayoutEffect(() => {
  //   dispatch(getSPContacts());
  // }, [dispatch]);


  const onSubmit = async (data) => {
    
      try{ 
        await dispatch(saveTechparamcategory(data));
        reset();
        enqueueSnackbar('Create success!');
        navigate(PATH_MACHINE.techParam.list); 
        // console.log(PATH_MACHINE.tool.list)
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

  

  const { themeStretch } = useSettingsContext();
  return (
    <>
    <Helmet>
        <title> Machine: Tech Params | Machine ERP</title>
      </Helmet>
    <Container maxWidth={false }>
    <Card
                sx={{
                  mb: 3,
                  height: 160,
                  position: 'relative',
                  // mt: '24px',
                }}
              >
                <Cover name='New Parameter Category' icon='ic:round-class' />
              </Card>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      
      

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

              <RHFTextField name="name" label="Tech Params" required />
              <RHFTextField name="description" label="Description" minRows={7} multiline />
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

              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
                        
            </Card>
          
          </Grid>
        
    </FormProvider>
    </Container>
    </>
  );
}