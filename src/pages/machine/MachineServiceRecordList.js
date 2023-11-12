import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../redux/store';
// COMPONENTS
import { setAllFlagsFalse } from '../../redux/slices/products/machineServiceRecord';
import MachineServiceRecordAddForm from './MachineServiceRecord/MachineServiceRecordAddForm';
import MachineServiceRecordEditForm from './MachineServiceRecord/MachineServiceRecordEditForm';
import MachineServiceRecordViewForm from './MachineServiceRecord/MachineServiceRecordViewForm';
import MachineServiceRecordListTable from './MachineServiceRecord/MachineServiceRecordList';
import MachineServiceRecordHistoryList from './MachineServiceRecord/MachineServiceRecordHistoryList';


// ----------------------------------------------------------------------

export default function MachineServiceRecordList() {

  const { machineServiceRecordEditFormFlag, machineServiceRecordAddFormFlag, machineServiceRecordViewFormFlag, machineServiceRecordHistoryFormFlag } = useSelector((state) => state.machineServiceRecord);
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setAllFlagsFalse());
  },[dispatch, machine])
 
  return (
    <>
      { !machineServiceRecordEditFormFlag && !machineServiceRecordAddFormFlag && !machineServiceRecordViewFormFlag && !machineServiceRecordHistoryFormFlag && <MachineServiceRecordListTable />}
      { !machineServiceRecordEditFormFlag && machineServiceRecordAddFormFlag && !machineServiceRecordViewFormFlag && !machineServiceRecordHistoryFormFlag && <MachineServiceRecordAddForm />}
      { machineServiceRecordEditFormFlag && !machineServiceRecordAddFormFlag && !machineServiceRecordViewFormFlag && !machineServiceRecordHistoryFormFlag && <MachineServiceRecordEditForm />}
      { !machineServiceRecordEditFormFlag && !machineServiceRecordAddFormFlag && machineServiceRecordViewFormFlag && !machineServiceRecordHistoryFormFlag && <MachineServiceRecordViewForm />}
      { !machineServiceRecordEditFormFlag && !machineServiceRecordAddFormFlag && !machineServiceRecordViewFormFlag && machineServiceRecordHistoryFormFlag && <MachineServiceRecordHistoryList />}
    </>
  );
}

