import PropTypes from 'prop-types';
// @mui
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// sections
import StatusViewForm from './StatusViewForm';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';


StatusView.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function StatusView({ editPage }) {

  const { machinestatus } = useSelector((state) => state.machinestatus);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={machinestatus?.name}
          setting
          backLink={PATH_MACHINE.machines.settings.status.list}
        />
      </StyledCardContainer>
      <StatusViewForm />
    </Container>
  );
}
