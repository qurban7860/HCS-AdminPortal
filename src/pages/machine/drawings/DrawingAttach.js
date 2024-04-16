// @mui
import { Container } from '@mui/material';
import DrawingAttachForm from './DrawingAttachForm';
// routes
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function DrawingAttach() {
    return (
            <Container maxWidth={false }>
                <MachineTabContainer currentTabValue='drawings' />
                <DrawingAttachForm/>
            </Container>
    );
}
