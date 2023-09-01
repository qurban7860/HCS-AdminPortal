// import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Card,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
// import { getValues } from '@mui/system';
// routes
import { PATH_SETTING } from '../../routes/paths'; 
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField } from '../../components/hook-form';
// import { getRoles } from '../../redux/slices/securityUser/role';
// slice
import { AddModule } from '../../redux/slices/module/module';
// current user
import AddFormButtons from '../components/DocumentForms/AddFormButtons';
// ----------------------------------------------------------------------

export default function ModuleAddForm() {


  const [selectedValues] = useState([]);
  const { roles } = useSelector((state) => state.role);
  // const { value } = useSelector((state) => state.Value);
  // eslint-disable-next-line
  // const [sortedRoles, setSortedRoles] = useState([]);
  const ROLES = [];
  roles.map((role) => ROLES.push({ value: role?._id, label: role.name }));

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const NewModuleSchema = Yup.object().shape({
    name: Yup.string().required('Name is required!').min(2, 'Name must be at least 2 characters long').max(40, 'Name must not exceed 40 characters!'),
    value:Yup.boolean(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      values: '',
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewModuleSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    if(selectedValues.length > 0){
      // const selectedValuesIDs = selectedValues.map((value) => value._id);
      // data.selectedValues = selectedValuesIDs;
    }
    try {
      const response = await dispatch(AddModule(data));
      // await dispatch(resetContacts());
      reset();
      console.log(response.data);
      navigate(PATH_SETTING.modules.view(response.data.securityModule._id));
    } catch (error) {
      if (error.Message) {
        enqueueSnackbar(error.Message, { variant: `error` });
      } else if (error.message) {
        enqueueSnackbar(error.message, { variant: `error` });
      } else {
        enqueueSnackbar('Something went wrong!', { variant: `error` });
      }
      console.log('Error:', error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SETTING.modules.list);
  };

  // const handleValueChange = (event, selectedOptions) => {
  //   setSelectedValues(selectedOptions);
  // };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
       <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <RHFTextField name="name" label="Name" required/>
                {/* <RHFTextField name="value" label="Value" required/> */}
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