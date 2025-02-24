// @mui
import { Container} from '@mui/material';
import {  useSelector } from 'react-redux';
// sections
import ServiceReportTemplateViewForm from './ServiceReportTemplateViewForm';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function ServiceReportTemplateView() {
  const { serviceReportTemplate, isLoading } = useSelector((state) => state.serviceReportTemplate);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={isLoading? "" : serviceReportTemplate?.reportTitle}
          setting
        />
      </StyledCardContainer>
      <ServiceReportTemplateViewForm />
    </Container>
  );
}
