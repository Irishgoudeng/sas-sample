// import node module libraries
import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import the useRouter hook from Next.js
import { Col, Row, Breadcrumb, Card, Button, Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { FaUser } from 'react-icons/fa';

// import sub components
import { Pagination } from 'sub-components';

// import data files
import EmployeeData from 'data/dashboard/tables/JobsData';

// import Firebase
import { db } from '../../../firebase'; // Adjust the path as necessary
import { collection, getDocs } from "firebase/firestore";

// import utility file
import { convertToCurrency } from 'helper/utils';
import JobListData from 'data/dashboard/tables/JobsData';

// import CSS module
import styles from './ViewJobs.module.css'; // Import the CSS module

const ViewJobs = () => {
  const router = useRouter(); // Initialize the router

  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold',
        fontSize: '14px',
        backgroundColor: "#F1F5FC",
        wordWrap: 'break-word', // Ensure column headers wrap text
        whiteSpace: 'normal', // Allow wrapping
        textAlign: 'left', // Center align headers
      },
    },
    cells: {
      style: {
        color: '#64748b',
        fontSize: '14px',
        wordWrap: 'break-word', // Ensure cells wrap text
        whiteSpace: 'normal', // Allow wrapping
        textAlign: 'left', // Center align cells
      },
    },
    rows: {
      style: {
        minHeight: '72px', // Adjust row height for better spacing
        wordWrap: 'break-word', // Ensure cells wrap text
        textAlign: 'center', // Center align rows
      },
      highlightOnHoverStyle: {
        backgroundColor: '#f1f5fc', // Light blue background on hover
        cursor: 'pointer', // Change cursor to pointer
      },
    },
    highlightOnHover: true, // Enable row highlighting on hover
  };

  const jobStatusMap = {
    "C": "Created",
    "CO": "Confirm",
    "CA": "Cancel",
    "JS": "Job Started",
    "JC": "Job Complete",
    "V": "Validate",
    "S": "Scheduled",
    "US": "Unscheduled",
    "RS": "Re-scheduled"
  };

  const jobPriorityMap = {
    "L": "Low",
    "M": "Mid",
    "H": "High"
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'L':
        return <Badge bg="success">Low</Badge>;
      case 'M':
        return <Badge bg="warning">Mid</Badge>;
      case 'H':
        return <Badge bg="danger">High</Badge>;
      default:
        return priority;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'C':
        return <Badge bg="info">Created</Badge>;
      case 'CO':
        return <Badge bg="primary">Confirm</Badge>;
      case 'CA':
        return <Badge bg="danger">Cancel</Badge>;
      case 'JS':
        return <Badge bg="warning">Job Started</Badge>;
      case 'JC':
        return <Badge bg="success">Job Complete</Badge>;
      case 'V':
        return <Badge bg="secondary">Validate</Badge>;
      case 'S':
        return <Badge bg="info">Scheduled</Badge>;
      case 'US':
        return <Badge bg="dark">Unscheduled</Badge>;
      case 'RS':
        return <Badge bg="warning">Re-scheduled</Badge>;
      default:
        return status;
    }
  };

  const formatTime = (time) => {
    if (!time) return ''; // Return an empty string if time is undefined or null
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert '0' hour to '12'
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const columns = [
    { name: 'Job No.', selector: row => row.jobNo, sortable: true, width: '120px' },
    { name: 'Worker Name', cell: row => <span><FaUser style={{ marginRight: '8px' }} />{row.workerFullName}</span>, sortable: true, wrap: true, width: '200px' },
    { name: 'Job Name', selector: row => row.jobName, sortable: true, wrap: true, width: '200px' },
    { name: 'Job Status', cell: row => getStatusBadge(row.jobStatus), sortable: false, width: '150px' },
    { name: 'Job Description', selector: row => row.description, sortable: false, wrap: true, width: '300px' },
    { name: 'Priority', cell: row => getPriorityBadge(row.jobPriority), sortable: true, width: '120px' },
    { name: 'Date Start', selector: row => row.startDate, sortable: true, width: '150px' },
    { name: 'Date End', selector: row => row.endDate, sortable: true, width: '150px' },
    { name: 'Start Time', cell: row => formatTime(row.startTime), sortable: true, width: '150px' },
    { name: 'End Time', cell: row => formatTime(row.endTime), sortable: true, width: '150px' }
  ];

  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const jobsSnapshot = await getDocs(collection(db, "jobs"));
  //     const usersSnapshot = await getDocs(collection(db, "users"));

  //     const jobsData = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //     const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  //     const mergedData = jobsData.map(job => {
  //       const workerNames = job.assignedWorkers.map(workerId => {
  //         const worker = usersData.find(user => user.workerId === workerId);
  //         return worker ? `${worker.firstName} ${worker.lastName}` : 'Unknown Worker';
  //       }).join(', ');

  //       return {
  //         ...job,
  //         workerFullName: workerNames
  //       };
  //     });

  //     setData(mergedData);
  //     setFilter(mergedData);
  //   };

  //   fetchData();
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      const jobsSnapshot = await getDocs(collection(db, "jobs"));
      const usersSnapshot = await getDocs(collection(db, "users"));
  
      const jobsData = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Sort jobs by timestamp in descending order
      const sortedJobsData = jobsData.sort((a, b) => b.timestamp - a.timestamp);
  
      const mergedData = sortedJobsData.map(job => {
        const workerNames = job.assignedWorkers.map(workerId => {
          const worker = usersData.find(user => user.workerId === workerId);
          return worker ? `${worker.firstName} ${worker.lastName}` : 'Unknown Worker';
        }).join(', ');
  
        return {
          ...job,
          workerFullName: workerNames
        };
      });
  
      setData(mergedData);
      setFilter(mergedData);
    };
  
    fetchData();
  }, []);
  

  useEffect(() => {
    const result = data.filter(item => {
      return (
        (item.workerFullName && item.workerFullName.toLowerCase().includes(search.toLowerCase())) ||
        (item.jobName && item.jobName.toLowerCase().includes(search.toLowerCase())) ||
        (item.jobStatus && item.jobStatus.toLowerCase().includes(search.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
        (item.jobPriority && item.jobPriority.toLowerCase().includes(search.toLowerCase())) ||
        (item.startDate && item.startDate.toLowerCase().includes(search.toLowerCase())) ||
        (item.endDate && item.endDate.toLowerCase().includes(search.toLowerCase())) ||
        (item.startTime && item.startTime.toLowerCase().includes(search.toLowerCase())) ||
        (item.endTime && item.endTime.toLowerCase().includes(search.toLowerCase())) ||
        (item.jobNo && item.jobNo.toString().includes(search))
      );
    });
    setFilter(result);
  }, [search, data]);

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <Fragment>
        <input type="text"
          className="form-control me-4 mb-4"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Fragment>
    );
  }, [search]);

  const ActionButtons = () => {
    return (
      <Fragment>
        <Button variant='light'>Excel</Button>
        <Button variant='light'>CSV</Button>
        <Button variant='light'>Print</Button>
      </Fragment>
    )
  }
  const actionsMemo = React.useMemo(() => <ActionButtons />, []);

  const BootstrapCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
    <div className="form-check">
      <input
        htmlFor="bootstrap-check"
        type="checkbox"
        className="form-check-input"
        ref={ref}
        onClick={onClick}
        {...rest}
      />
      <label className="form-check-label" id="bootstrap-check" />
    </div>
  ));

  BootstrapCheckbox.displayName = 'BootstrapCheckbox';

  const handleRowClicked = row => {
    router.push(`update-jobs/${row.id}`); 
  };

  return (
    <Fragment>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">Jobs List</h1>
              <Breadcrumb>
                <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item href="#">Jobs</Breadcrumb.Item>
                <Breadcrumb.Item active>Jobs List</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12} xs={12} className="mb-5">
          <Card>
            <Card.Body className='px-0'>
              <DataTable
                customStyles={customStyles}
                columns={columns}
                data={filter}
                pagination
                paginationComponent={Pagination}
                selectableRows
                selectableRowsHighlight
                selectableRowsComponent={BootstrapCheckbox}
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                paginationRowsPerPageOptions={[3, 5, 10]}
                subHeaderAlign="left"
                actions={actionsMemo}
                onRowClicked={handleRowClicked} // Add this line
                highlightOnHover
                pointerOnHover
                className={styles.dataTableRow} // Apply the CSS module class
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

