import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid } from '@mui/material';
// slice
import { addSetting, setSettingFormVisibility } from '../../../redux/slices/products/machineSetting';
import { getActiveTechparamcategories } from '../../../redux/slices/products/machineTechParamCategory';
import {
  getTechparamsByCategory,
  resetTechParamByCategory,
} from '../../../redux/slices/products/machineTechParam';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField, RHFSwitch } from '../../../components/hook-form';
import ToggleButtons from '../../../components/DocumentForms/ToggleButtons';
// constants
import { Snacks } from '../../../constants/machine-constants';
// schema
import { AddSettingSchema } from './schemas/AddSettingSchema';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function SettingAddForm() {
  const { settings } = useSelector((state) => state.machineSetting);
  const { techparamsByCategory} = useSelector((state) => state.techparam);
  const { activeTechParamCategories } = useSelector((state) => state.techparamcategory);
  const [category, setCategory] = useState('');
  const [techParamVal, setTechParamVal] = useState(null);
  // const [paramData, setparamData] = useState([]);
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
      category: null,
      techParamVal: null,
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
    setValue,
    trigger,
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

  const toggleCancel = () => {
    dispatch(setSettingFormVisibility(false));
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
                  
                    <RHFAutocomplete 
                      name="category"
                      label="Category*"
                      options={activeTechParamCategories}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setValue('category',newValue)
                          setCategory(newValue);
                        } else {
                          setValue('category',null)
                          setCategory(null);
                          setTechParamVal(null)
                          dispatch(resetTechParamByCategory());
                        }
                        trigger('category');

                      }}
                    />

                    <RHFAutocomplete 
                      name="techParamVal"
                      label="Technical Parameters*"
                      options={techparamsByCategory.filter((item) => !settings.some((setting) => setting?.techParam?._id === item._id))}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => option.name}
                      id="controllable-states-demo"
                      renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setValue('techParamVal',newValue)
                          setTechParamVal(newValue);
                        } else {
                          setValue('techParamVal',null)
                          setTechParamVal(null);
                        }
                        trigger('techParamVal');
                      }}
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
                    <RHFSwitch  name="isActive" label="Active" />
                  </Box>
                
              </Grid>
              <AddFormButtons isSubmitting={isSubmitting} disabled={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
