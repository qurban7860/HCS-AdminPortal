import { Container } from '@mui/material';
// sections
import SettingAddForm from './SettingAddForm';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function SettingAdd() {

  return (
      <Container maxWidth={false }>
          <MachineTabContainer currentTabValue='settings' />
        <SettingAddForm />
      </Container>
  );
}
