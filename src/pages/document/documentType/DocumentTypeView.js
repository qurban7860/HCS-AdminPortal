import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// @mui
import { Tab, Card, Tabs, Container, Box, Button, Grid, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_MACHINE, PATH_SETTING } from '../../../routes/paths';
// redux

import { getDocumentType } from '../../../redux/slices/document/documentType';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components

import Iconify from '../../../components/iconify/Iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import { Cover } from '../../components/Defaults/Cover';
import DocumentTypeViewForm from './DocumentTypeViewForm';
/* eslint-disable */

// ----------------------------------------------------------------------

export default function DocumentTypeView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getDocumentType(id));
  }, [id, dispatch]);

  const { documentType } = useSelector((state) => state.documentType);
  // console.log("documentType : ",documentType)
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
            name={documentType?.name}
            generalSettings
            backLink={PATH_SETTING.documentType.list}
          />
        </Card>

        <DocumentTypeViewForm />
      </Container>
    </>
  );
}
