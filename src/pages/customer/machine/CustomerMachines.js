import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { getCustomerMachines, setMachineMoveFormVisibility } from '../../../redux/slices/products/machine';
import CustomerTabContainer from '../CustomerTabContainer';
import MachineList from './MachineList'
import MoveMachineForm from './MoveMachineForm'

export default function CustomerMachines() {

    const dispatch = useDispatch();

    const { customerId } = useParams() 
    const { machineMoveFormVisibility } = useSelector((state) => state.machine );

    useEffect(()=>{
        dispatch(setMachineMoveFormVisibility(false))
        if(customerId){
          dispatch(getCustomerMachines(customerId));
        }
    },[dispatch, customerId])
    
  return (<Container maxWidth={false} >
    <CustomerTabContainer currentTabValue="machines" />
    { !machineMoveFormVisibility && <MachineList /> }
    { machineMoveFormVisibility && <MoveMachineForm/> }
    </Container>)
}

