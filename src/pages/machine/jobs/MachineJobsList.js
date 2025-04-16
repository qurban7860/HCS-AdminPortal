import { Container } from '@mui/material';
import React from 'react';
import MachineTabContainer from '../util/MachineTabContainer';

const MachineJobsList = () => {
  console.log('test');
  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue="jobs" />
    </Container>
  );
};

export default MachineJobsList;
