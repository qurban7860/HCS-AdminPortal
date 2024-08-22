// @mui
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
import DocumentViewForm from '../../documents/DocumentViewForm';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function MachineDocumentView() {
    const { machine } = useSelector((state) => state.machine);
    return (
        <Container maxWidth={false }>
            <MachineTabContainer currentTabValue='documents' />
            <DocumentViewForm machinePage allowActions={ machine?.isArchived } />
        </Container>
    );
}
