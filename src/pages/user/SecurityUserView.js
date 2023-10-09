import React, { useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SecurityUserViewForm from './SecurityUserViewForm'
import { getSecurityUser } from '../../redux/slices/securityUser/securityUser';

const SecurityUserView = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  useLayoutEffect(() => {
    if (id) {

      dispatch(getSecurityUser(id));

    }
  },[dispatch, id]);

  return (
    <SecurityUserViewForm />
  )
}

export default SecurityUserView