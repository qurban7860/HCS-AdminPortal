import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as  useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// redux

// import {
//   getSuppliers,
//   getSupplier,
//   setSupplierEditFormVisibility,
// } from '../../../redux/slices/products/supplier';
// auth
// import { useAuthContext } from '../../../auth/useAuthContext';
// components

// import Iconify from '../../../components/iconify/Iconify';
// import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
// import SupplierList from './SupplierList';
import SupplierViewForm from './SupplierViewForm';
/* eslint-disable */
import SupplierEditForm from './SupplierEditForm';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

SupplierView.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function SupplierView({ editPage }) {
  const dispatch = useDispatch();

  const { id } = useParams();

  const { themeStretch } = useSettingsContext();

  const { supplierEditFormFlag } = useSelector((state) => state.supplier);

  const { supplierEditFormVisibility } = useSelector((state) => state.supplier);

  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag((value) => !value);

  const [currentComponent, setCurrentComponent] = useState(<SupplierViewForm />);

  const [supplierFlag, setSupplierFlag] = useState(true);
  const { supplier } = useSelector((state) => state.supplier);

  // useLayoutEffect(() => {
  //   dispatch(setSupplierEditFormVisibility(editFlag));
  // }, [dispatch, editFlag]);

  useEffect(() => {
    if (supplierEditFormFlag) {
      setCurrentComponent(<SupplierEditForm />);
    } else {
      setSupplierFlag(false);
      setCurrentComponent(<SupplierViewForm />);
    }
  }, [editPage, supplierEditFormFlag, supplier]);
  // console.log( "muzna")
  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover
            name={supplier?.name}
            setting="enable"
            backLink={PATH_MACHINE.machines.settings.supplier.list}
          />
        </StyledCardContainer>

        <SupplierViewForm />
      </Container>
    </>
  );
}
