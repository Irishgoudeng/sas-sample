process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebase'; // Import your Firebase config
import jwt from 'jsonwebtoken';
import https from 'https';

// Initialize Firebase app
if (!initializeApp.length) {
  initializeApp(firebaseConfig);
}

// Fetch user data based on workerId from Firestore
async function fetchUserData(workerId) {
  const db = getFirestore();
  const userDocRef = doc(db, 'users', workerId);
  try {
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      console.log('User data fetched from Firestore:', userData);
      return userData; // Return the user data
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('Error fetching user data from Firestore:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  const { workerId, password } = req.body;
  console.log('Received request:', { workerId, password });

  try {
    const userData = await fetchUserData(workerId);
    console.log('Fetched user data:', userData);

    if (!userData.isAdmin) {
      console.log('Access denied. User is not an admin.');
      return res.status(401).json({ message: 'Access denied. You are not authorized.' });
    }

    const email = userData.email;
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in with email and password');

    // Trigger SAP B1 Service Layer Authentication
    const sapLoginResponse = await fetch(process.env.SAP_SERVICE_LAYER_BASE_URL + 'Login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        CompanyDB: process.env.SAP_B1_COMPANY_DB,
        UserName: process.env.SAP_B1_USERNAME,
        Password: process.env.SAP_B1_PASSWORD,
      }),
      agent: new https.Agent({ rejectUnauthorized: false }), // Disable cert verification
    });

    if (sapLoginResponse.ok) {
      const sapLoginData = await sapLoginResponse.json();
      const sessionId = sapLoginData.SessionId;
      const sessionTimeout = 30;

      res.setHeader('Set-Cookie', [
        `B1SESSION=${sessionId}; HttpOnly; Secure; SameSite=None`,
        `ROUTEID=.node4; Secure; SameSite=None`,
      ]);

      const token = { uid: auth.currentUser.uid, isAdmin: userData.isAdmin };
      const secretKey = 'kdaJLPhRtGKGTLiAThdvHnVR0H544DOGM3Q2OBerQk4L0z1zzcaOVqU0afHK6ab'; 
      const customToken = jwt.sign(token, secretKey, { expiresIn: '30m' });

      console.log('Generated custom token:', customToken);

      return res.status(200).json({
        message: 'Login successful',
        uid: auth.currentUser.uid,
        workerId,
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        isAdmin: userData.isAdmin,
        token,
        customToken,
        sessionId, 
        sessionTimeout,
      });
    } else {
      console.error('SAP B1 Service Layer login failed:', sapLoginResponse.statusText);
      return res.status(500).json({ message: 'SAP B1 Service Layer login failed' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}







// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { firebaseConfig } from '../../firebase'; // Import your Firebase config
// import jwt from 'jsonwebtoken';
// import https from 'https';

// // Initialize Firebase app
// if (!initializeApp.length) {
//   initializeApp(firebaseConfig);
// }

// // Fetch user email based on workerId from Firestore
// async function fetchUserEmail(workerId) {
//   const db = getFirestore();
//   const userDocRef = doc(db, 'users', workerId);
//   try {
//     const userDocSnapshot = await getDoc(userDocRef);
//     if (userDocSnapshot.exists()) {
//       const userData = userDocSnapshot.data();
//       console.log('User data fetched from Firestore:', userData);
//       return userData.email; // Return the email address
//     } else {
//       throw new Error('Invalid credentials'); // Changed error message
//     }
//   } catch (error) {
//     console.error('Error fetching user data from Firestore:', error);
//     throw error;
//   }
// }

// export default async function handler(req, res) {
//   const { workerId, password } = req.body;
//   console.log('Received request:', { workerId, password });

//   try {
//     const email = await fetchUserEmail(workerId);
//     console.log('Fetched user email:', email);

//     const auth = getAuth();
//     await signInWithEmailAndPassword(auth, email, password);
//     console.log('User signed in with email and password');

//     // Trigger SAP B1 Service Layer Authentication
//     const sapLoginResponse = await fetch(process.env.SAP_SERVICE_LAYER_BASE_URL + 'Login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         CompanyDB: process.env.SAP_B1_COMPANY_DB,
//         UserName: process.env.SAP_B1_USERNAME,
//         Password: process.env.SAP_B1_PASSWORD,
//       }),
//       agent: new https.Agent({ rejectUnauthorized: false }), // Disable cert verification
//     });

//     // Check if the SAP B1 Service Layer login was successful
//     if (sapLoginResponse.ok) {
//       const sapLoginData = await sapLoginResponse.json();
//       // Extract relevant data from SAP B1 Service Layer loginData
//       const sessionId = sapLoginData.SessionId;
//       const sessionTimeout = 30;

//       // Set cookies
//       res.setHeader('Set-Cookie', [
//         `B1SESSION=${sessionId}; HttpOnly; Secure`,
//         `ROUTEID=.node4; Secure`,
//       ]);

//       // Continue with your existing logic for generating custom token and sending response
//       const db = getFirestore();
//       const userDocRef = doc(db, 'users', workerId);
//       const userDocSnapshot = await getDoc(userDocRef);
//       if (userDocSnapshot.exists()) {
//         const userData = userDocSnapshot.data();
//         console.log('User data from Firestore:', userData);

//         if (userData.isAdmin) {
//           // Generate a custom token with a 30-minute expiration
//           const token = { uid: auth.currentUser.uid, isAdmin: userData.isAdmin };
//           const secretKey = 'kdaJLPhRtGKGTLiAThdvHnVR0H544DOGM3Q2OBerQk4L0z1zzcaOVqU0afHK6ab'; 
//           const customToken = jwt.sign(token, secretKey, { expiresIn: '30m' });

//           console.log('Generated custom token:', customToken);

//           // Return authentication data to client
//           res.status(200).json({
//             message: 'Login successful',
//             uid: auth.currentUser.uid,
//             workerId,
//             isAdmin: userData.isAdmin,
//             token,
//             customToken,
//             sessionId, 
//             sessionTimeout,
//           });
//         } else {
//           console.log('Access denied. User is not an admin.');
//           res.status(401).json({ message: 'Access denied. You are not authorized.' });
//         }
//       } else {
//         console.log('User data not found in Firestore.');
//         res.status(401).json({ message: 'Invalid credentials' }); 
//       }
//     } else {
//       // Handle SAP B1 Service Layer login failure
//       console.error('SAP B1 Service Layer login failed:', sapLoginResponse.statusText);
//       res.status(500).json({ message: 'SAP B1 Service Layer login failed' });
//     }
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }












/////////////////// OLD BUT WORKING ////////////////////////////////////////
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { firebaseConfig } from '../../firebase'; // Import your Firebase config
// import jwt from 'jsonwebtoken';

// // Initialize Firebase app
// if (!initializeApp.length) {
//   initializeApp(firebaseConfig);
// }

// // Fetch user email based on workerId from Firestore
// async function fetchUserEmail(workerId) {
//   const db = getFirestore();
//   const userDocRef = doc(db, 'users', workerId);
//   try {
//     const userDocSnapshot = await getDoc(userDocRef);
//     if (userDocSnapshot.exists()) {
//       const userData = userDocSnapshot.data();
//       console.log('User data fetched from Firestore:', userData);
//       return userData.email; // Return the email address
//     } else {
//       throw new Error('Invalid credentials'); // Changed error message
//     }
//   } catch (error) {
//     console.error('Error fetching user data from Firestore:', error);
//     throw error;
//   }
// }

// export default async function handler(req, res) {
//   const { workerId, password } = req.body;
//   console.log('Received request:', { workerId, password });

//   try {
//     const email = await fetchUserEmail(workerId);
//     console.log('Fetched user email:', email);

//     const auth = getAuth();
//     await signInWithEmailAndPassword(auth, email, password);
//     console.log('User signed in with email and password');

//     // Check if the user is an admin based on the isAdmin field in Firestore
//     const db = getFirestore();
//     const userDocRef = doc(db, 'users', workerId);
//     const userDocSnapshot = await getDoc(userDocRef);
//     if (userDocSnapshot.exists()) {
//       const userData = userDocSnapshot.data();
//       console.log('User data from Firestore:', userData);

//       if (userData.isAdmin) {
//         // Generate a custom token with a 30-minute expiration
//         const token = { uid: auth.currentUser.uid, isAdmin: userData.isAdmin };
//         const secretKey = 'kdaJLPhRtGKGTLiAThdvHnVR0H544DOGM3Q2OBerQk4L0z1zzcaOVqU0afHK6ab'; 
//         const customToken = jwt.sign(token, secretKey, { expiresIn: '30m' });

//         console.log('Generated custom token:', customToken);

//         // Return authentication data to client
//         res.status(200).json({
//           message: 'Login successful',
//           uid: auth.currentUser.uid,
//           workerId,
//           isAdmin: userData.isAdmin,
//           token,
//           customToken,
//         });
//       } else {
//         console.log('Access denied. User is not an admin.');
//         res.status(401).json({ message: 'Access denied. You are not authorized.' });
//       }
//     } else {
//       console.log('User data not found in Firestore.');
//       res.status(401).json({ message: 'Invalid credentials' }); 
//     }
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }


// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { firebaseConfig } from '../../firebase'; // Import your Firebase config
// import jwt from 'jsonwebtoken';

// // Initialize Firebase app
// if (!initializeApp.length) {
//   initializeApp(firebaseConfig);
// }

// // Fetch user email based on workerId from Firestore
// async function fetchUserEmail(workerId) {
//   const db = getFirestore();
//   const userDocRef = doc(db, 'users', workerId);
//   try {
//     const userDocSnapshot = await getDoc(userDocRef);
//     if (userDocSnapshot.exists()) {
//       const userData = userDocSnapshot.data();
//       console.log('User data fetched from Firestore:', userData);
//       return userData.email; // Return the email address
//     } else {
//       throw new Error('User data not found in Firestore.');
//     }
//   } catch (error) {
//     console.error('Error fetching user data from Firestore:', error);
//     throw error;
//   }
// }

// export default async function handler(req, res) {
//   const { workerId, password } = req.body;
//   console.log('Received request:', { workerId, password });

//   try {
//     const email = await fetchUserEmail(workerId);
//     console.log('Fetched user email:', email);

//     const auth = getAuth();
//     await signInWithEmailAndPassword(auth, email, password);
//     console.log('User signed in with email and password');

//     // Check if the user is an admin based on the isAdmin field in Firestore
//     const db = getFirestore();
//     const userDocRef = doc(db, 'users', workerId);
//     const userDocSnapshot = await getDoc(userDocRef);
//     if (userDocSnapshot.exists()) {
//       const userData = userDocSnapshot.data();
//       console.log('User data from Firestore:', userData);

//       if (userData.isAdmin) {
//         // Generate a custom token with a 30-minute expiration
//         const token = { uid: auth.currentUser.uid, isAdmin: userData.isAdmin };
//         const secretKey = 'kdaJLPhRtGKGTLiAThdvHnVR0H544DOGM3Q2OBerQk4L0z1zzcaOVqU0afHK6ab'; 
//         const customToken = jwt.sign(token, secretKey, { expiresIn: '30m' });

//         console.log('Generated custom token:', customToken);

//         // Return authentication data to client
//         res.status(200).json({
//           message: 'Login successful',
//           uid: auth.currentUser.uid,
//           workerId,
//           isAdmin: userData.isAdmin,
//           token,
//           customToken,
//         });
//       } else {
//         console.log('Access denied. User is not an admin.');
//         res.status(401).json({ message: 'Access denied. You are not authorized.' });
//       }
//     } else {
//       console.log('User data not found in Firestore.');
//       res.status(401).json({ message: 'User data not found in Firestore.' });
//     }
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }

// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import jwt from 'jsonwebtoken';

// // Define fetchUserEmail function
// const fetchUserEmail = async (workerId) => {
//   const db = getFirestore();
//   const userDocRef = doc(db, 'users', workerId);
//   const userDocSnapshot = await getDoc(userDocRef);

//   if (userDocSnapshot.exists()) {
//     const userData = userDocSnapshot.data();
//     return userData.email;
//   } else {
//     throw new Error('User data not found in Firestore.');
//   }
// };

// export default async function handler(req, res) {
//   const { workerId, password } = req.body;
//   console.log('Received request:', { workerId, password });

//   try {
//     const email = await fetchUserEmail(workerId);
//     console.log('Fetched user email:', email);

//     const auth = getAuth();
//     await signInWithEmailAndPassword(auth, email, password);
//     console.log('User signed in with email and password');

//     // Check if the user is an admin based on the isAdmin field in Firestore
//     const db = getFirestore();
//     const userDocRef = doc(db, 'users', workerId);
//     const userDocSnapshot = await getDoc(userDocRef);
//     if (userDocSnapshot.exists()) {
//       const userData = userDocSnapshot.data();
//       console.log('User data from Firestore:', userData);

//       if (userData.isAdmin) {
//         // Generate a custom token with a 30-minute expiration
//         const token = { uid: auth.currentUser.uid, isAdmin: userData.isAdmin, workerId };
//         const secretKey = 'kdaJLPhRtGKGTLiAThdvHnVR0H544DOGM3Q2OBerQk4L0z1zzcaOVqU0afHK6ab'; // Replace with your secret key
//         const customToken = jwt.sign(token, secretKey, { expiresIn: '30m' });

