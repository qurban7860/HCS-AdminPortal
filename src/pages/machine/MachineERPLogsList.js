import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../redux/store';
// COMPONENTS
import { setAllVisibilityFalse } from '../../redux/slices/products/machineErpLogs';
import MachineErpLogsAddForm from './logs/MachineLogsAddForm';
import MachineErpLogsViewForm from './logs/MachineLogsViewForm';
import MachineLogsGraphViewForm from './logs/MachineLogsGraphViewForm';
import MachineErpLogsList from './logs/MachineLogsList';

// ----------------------------------------------------------------------

export default function MachineERPLogsList() {
    const { machineErpLogViewForm, machineErpLogAddForm, machineErpLogListViewForm } = useSelector((state) => state.machineErpLogs);
    const { machine } = useSelector((state) => state.machine);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setAllVisibilityFalse());
    },[dispatch, machine])

    return (
        <>
            { !machineErpLogViewForm && !machineErpLogAddForm && !machineErpLogListViewForm && <MachineLogsGraphViewForm />}
            { !machineErpLogViewForm && !machineErpLogAddForm &&  machineErpLogListViewForm && <MachineErpLogsList />}
            {  machineErpLogViewForm && !machineErpLogAddForm && !machineErpLogListViewForm && <MachineErpLogsViewForm />}
            { !machineErpLogViewForm &&  machineErpLogAddForm && !machineErpLogListViewForm && <MachineErpLogsAddForm />}
        </>
    );
}

