import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
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
} from '../../../components/hook-form';
import RenderCustomInput from '../../../components/custom-input/RenderCustomInput';
import PriorityIcon from '../../calendar/utils/PriorityIcon';

export default function SystemIncidentForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const AddSystemProblemSchema = Yup.object().shape({
    description: Yup.string().max(10000).required('Description Field is required!'),
  });

  const defaultValues = useMemo(
    () => ({
      description: '',
      files: [],
      share: 'Sharing with TerminusTech',
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

  const { files } = watch();

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

  const priorityOptions = ['High', 'Medium', 'Low'];
  const impactOptions = [
    'Extensive / Widespread',
    'Significant / Large',
    'Moderate / Limited',
    'Minor / Localized',
  ];
  const reasonOptions = [
    'High impact incident',
    'Recurring incident',
    'Non-routine incident',
    'Other',
  ];
  const sharingOptions = ['Sharing with TerminusTech', 'No one'];

  const onSubmit = async (data) => {
    try {
      // await dispatch(addIncidentForm(data));
      reset();
      enqueueSnackbar('Investigation Problem Send Successfully!');
      navigate(PATH_TICKET_SETTING.root);
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => navigate(PATH_TICKET_SETTING.root);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Investigate Problem" ticketSettings />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography variant="h3" sx={{ color: 'text.secondary' }}>
                    Investigste Problem form
                  </Typography>
                </Stack>
                <RHFTextField
                  name="description"
                  label="Summarize the problem*"
                  minRows={3}
                  multiline
                />
                <RHFAutocomplete
                  name="reason"
                  options={reasonOptions}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderInput={(params) => (
                    <RenderCustomInput label="Investigation reason" params={params} />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {' '}
                      <span style={{ marginLeft: 8 }}>{option}</span>{' '}
                    </li>
                  )}
                />
                <Box sx={{ mt: 2 }}>
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
                        ? setValue('files', files && files?.filter((file) => file !== inputFile), {
                            shouldValidate: true,
                          })
                        : setValue('files', '', { shouldValidate: true })
                    }
                    onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
                  />{' '}
                </Box>
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
                    name="impact"
                    options={impactOptions}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <RenderCustomInput
                        label="Impact"
                        params={params}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        <span style={{ marginLeft: 8 }}>{option}</span>
                      </li>
                    )}
                  />
                  <RHFTextField name="cause" label="Root cause" minRows={4} multiline />
                  <RHFTextField name="work" label="Workaround" minRows={4} multiline />
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
                    sx={{ maxWidth: 500 }}
                  />
                </Box>
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
