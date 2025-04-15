import { useLayoutEffect, useState, useRef, memo } from 'react' 
import { useDispatch, useSelector } from 'react-redux';
import { useAuthContext } from '../../auth/useAuthContext';
import { getEvents, setEventModel } from '../../redux/slices/event/event';
import { getActiveCustomers } from '../../redux/slices/customer/customer';
import { getActiveSPContacts } from '../../redux/slices/customer/contact';
import { getActiveSecurityUsers, getSecurityUser } from '../../redux/slices/securityUser/securityUser';
import LoadingScreen from '../../components/loading-screen';
import useResponsive from '../../hooks/useResponsive';
import CalendarPage from './CalendarPage';

function CalendarView() {
    const dispatch = useDispatch();
    const calendarRef = useRef(null);
    const isDesktop = useResponsive('up', 'sm');
    const { userId, isAllAccessAllowed } = useAuthContext();
    const { isLoadingList } = useSelector((state) => state.event );
    const { activeSpContacts } = useSelector((state) => state.contact);
    const { securityUser } = useSelector((state) => state.user);
    const [ date, setDate ] = useState(new Date());
    const [ previousDate, setPreviousDate ] = useState(null);
    const [ defaultNotifyContacts, setDefaultNotifyContacts ] = useState([]);
    const [ selectedContact, setSelectedContact ] = useState(null);
    const [ selectedUser, setSelectedUser ] = useState(null);
    const [ view, setView ] = useState('dayGridMonth');

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
        };
        fetchData();
    }, [dispatch, date, previousDate, userId]);

    useLayoutEffect(() => {
        dispatch(setEventModel(false));
        dispatch(getActiveCustomers());
        dispatch(getActiveSPContacts());
        dispatch(getActiveSecurityUsers());
        dispatch(getSecurityUser(userId));
    },[ dispatch, userId ]);
    
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

    // useLayoutEffect(()=>{
    //     if(!isAllAccessAllowed){
    //         setSelectedUser(securityUser);
    //         setSelectedContact(securityUser?.contact)
    //     }
    // },[ securityUser, isAllAccessAllowed ])
    
    
    useLayoutEffect(() => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
            calendarApi.changeView(newView);
            setView(newView);
        }
    }, [ isDesktop ]);

    if ( isLoadingList ) {
        return <LoadingScreen />;
    }

    return (
        <CalendarPage 
            calendarRef={calendarRef}
            date={date}  
            view={view}
            selectedUser={selectedUser}
            previousDate={previousDate} 
            selectedContact={selectedContact}
            setDate={setDate} 
            setView={setView}
            setPreviousDate={setPreviousDate} 
            setSelectedUser={setSelectedUser}
            setSelectedContact={setSelectedContact}
            defaultNotifyContacts={defaultNotifyContacts}
        />
    );
}

export default  memo(CalendarView)