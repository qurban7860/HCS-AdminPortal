import { Box, Button, Card, Grid, MenuItem, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Iconify from '../iconify';
import { ICONS } from '../../constants/icons/default-icons';
import { RHFSelect, RHFTextField } from '../hook-form';
import FormLabel from '../DocumentForms/FormLabel';
import { FORM_LABELS } from '../../constants/job-constants';
import JobComponentsSection from './JobComponentsSection';

// const UPLOAD_METHODS = ['Manual', 'Upload CSV'];

const jobFormDefaultValues = () => ({
  csvVersion: '1.0',
  unitOfLength: 'MILLIMETRE',
  frameset: '',
  profileName: 'DEFAULT_PROFILE',
  profileDescription: '',
  components: [],
});

const AddNewJobForm = ({ machine }) => {
  const methods = useForm({
    defaultValues: jobFormDefaultValues(),
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const { csvVersion, unitOfLength } = watch();

  const onSubmit = async (data) => {
    // Handle form submission here
    console.log(data);
  };

  const handleUploadMethodChange = (e, newTab) => {
    if (newTab !== null) {
      // setCurrentTab(newTab);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{ p: 3, pt: 2 }}>
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
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
          </Box>
          <FormLabel content={FORM_LABELS.ADD_JOB.MAIN_ELEMENTS} />
          <FormProvider {...methods} onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ my: 2, mt: 3 }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item md={3}>
                  <RHFSelect
                    name="csvVersion"
                    label="CSV Version"
                    sx={{ width: '100%' }}
                    helperText={
                      errors.csvVersion?.message ||
                      'Specifies format version. v2.0 includes positioning data'
                    }
                    required
                  >
                    <MenuItem value="1.0">1.0</MenuItem>
                    <MenuItem value="2.0">2.0</MenuItem>
                  </RHFSelect>
                </Grid>
                <Grid item md={3}>
                  <RHFSelect
                    name="unitOfLength"
                    // size="small"
                    label="Unit of Length"
                    helperText={
                      errors.unitOfLength?.message || 'Measurement unit for all dimensions'
                    }
                    sx={{ width: '100%', '& .MuiInputBase-root': { textTransform: 'none' } }}
                    required
                  >
                    <MenuItem
                      value="MILLIMETRE"
                      sx={{ '&.MuiMenuItem-root': { textTransform: 'none' } }}
                    >
                      mm
                    </MenuItem>
                    <MenuItem value="INCH" sx={{ '&.MuiMenuItem-root': { textTransform: 'none' } }}>
                      inch
                    </MenuItem>
                  </RHFSelect>
                </Grid>
                <Grid item md={6}>
                  <RHFTextField
                    name="frameset"
                    label="Frameset"
                    // size="small"
                    helperText={
                      errors.frameset?.message ||
                      'Comma-separated identifiers for job labeling (e.g., IN1,Floor_2,Offices)'
                    }
                    required
                    placeholder="component_label,text_string_1,text_string_2,…"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item md={6}>
                  <RHFTextField
                    name="profileName"
                    label="Profile Name"
                    // size="small"
                    helperText={
                      errors.profileName?.message ||
                      'Unique identifier for the machine profile setup (e.g., 89.00X41.30)'
                    }
                    placeholder="DEFAULT_PROFILE"
                    required
                  />
                </Grid>
                <Grid item md={6}>
                  <RHFTextField
                    name="profileDescription"
                    label="Profile Description"
                    helperText={
                      errors.profileDescription?.message ||
                      'Optional description of the profile cross-section.'
                    }
                  />
                </Grid>
              </Grid>
              <JobComponentsSection csvVersion={csvVersion} unitOfLength={unitOfLength} />
            </Box>
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
