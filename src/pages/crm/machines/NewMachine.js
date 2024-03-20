import { Container } from '@mui/material';
import MachineAddForm from "../../machine/MachineAddForm";
import CustomerTabContainer from '../customers/util/CustomerTabContainer';

export default function MachineAdd(){
return(
    <Container maxWidth={false} >
        <CustomerTabContainer currentTabValue="machines" />
        <MachineAddForm />
    </Container>)
}