import { useEffect, useMemo , useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Autocomplete, Box, Card, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers';
import { MuiChipsInput } from 'mui-chips-input';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { useSnackbar } from '../../../components/snackbar';
import { 
  setProfileEditFormVisibility, 
  updateProfile,
  setProfileViewFormVisibility,
  getProfile,
  ProfileTypes,
  getProfiles
} from '../../../redux/slices/products/profile';
import { ProfileSchema } from './schemas/ProfileSchema';
import FormProvider, { RHFSwitch, RHFTextField } from '../../../components/hook-form';
// import { Snacks } from '../../../constants/machine-constants';

// ----------------------------------------------------------------------

export default function ProfileEditForm() {
  
  const { profile } = useSelector((state) => state.profile);
  const { machine } = useSelector((state) => state.machine);
  const { profiles } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const defaultValues = useMemo(
    () => ({
      defaultName: profile?.defaultName ||'',
      names:profile?.names ||[],
      web:profile?.web || '',
      flange:profile?.flange ||'',
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

  const [profileTypes, setProfileTypes] = useState([]);
  
  useEffect(() => {
    dispatch(getProfiles(machine?._id))
    const hasManufacturer = profiles.some((p) => p.type === 'MANUFACTURER');
    const updatedProfileTypes = hasManufacturer&&profile?.type!=='MANUFACTURER'?ProfileTypes.filter((type) => type !== 'MANUFACTURER'): ProfileTypes;
    setProfileTypes(updatedProfileTypes);
  }, [profiles,profile, dispatch, machine]);

   // Handle Type
  const [selectedValue, setSelectedValue] = useState(defaultValues?.type);
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setValue('type', event.target.value);
  };

  const onSubmit = async (data) => {
    data.names = chips;
    try {
      dispatch(await updateProfile(machine._id, profile._id, data));
      reset();
      enqueueSnackbar("Profile updated successfully");
      dispatch(setProfileViewFormVisibility(true));
      dispatch(getProfile(machine._id, profile._id));
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
            <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)',}}>
              <RHFTextField name="defaultName" label="Default Name"/>
              <MuiChipsInput name="names" label="Other Names" value={chips} onChange={handleChipChange} />
            </Box>  
            <Box sx={{marginTop:2}} rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)',}}>
              {/* <Autocomplete disablePortal id="combo-box-demo" name="type"
                options={profileTypes} onChange={handleTypeChange}
                defaultValue={defaultValues?.type}
                renderInput={(params) => <TextField {...params} label="Type" />}
              /> */}

              <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="type"
                  value={selectedValue}
                  label="Type"
                  onChange={handleChange}
                  >
                {profileTypes.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
                </Select>
              </FormControl>

              <RHFTextField name="web" label="Web"/>
              <RHFTextField name="flange" label="Flange"/>
              
              <RHFSwitch name="isActive" labelPlacement="start"
                label={
                  <Typography variant="subtitle2" sx={{ mx: 0, flange: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                    Active
                  </Typography>
                }
              />
            </Box>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
