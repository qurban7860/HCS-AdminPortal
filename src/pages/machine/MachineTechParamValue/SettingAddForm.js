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
import { getTechparams , getTechparamsByCategory , resetTechparamByCategory } from '../../../redux/slices/products/machineTechParam';
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
  const { initial,error, responseMessage , settings, settingEditFormVisibility, formVisibility } = useSelector((state) => state.machineSetting);
  const { techparamsByCategory , techparams } = useSelector((state) => state.techparam);
  const { techparamcategories } = useSelector((state) => state.techparamcategory);
  const [category, setCategory] = useState('');
  const [techParamVal, setTechParamVal] = useState('');
  const [paramData, setparamData] = useState([]);
  const { machine } = useSelector((state) => state.machine);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

useLayoutEffect(() => {
  dispatch(getTechparamcategories())
  dispatch(resetTechparamByCategory())
}, [dispatch]);

useLayoutEffect(() => {
const filterSetting = [];
settings.map((setting)=>(filterSetting.push(setting.techParam._id)))
const filteredsetting = techparamsByCategory.filter(item => !filterSetting.includes(item._id));

filteredsetting.sort((a, b) =>{
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
}, [settings,techparamsByCategory]);
  
const AddSettingSchema = Yup.object().shape({
  techParamValue: Yup.string().max(20),
});

useEffect(()=>{
  if(category){
    dispatch(resetTechparamByCategory())
    dispatch(getTechparamsByCategory(category._id));
  }
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
  };

  const onSubmit = async (data) => {
    try {
      if(techParamVal !== ""){
        data.techParam = techParamVal;
      }
      console.log('params',data);
      await dispatch(saveSetting(machine._id,data));
      reset();
      // setCategory("")
      setTechParamVal("")
    } catch (err) {
      enqueueSnackbar('Saving failed!');
      console.error(err);
    }
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
              <Grid item md={12} xs={18} display="flex">
              <Grid item md={9} xs={12}>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
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
                    dispatch(resetTechparamByCategory())
                  }
                }}
                renderOption={(props, option) => (<Box component="li" {...props} key={option.id}>{option.name}</Box>)}
                renderInput={(params) => <TextField {...params}  label="category" />}
                ChipProps={{ size: 'small' }}
              />
              
              <Autocomplete
                // freeSolo
                value={techParamVal || null}
                options={paramData}
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

                
              </Box>

              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(1, 1fr)',
                }}
                sx={{mt:3}}
              >
                <RHFTextField name="techParamValue" label="Technical Parameter Value" />
              </Box>
              </Grid>

                <Grid item xs={18} md={3} style={{width: "100%"}} display="flex">
                
                    <Button  sx={{ m: 'auto',}} variant="contained" type="submit" size="large" loading={isSubmitting} >
                      Add Setting
                    </Button>
                </Grid>
              </Grid>
            </Stack>

            

          </Card>

        </Grid>
      </Grid>
    </FormProvider>
  );
}

