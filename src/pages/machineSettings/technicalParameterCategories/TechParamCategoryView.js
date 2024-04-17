import PropTypes from 'prop-types';
// @mui
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
// sections
import TechParamCategoryViewForm from './TechParamCategoryViewForm';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
/* eslint-disable */

TechParamCategoryView.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function TechParamCategoryView() {
  const { techparamcategory } = useSelector((state) => state.techparamcategory);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={techparamcategory?.name}
          setting
        />
      </StyledCardContainer>
      <TechParamCategoryViewForm />
    </Container>
  );
}
