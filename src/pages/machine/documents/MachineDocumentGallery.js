// @mui
import { Container } from '@mui/material';
import DocumentGallery from '../../documents/DocumentGallery';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function MachineDocumentGallery() {
    return (
        <Container maxWidth={false }>
            <MachineTabContainer currentTabValue='documents' />
                <DocumentGallery machinePage />
            </Container>
    );
}
