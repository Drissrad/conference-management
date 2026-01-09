import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Spinner, Alert, Badge, Form } from 'react-bootstrap';
import { conferenceService } from '../services/api';

function ConferenceList() {
  const [conferences, setConferences] = useState([]);
  const [filteredConferences, setFilteredConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    fetchConferences();
  }, []);

  useEffect(() => {
    if (filterType === 'ALL') {
      setFilteredConferences(conferences);
    } else {
      setFilteredConferences(conferences.filter(c => c.type === filterType));
    }
  }, [filterType, conferences]);

  const fetchConferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await conferenceService.getAll();
      setConferences(response.data);
      setFilteredConferences(response.data);
    } catch (err) {
      console.error('Error fetching conferences:', err);
      setError('Impossible de charger les conférences. Vérifiez que le service est démarré.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette conférence ?')) {
      try {
        await conferenceService.delete(id);
        fetchConferences();
      } catch (err) {
        console.error('Error deleting conference:', err);
        setError('Erreur lors de la suppression.');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Chargement des conférences...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1>📅 Conférences</h1>
          <p className="text-muted">Liste de toutes les conférences</p>
        </div>
        <Button as={Link} to="/conferences/new" variant="primary">
          ➕ Nouvelle Conférence
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Filter */}
      <Card className="mb-4">
        <Card.Body>
          <Form.Group as={Row} className="align-items-center">
            <Form.Label column sm={2}>Filtrer par type :</Form.Label>
            <Col sm={4}>
              <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="ALL">Toutes</option>
                <option value="ACADEMIQUE">Académique</option>
                <option value="COMMERCIALE">Commerciale</option>
              </Form.Select>
            </Col>
            <Col sm={6}>
              <Badge bg="secondary" className="me-2">
                Total : {filteredConferences.length} conférence(s)
              </Badge>
            </Col>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Conference Cards */}
      {filteredConferences.length === 0 ? (
        <Alert variant="info">
          Aucune conférence trouvée.
          <Link to="/conferences/new" className="ms-2">Créer une nouvelle conférence</Link>
        </Alert>
      ) : (
        <Row>
          {filteredConferences.map((conference) => (
            <Col md={6} lg={4} key={conference.id}>
              <Card className={`conference-card ${conference.type?.toLowerCase()}`}>
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between">
                    {conference.titre}
                    <Badge bg={conference.type === 'ACADEMIQUE' ? 'success' : 'warning'} text={conference.type === 'COMMERCIALE' ? 'dark' : 'light'}>
                      {conference.type}
                    </Badge>
                  </Card.Title>
                  <Card.Text>
                    <div className="mb-2">
                      <strong>📅 Date :</strong> {conference.date}
                    </div>
                    <div className="mb-2">
                      <strong>⏱️ Durée :</strong> {conference.duree} minutes
                    </div>
                    <div className="mb-2">
                      <strong>👥 Inscrits :</strong> {conference.nombreInscrits}
                    </div>
                    <div className="mb-2">
                      <strong>⭐ Score :</strong> {conference.score || 'N/A'}
                    </div>
                    {conference.reviews && (
                      <div className="mb-2">
                        <strong>💬 Reviews :</strong> {conference.reviews.length}
                      </div>
                    )}
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button as={Link} to={`/conferences/${conference.id}`} variant="outline-primary" size="sm">
                      👁️ Détails
                    </Button>
                    <div>
                      <Button as={Link} to={`/conferences/edit/${conference.id}`} variant="outline-warning" size="sm" className="me-1">
                        ✏️
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(conference.id)}>
                        🗑️
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ConferenceList;

