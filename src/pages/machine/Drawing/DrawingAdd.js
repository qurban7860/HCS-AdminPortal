// @mui
import { Container } from '@mui/material';
import DrawingAddForm from './DrawingAddForm';
// routes
import { PATH_MACHINE } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function ModelEdit() {
    return (
        <>
            <Container maxWidth={false }>
                <DrawingAddForm/>
            </Container>
        </>
    );
}
