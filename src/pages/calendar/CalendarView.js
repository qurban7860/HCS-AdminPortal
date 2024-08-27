import { useLayoutEffect, useState } from 'react' 
import { useDispatch } from 'react-redux';
import CalendarPage from './CalendarPage'
import { getEvents } from '../../redux/slices/event/event';

export default function CalandarView(){
    const dispatch = useDispatch();
    const [ date, setDate ] = useState(new Date());
    const [ previousDate, setPreviousDate ] = useState(null);

    useLayoutEffect(() => {
      if( date && previousDate 
          && (( date?.getFullYear() !== previousDate?.getFullYear()) 
          || ( Number(date?.getMonth()) !== Number(previousDate?.getMonth())))
        )
      {
        setPreviousDate(date);
        dispatch(getEvents(date));
      } else if( !previousDate && date ){
        setPreviousDate(date);
        dispatch(getEvents(date));
      }
    }, [dispatch, date, previousDate]);

  return (
    <CalendarPage date={date}  setDate={setDate} previousDate={previousDate} setPreviousDate={setPreviousDate} />
  )
}
