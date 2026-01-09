import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { conferenceService, keynoteService } from '../services/api';

function Home() {
  const [stats, setStats] = useState({
    conferences: 0,
    keynotes: 0,
    reviews: 0,
  });
  const [recentConferences, setRecentConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [conferencesRes, keynotesRes] = await Promise.all([
        conferenceService.getAll(),
        keynoteService.getAll(),
      ]);

      const conferences = conferencesRes.data;
      const keynotes = keynotesRes.data;

      // Calculate total reviews
      let totalReviews = 0;
      conferences.forEach(conf => {
        if (conf.reviews) {
          totalReviews += conf.reviews.length;
        }
      });

      setStats({
        conferences: conferences.length,
        keynotes: keynotes.length,
        reviews: totalReviews,
      });

      // Get last 3 conferences
      setRecentConferences(conferences.slice(0, 3));

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Impossible de charger les données. Vérifiez que les services sont démarrés.');
    } finally {
      setLoading(false);
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
        <h1>🎤 Gestion des Conférences</h1>
        <p className="text-muted">Bienvenue dans l'application de gestion des conférences</p>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="stats-card bg-primary text-white">
            <Card.Body>
              <h2>{stats.conferences}</h2>
              <p className="mb-0">📅 Conférences</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stats-card bg-success text-white">
            <Card.Body>
              <h2>{stats.keynotes}</h2>
              <p className="mb-0">👤 Keynotes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stats-card bg-info text-white">
            <Card.Body>
              <h2>{stats.reviews}</h2>
              <p className="mb-0">⭐ Reviews</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">⚡ Actions Rapides</h5>
            </Card.Header>
            <Card.Body>
              <Button as={Link} to="/conferences/new" variant="primary" className="me-2">
                ➕ Nouvelle Conférence
              </Button>
              <Button as={Link} to="/keynotes/new" variant="success" className="me-2">
                ➕ Nouveau Keynote
              </Button>
              <Button as={Link} to="/conferences" variant="outline-primary" className="me-2">
                📋 Voir toutes les conférences
              </Button>
              <Button as={Link} to="/keynotes" variant="outline-success">
                📋 Voir tous les keynotes
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Conferences */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📅 Conférences Récentes</h5>
              <Button as={Link} to="/conferences" variant="outline-primary" size="sm">
                Voir tout
              </Button>
            </Card.Header>
            <Card.Body>
              {recentConferences.length === 0 ? (
                <p className="text-muted text-center">Aucune conférence trouvée</p>
              ) : (
                <Row>
                  {recentConferences.map((conference) => (
                    <Col md={4} key={conference.id}>
                      <Card className={`conference-card ${conference.type?.toLowerCase()}`}>
                        <Card.Body>
                          <Card.Title>{conference.titre}</Card.Title>
                          <Card.Text>
                            <span className={`badge ${conference.type === 'ACADEMIQUE' ? 'bg-success' : 'bg-warning text-dark'}`}>
                              {conference.type}
                            </span>
                            <br />
                            <small className="text-muted">
                              📅 {conference.date} | ⏱️ {conference.duree} min
                            </small>
                            <br />
                            <small>
                              👥 {conference.nombreInscrits} inscrits | ⭐ {conference.score || 'N/A'}
                            </small>
                          </Card.Text>
                          <Button as={Link} to={`/conferences/${conference.id}`} variant="outline-primary" size="sm">
                            Voir détails
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Home;

