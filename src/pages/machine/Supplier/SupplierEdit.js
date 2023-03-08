import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { getSupplier } from 'src/redux/slices/supplier';
import SupplierEditForm from './SupplierEditForm';
// redux
import { useDispatch,useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from 'src/routes/paths';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from 'src/components/settings';
// sections



// ----------------------------------------------------------------------

export default function SupplierEdit() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams(); 
  console.log(id);


  const { supplier } = useSelector((state) => state.supplier);

  useLayoutEffect(() => {
    dispatch(getSupplier(id));
  }, [dispatch, id]);

  
  return (
    <>
      <Helmet>
        <title> Supplier: Edit Page | Machine ERP</title>
      </Helmet>
      

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Supplier"
          links={[
            { name: 'Dashboard', href: PATH_MACHINE.root },
            {
              name: 'Supplier',
              href: PATH_MACHINE.supplier.list,
            },
            { name: supplier?.name },
          ]}
        />

        <SupplierEditForm/>
      </Container>
    </>
  );
}
