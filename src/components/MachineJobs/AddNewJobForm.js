import { Card, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

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
          <ToggleButtonGroup
            color="primary"
            value={currentTab}
            exclusive
            onChange={handleUploadMethodChange}
            aria-label="Job Upload Method"
          >
            {UPLOAD_METHODS.map((method) => (
              <ToggleButton key={method} value={method}>
                {method}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <span> </span>
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
