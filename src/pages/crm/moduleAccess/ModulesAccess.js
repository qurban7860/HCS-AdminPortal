import { Container } from '@mui/material';
import ModulesAccessEdit from './ModulesAccessEdit';
import CustomerTabContainer from '../customers/util/CustomerTabContainer';

// ----------------------------------------------------------------------

export default function ModulesAccess() {

  return (
    <Container maxWidth={false}>
      <CustomerTabContainer currentTabValue="modulesAccess" />
      <ModulesAccessEdit />
    </Container>
  );
}

