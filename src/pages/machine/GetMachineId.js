import { useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// redux
import { useDispatch } from '../../redux/store';
import { getMachineID } from '../../redux/slices/products/machine';
import { PATH_MACHINE, PATH_PAGE } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function GetMachineId() {

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
          navigate(PATH_PAGE.machineNotFound)
        });
    }
  }, [dispatch, navigate, serialNo, ref]);

  return null;
}
