import { useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// redux
import { useDispatch } from '../../redux/store';
import { getMachineID } from '../../redux/slices/products/machine';
import { PATH_MACHINE } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function GetMachineId() {

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    console.log("getMachineId Called");
    let response 
    if (id ) {
      response = dispatch(getMachineID(id));
    }
    navigate(PATH_MACHINE.machines.view( response?._id ))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  return null;
}
