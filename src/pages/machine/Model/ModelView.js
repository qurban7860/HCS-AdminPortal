import PropTypes from 'prop-types';
import { useLayoutEffect, useState } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// redux

import {
  setMachinemodelsEditFormVisibility,
} from '../../../redux/slices/products/model';
// sections
import ModelViewForm from './ModelViewForm';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

ModelViewPage.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function ModelViewPage({ editPage }) {
  const dispatch = useDispatch();

  const [editFlag] = useState(false);
  const { machineModel } = useSelector((state) => state.machinemodel);

  useLayoutEffect(() => {
    dispatch(setMachinemodelsEditFormVisibility(editFlag));
  }, [dispatch, editFlag]);


  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          model={machineModel?.name}
          name={machineModel?.name}
          setting
          backLink={PATH_MACHINE.machines.settings.model.list}
        />
      </StyledCardContainer>
      <ModelViewForm />
    </Container>
  );
}
