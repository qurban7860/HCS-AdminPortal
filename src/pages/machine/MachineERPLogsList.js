import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../redux/store';
// COMPONENTS
import { setAllVisibilityFalse } from '../../redux/slices/products/machineErpLogs';
import MachineErpLogsAddForm from './ERP_Logs/MachineLogsAddForm';
import MachineErpLogsViewForm from './ERP_Logs/MachineLogsViewForm';
import MachineLogsGraphViewForm from './ERP_Logs/MachineLogsGraphViewForm';
import MachineErpLogsList from './ERP_Logs/MachineLogsList';

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

