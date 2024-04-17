// @mui
import { Container} from '@mui/material';
import {  useSelector } from 'react-redux';
// sections
import ServiceRecordConfigViewForm from './ServiceRecordConfigViewForm';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function ServiceRecordConfigView() {
  const { serviceRecordConfig, isLoading } = useSelector((state) => state.serviceRecordConfig);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={isLoading? "" : serviceRecordConfig?.docTitle}
          setting
        />
      </StyledCardContainer>
      <ServiceRecordConfigViewForm />
    </Container>
  );
}
