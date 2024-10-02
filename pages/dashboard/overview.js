import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import useAuth from '../../utils/useAuth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import dynamic from 'next/dynamic';

const db = getFirestore();

// Import widget/custom components
import { StatRightIcon } from 'widgets';

// Import sub components
import { PopularInstructor, Activity } from 'sub-components';

// import node module libraries
import { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';

// import sub components
import { CommonHeaderTabs, TaskStats, TaskSummaryChart, TaskCompletionStatusChart, TaskbySectionsChart, UpcomingTaskList }  from 'sub-components';


// Import ApexCharts dynamically (Next.js specific)
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <Link
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className="btn-icon btn btn-ghost btn-sm rounded-circle"
  >
    {children}
  </Link>
));

CustomToggle.displayName = 'CustomToggle';

const ChartActionMenu = () => {
  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle}>
          <i className="fe fe-more-vertical text-muted"></i>
        </Dropdown.Toggle>
        <Dropdown.Menu align="end">
          <Dropdown.Header>SETTINGS</Dropdown.Header>
          <Dropdown.Item eventKey="1">
            <i className="fe fe-external-link dropdown-item-icon "></i> Export
          </Dropdown.Item>
          <Dropdown.Item eventKey="2">
            <i className="fe fe-mail dropdown-item-icon "></i> Email Report
          </Dropdown.Item>
          <Dropdown.Item eventKey="3">
            <i className="fe fe-download dropdown-item-icon "></i> Download
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

