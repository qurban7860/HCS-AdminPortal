import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// slice
import { getToolsInstalled, resetToolsInstalled, setToolInstalledFormVisibility, 
          setToolInstalledEditFormVisibility, setToolInstalledViewFormVisibility 
        } from '../../../redux/slices/products/toolInstalled';
// components
import ToolInstalledList from './ToolInstalledList'
import ToolInstalledAddForm from './ToolInstalledAddForm'
import ToolInstalledEditForm from './ToolInstalledEditForm'
import ToolInstalledViewForm from './ToolInstalledViewForm';


export default function MachineToolInstalled() {

    const dispatch = useDispatch();
    const { toolInstalledFormVisibility, toolInstalledEditFormVisibility, toolInstalledViewFormVisibility } = useSelector((state) => state.toolInstalled );
    const { machine } = useSelector((state) => state.machine);

    useEffect(()=>{
        dispatch(setToolInstalledFormVisibility(false))
        dispatch(setToolInstalledEditFormVisibility(false));
        dispatch(setToolInstalledViewFormVisibility(false));
        dispatch(resetToolsInstalled());
        dispatch(getToolsInstalled(machine?._id));
    },[dispatch, machine])

  return (<>
    { !toolInstalledFormVisibility && !toolInstalledEditFormVisibility && !toolInstalledViewFormVisibility && <ToolInstalledList /> }
    { toolInstalledFormVisibility && !toolInstalledEditFormVisibility && !toolInstalledViewFormVisibility && <ToolInstalledAddForm/> }
    { !toolInstalledFormVisibility && toolInstalledEditFormVisibility && !toolInstalledViewFormVisibility && <ToolInstalledEditForm/> }
    { !toolInstalledFormVisibility && !toolInstalledEditFormVisibility && toolInstalledViewFormVisibility && <ToolInstalledViewForm /> }
    </>)
}

