// @mui
import { Container } from '@mui/material';
import DocumentList from '../../document/documents/DocumentList';
// 
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
