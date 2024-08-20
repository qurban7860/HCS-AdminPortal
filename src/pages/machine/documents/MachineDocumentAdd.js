import { Container } from '@mui/material';
import DocumentAddForm from '../../documents/DocumentAddForm';
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
