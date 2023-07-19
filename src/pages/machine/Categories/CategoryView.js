import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
// @mui
import { Tab, Card, Tabs, Container, Box, Button, Grid, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// routes
import { PATH_MACHINE } from '../../../routes/paths';

// sections

import CategoryList from './CategoryList';
import CategoryViewForm from './CategoryViewForm';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
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
          setting="setting"
          backLink={PATH_MACHINE.machines.settings.categories.list}
        />
      </StyledCardContainer>
      <CategoryViewForm />
    </Container>
  );
}
