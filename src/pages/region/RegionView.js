import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Card, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_SETTING } from '../../routes/paths';
// redux
import { getRegion } from '../../redux/slices/region/region';
// sections
import { Cover } from '../components/Defaults/Cover';
import RegionViewForm from './RegionViewForm';
/* eslint-disable */

// ----------------------------------------------------------------------

export default function RegionView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getRegion(id));
  }, [id, dispatch]);

  const { region } = useSelector((state) => state.region );
  // console.log("role : ",role)
  return (
    <>
      <Container maxWidth={false}>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
            // mt: '24px',
          }}
        >
          <Cover name={region?.name} generalSettings="enabled" backLink={PATH_SETTING.regions.list} />
        </Card>
        <RegionViewForm />
      </Container>
    </>
  );
}