//         console.log('Generated custom token:', customToken);

//         // Return authentication data to client
//         res.setHeader('Set-Cookie', `customToken=${customToken}; HttpOnly; Path=/; Max-Age=1800`);
//         res.status(200).json({
//           message: 'Login successful',
//           customToken,
//         });
//       } else {
//         console.log('Access denied. User is not an admin.');
//         res.status(401).json({ message: 'Access denied. You are not authorized.' });
//       }
//     } else {
//       console.log('User data not found in Firestore.');
//       res.status(401).json({ message: 'User data not found in Firestore.' });
//     }
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }





// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { firebaseConfig } from '../../firebase'; // Import your Firebase config
// import jwt from 'jsonwebtoken';

// // Initialize Firebase app
// if (!initializeApp.length) {
//   initializeApp(firebaseConfig);
// }

// // Fetch user email based on workerId from Firestore
// async function fetchUserEmail(workerId) {
//   const db = getFirestore();
//   const userDocRef = doc(db, 'users', workerId);
//   try {
//     const userDocSnapshot = await getDoc(userDocRef);
//     if (userDocSnapshot.exists()) {
//       const userData = userDocSnapshot.data();
//       return userData.email; // Return the email address
//     } else {
//       throw new Error('User data not found in Firestore.');
//     }
//   } catch (error) {
//     throw error;
//   }
// }


