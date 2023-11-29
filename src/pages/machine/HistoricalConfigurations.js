import { useEffect, memo } from 'react';
import { useDispatch, useSelector } from '../../redux/store';
// COMPONENTS
import { setAllFlagFalse } from '../../redux/slices/products/historicalConfiguration';
import HistoricalConfigurationsViewForm from './Historical Configurations/HistoricalConfigurationsViewForm';
import HistoricalConfigurationsList from './Historical Configurations/HistoricalConfigurationsList';
import HistoricalConfigurationsAddForm from './Historical Configurations/HistoricalConfigurationsAddForm';


// ----------------------------------------------------------------------

function HistoricalConfigurations() {

  const { historicalConfigurationViewFormFlag, historicalConfigurationAddFormFlag } = useSelector((state) => state.historicalConfiguration);
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setAllFlagFalse());
  },[dispatch, machine])

  return (
    <>
      { !historicalConfigurationViewFormFlag && !historicalConfigurationAddFormFlag && <HistoricalConfigurationsList />}
      { historicalConfigurationViewFormFlag && !historicalConfigurationAddFormFlag && <HistoricalConfigurationsViewForm />}
      { !historicalConfigurationViewFormFlag && historicalConfigurationAddFormFlag && <HistoricalConfigurationsAddForm />}
    </>
  );
}

export default memo(HistoricalConfigurations)
