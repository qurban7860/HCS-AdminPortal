import PropTypes from 'prop-types';
// @mui
import { Container} from '@mui/material';
import {  useSelector } from 'react-redux';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// routes
import { PATH_MACHINE } from '../../../routes/paths';

// sections

// import ServiceRecordConfigList from './ServiceRecordConfigList';
import ServiceRecordConfigViewForm from './ServiceRecordConfigViewForm';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
/* eslint-disable */

ServiceRecordConfigView.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function ServiceRecordConfigView({ editPage }) {
  const { serviceRecordConfig } = useSelector((state) => state.serviceRecordConfig);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={serviceRecordConfig?.recordType}
          setting="setting"
          backLink={PATH_MACHINE.machines.settings.serviceRecordConfigs.list}
        />
      </StyledCardContainer>
      <ServiceRecordConfigViewForm />
    </Container>
  );
}
