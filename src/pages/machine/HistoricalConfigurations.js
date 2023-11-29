import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../redux/store';
// COMPONENTS
import { setHistoricalConfigurationViewFormVisibility } from '../../redux/slices/products/historicalConfiguration';
import HistoricalConfigurationsViewForm from './Historical Configurations/HistoricalConfigurationsViewForm';
import HistoricalConfigurationsAddForm from './Historical Configurations/HistoricalConfigurationsAddForm';
import HistoricalConfigurationsList from './Historical Configurations/HistoricalConfigurationsList';


// ----------------------------------------------------------------------

export default function HistoricalConfigurations() {

  const { historicalConfigurationViewFormFlag, historicalConfigurationAddFormFlag } = useSelector((state) => state.historicalConfiguration);
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setHistoricalConfigurationViewFormVisibility(false));
  },[dispatch, machine])

  return (
    <>
      { !historicalConfigurationViewFormFlag && !historicalConfigurationAddFormFlag && <HistoricalConfigurationsList />}
      { historicalConfigurationViewFormFlag && !historicalConfigurationAddFormFlag && <HistoricalConfigurationsViewForm />}
      { !historicalConfigurationViewFormFlag && historicalConfigurationAddFormFlag && <HistoricalConfigurationsAddForm />}
    </>
  );
}

