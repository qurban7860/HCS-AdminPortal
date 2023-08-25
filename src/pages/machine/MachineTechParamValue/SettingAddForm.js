import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Autocomplete, TextField } from '@mui/material';
// slice
import { addSetting, setSettingFormVisibility } from '../../../redux/slices/products/machineTechParamValue';
import { getActiveTechparamcategories } from '../../../redux/slices/products/machineTechParamCategory';
import {
  getTechparamsByCategory,
  resetTechParamByCategory,
} from '../../../redux/slices/products/machineTechParam';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import SingleButton from '../../components/DocumentForms/SingleButton';
// constants
import { Snacks } from '../../../constants/machine-constants';
import { BUTTONS } from '../../../constants/default-constants';
// schema
import { AddSettingSchema } from './schemas/AddSettingSchema';

// ----------------------------------------------------------------------

export default function SettingAddForm() {
  const { initial, error, responseMessage, settings, settingEditFormVisibility, formVisibility } = useSelector((state) => state.machineSetting);
  const { techparamsByCategory} = useSelector((state) => state.techparam);
  const { activeTechParamCategories } = useSelector((state) => state.techparamcategory);
  const [category, setCategory] = useState('');
  const [techParamVal, setTechParamVal] = useState('');
  const [paramData, setparamData] = useState([]);
  const { machine } = useSelector((state) => state.machine);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    dispatch(getActiveTechparamcategories());
    dispatch(resetTechParamByCategory());
  }, [dispatch]);

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
      dispatch(setSettingFormVisibility(false));
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
              <Grid item md={12} >
                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      sm: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)',
                    }}
                  >
                  
                    <Autocomplete
                      // freeSolo
                      required
                      value={category || null}
                      options={activeTechParamCategories}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => option.name}
                      id="controllable-states-demo"
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setCategory(newValue);
                        } else {
                          setCategory('');
                          setTechParamVal('')
                          dispatch(resetTechParamByCategory());
                        }
                      }}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                          {option.name}
                        </Box>
                      )}
                      renderInput={(params) => <TextField {...params} label="Category" required />}
                      ChipProps={{ size: 'small' }}
                    />

                    <Autocomplete
                      // freeSolo
                      required
                      value={techParamVal || null}
                      options={techparamsByCategory.filter((item) => !settings.some((setting) => setting?.techParam?._id === item._id))}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
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
              <Grid display="flex" justifyContent="end">
                <SingleButton
                    sx={{mt:"auto"}}
                    loading={isSubmitting && isSubmitting}
                    disabled={!techParamVal || isSubmitting}
                    name={BUTTONS.ADDSETTING}
                  />
              </Grid>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
