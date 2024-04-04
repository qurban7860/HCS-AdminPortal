import { useLayoutEffect, useMemo, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Container, Box, Card, Stack, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// Components
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { useSnackbar } from '../../../components/snackbar';
import { updateProfile, getProfile, ProfileTypes } from '../../../redux/slices/products/profile';
import { ProfileSchema } from './schemas/ProfileSchema';
import FormProvider, { RHFSwitch, RHFTextField, RHFChipsInput } from '../../../components/hook-form';
import { useAuthContext } from '../../../auth/useAuthContext';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function ProfileEditForm() {
  
  const { profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isAllAccessAllowed } = useAuthContext()
  const navigate = useNavigate();
  const { machineId, id } = useParams();

  useLayoutEffect(()=>{
    if(machineId && id ){
      dispatch(getProfile(machineId, id ))
    }
  },[ dispatch, machineId, id ])
  
  const defaultValues = useMemo(
    () => ({
      defaultName: profile?.defaultName ||'',
      names:profile?.names ||[],
      web:profile?.web || '',
      flange:profile?.flange ||'',
      thicknessStart: profile?.thicknessStart || '',
      thicknessEnd: profile?.thicknessEnd || '',
      type:profile?.type ||'CUSTOMER',
      isActive: profile?.isActive || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const toggleCancel = async() => navigate(PATH_MACHINE.machines.profiles.view(machineId, id));

   // Handle Type
  const [selectedValue, setSelectedValue] = useState(defaultValues?.type);
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setValue('type', event.target.value);
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(await updateProfile(machineId, id, data));
      reset();
      enqueueSnackbar("Profile updated successfully");
      navigate(PATH_MACHINE.machines.profiles.view(machineId, id))
    } catch (err) {
      enqueueSnackbar("Failed to update profile", { variant: 'error' });
      console.error(err.message);
    }
  };

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='profile' />
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} mb={5}>
      <Grid
        container
        spacing={2}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)',}}>
              <RHFTextField name="defaultName" label="Default Name"/>
              <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="type"
                  value={selectedValue}
                  label="Type"
                  onChange={handleChange}
                  disabled={!isAllAccessAllowed}
                  >
                {ProfileTypes.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
                </Select>
              </FormControl>
            </Box>  

            <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)',}} sx={{mt:2}}>
              <RHFChipsInput name="names" label="Other Names" />
            </Box>

            <Box sx={{marginTop:2}} rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(4, 1fr)',}}>
              <RHFTextField name="web" label="Web"/>
              <RHFTextField name="flange" label="Flange"/>
              <RHFTextField name="thicknessStart" label="Min. Thickness"/>
              <RHFTextField name="thicknessEnd" label="Max. Thickness"/>
              
            </Box>
              <RHFSwitch name="isActive" label="Active" />
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  </Container>
  );
}
