// pages/profile.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

export default function Profile() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    current_location: '',
    age: '',
    gender: '',
    profession: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/profile');
      return;
    }
    
    async function fetchProfile() {
      try {
        const response = await api.get('/api/profile/');
        if (response.data) {
          setProfile(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    }

    fetchProfile();
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError('');
    
    try {
      const formData = new FormData();
      
      Object.keys(profile).forEach(key => {
        formData.append(key, profile[key]);
      });
      
      if (e.target.photos.files[0]) {
        formData.append('photos', e.target.photos.files[0]);
      }
      
      await api.post('/api/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess(true);
      setSubmitting(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
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
        <title>Your Profile | Circulus</title>
      </Head>

      <Navigation />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="mb-4">Your Profile</h2>
                
                {success && (
                  <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
                    Profile updated successfully!
                  </Alert>
                )}
                
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Current Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="current_location"
                      value={profile.current_location}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Mumbai, Maharashtra"
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          type="number"
                          name="age"
                          value={profile.age}
                          onChange={handleChange}
                          required
                          min="18"
                          max="100"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          name="gender"
                          value={profile.gender}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-binary">Non-binary</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Profession</Form.Label>
                    <Form.Control
                      type="text"
                      name="profession"
                      value={profile.profession}
                      onChange={handleChange}
                      placeholder="e.g., Software Engineer"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Profile Photo</Form.Label>
                    <Form.Control
                      type="file"
                      name="photos"
                      accept="image/*"
                    />
                    {profile.photos && (
                      <div className="mt-2">
                        <p className="mb-1">Current photo:</p>
                        <img 
                          src={profile.photos} 
                          alt="Profile" 
                          style={{ 
                            width: '100px', 
                            height: '100px', 
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }} 
                        />
                      </div>
                    )}
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      size="lg"
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}