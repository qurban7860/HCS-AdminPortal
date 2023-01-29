  import PropTypes from 'prop-types';
  import * as Yup from 'yup';
  import { useCallback, useEffect, useMemo } from 'react';
  import { useDispatch, useSelector } from 'react-redux';

  import { useNavigate } from 'react-router-dom';
  // form
  import { useForm } from 'react-hook-form';
  import { yupResolver } from '@hookform/resolvers/yup';

  // @mui
  import { LoadingButton } from '@mui/lab';
  import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
  // global
  import { CONFIG } from '../../config-global';
  // slice
  import { updateCustomer } from '../../redux/slices/customer';
  // routes
  import { PATH_DASHBOARD } from '../../routes/paths';
  // components
  import { useSnackbar } from '../../components/snackbar';
  import Iconify from '../../components/iconify';

  import FormProvider, {
    RHFSelect,
    RHFEditor,
    RHFUpload,
    RHFTextField,

  } from '../../components/hook-form';



  // ----------------------------------------------------------------------

  // CustomerEditForm.propTypes = {
  //   currentCustomer: PropTypes.object,
  // };

  export default function CustomerEditForm() {

    const { error, customer } = useSelector((state) => state.customer);

    const { users } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const EditCustomerSchema = Yup.object().shape({
      name: Yup.string().min(5).max(40).required('Name is required')  ,
      tradingName: Yup.string().min(5).max(40).required('Trading Name is required')  ,
      accountManager: Yup.string(),
      projectManager: Yup.string(),
      supportManager: Yup.string(),
    });


    const defaultValues = useMemo(
      () => ({
        id: customer?._id || '',
        name: customer?.name || '',
        status: customer?.tradingName || '',
        accountManager: customer?.accountManager || '',
        projectManager: customer?.projectManager || '',
        supportManager: customer?.supportManager || '',
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [customer]
    );

    const methods = useForm({
      resolver: yupResolver(EditCustomerSchema),
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

    useEffect(() => {
      if (customer) {
        reset(defaultValues);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer]);


    const onSubmit = async (data) => {
      console.log(data);
      try {
        dispatch(updateCustomer(data));
        reset();
        enqueueSnackbar('Update success!');
        navigate(PATH_DASHBOARD.customer.list);
      } catch (err) {
        enqueueSnackbar('Saving failed!');
        console.error(error);
      }
    };


    return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={7} md={7}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="name" label="Customer Name" />

                <RHFTextField name="tradingName" label="Trading Name" />

                <RHFSelect native name="accountManager" label="Account Manager">
                  <option value="" defaultValue />
                  {
                    users.length > 0 && users.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.firstName} {option.lastName}
                      </option>
                    ))}
                </RHFSelect>

                <RHFSelect native name="projectManager" label="Project Manager">
                  <option value="" defaultValue />
                  {
                    users.length > 0 && users.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.firstName} {option.lastName}
                      </option>
                    ))}
                </RHFSelect>

                <RHFSelect native name="supportManager" label="Support Manager">
                  <option value="" defaultValue />
                  {
                    users.length > 0 && users.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.firstName} {option.lastName}
                      </option>
                    ))}
                </RHFSelect>



                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack>

            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
