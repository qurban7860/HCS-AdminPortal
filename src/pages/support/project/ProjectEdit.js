import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';
// redux
import {
  getProject,
  resetProject
} from '../../../redux/slices/support/project/project';
// paths
import { PATH_SUPPORT } from '../../../routes/paths';
// components
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { Cover } from '../../../components/Defaults/Cover';
import ProjectEditForm from './ProjectEditForm';

// ----------------------------------------------------------------------

export default function ProjectEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { project } = useSelector((state) => state.project);

  useLayoutEffect(() => {
    dispatch(getProject(id));

    return () => {
      dispatch(resetProject());
    };
  
  }, [id, dispatch]);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={project?.name} isArchived={project?.isArchived} />
      </StyledCardContainer>
      <ProjectEditForm />
    </Container>
  );
}
