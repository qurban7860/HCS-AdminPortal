// @mui
import { Container } from '@mui/material';
import DrawingAddForm from './DrawingAddForm';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function ModelEdit() {
    return (
            <Container maxWidth={false }>
                <MachineTabContainer currentTabValue='drawings' />
                <DrawingAddForm/>
            </Container>
    );
}
