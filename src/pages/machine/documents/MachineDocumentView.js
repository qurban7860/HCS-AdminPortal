// @mui
import { Container } from '@mui/material';
import DocumentViewForm from '../../document/documents/DocumentViewForm';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function MachineDocumentView() {
    return (
        <>
            <Container maxWidth={false }>
                <MachineTabContainer currentTabValue='documents' />
                <DocumentViewForm machinePage />
            </Container>
        </>
    );
}
