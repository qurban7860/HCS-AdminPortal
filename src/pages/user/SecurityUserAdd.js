// import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import { Container, Card } from '@mui/material';
// sections
import SecurityUserAddForm from './SecurityUserAddForm';
import { Cover } from '../../components/Defaults/Cover';
// ----------------------------------------------------------------------

SecurityUserAdd.propTypes = {
  isInvite: PropTypes.bool,
};

export default function SecurityUserAdd({isInvite}) {
  const title = isInvite?"Invite User":"Create User";
  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
        }}
      >
        <Cover name={title} icon="mdi:user-circle" />
      </Card>
      <SecurityUserAddForm isInvite={isInvite} />
    </Container>
  );
}