const Overview = () => {
  useAuth();

  const [userCount, setUserCount] = useState(null);
  const [jobCount, setJobCount] = useState({
    open: { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 },
    closed: { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 },
    scheduled: { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 },
    cancelled: { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 }
  });
  
  const [totalJobCount, setTotalJobCount] = useState(0);

  
  const [scheduleCount, setScheduleCount] = useState(null);
  const [eventStatuses, setEventStatuses] = useState({
    available: 0,
    onLeave: 0,
    medicalLeave: 0,
    publicHoliday: 0,
  });

  useEffect(() => {
    const fetchUserCount = async () => {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const count = snapshot.docs.length;
      setUserCount(count);
    };

    fetchUserCount();
  }, []);

  // useEffect(() => {
  //   const fetchJobsCount = async () => {
  //     const jobsRef = collection(db, 'jobs');
  //     const snapshot = await getDocs(jobsRef);
  
  //     const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  //     const jobCounts = {
  //       open: { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 },
  //       closed: { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 },
  //       scheduled: { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 },
  //       cancelled: { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 }
  //     };
  
  //     snapshot.docs.forEach(doc => {
  //       const jobData = doc.data();
  //       const status = jobData.jobStatus;
  //       const startDate = jobData.startDate ? new Date(jobData.startDate) : null;
  
  //       if (startDate) {
  //         const day = daysOfWeek[startDate.getDay()];
  
  //         if (status === 'C') {
  //           jobCounts.open[day] += 1;
  //         } else if (status === 'JC') {
  //           jobCounts.closed[day] += 1;
  //         } else if (status === 'S') {
  //           jobCounts.scheduled[day] += 1;
  //         } else if (status === 'CA') {
  //           jobCounts.cancelled[day] += 1;
  //         }
  //       }
  //     });
  
  //     setJobCount(jobCounts);
  //   };
  
  //   fetchJobsCount();
  // }, []);
  
  useEffect(() => {
    const fetchJobsCount = async () => {
      const jobsRef = collection(db, 'jobs');
      const snapshot = await getDocs(jobsRef);
  
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const jobCounts = {
        open: { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 },
        closed: { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 },
        scheduled: { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 },
        cancelled: { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 }
      };
  
      let totalJobs = 0;
  
      snapshot.docs.forEach(doc => {
        const jobData = doc.data();
        const status = jobData.jobStatus;
        const startDate = jobData.startDate ? new Date(jobData.startDate) : null;
  
        if (startDate) {
          const day = daysOfWeek[startDate.getDay()];
  
          if (status === 'C') {
            jobCounts.open[day] += 1;
          } else if (status === 'JC') {
            jobCounts.closed[day] += 1;
          } else if (status === 'S') {
            jobCounts.scheduled[day] += 1;
          } else if (status === 'CA') {
            jobCounts.cancelled[day] += 1;
          }
        }
  
        totalJobs += 1;
      });
  
      setJobCount(jobCounts);
      setTotalJobCount(totalJobs);
    };
  
    fetchJobsCount();
  }, []);
  

  useEffect(() => {
    const fetchSchedulesCount = async () => {
      const schedulesRef = collection(db, 'events');
      const snapshot = await getDocs(schedulesRef);
      const count = snapshot.docs.length;
      setScheduleCount(count);
    };

    fetchSchedulesCount();
  }, []);

  useEffect(() => {
    const fetchEventStatuses = async () => {
      const eventsRef = collection(db, 'events');
      const snapshot = await getDocs(eventsRef);
      const statuses = {
        available: 0,
        onLeave: 0,
        medicalLeave: 0,
        publicHoliday: 0,
      };

      snapshot.docs.forEach(doc => {
        const status = doc.data().extendedProps.status;
        if (status === 'Available') statuses.available += 1;
        else if (status === 'On Leave') statuses.onLeave += 1;
        else if (status === 'Medical Leave') statuses.medicalLeave += 1;
        else if (status === 'Public Holiday') statuses.publicHoliday += 1;
      });

      setEventStatuses(statuses);
    };

    fetchEventStatuses();
  }, []);

  const pieChartOptions = {
    chart: {
      type: 'pie',
    },
    colors: ['#28a745', '#FF0000', '#FFA500', '#FFFF00'], // Lime, Red, Orange, Yellow
    labels: ['Available', 'On Leave', 'Medical Leave', 'Public Holiday'],
  };

  const pieChartSeries = [
    eventStatuses.available,
    eventStatuses.onLeave,
    eventStatuses.medicalLeave,
    eventStatuses.publicHoliday,
  ];

  const stackedChartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    colors: ['#28a745', '#dc3545'], // Green for Open, Red for Closed
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      type: 'category',
      categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    legend: {
      position: 'right',
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
  };
  

  const openClosedSeries = [
    {
      name: 'Open Jobs',
      data: [
        jobCount.open.Sunday,
        jobCount.open.Monday,
        jobCount.open.Tuesday,
        jobCount.open.Wednesday,
        jobCount.open.Thursday,
        jobCount.open.Friday,
        jobCount.open.Saturday
      ]
    },
    {
      name: 'Closed Jobs',
      data: [
        jobCount.closed.Sunday,
        jobCount.closed.Monday,
        jobCount.closed.Tuesday,
        jobCount.closed.Wednesday,
        jobCount.closed.Thursday,
        jobCount.closed.Friday,
        jobCount.closed.Saturday
      ]
    }
  ];
  

  const scheduledCancelledSeries = [
    {
      name: 'Scheduled Jobs',
      data: [
        jobCount.scheduled.Sunday,
        jobCount.scheduled.Monday,
        jobCount.scheduled.Tuesday,
        jobCount.scheduled.Wednesday,
        jobCount.scheduled.Thursday,
        jobCount.scheduled.Friday,
        jobCount.scheduled.Saturday
      ]
    },
    {
      name: 'Cancelled Jobs',
      data: [
        jobCount.cancelled.Sunday,
        jobCount.cancelled.Monday,
        jobCount.cancelled.Tuesday,
        jobCount.cancelled.Wednesday,
        jobCount.cancelled.Thursday,
        jobCount.cancelled.Friday,
        jobCount.cancelled.Saturday
      ]
    }
  ];
  

  return (
    <Fragment>
    {/* page header tabs */}
    <CommonHeaderTabs />

    {/* various stats of task */}
    <TaskStats />

    <Row>
      <Col xl={8} md={12} xs={12} className="mb-4">
        {/* task summary chart  */}
        <TaskSummaryChart />
      </Col>
      <Col xl={4} md={12} xs={12} className="mb-4">
        {/* task completion status chart  */}
        <TaskCompletionStatusChart />
      </Col>
    </Row>
    <Row>
      <Col xl={4} xs={12} className="mb-4 mb-xl-0">
        {/* task by sections chart  */}
        <TaskbySectionsChart />
      </Col>
      <Col xl={8} xs={12} className="mb-4 mb-xl-0">
        {/* upcoming task list by assignee  */}
        <UpcomingTaskList />
      </Col>
    </Row>
  </Fragment>

  );
};

export default Overview;


// import React, { useState, useEffect } from 'react';
// import { Col, Row, Dropdown, Card, CardBody } from 'react-bootstrap';
// import Link from 'next/link';
// import useAuth from '../../utils/useAuth';
// import { getFirestore, collection, getDocs } from 'firebase/firestore';
// import dynamic from 'next/dynamic';

