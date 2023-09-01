import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
// @mui
import { Tab, Card, Tabs, Container, Box, Button, Grid, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// routes
import { PATH_MACHINE } from '../../../routes/paths';

// sections

import ServiceRecordConfigList from './ServiceRecordConfigList';
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
          name={serviceRecordConfig?.name}
          setting="setting"
          backLink={PATH_MACHINE.machines.settings.categories.list}
        />
      </StyledCardContainer>
      <ServiceRecordConfigViewForm />
    </Container>
  );
}
