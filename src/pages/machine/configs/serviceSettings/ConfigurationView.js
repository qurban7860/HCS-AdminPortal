// @mui
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../../routes/paths';
// sections
import ConfigurationViewForm from './ConfigurationViewForm';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';


// ----------------------------------------------------------------------

export default function ConfigurationView() {
  const { configuration } = useSelector((state) => state.configuration);
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={configuration?.collectionType}
          setting
          backLink={PATH_MACHINE.machines.settings.configuration.list}
        />
      </StyledCardContainer>
      <ConfigurationViewForm />
    </Container>
  );
}
