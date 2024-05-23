import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
//
import { useState, useRef, useEffect } from 'react';
// @mui
import { Card, Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';

import {
  getEvents,
  resetEvents,
  createEvent,
  updateEventDate,
  updateEventDateLocal,
  updateEvent,
  deleteEvent,
  selectRange,
  setEventModel,
  getEvent,
  resetEvent,
  setSelectedEvent
} from '../../redux/slices/event/event';
import { getActiveCustomers } from '../../redux/slices/customer/customer';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import { useDateRangePicker } from '../../components/date-range-picker';
// sections
import {
  StyledCalendar,
  CalendarToolbar,
} from '.';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import EventDialog from '../../components/Dialog/EventDialog';

// ----------------------------------------------------------------------

export default function CalendarPage() {
  
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const isDesktop = useResponsive('up', 'sm');

  const calendarRef = useRef(null);
  const { events, selectedEvent, eventModel, selectedRange } = useSelector((state) => state.event );
  const { activeCustomers } = useSelector((state) => state.customer);
  const userCustomer = localStorage.getItem('customer')

  const [data, setData] = useState([]);
  const [previousDate, setPreviousDate] = useState(null);
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() =>{
    if(userCustomer && Array.isArray(activeCustomers) && activeCustomers.length > 0 ){
      setIsCustomerSelected(true);
      const filteredCustomer = activeCustomers?.find(c => c?._id === userCustomer )
      setSelectedCustomer(filteredCustomer)
    }
  },[ userCustomer, activeCustomers ])

  const handleSelectEvent = async (_event) => {
    await dispatch(setSelectedEvent(_event.event));
    await dispatch(setEventModel(true));
  };

  const picker = useDateRangePicker(null, null);
  const [date, setDate] = useState(new Date());
  const [openFilter, setOpenFilter] = useState(false);
  const [filterEventColor, setFilterEventColor] = useState([]);
  const [view, setView] = useState(isDesktop ? 'dayGridMonth' : 'listWeek');

  useEffect(() => {
    if (Array.isArray(events) && events.length > 0) {
      const formattedData = events.map((v) => ({
        id: v?._id,
        title: v?.customer?.name,
        date: v?.start,
        textColor: "#1890FF",
        extendedProps: {
          ...v
        }
      }));
      setData(formattedData);
    }
  }, [events]);

  useEffect(() => {
    dispatch(resetEvents());
    dispatch(getActiveCustomers());
  }, [dispatch]);

  useEffect(() => {
    if( isCustomerSelected && date && !eventModel ){
        setPreviousDate(date);
        dispatch(getEvents(date, selectedCustomer?._id ));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, date, selectedCustomer ]);

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
        const monthFirstDate = new Date(date.getFullYear(), date.getMonth(), 1)
        calendarApi.gotoDate(date);
      }
      calendarApi.changeView(newView);
      setView(newView);
    }
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

  const handleDropEvent = async ({ event }) => {
    try {
      const newDate = new Date(event?._instance?.range?.start); 

      const startDateTime = new Date(event?._def?.extendedProps?.start)
      const endDateTime = new Date(event?._def?.extendedProps?.end)
      const modifiedStartDateTime = new Date(newDate);
      const modifiedEndDateTime = new Date(newDate);

      modifiedStartDateTime.setHours(startDateTime.getHours(), startDateTime.getMinutes());
      modifiedEndDateTime.setHours(endDateTime.getHours(), endDateTime.getMinutes());
      setData(prevData => {
        const updatedData = prevData.map(e => {
            if (e?.id === event.id) {
                return { 
                    ...e, 
                    date: modifiedStartDateTime,
                    extendedProps: {
                      ...e.extendedProps,
                      start: modifiedStartDateTime,
                      end: modifiedEndDateTime
                  }
                };
            }
            return e;
        });
        return updatedData;
    });
      
      dispatch(updateEventDate(event.id,  modifiedStartDateTime, modifiedEndDateTime ));
    } catch (error) {
      enqueueSnackbar('Event Date Update Failed!', { variant: `error` });
      dispatch(getEvents(date));
    }
  };

  const handleCreateUpdateEvent = async (newEvent) => {
    if (newEvent?._id) {
      try{
        await dispatch(updateEvent(newEvent?._id, newEvent));
        await dispatch(setEventModel(false));
        enqueueSnackbar('Event Updated Successfully!');
      } catch(e){
        enqueueSnackbar('Event Update Failed!');
      }
    } else {
      try{
        await dispatch(createEvent(newEvent));
        await dispatch(setEventModel(false));
        enqueueSnackbar('Event Created Successfully!');
      } catch(e){
      enqueueSnackbar('Event Create Failed!');
      }
    }
  };

  const handleDeleteEvent = async () => {
    try {
      if (selectedEvent && selectedEvent?.extendedProps?._id) {
        await setData(prevData => prevData.filter(e =>  e?.id !== selectedEvent?.extendedProps?._id) );
        await dispatch(setEventModel(false));
        await dispatch(deleteEvent(selectedEvent?.extendedProps?._id));
      }
      enqueueSnackbar('Event Deleted Successfully!');
    } catch (error) {
      enqueueSnackbar('Event Delete Failed!', { variant: 'error'});
      dispatch(getEvents(date));
    }
  };

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
              events={data}
              initialEvents={data}
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