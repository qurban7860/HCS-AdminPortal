import { Container } from '@mui/material';
import CustomerTabContainer from '../../customers/util/CustomerTabContainer';
import MachineList from './MachineList'

export default function CustomerMachines() {

  return (<Container maxWidth={false} >
    <CustomerTabContainer currentTabValue="machines" />
      <MachineList />
    </Container>)
}

