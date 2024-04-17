// @mui
import { Container } from '@mui/material';
import DocumentListAddForm from '../../documents/DocumentListAddForm';
// 
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function DrawingListAdd() {
    return (
        <>
            <Container maxWidth={false }>
                <MachineTabContainer currentTabValue='drawings' />
            </Container>
            <DocumentListAddForm machineDrawingPage />
        </>
    );
}
