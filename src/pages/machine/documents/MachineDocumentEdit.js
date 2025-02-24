// @mui
import { Container } from '@mui/material';
import DocumentEditForm from '../../documents/DocumentEditForm';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function MachineDocumentEdit() {
    return (
        <Container maxWidth={false }>
            <MachineTabContainer currentTabValue='documents' />
                <DocumentEditForm machinePage />
            </Container>
    );
}
