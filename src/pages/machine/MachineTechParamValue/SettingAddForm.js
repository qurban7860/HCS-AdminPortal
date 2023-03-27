import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Stack, Typography, Autocomplete, TextField } from '@mui/material';
// slice
import { setSettingEditFormVisibility , setSettingFormVisibility , saveSetting , getSettings , getSetting } from '../../../redux/slices/products/machineTechParamValue';
import { getTechparamcategories } from '../../../redux/slices/products/machineTechParamCategory';
import { getTechparams , getTechparamsByCategory } from '../../../redux/slices/products/machineTechParam';
// components
import { useSnackbar } from '../../../components/snackbar';
// assets
import { countries } from '../../../assets/data';


import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function SettingAddForm() {

  const { formVisibility } = useSelector((state) => state.machineSetting);
  const { techparamsByCategory , techparams } = useSelector((state) => state.techparam);
// console.log("tech param by category : ",techparamsByCategory)
  const { techparamcategories } = useSelector((state) => state.techparamcategory);
  const [category, setCategory] = useState('');
  const [techParamVal, setTechParamVal] = useState('');
  const [paramData, setparamData] = useState([]);
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

useLayoutEffect(() => {
  // dispatch(getTechparams())
  dispatch(getTechparamcategories())
}, [dispatch]);
  const AddSettingSchema = Yup.object().shape({
    techParamValue: Yup.string().max(20),

  });

useEffect(()=>{
  dispatch(getTechparamsByCategory(category._id));
},[dispatch,category])

  const defaultValues = useMemo(
    () => ({
      techParamValue: '',

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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onChange = (event) => {
    const value = event.target.value;
    console.log('value----->',value);
  };

  const onSubmit = async (data) => {
    try {
      console.log("techParamVal : ",techParamVal._id)
      if(techParamVal !== ""){
        data.techParam = techParamVal;
      }
      
      console.log('params',data);
      await dispatch(saveSetting(machine._id,data));
      reset();
      

    } catch (err) {
      enqueueSnackbar('Saving failed!');
      console.error(err);
    }
  };


  const toggleCancel = () => 
  {
    dispatch(setSettingFormVisibility(false));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
            <Stack spacing={1}>
                <Typography variant="h3" sx={{ color: 'text.secondary' }}>
                Create a new Setting
                </Typography>
              </Stack>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(4, 1fr)',
                }}
              >

                <Autocomplete
                // freeSolo
                value={ category || null}
                options={techparamcategories}
                getOptionLabel={(option) => option.name}
                id="controllable-states-demo"
                onChange={(event, newValue) => {
                  if(newValue){
                  setCategory(newValue);
                  }
                  else{ 
                  setCategory("");
                  }
                }}
                renderOption={(props, option) => (<Box component="li" {...props} key={option.id}>{option.name}</Box>)}
                renderInput={(params) => <TextField {...params}  label="category" />}
                ChipProps={{ size: 'small' }}
              />
              
              <Autocomplete
                // freeSolo
                value={techParamVal || null}
                options={techparamsByCategory}
                getOptionLabel={(option) => option.name}
                id="controllable-states-demo"
                onChange={(event, newValue) => {
                  if(newValue){
                  setTechParamVal(newValue);
                  }
                  else{ 
                  setTechParamVal("");
                  }
                }}
                renderOption={(props, option) => (<Box component="li" {...props} key={option.id}>{option.name}</Box>)}
                renderInput={(params) => <TextField {...params}  label="Technical Parameters" />}
                ChipProps={{ size: 'small' }}
              />

                <RHFTextField name="techParamValue" label="Technical Parameter Value" />

                <Button sx={{p:2}} variant="contained" type="submit" size="large" loading={isSubmitting} >
                  Add Setting
                </Button>
              </Box>
              

              {/* <Box
                rowGap={5}
                columnGap={4}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(4, 1fr)',
                }}
              > 
              
                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Save Site
                </LoadingButton>
              
                <Button 
                  onClick={toggleCancel}
                  variant="outlined" 
                  size="large">
                    Cancel
                </Button>


            </Box> */}
            </Stack>

            

          </Card>

        </Grid>
      </Grid>
    </FormProvider>
  );
}