export default ViewJobs;

// // import node module libraries
// import React, { Fragment, useMemo, useState, useEffect } from 'react';
// import { Col, Row, Breadcrumb, Card, Button, Badge } from 'react-bootstrap';
// import DataTable from 'react-data-table-component';
// import { FaUser } from 'react-icons/fa';


// // import sub components
// import { Pagination } from 'sub-components';

// // import data files
// import EmployeeData from 'data/dashboard/tables/JobsData';

// // import Firebase
// import { db } from '../../../firebase'; // Adjust the path as necessary
// import { collection, getDocs } from "firebase/firestore";

// // import utility file
// import { convertToCurrency } from 'helper/utils';
// import JobListData from 'data/dashboard/tables/JobsData';

// const ViewJobs = () => {

//   const customStyles = {
//     headCells: {
//       style: {
//         fontWeight: 'bold',
//         fontSize: '14px',
//         backgroundColor: "#F1F5FC",
//         wordWrap: 'break-word', // Ensure column headers wrap text
//         whiteSpace: 'normal', // Allow wrapping
//         textAlign: 'left', // Center align headers
//       },
//     },
//     cells: {
//       style: {
//         color: '#64748b',
//         fontSize: '14px',
//         wordWrap: 'break-word', // Ensure cells wrap text
//         whiteSpace: 'normal', // Allow wrapping
//         textAlign: 'left', // Center align cells
//       },
//     },
//     rows: {
//       style: {
//         minHeight: '72px', // Adjust row height for better spacing
//         wordWrap: 'break-word', // Ensure cells wrap text
//         textAlign: 'center', // Center align rows
//       },
//     },
//   };

