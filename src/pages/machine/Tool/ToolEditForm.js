import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useSelector,useDispatch } from 'react-redux';
// import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
// import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  // Button,
  // DialogTitle,
  // Dialog,
  // InputAdornment,
  // Link,
} from '@mui/material';
// slice
import {
  updateTool,
  getTool,
} from '../../../redux/slices/products/tools';
// import { useSettingsContext } from '../../../components/settings';
// import { CONFIG } from '../../../config-global';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// import Iconify from '../../../components/iconify/Iconify';
// import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import FormProvider, {
  // RHFSelect,
  // RHFAutocomplete,
  RHFTextField,
  RHFSwitch,
  // RHFMultiSelect,
  // RHFEditor,
  // RHFUpload,
} from '../../../components/hook-form';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function ToolEditForm() {
  const { tool } = useSelector((state) => state.tool);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  // console.log(navigate, 'test')

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const EditToolSchema = Yup.object().shape({
    name: Yup.string().max(50).required('Name is required'),
    description: Yup.string().max(2000),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: tool?.name || '',
      description: tool?.description || '',
      isActive: tool.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tool]
  );

  // const { themeStretch } = useSettingsContext();

  const methods = useForm({
    resolver: yupResolver(EditToolSchema),
    defaultValues,
  });

  const {
    reset,
    // watch,
    // setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const values = watch();

  useLayoutEffect(() => {
    dispatch(getTool(id));
    // dispatch(getSites(customer._id));
    // dispatch(getSPContacts());
  }, [dispatch, id]);

  useEffect(() => {
    if (tool) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool]);
  // console.log(id, 'testing id')

  const toggleCancel = () => {
    // dispatch(setToolEditFormVisibility(false));
    navigate(PATH_MACHINE.machines.settings.tool.view(id));
  };

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      await dispatch(updateTool({ ...data, id }));
      reset();
      enqueueSnackbar('Update success!');
      navigate(PATH_MACHINE.machines.settings.tool.view(id));
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={18} md={12}>
          <StyledCardContainer>
            <Cover name="Edit Tool" icon="fa-solid:tools" />
          </StyledCardContainer>
          <Card sx={{ p: 3 }}>
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
                <RHFTextField name="name" label="Name" required />
                <RHFTextField name="description" label="Description" minRows={7} multiline />
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
