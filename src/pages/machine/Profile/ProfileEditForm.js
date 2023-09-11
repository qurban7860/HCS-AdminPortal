import { useMemo , useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Box, Card, Grid, Autocomplete, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { MuiChipsInput } from 'mui-chips-input';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { useSnackbar } from '../../../components/snackbar';
import { 
  setProfileEditFormVisibility, 
  updateProfile,
  setProfileViewFormVisibility,
  getProfile
} from '../../../redux/slices/products/profile';
import { ProfileSchema } from './schemas/ProfileSchema';
import FormProvider, { RHFSwitch, RHFTextField } from '../../../components/hook-form';
import { Snacks } from '../../../constants/machine-constants';

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
              <MuiChipsInput name="names" label="Other Name" value={chips} onChange={handleChipChange} />
            </Box>  
            <Box sx={{marginTop:2}} rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)',}}>
              <RHFTextField name="height" label="Height"/>
              <RHFTextField name="width" label="Width"/>
              
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
