import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../redux/store';
// COMPONENTS
import { setAllVisibilityFalse } from '../../redux/slices/products/historicalConfiguration';
import HistoricalConfigurationsViewForm from './historicalConfigurations/HistoricalConfigurationsViewForm';
import HistoricalConfigurationsAddForm from './historicalConfigurations/HistoricalConfigurationsAddForm';
import HistoricalConfigurationsList from './historicalConfigurations/HistoricalConfigurationsList';
import HistoricalConfigurationsCompareViewForm from './historicalConfigurations/HistoricalConfigurationsCompareViewForm';


// ----------------------------------------------------------------------

export default function HistoricalConfigurations() {

  const { historicalConfigurationViewFormFlag, historicalConfigurationAddFormFlag, historicalConfigurationCompareViewFormFlag } = useSelector((state) => state.historicalConfiguration);
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setAllVisibilityFalse());
  },[dispatch, machine])

  return (
    <>
      { !historicalConfigurationViewFormFlag && !historicalConfigurationAddFormFlag && !historicalConfigurationCompareViewFormFlag && <HistoricalConfigurationsList />}
      { historicalConfigurationViewFormFlag && !historicalConfigurationAddFormFlag && !historicalConfigurationCompareViewFormFlag && <HistoricalConfigurationsViewForm />}
      { !historicalConfigurationViewFormFlag && historicalConfigurationAddFormFlag && !historicalConfigurationCompareViewFormFlag && <HistoricalConfigurationsAddForm />}
      { !historicalConfigurationViewFormFlag && !historicalConfigurationAddFormFlag && historicalConfigurationCompareViewFormFlag && <HistoricalConfigurationsCompareViewForm />}
    </>
  );
}

