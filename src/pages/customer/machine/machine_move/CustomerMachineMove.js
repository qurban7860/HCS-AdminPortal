import { Container } from '@mui/material';
import CustomerTabContainer from '../../util/CustomerTabContainer';
import MoveMachineForm from './MoveMachineForm'

export default function CustomerMachineMove() {

  return (<Container maxWidth={false} >
    <CustomerTabContainer currentTabValue="machines" />
      <MoveMachineForm /> 
    </Container>)
}

