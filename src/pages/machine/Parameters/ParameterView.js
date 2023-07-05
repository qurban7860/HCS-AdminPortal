import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
// @mui
import { Tab, Card, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// redux

import { setTechparamEditFormVisibility } from '../../../redux/slices/products/machineTechParam';

// sections

import ParameterList from './ParameterList';
import ParameterViewForm from './ParameterViewForm';
import { Cover } from '../../components/Defaults/Cover';
import ParameterEditForm from './ParameterEditForm';

ParameterViewPage.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function ParameterViewPage({ editPage }) {
  const dispatch = useDispatch();

  const { techparamEditFormFlag } = useSelector((state) => state.techparam);

  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag((value) => !value);

  const [currentComponent, setCurrentComponent] = useState(<ParameterViewForm />);

  const [techparamFlag, setTechparamFlag] = useState(true);
  const { techparam } = useSelector((state) => state.techparam);

  useLayoutEffect(() => {
    dispatch(setTechparamEditFormVisibility(editFlag));
  }, [dispatch, editFlag]);

  useEffect(() => {
    if (techparamEditFormFlag) {
      setCurrentComponent(<ParameterEditForm />);
    } else {
      setTechparamFlag(false);
      setCurrentComponent(<ParameterViewForm />);
    }
  }, [editPage, techparamEditFormFlag, techparam]);

  return (
    <Container maxWidth={false}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
        <Cover
          name={techparam?.name}
          setting="enable"
          backLink={PATH_MACHINE.machines.settings.machineParameters.list}
        />
      </Card>
      <ParameterViewForm />
    </Container>
  );
}
