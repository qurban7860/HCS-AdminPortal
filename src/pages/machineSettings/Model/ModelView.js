import PropTypes from 'prop-types';
// @mui
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
// sections
import ModelViewForm from './ModelViewForm';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

ModelViewPage.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function ModelViewPage({ editPage }) {
  const { machineModel } = useSelector((state) => state.machinemodel);
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          model={machineModel?.name}
          name={machineModel?.name}
          setting
        />
      </StyledCardContainer>
      <ModelViewForm />
    </Container>
  );
}
