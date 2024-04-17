import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch } from '../../redux/store';
import { getMachine } from '../../redux/slices/products/machine';
// sections
import MachineEditForm from './MachineEditForm';
import MachineTabContainer from './util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function MachineView( ) {
    const { machineId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        if (machineId ) {
            dispatch(getMachine(machineId));
        }
    }, [dispatch, machineId]);

    return (
        <Container maxWidth={false} sx={{mb:3}}>
            <MachineTabContainer currentTabValue="machine" />
            <MachineEditForm />
        </Container>
    );
}