// const db = getFirestore();

// // Import widget/custom components
// import { StatRightIcon } from 'widgets';

// // Import sub components
// import { PopularInstructor, Activity } from 'sub-components';

// // Import ApexCharts dynamically (Next.js specific)
// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
//   <Link
//     href=""
//     ref={ref}
//     onClick={(e) => {
//       e.preventDefault();
//       onClick(e);
//     }}
//     className="btn-icon btn btn-ghost btn-sm rounded-circle"
//   >
//     {children}
//   </Link>
// ));

// CustomToggle.displayName = 'CustomToggle';

// const ChartActionMenu = () => {
//   return (
//     <div>
//       <Dropdown>
//         <Dropdown.Toggle as={CustomToggle}>
//           <i className="fe fe-more-vertical text-muted"></i>
//         </Dropdown.Toggle>
//         <Dropdown.Menu align="end">
//           <Dropdown.Header>SETTINGS</Dropdown.Header>
//           <Dropdown.Item eventKey="1">
//             <i className="fe fe-external-link dropdown-item-icon "></i> Export
//           </Dropdown.Item>
//           <Dropdown.Item eventKey="2">
//             <i className="fe fe-mail dropdown-item-icon "></i> Email Report
//           </Dropdown.Item>
//           <Dropdown.Item eventKey="3">
//             <i className="fe fe-download dropdown-item-icon "></i> Download
//           </Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>
//     </div>
//   );
// };

// const Overview = () => {
//   useAuth();

//   const [userCount, setUserCount] = useState(null);
//   const [jobCount, setJobCount] = useState({ open: 0, closed: 0 });
//   const [scheduleCount, setScheduleCount] = useState(null);
//   const [eventStatuses, setEventStatuses] = useState({
//     available: 0,
//     onLeave: 0,
//     medicalLeave: 0,
//     publicHoliday: 0,
//   });


//   useEffect(() => {
//     const fetchUserCount = async () => {
//       if (userCount === null) {
//         const usersRef = collection(db, 'users');
//         const snapshot = await getDocs(usersRef);
//         const count = snapshot.docs.length;
//         setUserCount(count);
//       }
//     };

//     fetchUserCount();
//   }, [userCount]);

//   // useEffect(() => {
//   //   const fetchJobsCount = async () => {
//   //     if (jobCount === null) {
//   //       const jobsRef = collection(db, 'jobs');
//   //       const snapshot = await getDocs(jobsRef);
//   //       const count = snapshot.docs.length;
//   //       setJobCount(count);
//   //     }
//   //   };

//   //   fetchJobsCount();
//   // }, [jobCount]);

//   useEffect(() => {
//     const fetchJobsCount = async () => {
//       if (jobCount === null) {
//         const jobsRef = collection(db, 'jobs');
//         const snapshot = await getDocs(jobsRef);
        
//         let openJobs = 0;
//         let closedJobs = 0;
  
//         snapshot.docs.forEach(doc => {
//           const status = doc.data().jobStatus;
//           if (status === 'C') {
//             openJobs += 1;
//           } else if (status === 'JC') {
//             closedJobs += 1;
//           }
//         });
  
//         setJobCount({ open: openJobs, closed: closedJobs });
//       }
//     };
  
//     fetchJobsCount();
//   }, [jobCount]);
  

//   useEffect(() => {
//     const fetchSchedulesCount = async () => {
//       if (scheduleCount === null) {
//         const schedulesRef = collection(db, 'events');
//         const snapshot = await getDocs(schedulesRef);
//         const count = snapshot.docs.length;
//         setScheduleCount(count);
//       }
//     };

//     fetchSchedulesCount();
//   }, [scheduleCount]);

//   useEffect(() => {
//     const fetchEventStatuses = async () => {
//       const eventsRef = collection(db, 'events');
//       const snapshot = await getDocs(eventsRef);
//       const statuses = {
//         available: 0,
//         onLeave: 0,
//         medicalLeave: 0,
//         publicHoliday: 0,
//       };

//       snapshot.docs.forEach(doc => {
//         const status = doc.data().extendedProps.status;
//         if (status === 'Available') statuses.available += 1;
//         else if (status === 'On Leave') statuses.onLeave += 1;
//         else if (status === 'Medical Leave') statuses.medicalLeave += 1;
//         else if (status === 'Public Holiday') statuses.publicHoliday += 1;
//       });

