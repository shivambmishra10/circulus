import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Container, Card, Row, Col, Button, Alert } from 'react-bootstrap';
import Navigation from '../../../components/Navigation';
import Chat from '../../../components/Chat';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../utils/api';

export default function TripChat() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, user } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!id || !isAuthenticated) {
      if (!isAuthenticated) {
        router.push(`/login?redirect=/trips/${id}/chat`);
      }
      return;
    }
    
    async function fetchTripDetails() {
      try {
        const response = await api.get(`/api/trips/${id}/`);
        setTrip(response.data);
        
        // Check if user is a member of this trip
        const isMember = response.data.host.id === user.id || 
                        response.data.members.some(member => member.id === user.id);
        
        if (!isMember) {
          setError('You are not a member of this trip.');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trip details:', error);
        setError('Failed to load trip details');
        setLoading(false);
      }
    }

    fetchTripDetails();
  }, [id, isAuthenticated, router, user]);
  
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
  
  if (error) {
    return (
      <div>
        <Navigation />
        <Container className="py-5">
          <Alert variant="danger">{error}</Alert>
          <div className="text-center mt-3">
            <Link href={`/trips/${id}`}>
              <Button variant="primary">Back to Trip Details</Button>
            </Link>
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
  
  return (
    <div>
      <Head>
        <title>{trip.group_name} Chat | Circulus</title>
      </Head>
      
      <Navigation />
      
      <Container className="py-5">
        <Row>
          <Col lg={8} className="mx-auto">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>{trip.group_name} - Group Chat</h2>
              <Link href={`/trips/${id}`}>
                <Button variant="outline-primary">Back to Trip</Button>
              </Link>
            </div>
            
            <Chat tripId={id} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}