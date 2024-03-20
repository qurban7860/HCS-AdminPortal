import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// slice
import { getProfiles, resetProfiles, setProfileFormVisibility, 
          setProfileEditFormVisibility, setProfileViewFormVisibility 
        } from '../../../redux/slices/products/profile';
// components
import ProfileList from './ProfileList'
import ProfileAddForm from './ProfileAddForm'
import ProfileEditForm from './ProfileEditForm'
import ProfileViewForm from './ProfileViewForm';


export default function MachineProfiles() {

    const dispatch = useDispatch();
    const { profileFormVisibility, profileEditFormVisibility, profileViewFormVisibility } = useSelector((state) => state.profile );
    const { machine } = useSelector((state) => state.machine);

    useEffect(()=>{
        dispatch(setProfileFormVisibility(false))
        dispatch(setProfileEditFormVisibility(false));
        dispatch(setProfileViewFormVisibility(false));
        dispatch(resetProfiles());
        dispatch(getProfiles(machine?._id));
    },[dispatch, machine])

  return (<>
    { !profileFormVisibility && !profileEditFormVisibility && !profileViewFormVisibility && <ProfileList /> }
    { profileFormVisibility && !profileEditFormVisibility && !profileViewFormVisibility && <ProfileAddForm/> }
    { !profileFormVisibility && profileEditFormVisibility && !profileViewFormVisibility && <ProfileEditForm/> }
    { !profileFormVisibility && !profileEditFormVisibility && profileViewFormVisibility && <ProfileViewForm /> }
    </>)
}

