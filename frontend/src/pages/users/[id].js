import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import Navigation from '../../components/Navigation';
import api from '../../utils/api';

export default function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  
  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;
    
    async function fetchUserProfile() {
      try {
        const profileResponse = await api.get(`/api/users/${id}/`);
        const tripsResponse = await api.get(`/api/users/${id}/trips/`);
        
        setProfile(profileResponse.data);
        setTrips(tripsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [id]);
  
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
  
  if (!profile) {
    return (
      <div>
        <Navigation />
        <Container className="py-5 text-center">
          <p>User not found</p>
        </Container>
      </div>
    );
  }
  
  return (
    <div>
      <Head>
        <title>{profile.name || profile.username} | Circulus</title>
      </Head>
      
      <Navigation />
      
      <Container className="py-5">
        <Row>
          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Body className="text-center p-4">
                {profile.photos ? (
                  <img 
                    src={profile.photos} 
                    alt={profile.name || profile.username}
                    className="rounded-circle mb-3"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded-circle mb-3 bg-light d-flex align-items-center justify-content-center mx-auto"
                    style={{ width: '150px', height: '150px' }}
                  >
                    <span className="display-4 text-muted">
                      {(profile.name || profile.username).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                <h3>{profile.name || profile.username}</h3>
                {profile.current_location && (
                  <p className="text-muted mb-0">
                    <i className="bi bi-geo-alt me-1"></i> {profile.current_location}
                  </p>
                )}
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="mb-3">About</h5>
                
                {profile.age && (
                  <p>
                    <strong>Age:</strong> {profile.age}
                  </p>
                )}
                
                {profile.gender && (
                  <p>
                    <strong>Gender:</strong> {profile.gender}
                  </p>
                )}
                
                {profile.profession && (
                  <p>
                    <strong>Profession:</strong> {profile.profession}
                  </p>
                )}
                
                <p>
                  <strong>Member since:</strong> {new Date(profile.date_joined).toLocaleDateString()}
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={8}>
            <h4 className="mb-3">Trips</h4>
            
            {trips.length === 0 ? (
              <Card className="shadow-sm">
                <Card.Body className="text-center p-5">
                  <p className="mb-0">This user hasn&apos;t created or joined any trips yet.</p>
                </Card.Body>
              </Card>
            ) : (
              trips.map(trip => (
                <Card key={trip.id} className="shadow-sm mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5>{trip.group_name}</h5>
                        <p className="text-muted mb-2">
                          <strong>Destination:</strong> {trip.destination.name}
                        </p>
                        <div className="mb-3">
                          <Badge bg="info" className="me-2">
                            {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                          </Badge>
                          {profile.id === trip.host.id && (
                            <Badge bg="primary">Host</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <Button 
                          variant="outline-primary"
                          onClick={() => router.push(`/trips/${trip.id}`)}
                        >
                          View Trip
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}