// export default async function handler(req, res) {
//   const { workerId, password } = req.body;

//   try {
//     const email = await fetchUserEmail(workerId);

//     const auth = getAuth();
//     await signInWithEmailAndPassword(auth, email, password);

//     // Check if the user is an admin based on the isAdmin field in Firestore
//     const db = getFirestore();
//     const userDocRef = doc(db, 'users', workerId);
//     const userDocSnapshot = await getDoc(userDocRef);
//     if (userDocSnapshot.exists()) {
//       const userData = userDocSnapshot.data();
//       if (userData.isAdmin) {
//         // Generate a custom token with a 30-minute expiration
//         const token = { uid: auth.currentUser.uid, isAdmin: userData.isAdmin };
//         const secretKey = 'kdaJLPhRtGKGTLiAThdvHnVR0H544DOGM3Q2OBerQk4L0z1zzcaOVqU0afHK6ab'; // Replace with your secret key
//         const customToken = jwt.sign(token, secretKey, { expiresIn: '30m' });

//         // Return authentication data to client
//         res.status(200).json({
//           message: 'Login successful',
//           token,
//           customToken,
//         });
//       } else {
//         res.status(401).json({ message: 'Access denied. You are not authorized.' });
//       }
//     } else {
//       res.status(401).json({ message: 'User data not found in Firestore.' });
//     }
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }


