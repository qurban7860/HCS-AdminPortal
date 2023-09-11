import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../redux/store';
// COMPONENTS
import { setAllFlagsFalse } from '../../redux/slices/products/machineServiceRecord';
import MachineServiceRecordAddForm from './MachineServiceRecord/MachineServiceRecordAddForm';
import MachineServiceRecordEditForm from './MachineServiceRecord/MachineServiceRecordEditForm';
import MachineServiceRecordViewForm from './MachineServiceRecord/MachineServiceRecordViewForm';
import MachineServiceRecordListTable from './MachineServiceRecord/MachineServiceRecordList';


// ----------------------------------------------------------------------

export default function MachineServiceRecordList() {

  const { machineServiceRecordEditFormFlag, machineServiceRecordAddFormFlag, machineServiceRecordViewFormFlag } = useSelector((state) => state.machineServiceRecord);
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setAllFlagsFalse());
  },[dispatch, machine])
 
  return (
    <>
      { !machineServiceRecordEditFormFlag && !machineServiceRecordAddFormFlag && !machineServiceRecordViewFormFlag && <MachineServiceRecordListTable />}
      { !machineServiceRecordEditFormFlag && machineServiceRecordAddFormFlag && !machineServiceRecordViewFormFlag && <MachineServiceRecordAddForm />}
      { machineServiceRecordEditFormFlag && !machineServiceRecordAddFormFlag && !machineServiceRecordViewFormFlag && <MachineServiceRecordEditForm />}
      { !machineServiceRecordEditFormFlag && !machineServiceRecordAddFormFlag && machineServiceRecordViewFormFlag && <MachineServiceRecordViewForm />}
    </>
  );
}

