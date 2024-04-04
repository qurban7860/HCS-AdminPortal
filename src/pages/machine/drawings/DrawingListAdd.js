// @mui
import { Container } from '@mui/material';
import DocumentListAddForm from '../../document/documents/DocumentListAddForm';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function DrawingListAdd() {
    return (
            <Container maxWidth={false }>
                <MachineTabContainer currentTabValue='drawings' />
                <DocumentListAddForm machinePage />
            </Container>
    );
}
