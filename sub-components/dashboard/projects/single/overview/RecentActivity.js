import React, { useEffect, useState } from 'react';
import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../../../firebase'; 

const RecentActivity = () => {
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const activitiesQuery = query(collection(db, 'recentActivities'), orderBy('time', 'desc'));
        const snapshot = await getDocs(activitiesQuery);
        const activitiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          time: new Date(doc.data().time.seconds * 1000).toLocaleString(), // Convert Firestore Timestamp to readable format
        }));
        setRecentActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching recent activities:', error);
      }
    };

    fetchRecentActivities();
  }, []);

  return (
    <Card>
      <Card.Header className="card-header-height d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">Recent Activity</h4>
        </div>
      </Card.Header>

      <Card.Body>
        <ListGroup variant="flush" className="list-timeline-activity">
          {recentActivities.map((item, index) => (
            <ListGroup.Item className="px-0 pt-0 border-0 pb-4" key={item.id}>
              <Row className="position-relative">
                <Col xs="auto">
                  <div className="icon-shape icon-md bg-light-primary text-primary rounded-circle">
                    <i className={`fe fe-${item.icon}`}></i>
                  </div>
                </Col>
                <Col className="ms-n3">
                  <h4 className="mb-0 h5">{item.activity}</h4>
                  <p className="mb-0 text-body">{item.activitybrief}</p>
                </Col>
                <Col xs="auto">
                  <span className="text-muted fs-6">{item.time}</span>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default RecentActivity;


// // import node module libraries
// import React from 'react';
// import Link from 'next/link';
// import { Row, Col, Card, ListGroup } from 'react-bootstrap';

// // import data files
// import RecentActivityData from 'data/dashboard/projects/RecentActivityData';

// const RecentActivity = () => {
// 	return (
// 		<Card>
// 			{/* Card header */}
// 			<Card.Header className="card-header-height d-flex justify-content-between align-items-center">
// 				<div>
// 					{' '}
// 					<h4 className="mb-0">Recent Activity</h4>
// 				</div>
// 				<div>
// 					<Link href="#" className="">
// 						View All
// 					</Link>
// 				</div>
// 			</Card.Header>

// 			{/* Card body */}
// 			<Card.Body>
// 				{/* List group */}
// 				<ListGroup variant="flush" className="list-timeline-activity">
// 					{RecentActivityData.map((item, index) => {
// 						return (
// 							<ListGroup.Item className="px-0 pt-0 border-0 pb-4" key={index}>
// 								<Row className="position-relative">
// 									<Col xs="auto">
// 										<div className="icon-shape icon-md bg-light-primary text-primary rounded-circle">
// 											<i className={`fe fe-${item.icon}`}></i>
// 										</div>
// 									</Col>
// 									<Col className="ms-n3">
// 										<h4 className="mb-0 h5">{item.activity}</h4>
// 										<p
// 											className="mb-0 text-body"
// 											dangerouslySetInnerHTML={{ __html: item.activitybrief }}
// 										></p>
// 									</Col>
// 									<Col xs="auto">
// 										<span className="text-muted fs-6">{item.time}</span>
// 									</Col>
// 								</Row>
// 							</ListGroup.Item>
// 						);
// 					})}
// 				</ListGroup>
// 			</Card.Body>
// 		</Card>
// 	);
// };
// export default RecentActivity;
