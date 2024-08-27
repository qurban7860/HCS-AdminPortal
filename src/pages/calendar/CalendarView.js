import { useLayoutEffect, useState } from 'react' 
import { useDispatch, useSelector } from 'react-redux';
import CalendarPage from './CalendarPage'
import { useAuthContext } from '../../auth/useAuthContext';
import { getEvents, setEventModel } from '../../redux/slices/event/event';
import { getActiveCustomers } from '../../redux/slices/customer/customer';
import { getActiveSPContacts } from '../../redux/slices/customer/contact';
import { getActiveSecurityUsers, getSecurityUser } from '../../redux/slices/securityUser/securityUser';

export default function CalendarView() {
    const dispatch = useDispatch();
    const { userId } = useAuthContext();
    const { activeSpContacts } = useSelector((state) => state.contact);
    const [ date, setDate ] = useState(new Date());
    const [ previousDate, setPreviousDate ] = useState(null);
    const [ defaultNotifyContacts, setDefaultNotifyContacts ] = useState([]);

    useLayoutEffect(() => {
        const fetchData = async () => {
            if (date && previousDate 
                && ((date.getFullYear() !== previousDate.getFullYear()) 
                || (date.getMonth() !== previousDate.getMonth()))
            ) {
                setPreviousDate(date);
                await dispatch(getEvents(date));
            } else if (!previousDate && date) {
                setPreviousDate(date);
                await dispatch(getEvents(date));
            }

            await Promise.all([
                dispatch(setEventModel(false)),
                dispatch(getActiveCustomers()),
                dispatch(getActiveSPContacts()),
                dispatch(getActiveSecurityUsers()),
                dispatch(getSecurityUser(userId)),
            ]);
        };
        fetchData();
    }, [dispatch, date, previousDate, userId]);

    useLayoutEffect(() => {
      const configurations = JSON.parse(localStorage.getItem('configurations'));
      const def_contacts = configurations?.find(c => c.name === 'Default_Notify_Contacts');
      const emails = def_contacts?.value?.split(',')?.map(c => c.trim().toLowerCase());
      if (emails && activeSpContacts) {
          const filteredContacts = activeSpContacts.filter(_contact => 
              emails.includes(_contact.email?.trim().toLowerCase())
          );
          setDefaultNotifyContacts(filteredContacts);
      }
    }, [ activeSpContacts ]);

    return (
        <CalendarPage 
            date={date}  
            setDate={setDate} 
            previousDate={previousDate} 
            setPreviousDate={setPreviousDate} 
            defaultNotifyContacts={defaultNotifyContacts}
        />
    );
}
