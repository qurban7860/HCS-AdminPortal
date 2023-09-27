import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// slice
import { getSettings, resetSettings, setSettingFormVisibility, 
          setSettingEditFormVisibility, setSettingViewFormVisibility 
        } from '../../../redux/slices/products/machineSetting';
// components
import SettingList from './SettingList'
import SettingAddForm from './SettingAddForm'
import SettingEditForm from './SettingEditForm'
import SettingViewForm from './SettingViewForm';

export default function MachineSetting() {

    const dispatch = useDispatch();
    const { settingFormVisibility, settingEditFormVisibility, settingViewFormVisibility } = useSelector((state) => state.machineSetting);
    const { machine } = useSelector((state) => state.machine);

    useEffect(()=>{
        dispatch(setSettingFormVisibility(false))
        dispatch(setSettingEditFormVisibility(false));
        dispatch(setSettingViewFormVisibility(false));
        dispatch(resetSettings());
        dispatch(getSettings(machine?._id));
    },[dispatch, machine])

  return (<>
    { !settingFormVisibility && !settingEditFormVisibility && !settingViewFormVisibility && <SettingList /> }
    { settingFormVisibility && !settingEditFormVisibility && !settingViewFormVisibility && <SettingAddForm/> }
    { !settingFormVisibility && settingEditFormVisibility && !settingViewFormVisibility && <SettingEditForm/> }
    { !settingFormVisibility && !settingEditFormVisibility && settingViewFormVisibility && <SettingViewForm /> }
    </>)
}