//       setEventStatuses(statuses);
//     };

//     fetchEventStatuses();
//   }, []);

//   const pieChartOptions = {
//     chart: {
//       type: 'pie',
//     },
//     colors: ['#00FF00', '#FF0000', '#FFA500', '#FFFF00'], // Lime, Red, Orange, Yellow
//     labels: ['Available', 'On Leave', 'Medical Leave', 'Public Holiday'],
//   };

//   const pieChartSeries = [
//     eventStatuses.available,
//     eventStatuses.onLeave,
//     eventStatuses.medicalLeave,
//     eventStatuses.publicHoliday,
//   ];


//   const stackedChartOptions = {
//     chart: {
//       type: 'bar',
//       stacked: true,
//       toolbar: {
//         show: true,
//       },
//       zoom: {
//         enabled: true,
//       },
//     },
//     colors: ['#28a745', '#dc3545'], // Green for Open, Red for Closed
//     responsive: [
//       {
//         breakpoint: 480,
//         options: {
//           legend: {
//             position: 'bottom',
//             offsetX: -10,
//             offsetY: 0,
//           },
//         },
//       },
//     ],
//     plotOptions: {
//       bar: {
//         horizontal: false,
//       },
//     },
//     xaxis: {
//       type: 'category',
//       categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//     },
//     legend: {
//       position: 'right',
//       offsetY: 40,
//     },
//     fill: {
//       opacity: 1,
//     },
//   };

//   const openClosedSeries = [
//     {
//       name: 'Open Jobs',
//       data: [jobCount.open], // Use the jobCount state for Open Jobs
//     },
//     {
//       name: 'Closed Jobs',
//       data: [jobCount.closed], // Use the jobCount state for Closed Jobs
//     },
//   ];

  // const scheduledCancelledSeries = [
  //   {
  //     name: 'Scheduled Jobs',
  //     data: [20, 25, 22, 19, 5],
  //   },
  //   {
  //     name: 'Cancelled Jobs',
  //     data: [5, 7, 6, 8, 20],
  //   },
  // ];

//   return (
//     <div>
//       <Row>
//         <Col lg={12} md={12} sm={12}>
//           <div className="border-bottom pb-4 mb-4 d-lg-flex justify-content-between align-items-center">
//             <div className="mb-3 mb-lg-0">
//               <h1 className="mb-0 h2 fw-bold">Dashboard</h1>
//             </div>
//           </div>
//         </Col>
//       </Row>
//       <Row>
//         <Col xl={4} lg={6} md={12} sm={12}>
//           <StatRightIcon
//             title="JOBS"
//             value={jobCount}
//             summary="Total Jobs"
//             summaryValue=""
//             summaryIcon=""
//             //showSummaryIcon
//             iconName="shopping-bag"
//             iconColorVariant="primary"
//             classValue="mb-4"
//           />
//         </Col>

//         <Col xl={4} lg={6} md={12} sm={12}>
//           <StatRightIcon
//             title="SCHEDULES"
//             value={scheduleCount}
//             summary="Total Schedules"
//             summaryValue=""
//             summaryIcon=""
//             //showSummaryIcon
//             iconName="calendar"
//             iconColorVariant="primary"
//             classValue="mb-4"
//           />
//         </Col>

//         <Col xl={4} lg={6} md={12} sm={12}>
//           <StatRightIcon
//             title="WORKERS"
//             value={userCount} // update the value prop with the user count
//             summary="Total Worker"
//             summaryValue=""
//             summaryIcon=""
//             //showSummaryIcon
//             iconName="users"
//             iconColorVariant="primary"
//             classValue="mb-4"
//           />
//         </Col>
//       </Row>

