import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../redux/store';
// COMPONENTS
import { setAllFlagsFalse } from '../../redux/slices/products/machineServiceRecord';
import MachineServiceRecordAddForm from './machineServiceRecords/MachineServiceRecordAddForm';
import MachineServiceRecordEditForm from './machineServiceRecords/MachineServiceRecordEditForm';
import MachineServiceRecordViewForm from './machineServiceRecords/MachineServiceRecordViewForm';
import MachineServiceRecordListTable from './machineServiceRecords/MachineServiceRecordList';
import MachineServiceRecordHistoryList from './machineServiceRecords/MachineServiceRecordHistoryList';

// ----------------------------------------------------------------------

export default function MachineServiceRecordList() {

  const { machineServiceRecordEditFormFlag, machineServiceRecordAddFormFlag, 
          machineServiceRecordViewFormFlag, machineServiceRecordHistoryFormFlag,
          resetFlags } = useSelector((state) => state.machineServiceRecord);
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();
  useEffect(()=>{
    if(resetFlags){
      dispatch(setAllFlagsFalse());
    }
  },[dispatch, machine, resetFlags])
 
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

