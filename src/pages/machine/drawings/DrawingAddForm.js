// @mui
import { Container } from '@mui/material';
import DocumentAddForm from '../../documents/DocumentAddForm';
// routes
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function DrawingAttach() {
    return (
            <Container maxWidth={false }>
                <MachineTabContainer currentTabValue='drawings' />
                <DocumentAddForm drawingPage />
            </Container>
    );
}
