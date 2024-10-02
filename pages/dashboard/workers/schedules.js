import { Fragment, useState, useRef, useEffect } from 'react';
import { Col, Row, Breadcrumb, Card } from 'react-bootstrap';
import { v4 as uuid } from 'uuid';
import { getFirestore, doc, setDoc, collection, getDocs } from 'firebase/firestore';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import AddEditSchedule from 'sub-components/dashboard/calendar/AddEditSchedule';
import styled from 'styled-components';

// Function to save event in Firestore
const saveEventToFirestore = async (eventData) => {
  const db = getFirestore();
  const eventRef = doc(db, 'events', eventData.id);
  await setDoc(eventRef, eventData);
};

// Function to fetch events from Firestore
const fetchEventsFromFirestore = async () => {
  const db = getFirestore();
  const eventsCollection = collection(db, 'events');
  const eventsSnapshot = await getDocs(eventsCollection);
  const eventsList = eventsSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      start: data.start.toDate(), // Convert Firestore timestamp to Date
      end: data.end.toDate(), // Convert Firestore timestamp to Date
      allDay: data.allDay,
      extendedProps: {
        category: data.extendedProps.category,
        location: data.extendedProps.location,
        description: data.extendedProps.description,
        workerId: data.extendedProps.workerId
      }
    };
  });
  return eventsList;
};

// Function to fetch users from Firestore
const fetchUsersFromFirestore = async () => {
  const db = getFirestore();
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  const usersList = usersSnapshot.docs.map(doc => ({
    workerId: doc.id,
    ...doc.data()
  }));
  return usersList;
};

