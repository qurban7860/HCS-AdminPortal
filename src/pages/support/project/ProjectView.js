import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';
// redux
import {
  getProject,
} from '../../../redux/slices/support/supportSettings/Project';
// paths
import { PATH_SUPPORT } from '../../../routes/paths';
// components
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { Cover } from '../../../components/Defaults/Cover';
import ProjectViewForm from './ProjectViewForm';

// ----------------------------------------------------------------------

export default function ProjectView() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { Project } = useSelector((state) => state.Project);

  useEffect(() => {
    dispatch(getProject(id));
  }, [id, dispatch]);


  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={Project?.name} isArchived={Project?.isArchived} />
      </StyledCardContainer>
      <ProjectViewForm />
    </Container>
  );
}
