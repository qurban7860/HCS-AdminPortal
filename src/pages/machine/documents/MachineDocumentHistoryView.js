// @mui
import { Container } from '@mui/material';
import DocumentHistoryViewForm from '../../document/documents/DocumentHistoryViewForm';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function MachineDocumentHistoryView() {
    return (
        <>
            <Container maxWidth={false }>
                <MachineTabContainer currentTabValue='documents' />
                <DocumentHistoryViewForm machinePage />
            </Container>
        </>
    );
}
