import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Container, Row, Col, Card, Tabs, Tab } from 'react-bootstrap';
import { collection, getDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { ContactTab } from 'sub-components/dashboard/worker/ContactTab';
import { PersonalTab } from 'sub-components/dashboard/worker/PersonalTab';
import { SkillsTab } from 'sub-components/dashboard/worker/SkillsTab';
import { useParams } from 'next/router';
import { GetStaticProps } from 'next';

const EditWorker = () => {
  const { workerId } = useParams();
  const [activeTab, setActiveTab] = useState('personal');
  const [personalData, setPersonalData] = useState({});
  const [contactData, setContactData] = useState({});
  const [skillsData, setSkillsData] = useState({});

  useEffect(() => {
    const fetchWorkerData = async () => {
      const workerRef = doc(collection(db, 'users'), workerId);
      const workerDoc = await getDoc(workerRef);
      const workerData = workerDoc.data();
  
      setPersonalData(workerData);
      setContactData(workerData.contact);
      setSkillsData(workerData.skills);
    };
  
    fetchWorkerData();
  }, [workerId]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handlePersonalFormSubmit = async (personalFormData) => {
    try {
      // Update personal data in Firestore
      const workerRef = doc(collection(db, 'users'), workerId);
      await setDoc(workerRef, {...personalFormData }, { merge: true });

      handleTabChange('contact');
    } catch (error) {
      console.error('Error updating personal data:', error);
    }
  };

  const handleContactFormSubmit = async (contactFormData) => {
    try {
      // Update contact data in Firestore
      const workerRef = doc(collection(db, 'users'), workerId);
      await setDoc(workerRef, { contact: contactFormData }, { merge: true });

      handleTabChange('skills');
    } catch (error) {
      console.error('Error updating contact data:', error);
    }
  };

  const handleSkillsFormSubmit = async (skillsFormData) => {
    try {
      // Update skills data in Firestore
      const workerRef = doc(collection(db, 'users'), workerId);
      await setDoc(workerRef, { skills: skillsFormData }, { merge: true });

      // Display SweetAlert success alert
      Swal.fire({
        title: 'Success!',
        text: 'Worker profile updated successfully.',
        icon: 'uccess',
      });
    } catch (error) {
      console.error('Error updating skills data:', error);
      // Display SweetAlert error alert
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while updating data.',
        icon: 'error',
      });
    }
  };

  return (
    <Container>
      <Row>
        <Col xl={12} lg={12} md={12} sm={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <Tabs activeKey={activeTab} onSelect={handleTabChange} className="mb-3">
                <Tab eventKey="personal" title="Personal">
                  <PersonalTab onSubmit={handlePersonalFormSubmit} initialValues={personalData} />
                </Tab>
                <Tab eventKey="contact" title="Contact">
                  <ContactTab onSubmit={handleContactFormSubmit} initialValues={contactData} />
                </Tab>
                <Tab eventKey="skills" title="Skills">
                  <SkillsTab onSubmit={handleSkillsFormSubmit} initialValues={skillsData} />
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditWorker;

export const getStaticProps = async ({ params }) => {
    const workerId = params.workerId;
    // Fetch worker data using the workerId
    return {
      props: {
        workerId,
      },
    };
  };