//       <Row className="mb-4">
//         <Col xl={6} lg={6} md={12} sm={12}>
//           <Card className="mb-4">
//             <CardBody>
//               <div className="mb-4">
//                 <h3>Open Jobs vs Closed Jobs by Week</h3>
//                 <Chart options={stackedChartOptions} series={openClosedSeries} type="bar" />
//               </div>
//             </CardBody>
//           </Card>
//         </Col>

      //   <Col xl={6} lg={6} md={12} sm={12}>
      //     <Card className="mb-4">
      //       <CardBody>
      //         <div className="mb-4">
      //           <h3>Scheduled Jobs vs Cancelled Jobs by Week</h3>
      //           <Chart options={stackedChartOptions} series={scheduledCancelledSeries} type="bar" />
      //         </div>
      //       </CardBody>
      //     </Card>
      //   </Col>
      // </Row>

      // <Row className="mb-4">
      //   <Col xl={6} lg={6} md={12} sm={12}>
      //     <Card>
      //       <CardBody>
      //         <div className="mb-2">
      //           <h3>Worker Status Distribution</h3>
      //           <Chart options={pieChartOptions} series={pieChartSeries} type="pie" />
      //         </div>
      //       </CardBody>
      //     </Card>
      //   </Col>
      // </Row>
//     </div>
//   );
// };

// export default Overview;



// // pages/dashboard/overview.js
// import React, { useState, useEffect } from 'react';
// import { Col, Row, Dropdown, Card, CardBody } from 'react-bootstrap';
// import Link from 'next/link';
// import useAuth from '../../utils/useAuth';
// import { getFirestore, collection, getDocs } from 'firebase/firestore';
// import dynamic from 'next/dynamic';

// const db = getFirestore();

// // Import widget/custom components
// import { StatRightIcon } from 'widgets';

// // Import sub components
// import { PopularInstructor, Activity } from 'sub-components';

// // Import ApexCharts dynamically (Next.js specific)
// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
//   <Link
//     href=""
//     ref={ref}
//     onClick={(e) => {
//       e.preventDefault();
//       onClick(e);
//     }}
//     className="btn-icon btn btn-ghost btn-sm rounded-circle"
//   >
//     {children}
//   </Link>
// ));

// CustomToggle.displayName = 'CustomToggle';

// const ChartActionMenu = () => {
//   return (
//     <div>
//       <Dropdown>
//         <Dropdown.Toggle as={CustomToggle}>
//           <i className="fe fe-more-vertical text-muted"></i>
//         </Dropdown.Toggle>
//         <Dropdown.Menu align="end">
//           <Dropdown.Header>SETTINGS</Dropdown.Header>
//           <Dropdown.Item eventKey="1">
//             <i className="fe fe-external-link dropdown-item-icon "></i> Export
//           </Dropdown.Item>
//           <Dropdown.Item eventKey="2">
//             <i className="fe fe-mail dropdown-item-icon "></i> Email Report
//           </Dropdown.Item>
//           <Dropdown.Item eventKey="3">
//             <i className="fe fe-download dropdown-item-icon "></i> Download
//           </Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>
//     </div>
//   );
// };

// const Overview = () => {
//   useAuth();
  
//   const [userCount, setUserCount] = useState(null);
//   const [jobCount, setJobCount] = useState(null);
//   const [scheduleCount, setScheduleCount] = useState(null);

//   useEffect(() => {
//     const fetchUserCount = async () => {
//       if (userCount === null) {
//         const usersRef = collection(db, 'users');
//         const snapshot = await getDocs(usersRef);
//         const count = snapshot.docs.length;
//         setUserCount(count);
//       }
//     };

//     fetchUserCount();
//   }, []);

//   useEffect(() => {
//     const fetchJobsCount = async () => {
//       if (jobCount === null) {
//         const jobsRef = collection(db, 'jobs');
//         const snapshot = await getDocs(jobsRef);
//         const count = snapshot.docs.length;
//         setJobCount(count);
//       }
//     };

//     fetchJobsCount();
//   }, []);

//   useEffect(() => {
//     const fetchSchedulesCount = async () => {
//       if (scheduleCount === null) {
//         const schedulesRef = collection(db, 'events');
//         const snapshot = await getDocs(schedulesRef);
//         const count = snapshot.docs.length;
//         setScheduleCount(count);
//       }
//     };

//     fetchSchedulesCount();
//   }, []);

//   // Sample data and chart options
//   const pieChartOptions = {
//     chart: {
//       type: 'pie',
//     },
//     colors: ['#00FF00', '#FF0000', '#FFA500', '#FFFF00'], // Lime, Red, Orange, Yellow
//     labels: ['Available', 'On Leave', 'Medical Leave', 'Public Holiday'],
//   };

//   const pieChartSeries = [30, 40, 20, 10];

