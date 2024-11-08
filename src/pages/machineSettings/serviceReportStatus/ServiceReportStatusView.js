import {  useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
// sections
import ServiceReportStatusViewForm from './ServiceReportStatusViewForm';
import { getServiceReportStatus, resetServiceReportStatus } from '../../../redux/slices/products/serviceReportStatuses';

// ----------------------------------------------------------------------

export default function ServiceReportStatusView() {
  const { id } = useParams()
  const dispatch = useDispatch()

  useLayoutEffect(()=>{
    if(id){
      dispatch(getServiceReportStatus(id))
    }
    return () => {
      dispatch(resetServiceReportStatus())
    }
  },[dispatch, id ])

  return (
    <Container maxWidth={false}>
      <ServiceReportStatusViewForm />
    </Container>
  );
}
