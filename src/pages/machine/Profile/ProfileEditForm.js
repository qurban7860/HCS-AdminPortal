import { useMemo , useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Autocomplete, Box, Card, Grid, TextField, Typography } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers';
import { MuiChipsInput } from 'mui-chips-input';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { useSnackbar } from '../../../components/snackbar';
import { 
  setProfileEditFormVisibility, 
  updateProfile,
  setProfileViewFormVisibility,
  getProfile,
  ProfileTypes
} from '../../../redux/slices/products/profile';
import { ProfileSchema } from './schemas/ProfileSchema';
import FormProvider, { RHFSwitch, RHFTextField } from '../../../components/hook-form';
// import { Snacks } from '../../../constants/machine-constants';

// ----------------------------------------------------------------------

export default function ProfileEditForm() {
  
  const {
    profile, 
  } = useSelector((state) => state.profile);
  const { machine } = useSelector((state) => state.machine);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const defaultValues = useMemo(
    () => ({
      defaultName: profile?.defaultName ||'',
      names:profile?.names ||[],
      height:profile?.height || '',
      width:profile?.width ||'',
      type:profile?.type ||'',
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

   // Handle Type
   const handleTypeChange = (event, newValue) => {
    setValue('type', newValue);
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
              <Autocomplete disablePortal id="combo-box-demo" name="type"
                options={ProfileTypes} onChange={handleTypeChange}
                defaultValue={defaultValues?.type}
                renderInput={(params) => <TextField {...params} label="Type" />}
              />
              <RHFTextField name="height" label="Web"/>
              <RHFTextField name="width" label="Flang"/>
              
              <RHFSwitch name="isActive" labelPlacement="start"
                label={
                  <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
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
