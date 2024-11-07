import {  useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
// sections
import ServiceReportStatusViewForm from './ServiceReportStatusViewForm';
import { getMachineStatus} from '../../../redux/slices/products/statuses';

// ----------------------------------------------------------------------

export default function ServiceReportStatusView() {
  const { id } = useParams()
  const dispatch = useDispatch()

  useLayoutEffect(()=>{
    if(id){
      dispatch(getMachineStatus(id))
    }
  },[dispatch, id ])

  return (
    <Container maxWidth={false}>
      <StatusViewForm />
    </Container>
  );
}
