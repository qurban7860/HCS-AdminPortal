import PropTypes from 'prop-types';
import { useEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import {  useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// redux

// import { setTechparamEditFormVisibility } from '../../../redux/slices/products/machineTechParam';

// sections

// import ParameterList from './ParameterList';
import ParameterViewForm from './ParameterViewForm';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
// import ParameterEditForm from './ParameterEditForm';

ParameterViewPage.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function ParameterViewPage({ editPage }) {
  // const dispatch = useDispatch();

  const { techparamEditFormFlag } = useSelector((state) => state.techparam);

  // const [editFlag, setEditFlag] = useState(false);
  // const toggleEditFlag = () => setEditFlag((value) => !value);

  // const [currentComponent, setCurrentComponent] = useState(<ParameterViewForm />);

  // const [techparamFlag, setTechparamFlag] = useState(true);
  const { techparam } = useSelector((state) => state.techparam);

  // useLayoutEffect(() => {
  //   dispatch(setTechparamEditFormVisibility(editFlag));
  // }, [dispatch, editFlag]);

  useEffect(() => {
    if (techparamEditFormFlag) {
      // setCurrentComponent(<ParameterEditForm />);
    } else {
      // setTechparamFlag(false);
      // setCurrentComponent(<ParameterViewForm />);
    }
  }, [editPage, techparamEditFormFlag, techparam]);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={techparam?.name}
          setting="enable"
          backLink={PATH_MACHINE.machines.settings.parameters.list}
        />
      </StyledCardContainer>
      <ParameterViewForm />
    </Container>
  );
}
