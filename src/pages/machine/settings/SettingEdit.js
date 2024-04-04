import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch } from '../../../redux/store';
import { getSetting } from '../../../redux/slices/products/machineSetting';
// sections
import SettingEditForm from './SettingEditForm';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function SettingEdit() {
  const dispatch = useDispatch();

  const { machineId, id } = useParams();

  useLayoutEffect(() => {
    if(machineId && id) {
      dispatch(getSetting(machineId, id));
    }
  }, [dispatch, machineId, id]);

  return (
      <Container maxWidth={false}>
        <MachineTabContainer currentTabValue='settings' />
        <SettingEditForm />
      </Container>
  );
}
