// @mui
import { Container } from '@mui/material';
import DocumentAddForm from '../../document/documents/DocumentAddForm';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function MachineDocumentAdd() {
    return (
            <Container maxWidth={false }>
                <MachineTabContainer currentTabValue='documents' />
                <DocumentAddForm machinePage />
            </Container>
    );
}
