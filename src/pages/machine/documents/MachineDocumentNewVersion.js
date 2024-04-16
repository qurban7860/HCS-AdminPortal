// @mui
import { Container } from '@mui/material';
import DocumentAddForm from '../../documents/DocumentAddForm';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function MachineDocumentNewVersion() {
    return (
            <Container maxWidth={false }>
                <MachineTabContainer currentTabValue='documents' />
                <DocumentAddForm machinePage newVersion />
            </Container>
    );
}
