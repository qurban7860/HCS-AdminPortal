import { useMemo, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Box, Stack, Typography, Container } from '@mui/material';
// hooks
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../../../components/snackbar';
// schema
import { CheckItemsSchema } from '../../schemas/machine';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../components/hook-form';
import {
  getCheckItem,
  updateCheckItem
} from '../../../redux/slices/products/machineCheckItems';
import { getActiveServiceCategories } from '../../../redux/slices/products/serviceCategory';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import FormHeading from '../../components/DocumentForms/FormHeading';
import { Cover } from '../../components/Defaults/Cover';
// styles
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { FORMLABELS } from '../../../constants/default-constants';
import { Snacks } from '../../../constants/machine-constants';


// ----------------------------------------------------------------------

export default function DocumentCategoryeEditForm() {
  const { checkItem } = useSelector((state) => state.checkItems);
  const { activeServiceCategories } = useSelector((state) => state.serviceCategory);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const initialState = useSelector((state) => state.checkItems);
  const { inputTypes, unitTypes} = initialState;

  useEffect(()=>{
    dispatch(getActiveServiceCategories())
  },[dispatch])

  const defaultValues = useMemo(
    () => ({
      name:             checkItem?.name || '',
      serviceCategory:  checkItem?.category || null,
      printName:        checkItem?.printName || '',
      description:      checkItem?.description || '',
      helpHint:         checkItem?.helpHint || '',
      linkToUserManual: checkItem?.linkToUserManual || '',
      isRequired:       checkItem?.isRequired, 
      inputType:        {name: checkItem?.inputType} || null,
      unitType:         {name: checkItem?.unitType} || null,    
      minValidation:    checkItem?.minValidation || '',
      maxValidation:    checkItem?.maxValidation || '',
      isActive:         checkItem?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ checkItem ]
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
  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.checkItems.view(checkItem._id));
  };

  const onSubmit = async (data) => {
    try {
      console.log("data : ", data);
      await dispatch(updateCheckItem(checkItem._id, data));
      dispatch(getCheckItem(checkItem._id))
      navigate(PATH_MACHINE.machines.settings.checkItems.view(checkItem._id));
      enqueueSnackbar(Snacks.checkItemUpdate, { variant: `success` });
      reset();
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAM_EDIT}
          setting
          backLink={PATH_MACHINE.machines.settings.checkItems.view(checkItem?._id)}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <FormHeading heading={FORMLABELS.COVER.MACHINE_SERVICE_PARAM_EDIT} />
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
                  <RHFTextField name="printName" label="Print Name" minRows={3} multiline />
                  <RHFTextField name="helpHint" label="Help Hint" />
                  <RHFTextField name="linkToUserManual" label="Link To User Manual" />
                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >
                  <RHFAutocomplete 
                      name="inputType" label="Input Type"
                      options={inputTypes}
                      isOptionEqualToValue={(option, value) => option.name === value.name}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                    />

                    {inputType && inputType.name === 'Number' && <RHFAutocomplete 
                      name="unitType" label="Unit Type"
                      options={unitTypes}
                      isOptionEqualToValue={(option, value) => option.name === value.name}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                    />}
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
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
