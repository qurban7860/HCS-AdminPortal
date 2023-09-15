import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Autocomplete, Box, Card, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers';
import { MuiChipsInput } from 'mui-chips-input';
// slice
import { ProfileTypes, addProfile, setProfileFormVisibility } from '../../../redux/slices/products/profile';
// schema
import { ProfileSchema } from './schemas/ProfileSchema';
// components
import { useSnackbar } from '../../../components/snackbar';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';

// assets
import FormProvider, { RHFSwitch, RHFTextField } from '../../../components/hook-form';
// constants
// import { Snacks } from '../../../constants/machine-constants';


// ----------------------------------------------------------------------

export default function ProfileAddForm() {

  const { machine } = useSelector((state) => state.machine);
  const { profiles } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [profileTypes, setProfileTypes] = useState([]);

  const toggleCancel = () => {
    dispatch(setProfileFormVisibility(false));
  };

  const defaultValues = useMemo(
    () => ({
      defaultName: '',
      names:[],
      web:'',
      flange:'',
      type:'',
      isActive: true,
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

  const [chips, setChips] = useState([])
  const handleChipChange = (newChips) => {
    const array = [...new Set(newChips)]
    setChips(array)
  }
  
  useEffect(() => {
    const hasManufacturer = profiles.some((profile) => profile.type === 'MANUFACTURER');
    const updatedProfileTypes = hasManufacturer?ProfileTypes.filter((type) => type !== 'MANUFACTURER'): ProfileTypes;
    setProfileTypes(updatedProfileTypes);
  }, [profiles]);

  // Handle Type
  const [selectedValue, setSelectedValue] = useState('CUSTOMER');
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setValue('type',event.target.value);
  };

  const onSubmit = async (data) => {
    data.names = chips;
    try {
          await dispatch(addProfile(machine._id, data));
          reset();
          enqueueSnackbar('Profile added successfully');
          dispatch(setProfileFormVisibility(false));
    } catch (err) {
      enqueueSnackbar(err, { variant: 'error' });
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
              <MuiChipsInput name="names" label="Other Names"  value={chips} onChange={handleChipChange} />
            </Box>  
            <Box sx={{marginTop:2}} rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)',}}>
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
