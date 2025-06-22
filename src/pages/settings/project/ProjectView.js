import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';
// redux
import {
  getProject,
} from '../../../redux/slices/support/project/project';
// components
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { Cover } from '../../../components/Defaults/Cover';
import ProjectViewForm from './ProjectViewForm';

// ----------------------------------------------------------------------

export default function ProjectView() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { project } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(getProject(id));
  }, [id, dispatch]);


  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={project?.name} isArchived={project?.isArchived} />
      </StyledCardContainer>
      <ProjectViewForm />
    </Container>
  );
}
