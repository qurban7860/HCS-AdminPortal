import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// slice
// components
import CustomerViewForm from './CustomerViewForm'
import CustomerEditForm from './CustomerEditForm'
import { setCustomerEditFormVisibility } from '../../redux/slices/customer/customer';

export default function CustomerView() {

    const dispatch = useDispatch();
    const { customerEditFormFlag } = useSelector((state) => state.customer);

    useEffect(()=>{
        dispatch(setCustomerEditFormVisibility(false))
    },[dispatch])

  return (<>
    { customerEditFormFlag && <CustomerEditForm /> }
    { !customerEditFormFlag && <CustomerViewForm /> }
    </>)
}