//////////////////////////////////////////////////////////
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { firebaseConfig } from '../../firebase'; // Import your Firebase config

// // Initialize Firebase app
// if (!initializeApp.length) {
//   initializeApp(firebaseConfig);
// }

// // Fetch user email based on workerId from Firestore
// async function fetchUserEmail(workerId) {
//   const db = getFirestore();
//   const userDocRef = doc(db, 'users', workerId);
//   try {
//     const userDocSnapshot = await getDoc(userDocRef);
//     if (userDocSnapshot.exists()) {
//       const userData = userDocSnapshot.data();
//       return userData.email; // Return the email address
//     } else {
//       throw new Error('User data not found in Firestore.');
//     }
//   } catch (error) {
//     throw error;
//   }
// }

// export default async function handler(req, res) {
//   const { workerId, password } = req.body;

//   try {
//     const email = await fetchUserEmail(workerId);


//     const auth = getAuth();
//     await signInWithEmailAndPassword(auth, email, password);

//     // Check if the user is an admin based on the isAdmin field in Firestore
//     const db = getFirestore();
//     const userDocRef = doc(db, 'users', workerId);
//     const userDocSnapshot = await getDoc(userDocRef);
//     if (userDocSnapshot.exists()) {
//       const userData = userDocSnapshot.data();
//       if (userData.isAdmin) {
//         // Return authentication data to client
//         res.status(200).json({
//           message: 'Login successful',
//           uid: auth.currentUser.uid,
//           workerId,
//           isAdmin: userData.isAdmin,
//         });
//       } else {
//         res.status(401).json({ message: 'Access denied. You are not authorized.' });
//       }
//     } else {
//       res.status(401).json({ message: 'User data not found in Firestore.' });
//     }
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }





// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { firebaseConfig } from '../../firebase'; // Import your Firebase config

// // Initialize Firebase app
// if (!initializeApp.length) {
//   initializeApp(firebaseConfig);
// }

// // Fetch user email based on workerId from Firestore
// async function fetchUserEmail(workerId) {
//   const db = getFirestore();
//   const userDocRef = doc(db, 'users', workerId);
//   try {
//     const userDocSnapshot = await getDoc(userDocRef);
//     if (userDocSnapshot.exists()) {
//       const userData = userDocSnapshot.data();
//       return userData.email; // Return the email address
//     } else {
//       throw new Error('User data not found in Firestore.');
//     }
//   } catch (error) {
//     throw error;
//   }
// }

// export default async function handler(req, res) {
//   const { workerId, password } = req.body;

//   try {
//     // Fetch user email based on workerId from Firestore
//     const email = await fetchUserEmail(workerId);

//     // Authenticate user with fetched email and password
//     const auth = getAuth();
//     await signInWithEmailAndPassword(auth, email, password);

//     // Check if the user is an admin based on the isAdmin field in Firestore
//     const db = getFirestore();
//     const userDocRef = doc(db, 'users', workerId);
//     const userDocSnapshot = await getDoc(userDocRef);
//     if (userDocSnapshot.exists()) {
//       const userData = userDocSnapshot.data();
//       if (userData.isAdmin) {
//         // Set cookies for authentication
//         res.setHeader('Set-Cookie', [
//           `uid=${auth.currentUser.uid}; Path=/; HttpOnly`,
//           `workerId=${workerId}; Path=/; HttpOnly`,
//           `isAdmin=${userData.isAdmin}; Path=/; HttpOnly`,
//         ]);
//         res.status(200).json({ message: 'Login successful' });
//       } else {
//         res.status(401).json({ message: 'Access denied. You are not authorized.' });
//       }
//     } else {
//       res.status(401).json({ message: 'User data not found in Firestore.' });
//     }
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }
