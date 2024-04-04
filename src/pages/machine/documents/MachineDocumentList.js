// @mui
import { Container } from '@mui/material';
import DocumentList from '../../document/documents/DocumentList';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function MachineDocumentList() {
    return (
            <Container maxWidth={false }>
                <MachineTabContainer currentTabValue='documents' />
                <DocumentList machinePage />
            </Container>
    );
}