//   const stackedChartOptions = {
//     chart: {
//       type: 'bar',
//       stacked: true,
//       toolbar: {
//         show: true,
//       },
//       zoom: {
//         enabled: true,
//       },
//     },
//     colors: ['#28a745', '#dc3545'], // Green for Open, Red for Closed
//     responsive: [
//       {
//         breakpoint: 480,
//         options: {
//           legend: {
//             position: 'bottom',
//             offsetX: -10,
//             offsetY: 0,
//           },
//         },
//       },
//     ],
//     plotOptions: {
//       bar: {
//         horizontal: false,
//       },
//     },
//     xaxis: {
//       type: 'category',
//       categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//     },
//     legend: {
//       position: 'right',
//       offsetY: 40,
//     },
//     fill: {
//       opacity: 1,
//     },
//   };

//   const openClosedSeries = [
//     {
//       name: 'Open Jobs',
//       data: [10, 15, 14, 12, 30],
//     },
//     {
//       name: 'Closed Jobs',
//       data: [8, 10, 9, 11, 5],
//     },
//   ];

//   const scheduledCancelledSeries = [
//     {
//       name: 'Scheduled Jobs',
//       data: [20, 25, 22, 19, 5],
//     },
//     {
//       name: 'Cancelled Jobs',
//       data: [5, 7, 6, 8, 20],
//     },
//   ];
  
//   return (
//     <div>
//       <Row>
//         <Col lg={12} md={12} sm={12}>
//           <div className="border-bottom pb-4 mb-4 d-lg-flex justify-content-between align-items-center">
//             <div className="mb-3 mb-lg-0">
//               <h1 className="mb-0 h2 fw-bold">Dashboard</h1>
//             </div>
    
//           </div>
//         </Col>
//       </Row>
//       <Row>
//         <Col xl={4} lg={6} md={12} sm={12}>
//           <StatRightIcon
//             title="JOBS"
//             value={jobCount}
//             summary="Total Jobs"
//             summaryValue=""
//             summaryIcon=""
//             //showSummaryIcon
//             iconName="shopping-bag"
//             iconColorVariant="primary"
//             classValue="mb-4"
//           />
//         </Col>

//         <Col xl={4} lg={6} md={12} sm={12}>
//           <StatRightIcon
//             title="SCHEDULES"
//             value={scheduleCount}
//             summary="Total Schedules"
//             summaryValue=""
//             summaryIcon=""
//             //showSummaryIcon
//             iconName="calendar"
//             iconColorVariant="primary"
//             classValue="mb-4"
//           />
//         </Col>

//         <Col xl={4} lg={6} md={12} sm={12}>
//           <StatRightIcon
//             title="WORKERS"
//             value={userCount} // update the value prop with the user count
//             summary="Total Worker"
//             summaryValue=""
//             summaryIcon=""
//             //showSummaryIcon
//             iconName="users"
//             iconColorVariant="primary"
//             classValue="mb-4"
//           />
//         </Col>
   
//       </Row>

//       <Row className="mb-4">
//         <Col xl={6} lg={6} md={12} sm={12}>
//         <Card className="mb-4">
//           <CardBody>
//           <div className="mb-4">
//             <h3>Open Jobs vs Closed Jobs by Week</h3>
//             <Chart options={stackedChartOptions} series={openClosedSeries} type="bar" />
//           </div>
//           </CardBody>
//         </Card>
//         </Col>
      
//         <Col xl={6} lg={6} md={12} sm={12}>
//         <Card className="mb-4">
//         <CardBody>
//           <div className="mb-4">
//             <h3>Scheduled Jobs vs Cancelled Jobs by Week</h3>
//             <Chart options={stackedChartOptions} series={scheduledCancelledSeries} type="bar" />
//           </div>
//           </CardBody>
//           </Card>
//         </Col>

//       </Row>

//       <Row className="mb-4">
//       <Col xl={6} lg={6} md={12} sm={12}>
//         <Card>

//         <CardBody>
//           <div className="mb-2">
//             <h3>Worker Status Distribution</h3>
//             <Chart options={pieChartOptions} series={pieChartSeries} type="pie" />
//           </div>
//           </CardBody>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default Overview;


// // pages/dashboard/overview.js
// import React, { useState, useEffect } from 'react';
// import { Col, Row, Dropdown } from 'react-bootstrap';
// import Link from 'next/link';
// import useAuth from '../../utils/useAuth';
// import { getFirestore, collection, getDocs } from 'firebase/firestore';

// const db = getFirestore();

// // import widget/custom components
// import { FlatPickr, StatRightIcon } from 'widgets';

