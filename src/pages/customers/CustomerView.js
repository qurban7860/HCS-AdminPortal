import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Tab, Container, Box, tabsClasses } from '@mui/material';
import TabContainer from '../../components/Tabs/TabContainer';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCustomer } from '../../redux/slices/customer/customer';
// components
import UnderDevelopment from '../boundaries/UnderDevelopment';
// sections
import CustomerViewForm from './CustomerViewForm';
import CustomerTabContainer from './util/CustomerTabContainer';

// ----------------------------------------------------------------------

export default function CustomerView() {

  const { customerId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCustomer(customerId))
  },[ dispatch, customerId ])

  return (
    <Container maxWidth={false}>
      <CustomerTabContainer currentTabValue="customer" />
      <CustomerViewForm />
    </Container>
  );
}
