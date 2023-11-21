import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../redux/store';
// COMPONENTS
import { setHistoricalConfigurationViewFormVisibility } from '../../redux/slices/products/historicalConfiguration';
import HistoricalConfigurationsViewForm from './Historical Configurations/HistoricalConfigurationsViewForm';
import HistoricalConfigurationsList from './Historical Configurations/HistoricalConfigurationsList';


// ----------------------------------------------------------------------

export default function HistoricalConfigurations() {

  const { historicalConfigurationViewFormFlag } = useSelector((state) => state.historicalConfiguration);
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setHistoricalConfigurationViewFormVisibility(false));
  },[dispatch, machine])

  return (
    <>
      { !historicalConfigurationViewFormFlag && <HistoricalConfigurationsList />}
      { historicalConfigurationViewFormFlag  && <HistoricalConfigurationsViewForm />}
    </>
  );
}

