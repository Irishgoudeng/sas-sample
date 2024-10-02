import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Container, Row, Col, Card, Tabs, Tab } from 'react-bootstrap';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, setDoc, doc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../../firebase'; 
import { ContactTab } from 'sub-components/dashboard/worker/ContactTab';
import { PersonalTab } from 'sub-components/dashboard/worker/PersonalTab';
import { SkillsTab } from 'sub-components/dashboard/worker/SkillsTab';


const CreateWorker = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [personalData, setPersonalData] = useState({});
  const [contactData, setContactData] = useState({});
  const [skillsData, setSkillsData] = useState({});
  const timestamp = Timestamp.now();

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handlePersonalFormSubmit = async (personalFormData, workerId) => {
    try {
      const { email, password } = personalFormData;
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Include workerId in userData along with other personal data
      const userData = { uid: user.uid, workerId, ...personalFormData, timestamp };

      setPersonalData(userData);
      handleTabChange('contact');
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const handleContactFormSubmit = async (contactFormData) => {
    try {
      setContactData({ ...contactFormData });
      handleTabChange('skills');
    } catch (error) {
      console.error('Error saving contact data:', error);
    }
  };

  const handleSkillsFormSubmit = async (skillsFormData) => {
    try {
      // Combine all data including skills
      const userData = { ...personalData, ...contactData, skills: skillsFormData };
  
      // Save all data to Firestore
      const userDocRef = await setDoc(doc(collection(db, 'users'), personalData.workerId), userData);
      handleTabChange('personal');
      
      // Display SweetAlert success alert
      Swal.fire({
        title: 'Success!',
        text: 'Worker profile created successfully.',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error saving data:', error);
      // Display SweetAlert error alert
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while saving data.',
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
                  <PersonalTab onSubmit={handlePersonalFormSubmit} />
                </Tab>
                <Tab eventKey="contact" title="Contact">
                  <ContactTab onSubmit={handleContactFormSubmit} />
                </Tab>
                <Tab eventKey="skills" title="Skills">
                  <SkillsTab onSubmit={handleSkillsFormSubmit} />
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateWorker;





// import React, { useState } from 'react';

// import { Container, Row, Col, Card, Tabs, Tab, Button } from 'react-bootstrap';
// import { ContactTab } from 'sub-components/dashboard/worker/ContactTab';
// import { PersonalTab } from 'sub-components/dashboard/worker/PersonalTab';
// import { SkillsTab } from 'sub-components/dashboard/worker/SkillsTab';
// import { addDoc, collection } from 'firebase/firestore';
// import { db } from './../../../firebase'; 

// const CreateWorker = () => {
//   const [activeTab, setActiveTab] = useState('personal');
//   const [formData, setFormData] = useState({});

//   const handleTabChange = (key) => {
//     setActiveTab(key);
//   };

//   const handlePersonalFormSubmit = async (personalFormData) => {
//     try {
//       // Create user with email and password
//       const { email, password, displayName } = personalFormData;
//       await createUserWithEmailAndPassword(auth, email, password);

//       const currentUser = auth.currentUser;
//       await updateProfile(currentUser, { displayName });
  
    
//       const userData = {
//         email,
//         displayName,
//       };
//       const docRef = await addDoc(collection(db, 'users'), userData);
  
//       // Move to the next tab
//       setFormData({ ...formData, personal: personalFormData });
//       handleTabChange('contact');
//     } catch (error) {
//       console.error('Error creating user:', error);
//     }
//   };

//   const handleContactFormSubmit = async (contactFormData) => {
//     try {
//       // Save contact data to Firestore
//       const currentUser = auth.currentUser;
//       const contactData = {
//         userId: currentUser.uid, 
//         ...contactFormData, 
//       };
//       await addDoc(collection(db, 'contact'), contactData);
  
      
//       setFormData({ ...formData, contact: contactFormData });
//       handleTabChange('skills');
//     } catch (error) {
//       console.error('Error saving contact data:', error);
      
//     }
//   };
  
//   const handleSkillsFormSubmit = async (skillsFormData) => {
//     try {
//       // Save skills data to Firestore
//       const currentUser = auth.currentUser;
//       const skillsData = {
//         userId: currentUser.uid, 
//         ...skillsFormData, 
//       };
//       await addDoc(collection(db, 'skills'), skillsData);
  
//       // Move to the next tab or perform other actions
//       setFormData({ ...formData, skills: skillsFormData });
//       console.log(formData); 
//     } catch (error) {
//       console.error('Error saving skills data:', error);
//       // Handle error (e.g., show error message to the user)
//     }
//   };
  
// //   const handlePersonalFormSubmit = (personalFormData) => {
// //     setFormData({ ...formData, personal: personalFormData });
// //     handleTabChange('contact');
// //   };
  
// //   const handleContactFormSubmit = (contactFormData) => {
// //     setFormData({ ...formData, contact: contactFormData });
// //     handleTabChange('skills');
// //   };

// //   const handleSkillsFormSubmit = (skillsFormData) => {
// //     setFormData({ ...formData, skills: skillsFormData });
// //     console.log(formData); // Log form data after skills form submission
// //   };

  

//   return (
//     <Container>
//       <Row>
//         <Col xl={12} lg={12} md={12} sm={12}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Tabs activeKey={activeTab} onSelect={handleTabChange} className="mb-3">
//                 <Tab eventKey="personal" title="Personal">
//                   <PersonalTab onSubmit={handlePersonalFormSubmit} />
//                 </Tab>
//                 <Tab eventKey="contact" title="Contact">
//                   <ContactTab onSubmit={handleContactFormSubmit} />
//                 </Tab>
//                 <Tab eventKey="skills" title="Skills">
//                   <SkillsTab onSubmit={handleSkillsFormSubmit} />
//                 </Tab>
//               </Tabs>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default CreateWorker;



// import React from 'react'
// import {
//     Container,
//     Row,
//     Col,
//     Card,
//     Form,
//     FormGroup,
//     FormLabel,
//     FormControl,
//     Button,
//     InputGroup,
//     Alert,
// } from 'react-bootstrap';

// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';
// import { ContactTab } from 'sub-components/dashboard/worker/ContactTab';
// import { PersonalTab } from 'sub-components/dashboard/worker/PersonalTab';
// import { SkillsTab } from 'sub-components/dashboard/worker/SkillsTab';


// const CreateWorker = () => {
    
//   return (
//       <Container>
//           <Row>
//               <Col xl={12} lg={12} md={12} sm={12}>
//                   <Card className="shadow-sm">
//                       <Card.Body>
//                           <Tabs
//                               defaultActiveKey="personal"
//                               id="uncontrolled-tab-example"
//                               className="mb-3"
//                           >
//                               <Tab eventKey="personal" title="Personal">
//                               <PersonalTab />
//                               </Tab>
//                               <Tab eventKey="contact" title="Contact">
//                                   <ContactTab />
//                               </Tab>
//                               <Tab eventKey="skills" title="Skills">
//                                   <SkillsTab />
//                                </Tab>
            
//                           </Tabs>
                         

//                       </Card.Body>
                      
//                   </Card>
//               </Col>
//           </Row>
//       </Container>
//   )
// }

// export default CreateWorker