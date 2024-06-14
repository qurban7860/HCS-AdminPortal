import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
// @mui
import { Card, Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';

import {
 getEvents,
 createEvent,
 updateEventDate,
 updateEvent,
 deleteEvent,
 selectRange,
 setEventModel,
 setSelectedEvent
} from '../../redux/slices/event/event';
import { getActiveCustomers } from '../../redux/slices/customer/customer';
import { getActiveSPContacts } from '../../redux/slices/customer/contact';
import { getSecurityUser } from '../../redux/slices/securityUser/securityUser';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import { useDateRangePicker } from '../../components/date-range-picker';
// sections
import { StyledCalendar, CalendarToolbar } from '.';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import EventDialog from '../../components/Dialog/EventDialog';
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function CalendarPage() {
  
  const { enqueueSnackbar } = useSnackbar();
  const { userId } = useAuthContext();
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const isDesktop = useResponsive('up', 'sm');
  const calendarRef = useRef(null);
  const picker = useDateRangePicker(null, null);

  const { events, selectedEvent, eventModel, selectedRange } = useSelector((state) => state.event );
  const { activeCustomers } = useSelector((state) => state.customer);
  const { activeSpContacts } = useSelector((state) => state.contact);
  const { securityUser } = useSelector((state) => state.user);

  const [ previousDate, setPreviousDate ] = useState(null);
  const [ selectedCustomer, setSelectedCustomer ] = useState(null);
  const [ selectedContact, setSelectedContact ] = useState(null);
  const [ date, setDate ] = useState(new Date());
  const [ openFilter, setOpenFilter ] = useState(false);
  const [ filterEventColor, setFilterEventColor ] = useState([]);
  const [ view, setView ] = useState(isDesktop ? 'dayGridMonth' : 'listWeek');

  useLayoutEffect(() => {
    dispatch(setEventModel(false));
    dispatch(getActiveCustomers());
    dispatch(getActiveSPContacts());
    dispatch(getSecurityUser(userId))
  }, [dispatch, userId]);

  useLayoutEffect(()=>{
    setSelectedContact(securityUser?.contact)
  },[securityUser])

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, date,]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);

  const handleChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      if (newView === 'listMonth') {
        calendarApi.gotoDate(date);
      }
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleSelectEvent = async (_event) => {
    await dispatch(setSelectedEvent(_event.event));
    await dispatch(setEventModel(true));
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectDate = (arg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    dispatch(
      selectRange({
        start: arg.start,
        end: arg.end,
      })
    );
  };

  const handleResizeEvent = async ({ event }) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropEvent = async ({event}) => {
    try {

      const startDateTime = new Date(event.start)
      const endDateTime = new Date(event?.end)
      const modifiedStartDateTime = new Date(startDateTime);
      const modifiedEndDateTime = new Date(endDateTime);

      modifiedStartDateTime.setHours(startDateTime.getHours(), startDateTime.getMinutes());
      modifiedEndDateTime.setHours(endDateTime.getHours(), endDateTime.getMinutes());
      
      dispatch(updateEventDate(event.id,  modifiedStartDateTime, modifiedEndDateTime ));
    } catch (error) {
      enqueueSnackbar('Event Date Update Failed!', { variant: `error` });
      dispatch(getEvents(date, selectedCustomer?._id, selectedContact?._id ));
    }
  };

  const handleCreateUpdateEvent = (newEvent) => {

    try{
        if(newEvent?._id){
          dispatch(updateEvent(newEvent?._id, newEvent));
          enqueueSnackbar('Event Updated Successfully!');
        } else {
          dispatch(createEvent(newEvent));
          enqueueSnackbar('Event Created Successfully!');
        }
        dispatch(setEventModel(false));
      } catch(e){
        enqueueSnackbar('Event Update Failed!');
      }
  };

  const handleDeleteEvent = async () => {
    try {
      if (selectedEvent && selectedEvent?.extendedProps?._id) {
        await dispatch(setEventModel(false));
        await dispatch(deleteEvent(selectedEvent?.extendedProps?._id));
        // await dispatch(getEvents(date, selectedCustomer?._id, selectedContact?._id ));
      }
      enqueueSnackbar('Event Deleted Successfully!');
    } catch (error) {
      enqueueSnackbar('Event Delete Failed!', { variant: 'error'});
      dispatch(getEvents(date, selectedCustomer?._id, selectedContact?._id ));
    }
  };

  const dataFiltered = applyFilter({
    inputData: events,
    selectedCustomer,
    selectedContact
  });
  
  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
            <Cover name="Calendar Events" />
        </StyledCardContainer>
        <Card>
          <StyledCalendar>
            <CalendarToolbar
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              selectedContact={selectedContact}
              setSelectedContact={setSelectedContact}
              date={date}
              view={view}
              onNextDate={handleClickDateNext}
              onPrevDate={handleClickDatePrev}
              onChangeView={handleChangeView}
            />
            <FullCalendar
              weekends
              editable
              droppable
              selectable
              allDayMaintainDuration
              eventResizableFromStart
              events={dataFiltered}
              initialEvents={dataFiltered}
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              headerToolbar={false}
              select={handleSelectDate}
              eventDrop={handleDropEvent}
              eventClick={handleSelectEvent}
              eventResize={handleResizeEvent}
              height={isDesktop ? 720 : 'auto'}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
              }}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
          </StyledCalendar>
        </Card>
      </Container>

      <EventDialog
        date={date}
        range={selectedRange}
        onCreateUpdateEvent={handleCreateUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />

    </>
  );
}

function applyFilter({ inputData, selectedCustomer, selectedContact }) {

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  inputData = stabilizedThis.map((el) => el[0]);
  if(selectedCustomer){
    inputData = inputData.filter((e) => e?.extendedProps?.customer?._id === selectedCustomer?._id);
  }
  if (selectedContact) {
    inputData = inputData.filter(
      (e) =>
        e?.extendedProps?.primaryTechnician?._id === selectedContact?._id ||
        e?.extendedProps?.supportingTechnicians?.some((c) => c?._id === selectedContact?._id) ||
        e?.extendedProps?.notifyContacts?.some((c) => c?._id === selectedContact?._id)
    );
  }
  

  return inputData;
}