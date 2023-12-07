import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
// slice
import { updateMachinestatus, getMachineStatus } from '../../../redux/slices/products/statuses';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function StatusEditForm() {
  const {  machinestatus } = useSelector((state) => state.machinestatus);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const EditStatusSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name is required'),
    description: Yup.string().max(2000),
    isActive: Yup.boolean(),
    displayOrderNo: Yup.number()
      .typeError('Display Order No. must be a number')
      .nullable()
      .transform((_, val) => (val !== '' ? Number(val) : null)),
      slug: Yup.string().min(0).max(50).matches(/^(?!.*\s)[\S\s]{0,50}$/, 'Slug field cannot contain blankspaces'),
  });

  const defaultValues = useMemo(
    () => ({
      name: machinestatus?.name || '',
      description: machinestatus?.description || '',
      displayOrderNo: machinestatus?.displayOrderNo || '',
      slug: machinestatus?.slug || '',
      isActive: machinestatus.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [machinestatus]
  );

  const methods = useForm({
    resolver: yupResolver(EditStatusSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useLayoutEffect(() => {
    dispatch(getMachineStatus(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (machinestatus) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machinestatus]);

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.status.view(id));
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateMachinestatus(data, id));
      reset();
      enqueueSnackbar('Update success!');
      navigate(PATH_MACHINE.machines.settings.status.view(id));
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <StyledCardContainer>
            <Cover name="Edit Status" icon="material-symbols:diversity-1-rounded" />
          </StyledCardContainer>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
              >
                <RHFTextField name="name" label="Name" />
                <RHFTextField name="description" label="Description" minRows={7} multiline />
                <RHFTextField name="displayOrderNo" label="Display Order No." type="number" />
                <RHFTextField name="slug" label="Slug" />

                {/* <RHFSelect native name="displayOrderNo" label="Display Order No" type='number'>
                      <option value="" defaultValue/>
                </RHFSelect> */}
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
              </Box>
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
