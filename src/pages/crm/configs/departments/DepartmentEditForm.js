import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack } from '@mui/material';
// slice
import {
  updateDepartment,
  getDepartment,
} from '../../../../redux/slices/department/department';
// routes
import { PATH_SETTING } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../../components/hook-form';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { FORMLABELS } from '../../../../constants/default-constants';
// ----------------------------------------------------------------------

export default function DepartmentEditForm() {
  const { department } = useSelector((state) => state.department);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const defaultValues = useMemo(
    () => ({
      departmentName: department?.departmentName || '',
      isActive: department?.isActive,
      isDefault: department?.isDefault || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [department]
  );

  const departmentSchema = Yup.object().shape({
    departmentName: Yup.string().min(2).max(50).required('Name is required').trim(),
    isActive: Yup.boolean(),
    isDefault: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(departmentSchema),
    defaultValues,
  });


  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

    watch();

  useLayoutEffect(() => {
    dispatch(getDepartment(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (department) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department]);
  const toggleCancel = () => {
    navigate(PATH_SETTING.departments.view(department?._id));
  };
  const onSubmit = async (data) => {
    try {
      await dispatch(updateDepartment(data, id));
      reset();
      enqueueSnackbar('Department Updated Successfully!');
      navigate(PATH_SETTING.departments.view(department?._id));
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };
  return (
    <>
      <StyledCardContainer><Cover name={FORMLABELS.COVER.DEPARTMENTS_EDIT}/></StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}>
                  <RHFTextField name="departmentName" label="Name*" />
                  <Grid display="flex">
                    <RHFSwitch name="isActive" label="Active"/>
                    <RHFSwitch name="isDefault" label="Default"/>
                  </Grid>
                </Box>
              </Stack>
              <AddFormButtons settingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
