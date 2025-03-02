// pages/trips/create.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import Navigation from '../../components/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function CreateTrip() {
  const router = useRouter();
  const { city: cityId } = router.query;
  const { isAuthenticated } = useAuth();
  
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [itineraryDays, setItineraryDays] = useState(1);
  const [formData, setFormData] = useState({
    group_name: '',
    destination: '',
    start_date: '',
    end_date: '',
    description: '',
    min_age: 18,
    max_age: 65,
    required_members: 2,
    itinerary: [{ day: 1, description: '' }]
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/trips/create');
      return;
    }
    
    async function fetchCities() {
      try {
        const response = await api.get('/api/cities/');
        setCities(response.data);
        
        if (cityId) {
          setFormData(prev => ({ ...prev, destination: cityId }));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setLoading(false);
      }
    }

    fetchCities();
  }, [isAuthenticated, router, cityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItineraryChange = (day, value) => {
    const updatedItinerary = [...formData.itinerary];
    const index = updatedItinerary.findIndex(item => item.day === day);
    
    if (index !== -1) {
      updatedItinerary[index].description = value;
    } else {
      updatedItinerary.push({ day, description: value });
    }
    
    setFormData(prev => ({ ...prev, itinerary: updatedItinerary }));
  };

  const addItineraryDay = () => {
    setItineraryDays(prev => prev + 1);
  };

  const removeItineraryDay = () => {
    if (itineraryDays > 1) {
      setItineraryDays(prev => prev - 1);
      
      // Remove the last day from itinerary
      setFormData(prev => ({
        ...prev,
        itinerary: prev.itinerary.filter(item => item.day !== itineraryDays)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await api.post('/api/create-trip/', formData);
      router.push(`/trips/${response.data.id}`);
    } catch (error) {
      console.error('Error creating trip:', error);
      setSubmitting(false);
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

  return (
    <div>
      <Head>
        <title>Create New Trip | Circulus</title>
      </Head>

      <Navigation />

      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Body>
            <h2 className="mb-4">Create a New Trip</h2>
            
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Group Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="group_name"
                      value={formData.group_name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Backpacking Adventure"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Destination</Form.Label>
                    <Form.Select
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a destination</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Trip Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe your trip plan, activities, etc."
                />
              </Form.Group>
              
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Minimum Age</Form.Label>
                    <Form.Control
                      type="number"
                      name="min_age"
                      value={formData.min_age}
                      onChange={handleChange}
                      required
                      min="18"
                      max="100"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Maximum Age</Form.Label>
                    <Form.Control
                      type="number"
                      name="max_age"
                      value={formData.max_age}
                      onChange={handleChange}
                      required
                      min="18"
                      max="100"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Required Members</Form.Label>
                    <Form.Control
                      type="number"
                      name="required_members"
                      value={formData.required_members}
                      onChange={handleChange}
                      required
                      min="2"
                      max="20"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Itinerary</h5>
                  <div>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      onClick={removeItineraryDay}
                      disabled={itineraryDays <= 1}
                      className="me-2"
                    >
                      Remove Day
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={addItineraryDay}
                    >
                      Add Day
                    </Button>
                  </div>
                </div>
                
                {Array.from({ length: itineraryDays }).map((_, index) => (
                  <Form.Group key={index} className="mb-3">
                    <Form.Label>Day {index + 1}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={formData.itinerary.find(item => item.day === index + 1)?.description || ''}
                      onChange={(e) => handleItineraryChange(index + 1, e.target.value)}
                      placeholder={`Plans for day ${index + 1}`}
                    />
                  </Form.Group>
                ))}
              </div>
              
              <div className="d-grid">
                <Button 
                  variant="primary" 
                  type="submit" 
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Trip'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}