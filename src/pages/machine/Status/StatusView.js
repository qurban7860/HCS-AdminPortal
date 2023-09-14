import PropTypes from 'prop-types';
import { useEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// redux
// import { setMachinestatusesEditFormVisibility } from '../../../redux/slices/products/statuses';
// components
// import { useSettingsContext } from '../../../components/settings';
// sections
import StatusViewForm from './StatusViewForm';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
// import StatusEditForm from './StatusEditForm';

StatusView.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function StatusView({ editPage }) {
  // const dispatch = useDispatch();

  const { machinestatusEditFormFlag } = useSelector((state) => state.machinestatus);

  // const [editFlag, setEditFlag] = useState(false);
  // const toggleEditFlag = () => setEditFlag((value) => !value);

  // const [currentComponent, setCurrentComponent] = useState(<StatusViewForm />);

  // const [machinestatusFlag, setMachinestatusFlag] = useState(true);
  const { machinestatus } = useSelector((state) => state.machinestatus);

  // useLayoutEffect(() => {
  //   dispatch(setMachinestatusesEditFormVisibility(editFlag));
  // }, [dispatch, editFlag]);

  useEffect(() => {
    if (machinestatusEditFormFlag) {
      // setCurrentComponent(<StatusEditForm />);
    } else {
      // setMachinestatusFlag(false);
      // setCurrentComponent(<StatusViewForm />);
    }
  }, [editPage, machinestatusEditFormFlag, machinestatus]);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={machinestatus?.name}
          setting="enable"
          backLink={PATH_MACHINE.machines.settings.status.list}
        />
      </StyledCardContainer>
      <StatusViewForm />
    </Container>
  );
}
