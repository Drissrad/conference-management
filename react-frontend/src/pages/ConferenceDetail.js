import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert, Badge, Row, Col, Form, ListGroup } from 'react-bootstrap';
import { conferenceService } from '../services/api';

function ConferenceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conference, setConference] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    date: new Date().toISOString().split('T')[0],
    texte: '',
    note: 5,
  });

  useEffect(() => {
    fetchConference();
    fetchReviews();
  }, [id]);

  const fetchConference = async () => {
    try {
      setLoading(true);
      const response = await conferenceService.getByIdWithKeynote(id);
      setConference(response.data);
    } catch (err) {
      console.error('Error fetching conference:', err);
      setError('Impossible de charger la conférence.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await conferenceService.getReviews(id);
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await conferenceService.addReview(id, newReview);
      setNewReview({ date: new Date().toISOString().split('T')[0], texte: '', note: 5 });
      setShowReviewForm(false);
      fetchReviews();
      fetchConference();
    } catch (err) {
      console.error('Error adding review:', err);
      setError('Erreur lors de l\'ajout de la review.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Supprimer cette review ?')) {
      try {
        await conferenceService.deleteReview(reviewId);
        fetchReviews();
        fetchConference();
      } catch (err) {
        console.error('Error deleting review:', err);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette conférence ?')) {
      try {
        await conferenceService.delete(id);
        navigate('/conferences');
      } catch (err) {
        console.error('Error deleting conference:', err);
        setError('Erreur lors de la suppression.');
      }
    }
  };

  const renderStars = (note) => {
    return '⭐'.repeat(note) + '☆'.repeat(5 - note);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Chargement...</span>
      </div>
    );
  }

  if (!conference) {
    return <Alert variant="danger">Conférence non trouvée.</Alert>;
  }

  return (
    <div>
      <div className="mb-3">
        <Button variant="outline-secondary" onClick={() => navigate('/conferences')}>
          ← Retour aux conférences
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Conference Details */}
      <Card className={`conference-card ${conference.type?.toLowerCase()} mb-4`}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">{conference.titre}</h3>
          <Badge bg={conference.type === 'ACADEMIQUE' ? 'success' : 'warning'} text={conference.type === 'COMMERCIALE' ? 'dark' : 'light'}>
            {conference.type}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h5>📋 Informations</h5>
              <ListGroup variant="flush">
                <ListGroup.Item><strong>📅 Date :</strong> {conference.date}</ListGroup.Item>
                <ListGroup.Item><strong>⏱️ Durée :</strong> {conference.duree} minutes</ListGroup.Item>
                <ListGroup.Item><strong>👥 Inscrits :</strong> {conference.nombreInscrits}</ListGroup.Item>
                <ListGroup.Item><strong>⭐ Score :</strong> {conference.score || 'N/A'}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <h5>👤 Keynote</h5>
              {conference.keynote ? (
                <Card className="keynote-card">
                  <Card.Body>
                    <Card.Title>{conference.keynote.prenom} {conference.keynote.nom}</Card.Title>
                    <Card.Text>
                      <div><strong>📧 Email :</strong> {conference.keynote.email}</div>
                      <div><strong>💼 Fonction :</strong> {conference.keynote.fonction}</div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              ) : (
                <Alert variant="warning">
                  {conference.keynoteId ? 'Keynote non disponible (service indisponible)' : 'Aucun keynote assigné'}
                </Alert>
              )}
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Button as={Link} to={`/conferences/edit/${id}`} variant="warning" className="me-2">
            ✏️ Modifier
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            🗑️ Supprimer
          </Button>
        </Card.Footer>
      </Card>

      {/* Reviews Section */}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">💬 Reviews ({reviews.length})</h5>
          <Button variant="primary" size="sm" onClick={() => setShowReviewForm(!showReviewForm)}>
            {showReviewForm ? 'Annuler' : '➕ Ajouter une review'}
          </Button>
        </Card.Header>
        <Card.Body>
          {/* Add Review Form */}
          {showReviewForm && (
            <Card className="mb-3 border-primary">
              <Card.Body>
                <Form onSubmit={handleAddReview}>
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={newReview.date}
                          onChange={(e) => setNewReview({ ...newReview, date: e.target.value })}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Note (1-5)</Form.Label>
                        <Form.Select
                          value={newReview.note}
                          onChange={(e) => setNewReview({ ...newReview, note: parseInt(e.target.value) })}
                        >
                          {[5, 4, 3, 2, 1].map(n => (
                            <option key={n} value={n}>{n} ⭐</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={7}>
                      <Form.Group className="mb-3">
                        <Form.Label>Commentaire</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={newReview.texte}
                          onChange={(e) => setNewReview({ ...newReview, texte: e.target.value })}
                          placeholder="Votre avis sur cette conférence..."
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button type="submit" variant="success">
                    ✅ Publier la review
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <Alert variant="info">Aucune review pour cette conférence.</Alert>
          ) : (
            <ListGroup>
              {reviews.map((review) => (
                <ListGroup.Item key={review.id} className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="stars">{renderStars(review.note)}</div>
                    <p className="mb-1">{review.texte}</p>
                    <small className="text-muted">📅 {review.date}</small>
                  </div>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDeleteReview(review.id)}>
                    🗑️
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default ConferenceDetail;