const Schedules = () => {
  const [showEventOffcanvas, setShowEventOffcanvas] = useState(false);
  const [isEditEvent, setIsEditEvent] = useState(false);
  const [calendarApi, setCalendarApi] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState();
  const [events, setEvents] = useState([]);

  const calendarRef = useRef(null);

  const fetchEventsAndUsers = async () => {
    const [fetchedEvents, fetchedUsers] = await Promise.all([
      fetchEventsFromFirestore(),
      fetchUsersFromFirestore()
    ]);

    const eventsWithUserNames = fetchedEvents.map(event => {
      const user = fetchedUsers.find(user => user.workerId === event.extendedProps.workerId);
      const userName = user ? `${user.firstName} ${user.lastName}` : 'Unknown';
      return {
        ...event,
        title: `${event.title} (${userName})`
      };
    });

    setEvents(eventsWithUserNames);
  };

  useEffect(() => {
    fetchEventsAndUsers();
  }, []);

  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi());
    }
  }, [calendarApi]);

  useEffect(() => {
    if (calendarApi) {
      calendarApi.removeAllEvents(); // Remove all existing events
      events.forEach(event => {
        calendarApi.addEvent(event); // Add fetched events
      });
    }
  }, [calendarApi, events]);

  const handleCloseEventOffcanvas = () => setShowEventOffcanvas(false);

  const handleEventSave = async () => {
    await fetchEventsAndUsers(); // Fetch latest events after saving
  };

  const calendarOptions = {
    ref: calendarRef,
    events: events,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay,listWeek'
    },
    displayEventTime: false,
    editable: true,
    droppable: true,
    allDaySlot: false,
    eventResizableFromStart: true,
    dayMaxEvents: 2,
    navLinks: true,
    eventClick({ event: clickedEvent }) {
      setIsEditEvent(true);
      setShowEventOffcanvas(true);
      setSelectedEvent(clickedEvent);
    },
    eventClassNames({ event: calendarEvent }) {
      return [`text-white bg-${calendarEvent.extendedProps.category}`];
    },
    drop(info) {
      const newEvent = {
        id: uuid(),
        title: info.draggedEl.innerText.trim(),
        start: info.date,
        end: new Date(info.date.getTime() + 60 * 60 * 1000),
        allDay: info.allDay,
        extendedProps: {
          category: info.draggedEl.dataset.category,
          location: '',
          description: '',
          workerId: ''
        }
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      calendarApi.addEvent(newEvent);
      saveEventToFirestore(newEvent).then(() => {
        handleEventSave(); // Fetch latest events after saving new event
      });
    }
  };

  useEffect(() => {
    let draggableEl = document.getElementById('external-events');
    new Draggable(draggableEl, {
      itemSelector: '.fc-event',
      eventData: function(eventEl) {
        return {
          title: eventEl.innerText.trim(),
          extendedProps: {
            category: eventEl.dataset.category,
            location: '',
            description: '',
            workerId: ''
          }
        };
      }
    });
  }, []);

  return (
    <Fragment>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">Worker Schedules</h1>
              <Breadcrumb>
                <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Schedules</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div>
              <AddEditSchedule
                show={showEventOffcanvas}
                setShowEventOffcanvas={setShowEventOffcanvas}
                onHide={handleCloseEventOffcanvas}
                calendarApi={calendarApi}
                isEditEvent={isEditEvent}
                selectedEvent={selectedEvent}
                setEvents={setEvents}
                handleEventSave={handleEventSave} // Pass handleEventSave to AddEditSchedule
              />
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xl={9} lg={8} md={12} xs={12}>
          <Card>
            <FullCalendar {...calendarOptions} />
          </Card>
        </Col>
        <Col lg={3} md={4} sm={12}>
          <Card>
            <Card.Body>
              <div id="external-events">
                <p className="mb-2"><strong>Draggable Legends</strong></p>
                <div className="fc-event bg-danger text-white p-2 mb-2 rounded" data-category="bg-danger" style={{ cursor: 'pointer' }}>Not Available</div>
                <div className="fc-event bg-success text-white p-2 mb-2 rounded" data-category="bg-success" style={{ cursor: 'pointer' }}>Available</div>
                <div className="fc-event bg-warning text-white p-2 mb-2 rounded" data-category="bg-warning" style={{ cursor: 'pointer' }}>Absent</div>
                <div className="fc-event bg-info text-white p-2 mb-2 rounded" data-category="bg-info" style={{ cursor: 'pointer' }}>Overtime</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Schedules;




// import { Fragment, useState, useRef, useEffect } from 'react';
// import { Col, Row, Breadcrumb, Card } from 'react-bootstrap';
// import { v4 as uuid } from 'uuid';
// import { getFirestore, doc, setDoc, collection, getDocs } from 'firebase/firestore';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import listPlugin from '@fullcalendar/list';
// import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
// import AddEditSchedule from 'sub-components/dashboard/calendar/AddEditSchedule';
// import styled from 'styled-components';

// // Function to save event in Firestore
// const saveEventToFirestore = async (eventData) => {
//   const db = getFirestore();
//   const eventRef = doc(db, 'events', eventData.id);
//   await setDoc(eventRef, eventData);
// };

// // Function to fetch events from Firestore
// const fetchEventsFromFirestore = async () => {
//   const db = getFirestore();
//   const eventsCollection = collection(db, 'events');
//   const eventsSnapshot = await getDocs(eventsCollection);
//   const eventsList = eventsSnapshot.docs.map(doc => {
//     const data = doc.data();
//     return {
//       id: doc.id,
//       title: data.title,
//       start: data.start.toDate(), // Convert Firestore timestamp to Date
//       end: data.end.toDate(), // Convert Firestore timestamp to Date
//       allDay: data.allDay,
//       extendedProps: {
//         category: data.extendedProps.category,
//         location: data.extendedProps.location,
//         description: data.extendedProps.description,
//         workerId: data.extendedProps.workerId
//       }
//     };
//   });
//   return eventsList;
// };

// // Function to fetch users from Firestore
// const fetchUsersFromFirestore = async () => {
//   const db = getFirestore();
//   const usersCollection = collection(db, 'users');
//   const usersSnapshot = await getDocs(usersCollection);
//   const usersList = usersSnapshot.docs.map(doc => ({
//     workerId: doc.id,
//     ...doc.data()
//   }));
//   return usersList;
// };

// const Schedules = () => {
//   const [showEventOffcanvas, setShowEventOffcanvas] = useState(false);
//   const [isEditEvent, setIsEditEvent] = useState(false);
//   const [calendarApi, setCalendarApi] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState();
//   const [events, setEvents] = useState([]);

//   const calendarRef = useRef(null);

//   useEffect(() => {
//     const fetchEventsAndUsers = async () => {
//       const [fetchedEvents, fetchedUsers] = await Promise.all([
//         fetchEventsFromFirestore(),
//         fetchUsersFromFirestore()
//       ]);

//       const eventsWithUserNames = fetchedEvents.map(event => {
//         const user = fetchedUsers.find(user => user.workerId === event.extendedProps.workerId);
//         const userName = user ? `${user.firstName} ${user.lastName}` : 'Unknown';
//         return {
//           ...event,
//           title: `${event.title} (${userName})`
//         };
//       });

//       setEvents(eventsWithUserNames);
//     };

//     fetchEventsAndUsers();
//   }, []);

//   useEffect(() => {
//     if (calendarApi === null) {
//       setCalendarApi(calendarRef.current.getApi());
//     }
//   }, [calendarApi]);

//   useEffect(() => {
//     if (calendarApi) {
//       calendarApi.removeAllEvents(); // Remove all existing events
//       events.forEach(event => {
//         calendarApi.addEvent(event); // Add fetched events
//       });
//     }
//   }, [calendarApi, events]);

//   const handleCloseEventOffcanvas = () => setShowEventOffcanvas(false);

//   const calendarOptions = {
//     ref: calendarRef,
//     events: events,
//     plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
//     initialView: 'timeGridWeek',
//     headerToolbar: {
//       left: 'prev,next today',
//       center: 'title',
//       right: 'timeGridWeek,timeGridDay,listWeek'
//     },
//     displayEventTime: false,
//     editable: true,
//     droppable: true,
//     allDaySlot: false,
//     eventResizableFromStart: true,
//     dayMaxEvents: 2,
//     navLinks: true,
//     eventClick({ event: clickedEvent }) {
//       setIsEditEvent(true);
//       setShowEventOffcanvas(true);
//       setSelectedEvent(clickedEvent);
//     },
//     eventClassNames({ event: calendarEvent }) {
//       return [`text-white bg-${calendarEvent.extendedProps.category}`];
//     },
//     drop(info) {
//       const newEvent = {
//         id: uuid(),
//         title: info.draggedEl.innerText.trim(),
//         start: info.date,
//         end: new Date(info.date.getTime() + 60 * 60 * 1000),
//         allDay: info.allDay,
//         extendedProps: {
//           category: info.draggedEl.dataset.category,
//           location: '',
//           description: '',
//           workerId: ''
//         }
//       };
//       setEvents((prevEvents) => [...prevEvents, newEvent]);
//       calendarApi.addEvent(newEvent);
//       saveEventToFirestore(newEvent);
//     }
//   };

//   useEffect(() => {
//     let draggableEl = document.getElementById('external-events');
//     new Draggable(draggableEl, {
//       itemSelector: '.fc-event',
//       eventData: function(eventEl) {
//         return {
//           title: eventEl.innerText.trim(),
//           extendedProps: {
//             category: eventEl.dataset.category,
//             location: '',
//             description: '',
//             workerId: ''
//           }
//         };
//       }
//     });
//   }, []);

//   return (
//     <Fragment>
//       <Row>
//         <Col lg={12} md={12} sm={12}>
//           <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
//             <div className="mb-3 mb-md-0">
//               <h1 className="mb-1 h2 fw-bold">Worker Schedules</h1>
//               <Breadcrumb>
//                 <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
//                 <Breadcrumb.Item active>Schedules</Breadcrumb.Item>
//               </Breadcrumb>
//             </div>
//             <div>
//               <AddEditSchedule
//                 show={showEventOffcanvas}
//                 setShowEventOffcanvas={setShowEventOffcanvas}
//                 onHide={handleCloseEventOffcanvas}
//                 calendarApi={calendarApi}
//                 isEditEvent={isEditEvent}
//                 selectedEvent={selectedEvent}
//                 setEvents={setEvents}
//               />
//             </div>
//           </div>
//         </Col>
//       </Row>

//       <Row>
//         <Col xl={9} lg={8} md={12} xs={12}>
//           <Card>
//             <FullCalendar {...calendarOptions} />
//           </Card>
//         </Col>
//         <Col lg={3} md={4} sm={12}>
//           <Card>
//             <Card.Body>
//               <div id="external-events">
//                 <p className="mb-2"><strong>Draggable Legends</strong></p>
//                 <div className="fc-event bg-danger text-white p-2 mb-2 rounded" data-category="bg-danger" style={{ cursor: 'pointer' }}>Not Available</div>
//                 <div className="fc-event bg-success text-white p-2 mb-2 rounded" data-category="bg-success" style={{ cursor: 'pointer' }}>Available</div>
//                 <div className="fc-event bg-warning text-white p-2 mb-2 rounded" data-category="bg-warning" style={{ cursor: 'pointer' }}>Absent</div>
//                 <div className="fc-event bg-info text-white p-2 mb-2 rounded" data-category="bg-info" style={{ cursor: 'pointer' }}>Overtime</div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Fragment>
//   );
// };

// export default Schedules;














// // import node module libraries
// import { Fragment, useState, useRef, useEffect } from 'react';
// import { Col, Row, Breadcrumb, Card, Button } from 'react-bootstrap';

// // import full calendar and its plugins
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import listPlugin from '@fullcalendar/list';
// import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

// // import required data files
// import { EventsData } from 'data/dashboard/calendar/EventsData';

// // import sub components
// import { AddEditEvent } from 'sub-components';
// import { AddEditSchedule } from 'sub-components';

// const Schedules = () => {
//   // Define required states
//   const [showEventOffcanvas, setShowEventOffcanvas] = useState(false);
//   const [isEditEvent, setIsEditEvent] = useState(false);
//   const [calendarApi, setCalendarApi] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState();
//   const [events, setEvents] = useState(EventsData);

//   // Calendar Refs
//   const calendarRef = useRef(null);

//   // useEffect hook to check calendarApi Update
//   useEffect(() => {
//     if (calendarApi === null) {
//       setCalendarApi(calendarRef.current.getApi());
//     }
//   }, [calendarApi]);

//   // Handle close event offcanvas
//   const handleCloseEventOffcanvas = () => setShowEventOffcanvas(false);

//   // Blank Event Object
//   const blankEvent = {
//     title: '',
//     start: new Date(),
//     end: new Date(),
//     allDay: false,
//     extendedProps: {
//       category: '',
//       location: '',
//       description: '',
//       workerId: null // Add workerId to the event
//     }
//   };

//   // Calendar Options or Properties
//   const calendarOptions = {
//     ref: calendarRef,
//     events: events,
//     plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
//     initialView: 'timeGridWeek',
//     headerToolbar: {
//       left: 'prev,next today',
//       center: 'title',
//       right: 'timeGridWeek,timeGridDay,listWeek'
//     },
//     editable: true,
//     droppable: true,
//     allDaySlot: false,
//     eventResizableFromStart: true,
//     dayMaxEvents: 2,
//     navLinks: true,
//     eventClick({ event: clickedEvent }) {
//       setIsEditEvent(true);
//       setShowEventOffcanvas(true);
//       setSelectedEvent(clickedEvent);
//     },
//     dateClick(info) {
//       const ev = { ...blankEvent, start: info.date, end: new Date(info.date.getTime() + 60 * 60 * 1000) }; // default to 1 hour event
//       setSelectedEvent(ev);
//       setIsEditEvent(false);
//       setShowEventOffcanvas(true);
//     },
//     eventClassNames({ event: calendarEvent }) {
//       return [`text-white bg-${calendarEvent.extendedProps.category}`];
//     },
//   };

//   // Handle Drag-and-Drop of Legends
//   useEffect(() => {
//     let draggableEl = document.getElementById('external-events');
//     new Draggable(draggableEl, {
//       itemSelector: '.fc-event',
//       eventData: function(eventEl) {
//         return {
//           title: eventEl.innerText.trim(),
//           extendedProps: {
//             category: eventEl.dataset.category,
//             workerId: null // Adjust workerId as needed
//           }
//         };
//       }
//     });
//   }, []);

//   return (
//     <Fragment>
//       <Row>
//         <Col lg={12} md={12} sm={12}>
//           <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
//             <div className="mb-3 mb-md-0">
//               <h1 className="mb-1 h2 fw-bold">Worker Schedules</h1>
//               <Breadcrumb>
//                 <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
//                 <Breadcrumb.Item active>Schedules</Breadcrumb.Item>
//               </Breadcrumb>
//             </div>
//             <div>
//               <AddEditSchedule
//                 show={showEventOffcanvas}
//                 setShowEventOffcanvas={setShowEventOffcanvas}
//                 onHide={handleCloseEventOffcanvas}
//                 calendarApi={calendarApi}
//                 isEditEvent={isEditEvent}
//                 selectedEvent={selectedEvent}
//                 setEvents={setEvents}
//               />
//             </div>
//           </div>
//         </Col>
//       </Row>

//       <Row>
//         <Col xl={9} lg={8} md={12} xs={12}>
//           <Card>
//             {/* Calendar */}
//             <FullCalendar {...calendarOptions} />
//           </Card>
//         </Col>
//         <Col lg={3} md={4} sm={12}>
//         <Card>
//           <Card.Body>
//           <div id="external-events">
//             <p className="mb-2"><strong>Draggable Legends</strong></p>
//             <div className="fc-event bg-danger text-white p-2 mb-2 rounded" data-category="bg-danger" style={{ cursor: 'pointer' }}>Not Available</div>
//             <div className="fc-event bg-success text-white p-2 mb-2 rounded" data-category="bg-success" style={{ cursor: 'pointer' }}>Available</div>
//             <div className="fc-event bg-warning text-white p-2 mb-2 rounded" data-category="bg-warning" style={{ cursor: 'pointer' }}>Absent</div>
//             <div className="fc-event bg-info text-white p-2 mb-2 rounded" data-category="bg-info" style={{ cursor: 'pointer' }}>Overtime</div>
//           </div>
//           </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Fragment>
//   );
// }

// export default Schedules;
