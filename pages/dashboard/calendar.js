import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Col, Row, Breadcrumb, Card, Button, Spinner } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { db } from '../../firebase'; // Adjust the path as necessary
import { collection, getDocs } from "firebase/firestore";

// import sub components
import { AddEditEvent } from 'sub-components';

const Calendar = () => {
  const [showEventOffcanvas, setShowEventOffcanvas] = useState(false);
  const [isEditEvent, setIsEditEvent] = useState(false);
  const [calendarApi, setCalendarApi] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCloseEventOffcanvas = () => setShowEventOffcanvas(false);

  const calendarRef = useRef(null);

  useEffect(() => {
    if (calendarRef.current && calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi());
    }
  }, [calendarApi]);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsSnapshot = await getDocs(collection(db, "jobs"));
        const jobsData = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const transformedEvents = jobsData.map(job => ({
          title: `${job.jobName} (${formatDateTime(job.startDate, job.startTime)} - ${formatDateTime(job.endDate, job.endTime)})`,
          start: `${job.startDate}T${job.startTime}`,
          end: `${job.endDate}T${job.endTime}`,
          allDay: false,
          extendedProps: {
            description: job.description,
            priority: job.jobPriority,
            status: job.jobStatus,
          }
        }));

        setEvents(transformedEvents);
      } catch (error) {
        console.error("Error fetching job data: ", error);
      } finally {
        setLoading(false); // Hide loading spinner after data is fetched
      }
    };

    fetchData();
  }, []);

  const formatDateTime = (dateStr, timeStr) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const blankEvent = {
    title: '',
    start: new Date(),
    end: new Date(),
    allDay: false,
    url: '',
    extendedProps: {
      category: '',
      location: '',
      description: ''
    }
  };

  const calendarOptions = {
    ref: calendarRef,
    events: events, // Use the events state
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth'
    },
    displayEventTime: false,
    editable: true,
    eventResizableFromStart: true,
    dayMaxEvents: 2,
    navLinks: true,
    eventClick({ event: clickedEvent }) {
      setIsEditEvent(true);
      setShowEventOffcanvas(true);
      setSelectedEvent(clickedEvent);
    },
    dateClick(info) {
      const ev = blankEvent;
      const date = new Date(info.date);
      date.setDate(date.getDate() + 1);
      ev.start = info.date;
      ev.end = date;
      setSelectedEvent(ev);
      setIsEditEvent(false);
    },
    eventClassNames({ event: calendarEvent }) {
      return [`text-white bg-${calendarEvent.extendedProps.priority}`];
    },
  };

  return (
    <Fragment>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">Calendar</h1>
              <Breadcrumb>
                <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Calendar</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div>
              <AddEditEvent
                show={showEventOffcanvas}
                setShowEventOffcanvas={setShowEventOffcanvas}
                onHide={handleCloseEventOffcanvas}
                calendarApi={calendarApi}
                isEditEvent={isEditEvent}
                selectedEvent={selectedEvent}
              />
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xl={12} lg={12} md={12} xs={12}>
          <Card>
            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <FullCalendar {...calendarOptions} />
            )}
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default Calendar;
