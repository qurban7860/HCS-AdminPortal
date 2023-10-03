import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// slice
import { getCustomerMachines, ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setMachineDialog,
  setMachineMoveFormVisibility } from '../../../redux/slices/products/machine';
// components
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
  return (<>
    { !machineMoveFormVisibility && <MachineList /> }
    { machineMoveFormVisibility && <MoveMachineForm/> }
    </>)
}

