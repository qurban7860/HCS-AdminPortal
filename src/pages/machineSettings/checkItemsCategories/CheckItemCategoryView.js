import PropTypes from 'prop-types';
// @mui
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
// sections
import CheckItemCategoryViewForm from './CheckItemCategoryViewForm';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
/* eslint-disable */

CheckItemCategoryView.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function CheckItemCategoryView({ editPage }) {
  const { serviceCategory } = useSelector((state) => state.serviceCategory);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={serviceCategory?.name}
          setting
        />
      </StyledCardContainer>
      <CheckItemCategoryViewForm />
    </Container>
  );
}
