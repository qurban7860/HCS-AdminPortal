import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// slice
import { getLicenses, resetLicenses, setLicenseFormVisibility, 
          setLicenseEditFormVisibility, setLicenseViewFormVisibility 
        } from '../../../redux/slices/products/license';
// components
import LicenseList from './LicenseList'
import LicenseAddForm from './LicenseAddForm'
import LicenseEditForm from './LicenseEditForm'
import LicenseViewForm from './LicenseViewForm';


export default function MachineLicenses() {

    const dispatch = useDispatch();
    const { licenseFormVisibility, licenseEditFormVisibility, licenseViewFormVisibility } = useSelector((state) => state.license );
    const { machine } = useSelector((state) => state.machine);

    useEffect(()=>{
        dispatch(setLicenseFormVisibility(false))
        dispatch(setLicenseEditFormVisibility(false));
        dispatch(setLicenseViewFormVisibility(false));
        dispatch(resetLicenses());
        dispatch(getLicenses(machine?._id));
    },[dispatch, machine])

  return (<>
    { !licenseFormVisibility && !licenseEditFormVisibility && !licenseViewFormVisibility && <LicenseList /> }
    { licenseFormVisibility && !licenseEditFormVisibility && !licenseViewFormVisibility && <LicenseAddForm/> }
    { !licenseFormVisibility && licenseEditFormVisibility && !licenseViewFormVisibility && <LicenseEditForm/> }
    { !licenseFormVisibility && !licenseEditFormVisibility && licenseViewFormVisibility && <LicenseViewForm /> }
    </>)
}