// // import sub components
// import { PopularInstructor, Activity } from 'sub-components';

// const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
//   <Link
//     href=""
//     ref={ref}
//     onClick={(e) => {
//       e.preventDefault();
//       onClick(e);
//     }}
//     className="btn-icon btn btn-ghost btn-sm rounded-circle"
//   >
//     {children}
//   </Link>
// ));

// CustomToggle.displayName = 'CustomToggle';

// const ChartActionMenu = () => {
//   return (
//     <div>
//       <Dropdown>
//         <Dropdown.Toggle as={CustomToggle}>
//           <i className="fe fe-more-vertical text-muted"></i>
//         </Dropdown.Toggle>
//         <Dropdown.Menu align="end">
//           <Dropdown.Header>SETTINGS</Dropdown.Header>
//           <Dropdown.Item eventKey="1">
//             <i className="fe fe-external-link dropdown-item-icon "></i> Export
//           </Dropdown.Item>
//           <Dropdown.Item eventKey="2">
//             <i className="fe fe-mail dropdown-item-icon "></i> Email Report
//           </Dropdown.Item>
//           <Dropdown.Item eventKey="3">
//             <i className="fe fe-download dropdown-item-icon "></i> Download
//           </Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>
//     </div>
//   );
// };

// const Overview = () => {
//   useAuth();
  
//   const [userCount, setUserCount] = useState(null);
//   const [jobCount, setJobCount] = useState(null);
//   const [scheduleCount, setScheduleCount] = useState(null);

//   useEffect(() => {
//     const fetchUserCount = async () => {
//       if (userCount === null) {
//         const usersRef = collection(db, 'users');
//         const snapshot = await getDocs(usersRef);
//         const count = snapshot.docs.length;
//         setUserCount(count);
//       }
//     };

//     fetchUserCount();
//   }, []);

//   useEffect(() => {
//     const fetchJobsCount = async () => {
//       if (jobCount === null) {
//         const jobsRef = collection(db, 'jobs');
//         const snapshot = await getDocs(jobsRef);
//         const count = snapshot.docs.length;
//         setJobCount(count);
//       }
//     };

//     fetchJobsCount();
//   }, []);

//   useEffect(() => {
//     const fetchSchedulesCount = async () => {
//       if (scheduleCount === null) {
//         const schedulesRef = collection(db, 'events');
//         const snapshot = await getDocs(schedulesRef);
//         const count = snapshot.docs.length;
//         setScheduleCount(count);
//       }
//     };

//     fetchSchedulesCount();
//   }, []);
  
//   return (
//     <div>
//       <Row>
//         <Col lg={12} md={12} sm={12}>
//           <div className="border-bottom pb-4 mb-4 d-lg-flex justify-content-between align-items-center">
//             <div className="mb-3 mb-lg-0">
//               <h1 className="mb-0 h2 fw-bold">Dashboard</h1>
//             </div>
    
//           </div>
//         </Col>
//       </Row>
//       <Row>
//         <Col xl={4} lg={6} md={12} sm={12}>
//           <StatRightIcon
//             title="JOBS"
//             value={jobCount}
//             summary="Total Jobs"
//             summaryValue=""
//             summaryIcon=""
//             //showSummaryIcon
//             iconName="shopping-bag"
//             iconColorVariant="primary"
//             classValue="mb-4"
//           />
//         </Col>

//         <Col xl={4} lg={6} md={12} sm={12}>
//           <StatRightIcon
//             title="SCHEDULES"
//             value={scheduleCount}
//             summary="Total Schedules"
//             summaryValue=""
//             summaryIcon=""
//             //showSummaryIcon
//             iconName="calendar"
//             iconColorVariant="primary"
//             classValue="mb-4"
//           />
//         </Col>
//         <Col xl={4} lg={6} md={12} sm={12}>
//           <StatRightIcon
//             title="WORKERS"
//             value={userCount} // update the value prop with the user count
//             summary="Total Worker"
//             summaryValue=""
//             summaryIcon=""
//             //showSummaryIcon
//             iconName="users"
//             iconColorVariant="primary"
//             classValue="mb-4"
//           />
//         </Col>
   
//       </Row>

//     </div>
//   );
// };

// export default Overview;





// export const getServerSideProps = async (context) => {
//   const { isAuthenticated } = checkAuth(context);

//   if (!isAuthenticated) {
//     return {
//       redirect: {
//         destination: '/authentication/sign-in',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };

// export default Overview;


// // import node module libraries
// import React from 'react';
// import { Col, Row, Card, Dropdown } from 'react-bootstrap';
// import Link from 'next/link';

// // import widget/custom components
// import { FlatPickr, ApexCharts, StatRightIcon } from 'widgets';

// // import sub components
// import { PopularInstructor, RecentCourses, Activity } from 'sub-components';

// // import data files
// import {
// 	TrafficChartSeries,
// 	TrafficChartOptions,
// 	EarningsChartSeries,
// 	EarningsChartOptions
// } from 'data/charts/ChartData';

// const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
// 	(<Link
// 		href=""
// 		ref={ref}
// 		onClick={(e) => {
// 			e.preventDefault();
// 			onClick(e);
// 		}}
// 		className="btn-icon btn btn-ghost btn-sm rounded-circle">
// 		{children}
// 	</Link>)
// ));

// CustomToggle.displayName = 'CustomToggle';

// const ChartActionMenu = () => {
// 	return (
// 		<div>
// 			<Dropdown>
// 				<Dropdown.Toggle as={CustomToggle}>
// 					<i className="fe fe-more-vertical text-muted"></i>
// 				</Dropdown.Toggle>
// 				<Dropdown.Menu align="end">
// 					<Dropdown.Header>SETTINGS</Dropdown.Header>
// 					<Dropdown.Item eventKey="1">
// 						<i className="fe fe-external-link dropdown-item-icon "></i> Export
// 					</Dropdown.Item>
// 					<Dropdown.Item eventKey="2">
// 						<i className="fe fe-mail dropdown-item-icon "></i> Email Report
// 					</Dropdown.Item>
// 					<Dropdown.Item eventKey="3">
// 						<i className="fe fe-download dropdown-item-icon "></i> Download
// 					</Dropdown.Item>
// 				</Dropdown.Menu>
// 			</Dropdown>
// 		</div>
// 	);
// };

// const Overview = () => {
// 	return (
// 		<div>
// 			<Row>
// 				<Col lg={12} md={12} sm={12}>
// 					<div className="border-bottom pb-4 mb-4 d-lg-flex justify-content-between align-items-center">
// 						<div className="mb-3 mb-lg-0">
// 							<h1 className="mb-0 h2 fw-bold">Dashboard</h1>
// 						</div>
// 						<div className="d-flex">
// 							<div className="input-group me-3  ">
// 								<FlatPickr value={''} />

// 								<span className="input-group-text text-muted" id="basic-addon2">
// 									<i className="fe fe-calendar"></i>
// 								</span>
// 							</div>
// 							<Link href="#" className="btn btn-primary">
// 								Setting
// 							</Link>
// 						</div>
// 					</div>
// 				</Col>
// 			</Row>
// 			<Row>
// 				<Col xl={4} lg={6} md={12} sm={12}>
// 					<StatRightIcon
// 						title="JOBS"
// 						value="150"
// 						summary="New Job"
// 						summaryValue="+5"
// 						summaryIcon="up"
// 						showSummaryIcon
// 						iconName="shopping-bag"
// 						iconColorVariant="primary"
// 						classValue="mb-4"
// 					/>
// 				</Col>

// 				<Col xl={4} lg={6} md={12} sm={12}>
// 					<StatRightIcon
// 						title="SCHEDULES"
// 						value="30"
// 						summary="New Schedule"
// 						summaryValue="+1"
// 						summaryIcon="up"
// 						showSummaryIcon
// 						iconName="calendar"
// 						iconColorVariant="primary"
// 						classValue="mb-4"
// 					/>
// 				</Col>

// 				<Col xl={4} lg={6} md={12} sm={12}>
// 					<StatRightIcon
// 						title="WORKERS"
// 						value="35"
// 						summary="New Worker"
// 						summaryValue="+1"
// 						summaryIcon="up"
// 						showSummaryIcon
// 						iconName="users"
// 						iconColorVariant="primary"
// 						classValue="mb-4"
// 					/>
// 				</Col>

	
// 			</Row>

// 			<Row>
		
// 				<Col xl={8} lg={6} md={12} className="mb-4">
// 					<Activity title="Activity" />
// 				</Col>
// 				<Col xl={4} lg={6} md={12} className="mb-4">
// 					<PopularInstructor />
// 				</Col>
// 			</Row>
// 		</div>
// 	);
// };

// export default Overview;
