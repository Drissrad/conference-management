import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { keynoteService } from '../services/api';

function KeynoteList() {
  const [keynotes, setKeynotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKeynotes();
  }, []);

  const fetchKeynotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await keynoteService.getAll();
      setKeynotes(response.data);
    } catch (err) {
      console.error('Error fetching keynotes:', err);
      setError('Impossible de charger les keynotes. Vérifiez que le service est démarré.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce keynote ?')) {
      try {
        await keynoteService.delete(id);
        fetchKeynotes();
      } catch (err) {
        console.error('Error deleting keynote:', err);
        setError('Erreur lors de la suppression.');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Chargement des keynotes...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1>👤 Keynotes</h1>
          <p className="text-muted">Liste de tous les keynotes ({keynotes.length})</p>
        </div>
        <Button as={Link} to="/keynotes/new" variant="success">
          ➕ Nouveau Keynote
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {keynotes.length === 0 ? (
        <Alert variant="info">
          Aucun keynote trouvé.
          <Link to="/keynotes/new" className="ms-2">Créer un nouveau keynote</Link>
        </Alert>
      ) : (
        <>
          {/* Card View */}
          <Row className="mb-4">
            {keynotes.map((keynote) => (
              <Col md={6} lg={4} key={keynote.id}>
                <Card className="keynote-card">
                  <Card.Body>
                    <Card.Title>
                      👤 {keynote.prenom} {keynote.nom}
                    </Card.Title>
                    <Card.Text>
                      <div className="mb-2">
                        <strong>📧 Email :</strong> {keynote.email}
                      </div>
                      <div className="mb-2">
                        <strong>💼 Fonction :</strong> {keynote.fonction || 'Non spécifié'}
                      </div>
                    </Card.Text>
                    <div className="d-flex justify-content-end">
                      <Button as={Link} to={`/keynotes/edit/${keynote.id}`} variant="outline-warning" size="sm" className="me-1">
                        ✏️ Modifier
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(keynote.id)}>
                        🗑️ Supprimer
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Table View */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">📋 Vue Tableau</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Fonction</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {keynotes.map((keynote) => (
                    <tr key={keynote.id}>
                      <td>{keynote.id}</td>
                      <td>{keynote.nom}</td>
                      <td>{keynote.prenom}</td>
                      <td>{keynote.email}</td>
                      <td>{keynote.fonction || '-'}</td>
                      <td>
                        <Button as={Link} to={`/keynotes/edit/${keynote.id}`} variant="warning" size="sm" className="me-1">
                          ✏️
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(keynote.id)}>
                          🗑️
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
}

export default KeynoteList;

