import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Box, Stack, Typography, Container } from '@mui/material';
// hooks
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../../../components/snackbar';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
import FormHeading from '../../components/DocumentForms/FormHeading';
import { FORMLABELS } from '../../../constants/default-constants';
// schema
import { CheckItemsSchema } from '../../schemas/machine';
// slice
import { addCheckItem } from '../../../redux/slices/products/machineCheckItems';
import { getActiveServiceCategories } from '../../../redux/slices/products/serviceCategory';
// components
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../components/Defaults/Cover';
// styles
import { StyledCardContainer } from '../../../theme/styles/default-styles';
// constants
import { Snacks } from '../../../constants/machine-constants';
import { unitTypes, inputTypes } from '../util/index'

// ----------------------------------------------------------------------

export default function CheckItemAddForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { filterBy } = useSelector((state) => state.checkItems);
  const { activeServiceCategories } = useSelector((state) => state.serviceCategory);

  useEffect(()=>{
    dispatch(getActiveServiceCategories())
  },[dispatch])
  const defaultValues = useMemo(
    () => ({
      name:             filterBy,
      serviceCategory: null,
      printName:        '',
      description:      '',
      helpHint:         '',
      linkToUserManual: '',
      isRequired:       false, 
      inputType:        '',
      unitType:         '',    
      minValidation:    '',
      maxValidation:    '',
      isActive:         true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(CheckItemsSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { inputType } = watch();

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    try {
      await dispatch(addCheckItem(data));
      reset();
      enqueueSnackbar(Snacks.checkItemAdd);
      navigate(PATH_MACHINE.machines.settings.checkItems.list);
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.checkItems.list);
  };
  
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAM_ADD}
          setting
          backLink={PATH_MACHINE.machines.settings.checkItems.list}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                  <RHFAutocomplete 
                    name="serviceCategory"
                    label="Item Category"
                    options={activeServiceCategories}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />
                  <RHFTextField name="name" label="Name" />
                  <RHFTextField name="printName" label="Print Name" minRows={3} multiline/>

                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >
                    <RHFTextField name="helpHint" label="Help Hint" />
                    <RHFTextField name="linkToUserManual" label="Link To User Manual" />
                    <RHFAutocomplete 
                      name="inputType" label="Input Type"
                      options={inputTypes}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                    />

                    {inputType && inputType?.name === 'Number' && <RHFAutocomplete 
                      name="unitType" label="Unit Type"
                      options={unitTypes}
                      isOptionEqualToValue={(option, value) => option?.name === value?.name}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                    />}
                  </Box>

                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >
                    
                    <RHFTextField name="minValidation" label="Minimum Validation" />
                    <RHFTextField name="maxValidation" label="Maximum Validation" />
                    
                  </Box>
                  <RHFTextField name="description" label="Description" minRows={7} multiline />

                <Grid container display="flex">
                  <RHFSwitch
                    name="isRequired"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                        Required
                      </Typography>
                    }
                  />

                  <RHFSwitch
                    name="isActive"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                        Active
                      </Typography>
                    }
                  />
                </Grid>

                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
