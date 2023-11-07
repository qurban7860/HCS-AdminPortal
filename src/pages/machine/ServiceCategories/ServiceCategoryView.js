import PropTypes from 'prop-types';
// @mui
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// routes
import { PATH_MACHINE } from '../../../routes/paths';

// sections

// import ServiceCategoryList from './ServiceCategoryList';
import ServiceCategoryViewForm from './ServiceCategoryViewForm';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
/* eslint-disable */

ServiceCategoryView.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function ServiceCategoryView({ editPage }) {
  const { serviceCategory } = useSelector((state) => state.serviceCategory);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={serviceCategory?.name}
          setting
          backLink={PATH_MACHINE.machines.settings.serviceCategories.list}
        />
      </StyledCardContainer>
      <ServiceCategoryViewForm />
    </Container>
  );
}
