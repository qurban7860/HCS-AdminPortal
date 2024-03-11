import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { getCustomerMachines, setMachineMoveFormVisibility } from '../../../redux/slices/products/machine';
import CustomerTabContainer from '../CustomerTabContainer';
import MachineList from './MachineList'
import MoveMachineForm from './MoveMachineForm'

export default function CustomerMachines() {

    const dispatch = useDispatch();
    const { machineMoveFormVisibility } = useSelector((state) => state.machine );
    const { customer } = useSelector((state) => state.customer);

    useEffect(()=>{
        dispatch(setMachineMoveFormVisibility(false))
        if(customer?._id){
          dispatch(getCustomerMachines(customer._id));
        }
    },[dispatch, customer])
    
  return (<Container maxWidth={false} >
    <CustomerTabContainer currentTabValue="machines" />
    { !machineMoveFormVisibility && <MachineList /> }
    { machineMoveFormVisibility && <MoveMachineForm/> }
    </Container>)
}

