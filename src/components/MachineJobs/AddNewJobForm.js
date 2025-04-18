import { Button, Card, Grid, MenuItem, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Iconify from '../iconify';
import { ICONS } from '../../constants/icons/default-icons';
import { RHFSelect, RHFTextField } from '../hook-form';

const UPLOAD_METHODS = ['Manual', 'Upload CSV'];

const AddNewJobForm = ({ machine }) => {
  const [currentTab, setCurrentTab] = useState(UPLOAD_METHODS[0]);
  const methods = useForm({
    // defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const {
    reset,
    setError,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data) => {
    // Handle form submission here
    console.log(data);
  };

  const handleUploadMethodChange = (e, newTab) => {
    if (newTab !== null) {
      setCurrentTab(newTab);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{ p: 3, pt: 2 }}>
          <FormProvider {...methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item md={6}>
                <RHFSelect
                  name="CSV_VERSION"
                  size="small"
                  label="CSV Version"
                  sx={{ width: '100%' }}
                  required
                >
                  <MenuItem value="1.0">Version 1.0</MenuItem>
                  <MenuItem value="2.0">Version 2.0</MenuItem>
                </RHFSelect>
              </Grid>
              <Grid item md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  component="label"
                  // size="small"
                  // disabled={!logType || !logVersion}
                  startIcon={<Iconify icon={ICONS.UPLOAD_FILE_CSV.icon} />}
                >
                  {' '}
                  Import Job CSV
                  <input
                    // key={fileInputKey}
                    type="file"
                    accept=".txt, .csv"
                    hidden
                    // onChange={handleFileChange}
                  />
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item md={6}>
                <RHFSelect
                  name="UNIT"
                  size="small"
                  label="Unit of Length"
                  sx={{ width: '100%' }}
                  required
                >
                  <MenuItem value="MILLIMETRE">MILLIMETRE</MenuItem>
                  <MenuItem value="INCH">INCH</MenuItem>
                </RHFSelect>
              </Grid>
              <Grid item md={6}>
                <RHFTextField
                  name="FRAMESET"
                  label="Frameset"
                  size="small"
                  required
                  placeholder="component label,text1,text2,…"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item md={6}>
                <RHFTextField
                  name="PROFILE_NAME"
                  label="Profile Name"
                  size="small"
                  placeholder="DEFAULT_PROFILE"
                  required
                />
              </Grid>
              <Grid item md={6}>
                <RHFTextField name="PROFILE_DESC" label="Profile Description" size="small" />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item md={12}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  Components
                </Typography>
              </Grid>
            </Grid>
          </FormProvider>
        </Card>
      </Grid>
    </Grid>
  );
};

AddNewJobForm.propTypes = {
  machine: PropTypes.object,
};

export default AddNewJobForm;
