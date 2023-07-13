import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// @mui
import { Tab, Card, Tabs, Container, Box, Button, Grid, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// redux

import { getDocumentCategory } from '../../../redux/slices/document/documentCategory';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components

import Iconify from '../../../components/iconify/Iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import { Cover } from '../../components/Defaults/Cover';
import DocumentCategoryViewForm from './DocumentCategoryViewForm';
/* eslint-disable */

// ----------------------------------------------------------------------

export default function DocumentCategoryView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getDocumentCategory(id));
  }, [id, dispatch]);

  const { documentCategory } = useSelector((state) => state.documentCategory);
  // console.log("documentCategory : ",documentCategory)
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
          <Cover
            name={documentCategory?.name}
            generalSettings
            backLink={PATH_SETTING.documentCategory.list}
          />
        </Card>
        <DocumentCategoryViewForm />
      </Container>
    </>
  );
}
