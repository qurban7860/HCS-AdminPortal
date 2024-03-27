import { useLayoutEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../redux/store';
import { getMachineID } from '../../redux/slices/products/machine';
import { PATH_MACHINE } from '../../routes/paths';
import MachineNotFoundPage from '../MachineNotFoundPage';

// ----------------------------------------------------------------------

export default function GetMachineId() {
  const [ isMachineNotExist, setIsMachineNotExist ] = useState(false);
  const { serialNo, ref } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (serialNo) {
      dispatch(getMachineID(serialNo, ref))
        .then(response => {
          if(response?.data?._id){
            navigate(PATH_MACHINE.machines.view(response?.data?._id))
          }
        })
        .catch(error => {
          console.error(error);
          setIsMachineNotExist(true);
          // navigate(PATH_PAGE.machineNotFound)
        });
    }
  }, [dispatch, navigate, serialNo, ref]);

  return isMachineNotExist ? <MachineNotFoundPage /> : null;
}
