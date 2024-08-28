import PropTypes from 'prop-types';
import { useState, useMemo, memo } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
// @mui
import { Card, Container} from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getEvents, updateEventDate, updateEvent, selectRange, setEventModel, setSelectedEvent } from '../../redux/slices/event/event';
// components
import { useSnackbar } from '../../components/snackbar';
// sections
import { StyledCalendar, CalendarToolbar } from '.';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import EventDialog from '../../components/Dialog/EventDialog';
import { useAuthContext } from '../../auth/useAuthContext';
import EventContent from './utils/EventContent';


// ----------------------------------------------------------------------

CalendarPage.propTypes = {
  calendarRef: PropTypes.any,
  date: PropTypes.object,
  view: PropTypes.string,
  previousDate: PropTypes.object,
  selectedUser: PropTypes.object,
  selectedContact: PropTypes.object,
  setDate: PropTypes.func,
  setView: PropTypes.func,
  setPreviousDate: PropTypes.func,
  setSelectedUser: PropTypes.func,
  setSelectedContact: PropTypes.func,
  defaultNotifyContacts: PropTypes.array
};
function CalendarPage({ calendarRef, view, date, previousDate, selectedUser, selectedContact, setDate, setView, setPreviousDate, setSelectedUser, setSelectedContact, defaultNotifyContacts }) {
  
  const { enqueueSnackbar } = useSnackbar();
  const { isAllAccessAllowed, user } = useAuthContext();
  const dispatch = useDispatch();

  const { events, eventModel, selectedRange } = useSelector((state) => state.event );
  const [ selectedCustomer, setSelectedCustomer ] = useState(null);

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

  const handleSelectEvent =  (_event) => {
    dispatch(setSelectedEvent(_event.event));
    dispatch(setEventModel(true));
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
      await dispatch(
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
      await dispatch(updateEventDate(event.id,  modifiedStartDateTime, modifiedEndDateTime ));
    } catch (error) {
      enqueueSnackbar('Event Date Update Failed!', { variant: `error` });
      dispatch(getEvents(date, selectedCustomer?._id, selectedContact?._id ));
    }
  };

  const dataFiltered = useMemo(() => applyFilter({
    inputData: events || [],
    selectedCustomer,
    selectedContact,
    selectedUser,
    isAllAccessAllowed,
    user
  }), [events, selectedCustomer, selectedContact, selectedUser, isAllAccessAllowed, user]);

  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer><Cover name="Calendar Events" /></StyledCardContainer>
        <Card>
          <StyledCalendar>
            <CalendarToolbar
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              selectedContact={selectedContact}
              setSelectedContact={setSelectedContact}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
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
              height= 'auto'
              eventTimeFormat={{ hour: 'numeric', minute: '2-digit' }}
              eventContent={(info) => <EventContent info={info} />}
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
      
      { eventModel && <EventDialog
        range={selectedRange}
        contacts={defaultNotifyContacts}
      />}

    </>
  );
}

function applyFilter({ inputData, selectedCustomer, selectedContact, selectedUser, isAllAccessAllowed, user}) {

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  inputData = stabilizedThis.map((el) => el[0]);
  
  if(selectedCustomer){
    inputData = inputData.filter((e) => e?.extendedProps?.customer?._id === selectedCustomer?._id);
  }

  if(selectedUser){
    inputData = inputData.filter((e) => e?.extendedProps?.createdBy?._id === selectedUser?._id);
  } 
  
  if (selectedContact) {
    inputData = inputData.filter(
      (e) =>
        e?.extendedProps?.primaryTechnician?._id === selectedContact?._id ||
        e?.extendedProps?.supportingTechnicians?.some((c) => c?._id === selectedContact?._id)
    );
  }
  return inputData;
}

export default  memo(CalendarPage);