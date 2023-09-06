import { useEffect, useMemo, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { TextField, Autocomplete, Box, Card, Grid, Stack } from '@mui/material';
// slice
import { updateMachineModel } from '../../../redux/slices/products/model';
import { getActiveCategories } from '../../../redux/slices/products/category';
// import { useSettingsContext } from '../../../components/settings';
// schema
import { EditModelSchema } from './schemas/EditModelSchema';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
// constants
import { FORMLABELS } from '../../../constants/default-constants';
import { Snacks } from '../../../constants/machine-constants';
// ----------------------------------------------------------------------

export default function ModelEditForm() {
  const { machineModel } = useSelector((state) => state.machinemodel);
  const { activeCategories } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  // console.log("machineModel : ", machineModel)

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  useLayoutEffect(() => {
    dispatch(getActiveCategories());
  }, [dispatch]);

  useEffect(() => {
    if (machineModel) {
      reset(defaultValues);
      setCategory(machineModel.category);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineModel]);

  const defaultValues = useMemo(
    () => ({
      name: machineModel?.name || '',
      description: machineModel?.description || '',
      displayOrderNo: machineModel?.displayOrderNo || '',
      // category:      machineModel?.category || '',
      isActive: machineModel?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [machineModel]
  );

  // const { themeStretch } = useSettingsContext();

  const methods = useForm({
    resolver: yupResolver(EditModelSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const values = watch();

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.model.view(id));
  };

  const onSubmit = async (data) => {
    try {
      if (category) {
        data.category = category;
      } else {
        data.category = null;
      }

      await dispatch(updateMachineModel(data, id));
      navigate(PATH_MACHINE.machines.settings.model.view(id));
      reset();
      enqueueSnackbar(Snacks.modelUpdated);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(Snacks.failedUpdateModel, { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={18} md={12}>
          <StyledCardContainer>
            <Cover name={FORMLABELS.COVER.EDIT_MODEL} />
          </StyledCardContainer>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              {/* <Stack spacing={1}>
                <Typography variant="h3" sx={{ color: 'text.secondary' }}>
                Edit Model
                </Typography>
              </Stack> */}
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(1, 1fr)',
                }}
              >
                <Autocomplete
                  value={category || null}
                  options={activeCategories}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setCategory(newValue);
                    } else {
                      setCategory('');
                    }
                  }}
                  id="controllable-states-demo"
                  renderInput={(params) => <TextField {...params} label="Category*" />}
                  ChipProps={{ size: 'small' }}
                />
                <RHFTextField name="name" label="Name*" />

                <RHFTextField name="description" label="Description" minRows={7} multiline />

                <ToggleButtons isMachine name={FORMLABELS.isACTIVE.name} />
              </Box>
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
