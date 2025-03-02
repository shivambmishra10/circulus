// pages/index.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import api from '../utils/api';

export default function Home() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await api.get('/api/cities/');
        setCities(response.data);
        setLoading(false);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching cities:', error);
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  return (
      <div>
      <Head>
        <title>Circulus - Find Travel Buddies</title>
        <meta name="description" content="Find travel buddies for your next adventure" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <Navigation />

      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 mb-3">Discover New Places With New Friends</h1>
          <p className="lead">Join or create travel groups to your favorite destinations</p>
          <div className="mt-4">
            <Link href="/trips/create">
              <Button variant="primary" className="me-3">Create New Trip</Button>
            </Link>
          </div>
        </div>

        <Row className="g-4">
          {loading ? (
            <div className="text-center w-100 py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            cities.map((city) => (
              <Col key={city.id} md={4} className="mb-4">
                <Card className="h-100 shadow-sm border-0">
                  <Card.Img 
                    variant="top" 
                    src={city.image} 
                    alt={city.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{city.name}</Card.Title>
                    <div className="mt-auto">
                      <Link href={`/cities/${city.id}`}>
                        <Button variant="outline-primary" className="w-100">View Trips</Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>

  );
}