//   const jobStatusMap = {
//     "C": "Created",
//     "CO": "Confirm",
//     "CA": "Cancel",
//     "JS": "Job Started",
//     "JC": "Job Complete",
//     "V": "Validate",
//     "S": "Scheduled",
//     "US": "Unscheduled",
//     "RS": "Re-scheduled"
//   };

//   const jobPriorityMap = {
//     "L": "Low",
//     "M": "Mid",
//     "H": "High"
//   };

//   const getPriorityBadge = (priority) => {
//     switch (priority) {
//       case 'L':
//         return <Badge bg="success">Low</Badge>;
//       case 'M':
//         return <Badge bg="warning">Mid</Badge>;
//       case 'H':
//         return <Badge bg="danger">High</Badge>;
//       default:
//         return priority;
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'C':
//         return <Badge bg="info">Created</Badge>;
//       case 'CO':
//         return <Badge bg="primary">Confirm</Badge>;
//       case 'CA':
//         return <Badge bg="danger">Cancel</Badge>;
//       case 'JS':
//         return <Badge bg="warning">Job Started</Badge>;
//       case 'JC':
//         return <Badge bg="success">Job Complete</Badge>;
//       case 'V':
//         return <Badge bg="secondary">Validate</Badge>;
//       case 'S':
//         return <Badge bg="info">Scheduled</Badge>;
//       case 'US':
//         return <Badge bg="dark">Unscheduled</Badge>;
//       case 'RS':
//         return <Badge bg="warning">Re-scheduled</Badge>;
//       default:
//         return status;
//     }
//   };

//   const formatTime = (time) => {
//     if (!time) return ''; // Return an empty string if time is undefined or null
//     const [hours, minutes] = time.split(':');
//     const hour = parseInt(hours, 10);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const formattedHour = hour % 12 || 12; // Convert '0' hour to '12'
//     return `${formattedHour}:${minutes} ${ampm}`;
//   };
  

//   const columns = [
//     { name: 'Job No.', selector: row => row.jobNo, sortable: true, width: '120px' },
//    { name: 'Worker Name', cell: row => <span><FaUser style={{ marginRight: '8px' }} />{row.workerFullName}</span>, sortable: true, wrap: true, width: '200px' },
//     { name: 'Job Name', selector: row => row.jobName, sortable: true, wrap: true, width: '200px' },
//     { name: 'Job Status', cell: row => getStatusBadge(row.jobStatus), sortable: false, width: '150px' },
//     { name: 'Job Description', selector: row => row.description, sortable: false, wrap: true, width: '300px' },
//     { name: 'Priority', cell: row => getPriorityBadge(row.jobPriority), sortable: true, width: '120px' },
//     { name: 'Date Start', selector: row => row.startDate, sortable: true, width: '150px' },
//     { name: 'Date End', selector: row => row.endDate, sortable: true, width: '150px' },
//     { name: 'Start Time', cell: row => formatTime(row.startTime), sortable: true, width: '150px' },
//     { name: 'End Time', cell: row => formatTime(row.endTime), sortable: true, width: '150px' }
//   ];
  

