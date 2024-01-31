import { useMemo , useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Box, Card, Stack, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { useSnackbar } from '../../../components/snackbar';
import { 
  setProfileEditFormVisibility, 
  updateProfile,
  setProfileViewFormVisibility,
  getProfile,
  ProfileTypes,
} from '../../../redux/slices/products/profile';
import { ProfileSchema } from './schemas/ProfileSchema';
import FormProvider, { RHFSwitch, RHFTextField } from '../../../components/hook-form';
import { getMachine } from '../../../redux/slices/products/machine';
// ----------------------------------------------------------------------

export default function ProfileEditForm() {
  
  const { profile } = useSelector((state) => state.profile);
  const { machine } = useSelector((state) => state.machine);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const isSuperAdmin = userRoles?.some((role) => role.roleType === 'SuperAdmin');

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

  const [chips, setChips] = useState(defaultValues?.names)
  const handleChipChange = (newChips) => {
    const array = [...new Set(newChips)]
    setChips(array)
  }

  const toggleCancel = async() => {
    dispatch(setProfileEditFormVisibility (false));
    dispatch(setProfileViewFormVisibility(true));
  };

  // const [profileTypes, setProfileTypes] = useState([]);

  // useEffect(() => {
  //   const hasManufacturer = profiles.some((p) => p.type === 'MANUFACTURER');
  //   const updatedProfileTypes = hasManufacturer?ProfileTypes.filter((type) => type !== 'MANUFACTURER'): ProfileTypes;
  //   setProfileTypes(updatedProfileTypes);
  // }, [profiles]);

   // Handle Type
  const [selectedValue, setSelectedValue] = useState(defaultValues?.type);
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setValue('type', event.target.value);
  };

  const onSubmit = async (data) => {
    data.names = chips;
    try {
      await dispatch(await updateProfile(machine._id, profile._id, data));
      reset();
      enqueueSnackbar("Profile updated successfully");
      dispatch(setProfileViewFormVisibility(true));
      dispatch(getProfile(machine._id, profile._id));
      dispatch(getMachine(machine._id))
    } catch (err) {
      enqueueSnackbar("Failed to update profile", { variant: 'error' });
      console.error(err.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} mb={5}>
      <Grid
        container
        spacing={4}>
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
                  disabled={!isSuperAdmin}
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
              <MuiChipsInput fullWidth name="names" label="Other Names" value={chips} onChange={handleChipChange} />
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
  );
}
