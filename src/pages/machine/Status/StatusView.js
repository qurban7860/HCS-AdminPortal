import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Card, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// redux
import { setMachinestatusesEditFormVisibility } from '../../../redux/slices/products/statuses';
// components
import { useSettingsContext } from '../../../components/settings';
// sections
import StatusViewForm from './StatusViewForm';
import { Cover } from '../../components/Cover';
import StatusEditForm from './StatusEditForm';

StatusView.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function StatusView({editPage}) {
  const dispatch = useDispatch();

  const { machinestatusEditFormFlag } = useSelector((state) => state.machinestatus);

  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag(value => !value);

  const [currentComponent, setCurrentComponent] = useState(<StatusViewForm/>);

  const [machinestatusFlag, setMachinestatusFlag] = useState(true);
  const {machinestatus} = useSelector((state) => state.machinestatus);
  
  useLayoutEffect(() => {
    dispatch(setMachinestatusesEditFormVisibility(editFlag));
  }, [dispatch, editFlag]);

  useEffect(() => {
    if(machinestatusEditFormFlag){
      setCurrentComponent(<StatusEditForm/>);
    }else{
      setMachinestatusFlag(false);
      setCurrentComponent(<StatusViewForm/>);        
    }
  }, [editPage, machinestatusEditFormFlag, machinestatus]);

  
  return (
    <Container maxWidth={false}>
      <Card sx={{ mb: 3, height: 160, position: 'relative', }} >
        <Cover name={machinestatus?.name} setting="enable" backLink={PATH_MACHINE.machines.settings.machineStatus.list}/> 
      </Card>
      <StatusViewForm/>
    </Container>
  );
}
