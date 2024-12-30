import * as Yup from 'yup';
import { useCallback, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// routes
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Container, Card, Grid, Stack, Typography } from '@mui/material';
// components
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { PATH_TICKET_SETTING } from '../../../routes/paths';
import { useSnackbar } from '../../../components/snackbar';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import FormProvider, {
  RHFTextField,
  RHFUpload,
  RHFAutocomplete,
  RHFDatePicker,
} from '../../../components/hook-form';
import { time_list } from '../../../constants/time-list';
import RenderCustomInput from '../../../components/custom-input/RenderCustomInput';
import PriorityIcon from '../../calendar/utils/PriorityIcon';

function getTimeObjectFromISOString(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedValueTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const timeObject = {
    value: formattedValueTime,
    label: `${formattedTime} ${ampm}`
};
return timeObject;
}

export default function SystemChangeForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const AddSystemProblemSchema = Yup.object().shape({
    description: Yup.string().max(10000).required('Summary is required!'),
  });

  const defaultValues = useMemo(
    () => ({
      description: '',
      files: [],
      share: 'Sharing with TerminusTech',
      start: getTimeObjectFromISOString(new Date().toISOString()),
      end: getTimeObjectFromISOString(new Date().toISOString()),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddSystemProblemSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const { files, date } = watch();

  const handleDropMultiFile = useCallback(
    async (acceptedFiles) => {
      const docFiles = files || [];

      const newFiles = acceptedFiles.map((file, index) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          src: URL.createObjectURL(file),
          isLoaded: true,
        })
      );
      setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files]
  );

  useEffect(() => {
    const { end_date } = watch();
    if (date && end_date) {
      const startDate = new Date(date);
      const endDate = new Date(end_date);
      if (startDate > endDate) {
        setValue('end_date', startDate);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const typeOptions = ['Standard', 'Normal', 'Emergency'];
  const priorityOptions = ['High', 'Medium', 'Low'];
  const impactOptions = [
    'Extensive / Widespread',
    'Significant / Large',
    'Moderate / Limited',
    'Minor / Localized',
  ];
  const changeReasonOptions = ['Repair', 'Upgrade', 'Maintenance', 'New functionality', 'Other'];
  const sharingOptions = ['Sharing with TerminusTech', 'No one'];
  
  const onSubmit = async (data) => {
    try {
      // await dispatch(addChangeRequest(data));
      reset();
      enqueueSnackbar('Change Request Send Successfully!');
      navigate(PATH_TICKET_SETTING.root);
    } catch ( error ) {
      enqueueSnackbar( error, { variant: `error` });
      console.error( error );
    }
  };

  const toggleCancel = () => navigate(PATH_TICKET_SETTING.root);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="System Change" ticketSettings />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography variant="h3" sx={{ color: 'text.secondary' }}>
                    Create a Change Request
                  </Typography>
                </Stack>
                <RHFTextField name="description" label="Summary*" minRows={3} multiline />
                <Box
                  sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(1, 1fr)' },
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <RHFAutocomplete
                    name="type"
                    options={typeOptions}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <RenderCustomInput label="Change Type" params={params} />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {' '}
                        <span style={{ marginLeft: 8 }}>{option}</span>{' '}
                      </li>
                    )}
                  />
                  <RHFAutocomplete
                    name="impact"
                    options={impactOptions}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => <RenderCustomInput label="Impact" params={params} />}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {' '}
                        <span style={{ marginLeft: 8 }}>{option}</span>{' '}
                      </li>
                    )}
                  />
                  <RHFAutocomplete
                    name="priority"
                    options={priorityOptions}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => <RenderCustomInput label="Urgency" params={params} />}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {' '}
                        <PriorityIcon priority={option} />{' '}
                        <span style={{ marginLeft: 8 }}>{option}</span>{' '}
                      </li>
                    )}
                  />
                  <RHFAutocomplete
                    name="priority"
                    options={priorityOptions}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <RenderCustomInput label="Change Risk" params={params} />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {' '}
                        <PriorityIcon priority={option} />{' '}
                        <span style={{ marginLeft: 8 }}>{option}</span>{' '}
                      </li>
                    )}
                  />
                  <Box sx={{ mt: 0 }}>
                    <Typography variant="body1" sx={{ mb: 1, ml: 1 }}>
                      Attachment
                    </Typography>
                    <RHFUpload
                      multiple
                      thumbnail
                      name="files"
                      imagesOnly
                      onDrop={handleDropMultiFile}
                      onRemove={(inputFile) =>
                        files.length > 1
                          ? setValue(
                              'files',
                              files && files?.filter((file) => file !== inputFile),
                              {
                                shouldValidate: true,
                              }
                            )
                          : setValue('files', '', { shouldValidate: true })
                      }
                      onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
                    />{' '}
                  </Box>
                  <RHFAutocomplete
                    name="changeReason"
                    options={changeReasonOptions}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <RenderCustomInput label="Change Reason" params={params} />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {' '}
                        <PriorityIcon priority={option} />{' '}
                        <span style={{ marginLeft: 8 }}>{option}</span>{' '}
                      </li>
                    )}
                  />
                  <RHFTextField name="implementation" label="Implementation Plan" minRows={4} multiline />
                  <RHFTextField name="backout" label="Backout Plan" minRows={4} multiline />
                  <RHFTextField name="test" label="Test Plan" minRows={4} multiline />
                </Box>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }}
                >
                  <RHFDatePicker label="Planned start date" name="date" />
                  <RHFAutocomplete
                    label="Planned start time"
                    name="start"
                    options={time_list}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    getOptionLabel={(option) => `${option?.label || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option?.label || ''}`}</li>
                    )}
                  />
                  <RHFDatePicker label="Planned end date" name="end_date" />
                  <RHFAutocomplete
                    label="Planned end time"
                    name="end"
                    options={time_list}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    getOptionLabel={(option) => `${option?.label || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option?.label || ''}`}</li>
                    )}
                  />
                </Box>
                <RHFAutocomplete
                  name="share"
                  options={sharingOptions}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderInput={(params) => (
                    <RenderCustomInput label="Share with*" params={params} />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {' '}
                      <span style={{ marginLeft: 8 }}>{option}</span>{' '}
                    </li>
                  )}
                  sx={{ maxWidth: 400 }}
                />
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
