import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// redux

import {  setToolEditFormVisibility } from '../../../redux/slices/products/tools';
// auth
// import { useAuthContext } from '../../../auth/useAuthContext';
// components

// import Iconify from '../../../components/iconify/Iconify';
// import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections

// import ToolList from './ToolList';
import ToolViewForm from './ToolViewForm';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import ToolEditForm from './ToolEditForm';
/* eslint-disable */

ToolView.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function ToolView({ editPage }) {
  const dispatch = useDispatch();

  const { id } = useParams();

  const { themeStretch } = useSettingsContext();

  const { toolEditFormFlag } = useSelector((state) => state.tool);

  const { toolEditFormVisibility } = useSelector((state) => state.tool);

  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag((value) => !value);

  const [currentComponent, setCurrentComponent] = useState(<ToolViewForm />);

  const [toolFlag, setToolFlag] = useState(true);
  const { tool } = useSelector((state) => state.tool);
  // const tool = tools

  useLayoutEffect(() => {
    dispatch(setToolEditFormVisibility(editFlag));
  }, [dispatch, editFlag]);

  useEffect(() => {
    if (toolEditFormFlag) {
      setCurrentComponent(<ToolEditForm />);
    } else {
      setToolFlag(false);
      setCurrentComponent(<ToolViewForm />);
    }
  }, [editPage, toolEditFormFlag, tool]);
  // console.log( "muzna")
  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover
            name={tool?.name}
            setting="setting"
            backLink={PATH_MACHINE.machines.settings.tool.list}
          />
        </StyledCardContainer>

        <ToolViewForm />
      </Container>
    </>
  );
}
