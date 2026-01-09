import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { conferenceService, keynoteService } from '../services/api';

function ConferenceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [keynotes, setKeynotes] = useState([]);
  const [conference, setConference] = useState({
    titre: '',
    type: 'ACADEMIQUE',
    date: new Date().toISOString().split('T')[0],
    duree: 60,
    nombreInscrits: 0,
    score: 0,
    keynoteId: '',
  });

  useEffect(() => {
    fetchKeynotes();
    if (isEdit) {
      fetchConference();
    }
  }, [id]);

  const fetchKeynotes = async () => {
    try {
      const response = await keynoteService.getAll();
      setKeynotes(response.data);
    } catch (err) {
      console.error('Error fetching keynotes:', err);
    }
  };

  const fetchConference = async () => {
    try {
      setLoading(true);
      const response = await conferenceService.getById(id);
      setConference(response.data);
    } catch (err) {
      console.error('Error fetching conference:', err);
      setError('Impossible de charger la conférence.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConference({
      ...conference,
      [name]: name === 'duree' || name === 'nombreInscrits' || name === 'keynoteId'
        ? parseInt(value) || ''
        : name === 'score'
          ? parseFloat(value) || 0
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const conferenceData = {
        ...conference,
        keynoteId: conference.keynoteId || null,
      };

      if (isEdit) {
        await conferenceService.update(id, conferenceData);
      } else {
        await conferenceService.create(conferenceData);
      }
      navigate('/conferences');
    } catch (err) {
      console.error('Error saving conference:', err);
      setError('Erreur lors de la sauvegarde de la conférence.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Chargement...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? '✏️ Modifier la conférence' : '➕ Nouvelle conférence'}</h1>
        <p className="text-muted">
          {isEdit ? 'Modifiez les informations de la conférence' : 'Créez une nouvelle conférence'}
        </p>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Titre *</Form.Label>
                  <Form.Control
                    type="text"
                    name="titre"
                    value={conference.titre}
                    onChange={handleChange}
                    placeholder="Titre de la conférence"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Type *</Form.Label>
                  <Form.Select name="type" value={conference.type} onChange={handleChange}>
                    <option value="ACADEMIQUE">Académique</option>
                    <option value="COMMERCIALE">Commerciale</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={conference.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Durée (minutes) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="duree"
                    value={conference.duree}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre d'inscrits</Form.Label>
                  <Form.Control
                    type="number"
                    name="nombreInscrits"
                    value={conference.nombreInscrits}
                    onChange={handleChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Keynote</Form.Label>
                  <Form.Select name="keynoteId" value={conference.keynoteId || ''} onChange={handleChange}>
                    <option value="">-- Sélectionner un keynote --</option>
                    {keynotes.map((keynote) => (
                      <option key={keynote.id} value={keynote.id}>
                        {keynote.prenom} {keynote.nom} ({keynote.fonction})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Score (0-5)</Form.Label>
                  <Form.Control
                    type="number"
                    name="score"
                    value={conference.score}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between">
              <Button variant="outline-secondary" onClick={() => navigate('/conferences')}>
                ← Annuler
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Sauvegarde...
                  </>
                ) : (
                  <>✅ {isEdit ? 'Mettre à jour' : 'Créer'}</>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ConferenceForm;

