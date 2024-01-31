import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import {  useSelector, useDispatch } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// sections
import ParameterViewForm from './ParameterViewForm';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { getTechparam } from '../../../redux/slices/products/machineTechParam';

ParameterViewPage.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function ParameterViewPage({ editPage }) {

  const { id } = useParams();
  const dispatch = useDispatch();

  const { techparam } = useSelector((state) => state.techparam);
  
  useLayoutEffect(() => {
    dispatch(getTechparam(id));
  }, [dispatch, id]);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={techparam?.name}
          setting
          backLink={PATH_MACHINE.machines.settings.parameters.list}
        />
      </StyledCardContainer>
      <ParameterViewForm />
    </Container>
  );
}
