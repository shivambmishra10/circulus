// // pages/trips/[id].js
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Head from 'next/head';
// import Link from 'next/link';
// import { Container, Row, Col, Card, Button, Badge, ListGroup, Alert } from 'react-bootstrap';
// import Navigation from '../../components/Navigation';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../utils/api';

// export default function TripDetails() {
//   const router = useRouter();
//   const { id } = router.query;
//   const { user, isAuthenticated } = useAuth();
  
//   const [trip, setTrip] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [joinRequestStatus, setJoinRequestStatus] = useState(null);
//   const [submitLoading, setSubmitLoading] = useState(false);

//   useEffect(() => {
//     if (!id) return;
    
//     async function fetchTripDetails() {
//       try {
//         const response = await api.get(`/api/trips/${id}/`);
//         setTrip(response.data);
        
//         if (isAuthenticated) {
//           const requestResponse = await api.get(`/api/trips/${id}/join-status/`);
//           setJoinRequestStatus(requestResponse.data.status);
//         }
        
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching trip details:', error);
//         setLoading(false);
//       }
//     }

//     fetchTripDetails();
//   }, [id, isAuthenticated]);

//   const handleJoinRequest = async () => {
//     if (!isAuthenticated) {
//       router.push(`/login?redirect=/trips/${id}`);
//       return;
//     }
    
//     setSubmitLoading(true);
//     try {
//       await api.post(`/api/trips/${id}/join-request/`);
//       setJoinRequestStatus('pending');
//     } catch (error) {
//       console.error('Error sending join request:', error);
//     }
//     setSubmitLoading(false);
//   };

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

//   if (!trip) {
//     return (
//       <div>
//         <Navigation />
//         <Container className="py-5 text-center">
//           <p>Trip not found</p>
//         </Container>
//       </div>
//     );
//   }

//   const isMember = isAuthenticated && (
//     user.id === trip.host.id || 
//     trip.members.some(member => member.id === user.id)
//   );

//   return (
//     <div>
//       <Head>
//         <title>{trip.group_name} | Circulus</title>
//       </Head>

//       <Navigation />

//       <Container className="py-5">
//         <Row>
//           <Col lg={8}>
//             <Card className="mb-4 shadow-sm">
//               <Card.Body>
//                 <div className="d-flex justify-content-between align-items-start mb-3">
//                   <div>
//                     <h2 className="mb-1">{trip.group_name}</h2>
//                     <p className="text-muted">
//                       <strong>Destination:</strong> {trip.destination.name}
//                     </p>
//                   </div>
//                   <div>
//                     <Badge bg="info" className="p-2">
//                       {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
//                     </Badge>
//                   </div>
//                 </div>

//                 <h5>Description</h5>
//                 <p>{trip.description}</p>

//                 <div className="my-4">
//                   <h5>Trip Itinerary</h5>
//                   <ListGroup variant="flush" className="border rounded">
//                     {trip.itinerary_items.map((item) => (
//                       <ListGroup.Item key={item.id}>
//                         <strong>Day {item.day}:</strong> {item.description}
//                       </ListGroup.Item>
//                     ))}
//                   </ListGroup>
//                 </div>

//                 {isMember && (
//                   <div className="mt-4">
//                     <Link href={`/trips/${id}/chat`}>
//                       <Button variant="success" className="w-100">
//                         Open Group Chat
//                       </Button>
//                     </Link>
//                   </div>
//                 )}

//                 {!isMember && (
//                   <div className="mt-4">
//                     {joinRequestStatus === 'pending' && (
//                       <Alert variant="info">
//                         Your request to join this trip is pending approval.
//                       </Alert>
//                     )}
//                     {joinRequestStatus === 'accepted' && (
//                       <Alert variant="success">
//                         You\&apos;ve been accepted to this trip!
//                       </Alert>
//                     )}
//                     {joinRequestStatus === 'rejected' && (
//                       <Alert variant="danger">
//                         Your request to join this trip was declined.
//                       </Alert>
//                     )}
//                     {!joinRequestStatus && (
//                       <Button 
//                         variant="primary" 
//                         className="w-100"
//                         onClick={handleJoinRequest}
//                         disabled={submitLoading}
//                       >
//                         {submitLoading ? 'Processing...' : 'Request to Join Trip'}
//                       </Button>
//                     )}
//                   </div>
//                 )}
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col lg={4}>
//             <Card className="mb-4 shadow-sm">
//               <Card.Body>
//                 <h5 className="mb-3">Trip Details</h5>
//                 <p>
//                   <strong>Members:</strong> {trip.current_members_count}/{trip.required_members}
//                 </p>
//                 <p>
//                   <strong>Age Criteria:</strong> {trip.min_age} - {trip.max_age} years
//                 </p>
//                 <p>
//                 <strong>Host:</strong>{' '}
//                   <Link href={`/users/${trip.host.id}`}>
//                     {trip.host.name || trip.host.username}
//                   </Link>
//                 </p>
//               </Card.Body>
//             </Card>

//             <Card className="shadow-sm">
//               <Card.Header>
//                 <h5 className="mb-0">Group Members</h5>
//               </Card.Header>
//               <ListGroup variant="flush">
//                 <ListGroup.Item>
//                   <Link href={`/users/${trip.host.id}`} className="d-flex align-items-center text-decoration-none">
//                     <div className="fw-bold">{trip.host.name || trip.host.username}</div>
//                     <Badge bg="primary" className="ms-2">Host</Badge>
//                   </Link>
//                 </ListGroup.Item>
//                 {trip.members.map((member) => (
//                   <ListGroup.Item key={member.id}>
//                     <Link href={`/users/${member.id}`} className="text-decoration-none">
//                       {member.name || member.username}
//                     </Link>
//                   </ListGroup.Item>
//                 ))}
//               </ListGroup>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// }

