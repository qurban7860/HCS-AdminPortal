import { Card, Container, Grid } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Cover } from '../../components/Defaults/Cover';

import { StyledCardContainer } from '../../theme/styles/default-styles';
import AddNewJobForm from '../../components/MachineJobs/AddNewJobForm';

const JobsAddForm = () => {
console.log("object");

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover backLink name="Add New Job" />
      </StyledCardContainer>
      <AddNewJobForm />
    </Container>
  );
};

export default JobsAddForm;
