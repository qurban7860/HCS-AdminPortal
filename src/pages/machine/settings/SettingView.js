import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch } from '../../../redux/store';
import { getSetting } from '../../../redux/slices/products/machineSetting';
// sections
import SettingViewForm from './SettingViewForm';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function SettingView() {
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
          <SettingViewForm />
    </Container>
  );
}
