import { Container } from '@mui/material';
import MachineAddForm from "./MachineAddForm";
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';

export default function MachineAdd(){
return(
    <Container maxWidth={false} >
        <StyledCardContainer>
            <Cover name="New Machine" setting />
        </StyledCardContainer>
        <MachineAddForm />
    </Container>)
}