// pages/trips/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Alert } from 'react-bootstrap';
import Navigation from '../../components/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function TripDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinRequestStatus, setJoinRequestStatus] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    if (!id) return;
    
    async function fetchTripDetails() {
      try {
        const tripResponse = await api.get(`/api/trips/${id}/`);
        setTrip(tripResponse.data);
        
        // For non-host users, fetch join status for this trip.
        if (isAuthenticated) {
          const statusResponse = await api.get(`/api/trips/${id}/join-status/`);
          setJoinRequestStatus(statusResponse.data.status);
        }
        
        // If the current user is the host, fetch pending join requests.
        if (isAuthenticated && tripResponse.data.host.id === user.id) {
          const requestsResponse = await api.get(`/api/trip-requests/`);
          // Filter requests to only include those for this trip.
          const tripRequests = requestsResponse.data.filter(
            req => req.trip.id === tripResponse.data.id
          );
          setPendingRequests(tripRequests);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trip details:', error);
        setLoading(false);
      }
    }

    fetchTripDetails();
  }, [id, isAuthenticated, user]);

  const handleJoinRequest = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/trips/${id}`);
      return;
    }
    
    setSubmitLoading(true);
    try {
      await api.post(`/api/trips/${id}/join-request/`);
      setJoinRequestStatus('pending');
    } catch (error) {
      console.error('Error sending join request:', error);
    }
    setSubmitLoading(false);
  };

  // Functions to handle approving and rejecting join requests (for trip hosts)
  const handleApprove = async (requestId) => {
    try {
      await api.post(`/api/trip-requests/${requestId}/approve/`);
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.post(`/api/trip-requests/${requestId}/reject/`);
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error rejecting request:', error);
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

  if (!trip) {
    return (
      <div>
        <Navigation />
        <Container className="py-5 text-center">
          <p>Trip not found</p>
        </Container>
      </div>
    );
  }

  const isMember = isAuthenticated && (
    user.id === trip.host.id || 
    trip.members.some(member => member.id === user.id)
  );

  return (
    <div>
      <Head>
        <title>{trip.group_name} | Circulus</title>
      </Head>

      <Navigation />

      <Container className="py-5">
        <Row>
          <Col lg={8}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h2 className="mb-1">{trip.group_name}</h2>
                    <p className="text-muted">
                      <strong>Destination:</strong> {trip.destination.name}
                    </p>
                  </div>
                  <div>
                    <Badge bg="info" className="p-2">
                      {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>

                <h5>Description</h5>
                <p>{trip.description}</p>

                <div className="my-4">
                  <h5>Trip Itinerary</h5>
                  <ListGroup variant="flush" className="border rounded">
                    {trip.itinerary_items.map((item) => (
                      <ListGroup.Item key={item.id}>
                        <strong>Day {item.day}:</strong> {item.description}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>

                {isMember && (
                  <div className="mt-4">
                    <Link href={`/trips/${id}/chat`}>
                      <Button variant="success" className="w-100">
                        Open Group Chat
                      </Button>
                    </Link>
                  </div>
                )}

                {!isMember && (
                  <div className="mt-4">
                    {joinRequestStatus === 'pending' && (
                      <Alert variant="info">
                        Your request to join this trip is pending approval.
                      </Alert>
                    )}
                    {joinRequestStatus === 'accepted' && (
                      <Alert variant="success">
                        You’ve been accepted to this trip!
                      </Alert>
                    )}
                    {joinRequestStatus === 'rejected' && (
                      <Alert variant="danger">
                        Your request to join this trip was declined.
                      </Alert>
                    )}
                    {!joinRequestStatus && (
                      <Button 
                        variant="primary" 
                        className="w-100"
                        onClick={handleJoinRequest}
                        disabled={submitLoading}
                      >
                        {submitLoading ? 'Processing...' : 'Request to Join Trip'}
                      </Button>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h5 className="mb-3">Trip Details</h5>
                <p>
                  <strong>Members:</strong> {trip.current_members_count}/{trip.required_members}
                </p>
                <p>
                  <strong>Age Criteria:</strong> {trip.min_age} - {trip.max_age} years
                </p>
                <p>
                  <strong>Host:</strong>{' '}
                  <Link href={`/users/${trip.host.id}`}>
                    {trip.host.name || trip.host.username}
                  </Link>
                </p>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">Group Members</h5>
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Link href={`/users/${trip.host.id}`} className="d-flex align-items-center text-decoration-none">
                    <div className="fw-bold">{trip.host.name || trip.host.username}</div>
                    <Badge bg="primary" className="ms-2">Host</Badge>
                  </Link>
                </ListGroup.Item>
                {trip.members.map((member) => (
                  <ListGroup.Item key={member.id}>
                    <Link href={`/users/${member.id}`} className="text-decoration-none">
                      {member.name || member.username}
                    </Link>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>

            {/* Show pending join requests only if the logged-in user is the host */}
            {isAuthenticated && trip.host.id === user.id && (
              <Card className="mt-4 shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">Pending Join Requests</h5>
                </Card.Header>
                <ListGroup variant="flush">
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map(req => (
                      <ListGroup.Item key={req.id} className="d-flex justify-content-between align-items-center">
                        <div>
                          {req.user.name || req.user.username} (<small>{req.user.email}</small>)
                        </div>
                        <div>
                          <Button variant="success" size="sm" onClick={() => handleApprove(req.id)}>Approve</Button>{' '}
                          <Button variant="danger" size="sm" onClick={() => handleReject(req.id)}>Reject</Button>
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item>No pending requests.</ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
