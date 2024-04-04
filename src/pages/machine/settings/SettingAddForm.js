import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// slice
import { addSetting } from '../../../redux/slices/products/machineSetting';
import { getActiveTechparamcategories } from '../../../redux/slices/products/machineTechParamCategory';
import { getTechparamsByCategory, resetTechParamByCategory } from '../../../redux/slices/products/machineTechParam';
import { getActiveCustomerMachines, resetActiveCustomerMachines } from '../../../redux/slices/products/machine';
import { getActiveCustomers, resetActiveCustomers } from '../../../redux/slices/customer/customer';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField, RHFSwitch, RHFCheckbox } from '../../../components/hook-form';
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
  const { activeCustomers } = useSelector((state) => state.customer);
  const { machine, activeCustomerMachines } = useSelector((state) => state.machine);
  const { machineId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect( () => {
    dispatch(getActiveTechparamcategories());
    dispatch(resetTechParamByCategory());
    if(machine?.customer?._id ){
      dispatch(getActiveCustomerMachines( machine?.customer?._id ))
    }
    return ()=>{ dispatch(resetActiveCustomerMachines()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch ]);

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
      customer: machine?.customer || null,
      machines: activeCustomerMachines?.filter(el => el?._id !== machine?._id ) || [],
      isUpdateMultipleMachines: false,
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddSettingSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    trigger,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useLayoutEffect( () => {
      reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const { isUpdateMultipleMachines } = watch();

  useEffect(() => {
    if( isUpdateMultipleMachines && Array.isArray(activeCustomers) && activeCustomers?.length < 1  ){
      dispatch(getActiveCustomers());
    }
    return () => { dispatch(resetActiveCustomers())}
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ dispatch, isUpdateMultipleMachines ])

  const onSubmit = async (data) => {
    try {
      if (techParamVal !== '') {
        data.techParam = techParamVal;
      }
      await dispatch(addSetting(machine._id, data));
      await reset();
      await setTechParamVal('');
      await enqueueSnackbar(Snacks.settingAdded);
      await navigate(PATH_MACHINE.machines.settings.root(machineId));
    } catch (err) {
      enqueueSnackbar(Snacks.failedAddSetting, { variant: `error` });
      console.error(err.message);
    }
  };

  const toggleCancel = () => navigate(PATH_MACHINE.machines.settings.root(machineId));

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
                    <RHFCheckbox name="isUpdateMultipleMachines" label="Update in multiple Machines" sx={{my:-1.5}} />
                    { isUpdateMultipleMachines && 
                    <>
                      <RHFAutocomplete 
                        name="customer"
                        label="Customer"
                        options={ [ { _id: 'customId', name: 'All Customer' }, ...activeCustomers ] }
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        getOptionLabel={(option) => `${option?.name || ''}`}
                        renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.name || ''}`}</li> )}
                        onChange={async (event, newValue) => {
                          if(newValue){
                            await setValue('customer',newValue);
                            if( newValue?.name?.toLowerCase() === 'all customer' ){
                              await dispatch(getActiveCustomerMachines())
                            }else{
                              await dispatch(getActiveCustomerMachines(newValue?._id))
                            }
                          }else{
                            await setValue('customer',null);
                            await dispatch(resetActiveCustomerMachines())
                          }
                        }}
                      />
                      <RHFAutocomplete 
                        multiple
                        disableCloseOnSelect
                        filterSelectedOptions
                        name="machines"
                        label="Machines"
                        options={activeCustomerMachines.filter((el)=> el?._id !== machine?._id )}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        getOptionLabel={(option) => `${option?.serialNo || ''} ${option?.name ? '-' : '' } ${option?.name || ''}`}
                        renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.serialNo || ''} ${option?.name ? '-' : '' } ${option?.name || ''}`}</li> )}
                      />
                    </>
                    }
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
