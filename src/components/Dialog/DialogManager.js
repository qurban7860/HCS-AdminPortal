import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';

const SecurityUserDialog = lazy(() => import('./SecurityUserDialog'));
const CustomerDialog = lazy(() => import('./CustomerDialog'));
const ContactDialog = lazy(() => import('./ContactDialog'));
const MachineDialog = lazy(() => import('./MachineDialog'));
const PortalRequestDialog = lazy(() => import('./PortalRequestDialog'));
const DialogServiceReportAddFile = lazy(() => import('./ServiceReportAddFileDialog'));

function DialogManager() {
    const { securityUserDialog } = useSelector((state) => state.user);
    const { customerDialog } = useSelector((state) => state.customer);
    const { contactDialog } = useSelector((state) => state.contact);
    const { machineDialog } = useSelector((state) => state.machine);
    const { requestDialog } = useSelector((state) => state.portalRegistration);
    const { addReportDocsDialog } = useSelector((state) => state.machineServiceReport);

  return (
    <Suspense 
      fallback={<Backdrop 
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open 
      />} >
      { securityUserDialog && <SecurityUserDialog /> }
      { customerDialog && <CustomerDialog /> }
      { contactDialog && <ContactDialog /> }
      { machineDialog && <MachineDialog /> }
      { requestDialog && <PortalRequestDialog /> }
      { addReportDocsDialog && <DialogServiceReportAddFile /> }
    </Suspense>
  );
}

export default DialogManager;