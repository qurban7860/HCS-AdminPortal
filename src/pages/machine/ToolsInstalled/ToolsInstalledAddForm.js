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
import { setToolInstalledEditFormVisibility , setToolInstalledFormVisibility , updateToolInstalled , addToolInstalled , getToolsInstalled , getToolInstalled } from '../../../redux/slices/products/toolInstalled';
import { getTools } from '../../../redux/slices/products/tools';
// components
import { useSnackbar } from '../../../components/snackbar';
// assets

import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function ToolsInstalledAddForm() {
  const { tools } = useSelector((state) => state.tool);
  const { initial,error, responseMessage , toolInstalledEditFormVisibility , toolsInstalled, formVisibility } = useSelector((state) => state.toolInstalled);
  const [toolVal, setToolVal] = useState('');
  const [toolsVal, setToolsVal] = useState([]);
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
useLayoutEffect(() => {
  dispatch(getTools())
  dispatch(getToolsInstalled)
}, [dispatch,machine]);

useLayoutEffect(() => {
const filterTool = [];
toolsInstalled.map((toolInstalled)=>(filterTool.push(toolInstalled?.tool?._id)))
const filteredTool = tools.filter(item => !filterTool.includes(item._id));
filteredTool.sort((a, b) =>{
  const nameA = a.name.toUpperCase(); 
  const nameB = b.name.toUpperCase(); 
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}
)
// console.log("filteredTool: ", filteredTool)
setToolsVal(filteredTool);

}, [tools,toolsInstalled,machine] );

  const AddSettingSchema = Yup.object().shape({
    note: Yup.string().max(1500),
    isActive : Yup.boolean(),
  });

const toggleCancel = () => 
{
  dispatch(setToolInstalledFormVisibility(false));
};

  const defaultValues = useMemo(
    () => ({
      note: '',
      isActive : true,
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

  const onSubmit = async (data) => {
    try {
      if(toolVal !== ""){
        data.tool = toolVal._id;
      }
      // console.log("Data", data);
      await dispatch(addToolInstalled(machine._id,data));
      reset();
      setToolVal("")
  dispatch(setToolInstalledFormVisibility(false));

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
                New Tool
                </Typography>
              </Stack>
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
                // freeSolo
                required
                value={ toolVal|| null}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                options={toolsVal}
                getOptionLabel={(option) => option.name}
                id="controllable-states-demo"
                onChange={(event, newValue) => {
                  if(newValue){
                  setToolVal(newValue);
                  }
                  else{ 
                  setToolVal("");
                  }
                }}
                renderOption={(props, option) => (<Box component="li" {...props} key={option.id}>{option.name}</Box>)}
                renderInput={(params) => <TextField {...params}  label="Tool" required/>}
                ChipProps={{ size: 'small' }}
              />
              
              <RHFTextField name="note" label="Note*" minRows={8} multiline />

              <RHFSwitch name="isActive" labelPlacement="start" label={<Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography>} />

              </Box>
              

              <Box
                rowGap={5}
                columnGap={4}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(4, 1fr)',
                }}
              > 
              
                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Add Tool
                </LoadingButton>
              
                <Button 
                  onClick={toggleCancel}
                  variant="outlined" 
                  size="large">
                    Cancel
                </Button>
              </Box>
              
            </Stack>

            

          </Card>

        </Grid>
      </Grid>
    </FormProvider>
  );
}

