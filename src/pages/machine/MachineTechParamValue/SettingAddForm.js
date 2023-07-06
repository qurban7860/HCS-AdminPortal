import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Autocomplete, TextField } from '@mui/material';
// slice
import { addSetting } from '../../../redux/slices/products/machineTechParamValue';
import { getTechparamcategories } from '../../../redux/slices/products/machineTechParamCategory';
import {
  getTechparamsByCategory,
  resetTechParamByCategory,
} from '../../../redux/slices/products/machineTechParam';
// schema
import { AddSettingSchema } from './schemas/AddSettingSchema';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import SingleButton from '../../components/DocumentForms/SingleButton';
// constants
import { Snacks } from '../../../constants/machine-constants';
import { BUTTONS } from '../../../constants/default-constants';

// ----------------------------------------------------------------------

export default function SettingAddForm() {
  const { settings } = useSelector((state) => state.machineSetting);
  const { techparamsByCategory, techparams } = useSelector((state) => state.techparam);
  const { techparamcategories } = useSelector((state) => state.techparamcategory);
  const [category, setCategory] = useState('');
  const [techParamVal, setTechParamVal] = useState('');
  const [paramData, setparamData] = useState([]);
  const { machine } = useSelector((state) => state.machine);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    dispatch(getTechparamcategories());
    dispatch(resetTechParamByCategory());
  }, [dispatch]);

  useLayoutEffect(() => {
    const filterSetting = [];
    settings.map((setting) => filterSetting.push(setting.techParam._id));
    const filteredsetting = techparamsByCategory.filter(
      (item) => !filterSetting.includes(item._id)
    );

    filteredsetting.sort((a, b) => {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    setparamData(filteredsetting);
  }, [settings, techparamsByCategory]);

  useEffect(() => {
    if (category) {
      dispatch(resetTechParamByCategory());
      dispatch(getTechparamsByCategory(category._id));
    }
  }, [dispatch, category]);

  const defaultValues = useMemo(
    () => ({
      techParamValue: '',
      isActive: true,
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddSettingSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      if (techParamVal !== '') {
        data.techParam = techParamVal;
      }
      await dispatch(addSetting(machine._id, data));
      reset();
      setTechParamVal('');
      enqueueSnackbar(Snacks.settingAdded);
    } catch (err) {
      enqueueSnackbar(Snacks.failedAddSetting, { variant: `error` });
      console.error(err.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4} mb={2}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Grid item md={12} xs={18} display="flex">
                <Grid item md={9} xs={12} m={1}>
                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                    }}
                  >
                    {/* will be cleaning this.. */}
                    {/* tech param name */}
                    <Autocomplete
                      // freeSolo
                      required
                      value={category || null}
                      options={techparamcategories}
                      isOptionEqualToValue={(option, value) => option.name === value.name}
                      getOptionLabel={(option) => option.name}
                      id="controllable-states-demo"
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setCategory(newValue);
                        } else {
                          setCategory('');
                          dispatch(resetTechParamByCategory());
                        }
                      }}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                          {option.name}
                        </Box>
                      )}
                      renderInput={(params) => <TextField {...params} label="category" required />}
                      ChipProps={{ size: 'small' }}
                    />

                    {/* will be cleaning this.. */}
                    {/* tech param value */}
                    <Autocomplete
                      // freeSolo
                      required
                      value={techParamVal || null}
                      options={paramData}
                      isOptionEqualToValue={(option, value) => option.name === value.name}
                      getOptionLabel={(option) => option.name}
                      id="controllable-states-demo"
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setTechParamVal(newValue);
                        } else {
                          setTechParamVal('');
                        }
                      }}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                          {option.name}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} label="Technical Parameters" required />
                      )}
                      ChipProps={{ size: 'small' }}
                    />
                  </Box>

                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(1, 1fr)',
                    }}
                    sx={{ mt: 3 }}
                  >
                    <RHFTextField name="techParamValue" label="Technical Parameter Value" />
                    <ToggleButtons isMachine name="isActive" />
                  </Box>
                </Grid>
                <SingleButton
                  loading={isSubmitting}
                  disabled={!techParamVal}
                  name={BUTTONS.ADDSETTING}
                />
              </Grid>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
