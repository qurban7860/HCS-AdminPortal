import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// redux
import { useSettingsContext } from '../../../components/settings';
import SupplierViewForm from './SupplierViewForm';
/* eslint-disable */
import SupplierEditForm from './SupplierEditForm';
import { Cover } from '../../../components/Defaults/Cover';
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
          <Cover name={supplier?.name} setting/>
        </StyledCardContainer>
        <SupplierViewForm />
      </Container>
    </>
  );
}
