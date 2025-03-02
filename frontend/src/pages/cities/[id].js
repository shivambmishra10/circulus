// // pages/cities/[id].js
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Head from 'next/head';
// import Link from 'next/link';
// import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
// import Navigation from '../../components/Navigation';
// import api from '../../utils/api';

// export default function CityTrips() {
//   const router = useRouter();
//   const { id } = router.query;
  
//   const [city, setCity] = useState(null);
//   const [trips, setTrips] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;
    
//     async function fetchCityTrips() {
//       try {
//         const cityResponse = await api.get(`/api/cities/${id}/`);
//         const tripsResponse = await api.get(`/api/cities/${id}/trips/`);
        
//         setCity(cityResponse.data);
//         setTrips(tripsResponse.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       }
//     }

//     fetchCityTrips();
//   }, [id]);

//   if (loading) {
//     return (
//       <div>
//         <Navigation />
//         <Container className="py-5 text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </Container>
//       </div>
//     );
//   }

//   if (!city) {
//     return (
//       <div>
//         <Navigation />
//         <Container className="py-5 text-center">
//           <p>City not found</p>
//         </Container>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Head>
//         <title>Trips to {city.name} | Circulus</title>
//       </Head>

//       <Navigation />

//       <Container className="py-5">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h2>Trips to {city.name}</h2>
//           <Link href={`/trips/create?city=${city.id}`}>
//             <Button variant="primary">Create Trip to {city.name}</Button>
//           </Link>
//         </div>

//         {trips.length === 0 ? (
//           <div className="text-center py-5">
//             <p className="lead">No trips available for this destination yet.</p>
//             <p>Be the first to create a trip!</p>
//           </div>
//         ) : (
//           <Row>
//             {trips.map((trip) => (
//               <Col key={trip.id} lg={6} className="mb-4">
//                 <Card className="h-100 shadow-sm">
//                   <Card.Body>
//                     <Card.Title>{trip.group_name}</Card.Title>
//                     <div className="mb-3">
//                       <Badge bg="info" className="me-2">
//                         {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
//                       </Badge>
//                       <Badge bg="secondary">
//                         Members: {trip.current_members_count}/{trip.required_members}
//                       </Badge>
//                     </div>
//                     <Card.Text>
//                       {trip.description.length > 100 
//                         ? `${trip.description.substring(0, 100)}...` 
//                         : trip.description}
//                     </Card.Text>
//                     <div className="d-flex mt-auto pt-3">
//                       <Link href={`/trips/${trip.id}`}>
//                         <Button variant="outline-primary" className="me-2">View Details</Button>
//                       </Link>
//                       <Link href={`/trips/${trip.id}`}>
//                         <Button variant="primary">Apply</Button>
//                       </Link>
//                     </div>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         )}
//       </Container>
//     </div>
//   );
// }


// pages/cities/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import Navigation from '../../components/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function CityTrips() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuth();

  const [city, setCity] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  // Track join request status for each trip by its ID
  const [joinStatus, setJoinStatus] = useState({});

  useEffect(() => {
    if (!id) return;
    
    async function fetchCityTrips() {
      try {
        const cityResponse = await api.get(`/api/cities/${id}/`);
        const tripsResponse = await api.get(`/api/cities/${id}/trips/`);
        
        setCity(cityResponse.data);
        setTrips(tripsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchCityTrips();
  }, [id]);

  const handleApply = async (tripId) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/cities/${id}`);
      return;
    }

    try {
      await api.post(`/api/trips/${tripId}/join-request/`);
      // Mark this trip's join status as "pending"
      setJoinStatus(prevStatus => ({ ...prevStatus, [tripId]: 'pending' }));
    } catch (error) {
      console.error('Error sending join request:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <Container className="py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Container>
      </div>
    );
  }

  if (!city) {
    return (
      <div>
        <Navigation />
        <Container className="py-5 text-center">
          <p>City not found</p>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Trips to {city.name} | Circulus</title>
      </Head>

      <Navigation />

      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Trips to {city.name}</h2>
          <Link href={`/trips/create?city=${city.id}`}>
            <Button variant="primary">Create Trip to {city.name}</Button>
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-5">
            <p className="lead">No trips available for this destination yet.</p>
            <p>Be the first to create a trip!</p>
          </div>
        ) : (
          <Row>
            {trips.map((trip) => (
              <Col key={trip.id} lg={6} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{trip.group_name}</Card.Title>
                    <div className="mb-3">
                      <Badge bg="info" className="me-2">
                        {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                      </Badge>
                      <Badge bg="secondary">
                        Members: {trip.current_members_count}/{trip.required_members}
                      </Badge>
                    </div>
                    <Card.Text className="flex-grow-1">
                      {trip.description.length > 100 
                        ? `${trip.description.substring(0, 100)}...` 
                        : trip.description}
                    </Card.Text>
                    <div className="d-flex mt-auto pt-3">
                      <Link href={`/trips/${trip.id}`}>
                        <Button variant="outline-primary" className="me-2">View Details</Button>
                      </Link>
                      <Button 
                        variant="primary" 
                        onClick={() => handleApply(trip.id)}
                        disabled={joinStatus[trip.id] === 'pending'}
                      >
                        {joinStatus[trip.id] === 'pending' ? 'Request Pending' : 'Apply'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}
