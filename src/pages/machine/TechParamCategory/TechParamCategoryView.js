import PropTypes from 'prop-types';
// @mui
import { Card, Container } from '@mui/material';
import { useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// sections
import TechParamCategoryViewForm from './TechParamCategoryViewForm';
import { Cover } from '../../components/Defaults/Cover';
/* eslint-disable */

TechParamCategoryView.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function TechParamCategoryView() {
  const { techparamcategory } = useSelector((state) => state.techparamcategory);

  return (
    <Container maxWidth={false}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
        <Cover
          name={techparamcategory?.name}
          setting="enable"
          backLink={PATH_MACHINE.machines.settings.machineTechnicalParameterCategories.list}
        />
      </Card>
      <TechParamCategoryViewForm />
    </Container>
  );
}
