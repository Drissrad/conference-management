import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { keynoteService } from '../services/api';

function KeynoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [keynote, setKeynote] = useState({
    nom: '',
    prenom: '',
    email: '',
    fonction: '',
  });

  useEffect(() => {
    if (isEdit) {
      fetchKeynote();
    }
  }, [id]);

  const fetchKeynote = async () => {
    try {
      setLoading(true);
      const response = await keynoteService.getById(id);
      setKeynote(response.data);
    } catch (err) {
      console.error('Error fetching keynote:', err);
      setError('Impossible de charger le keynote.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKeynote({
      ...keynote,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      if (isEdit) {
        await keynoteService.update(id, keynote);
      } else {
        await keynoteService.create(keynote);
      }
      navigate('/keynotes');
    } catch (err) {
      console.error('Error saving keynote:', err);
      setError('Erreur lors de la sauvegarde du keynote.');
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
        <h1>{isEdit ? '✏️ Modifier le keynote' : '➕ Nouveau keynote'}</h1>
        <p className="text-muted">
          {isEdit ? 'Modifiez les informations du keynote' : 'Créez un nouveau keynote'}
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nom"
                    value={keynote.nom}
                    onChange={handleChange}
                    placeholder="Nom du keynote"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prénom *</Form.Label>
                  <Form.Control
                    type="text"
                    name="prenom"
                    value={keynote.prenom}
                    onChange={handleChange}
                    placeholder="Prénom du keynote"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={keynote.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fonction</Form.Label>
                  <Form.Control
                    type="text"
                    name="fonction"
                    value={keynote.fonction}
                    onChange={handleChange}
                    placeholder="Ex: Architecte Cloud, DevOps Engineer..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between">
              <Button variant="outline-secondary" onClick={() => navigate('/keynotes')}>
                ← Annuler
              </Button>
              <Button type="submit" variant="success" disabled={saving}>
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

export default KeynoteForm;

