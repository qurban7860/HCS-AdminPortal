import PropTypes from 'prop-types';
// @mui
import { Container } from '@mui/material';
import {  useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../../routes/paths';

// sections

import CategoryViewForm from './CategoryViewForm';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
/* eslint-disable */

CategoryView.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function CategoryView({ editPage }) {
  const { category } = useSelector((state) => state.category);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={category?.name}
          setting
          backLink={PATH_MACHINE.machines.settings.categories.list}
        />
      </StyledCardContainer>
      <CategoryViewForm />
    </Container>
  );
}