//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState('');
//   const [filter, setFilter] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const jobsSnapshot = await getDocs(collection(db, "jobs"));
//       const usersSnapshot = await getDocs(collection(db, "users"));
      
//       const jobsData = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//       const mergedData = jobsData.map(job => {
//         const workerNames = job.assignedWorkers.map(workerId => {
//           const worker = usersData.find(user => user.workerId === workerId);
//           return worker ? `${worker.firstName} ${worker.lastName}` : 'Unknown Worker';
//         }).join(', ');

//         return {
//           ...job,
//           workerFullName: workerNames
//         };
//       });

//       setData(mergedData);
//       setFilter(mergedData);
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const result = data.filter(item => {
//       return (
//         (item.workerFullName && item.workerFullName.toLowerCase().includes(search.toLowerCase())) ||
//         (item.jobName && item.jobName.toLowerCase().includes(search.toLowerCase())) ||
//         (item.jobStatus && item.jobStatus.toLowerCase().includes(search.toLowerCase())) ||
//         (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
//         (item.jobPriority && item.jobPriority.toLowerCase().includes(search.toLowerCase())) ||
//         (item.startDate && item.startDate.toLowerCase().includes(search.toLowerCase())) ||
//         (item.endDate && item.endDate.toLowerCase().includes(search.toLowerCase())) ||
//         (item.startTime && item.startTime.toLowerCase().includes(search.toLowerCase())) ||
//         (item.endTime && item.endTime.toLowerCase().includes(search.toLowerCase())) ||
//         (item.jobNo && item.jobNo.toString().includes(search))
//       );
//     });
//     setFilter(result);
//   }, [search, data]);
  

//   const subHeaderComponentMemo = useMemo(() => {
//     return (
//       <Fragment>
//         <input type="text"
//           className="form-control me-4 mb-4"
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </Fragment>
//     );
//   }, [search]);

//   const ActionButtons = () => {
//     return (
//       <Fragment>
//         <Button variant='light'>Excel</Button>
//         <Button variant='light'>CSV</Button>
//         <Button variant='light'>Print</Button>
//       </Fragment>
//     )
//   }
//   const actionsMemo = React.useMemo(() => <ActionButtons />, []);

//   const BootstrapCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
//     <div className="form-check">
//       <input
//         htmlFor="bootstrap-check"
//         type="checkbox"
//         className="form-check-input"
//         ref={ref}
//         onClick={onClick}
//         {...rest}
//       />
//       <label className="form-check-label" id="bootstrap-check" />
//     </div>
//   ));

//   BootstrapCheckbox.displayName = 'BootstrapCheckbox';

//   return (
//     <Fragment>
//       <Row>
//         <Col lg={12} md={12} sm={12}>
//           <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
//             <div className="mb-3 mb-md-0">
//               <h1 className="mb-1 h2 fw-bold">Jobs List</h1>
//               <Breadcrumb>
//                 <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
//                 <Breadcrumb.Item href="#">Jobs</Breadcrumb.Item>
//                 <Breadcrumb.Item active>Jobs List</Breadcrumb.Item>
//               </Breadcrumb>
//             </div>
//           </div>
//         </Col>
//       </Row>
//       <Row>
//         <Col md={12} xs={12} className="mb-5">
//           <Card>
//             <Card.Body className='px-0'>
//               <DataTable
//                 customStyles={customStyles}
//                 columns={columns}
//                 data={filter}
//                 pagination
//                 paginationComponent={Pagination}
//                 selectableRows
//                 selectableRowsHighlight
//                 selectableRowsComponent={BootstrapCheckbox}
//                 subHeader
//                 subHeaderComponent={subHeaderComponentMemo}
//                 paginationRowsPerPageOptions={[3, 5, 10]}
//                 subHeaderAlign="left"
//                 actions={actionsMemo}
//               />
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Fragment>
//   );
// }

// export default ViewJobs;