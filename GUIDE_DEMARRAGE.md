# 🚀 Guide de Démarrage - Projet Conference Management

## 📋 Architecture Complète

```
┌─────────────────────────────────────────────────────────────┐
│                    EUREKA SERVER (8761)                     │
│              Service Discovery & Registry                    │
└────────────┬────────────────────────────────────────────────┘
             │
    ┌────────┴─────────┬────────────────┬────────────────────┐
    │                  │                │                    │
┌───▼──────────┐  ┌────▼─────────┐  ┌──▼─────────────┐  ┌──▼─────────────┐
│ CONFIG       │  │  GATEWAY     │  │  KEYNOTE       │  │  CONFERENCE    │
│ SERVICE      │  │  SERVICE     │  │  SERVICE       │  │  SERVICE       │
│ Port: 8888   │  │  Port: 9999  │  │  Port: 8081    │  │  Port: 8082    │
└──────────────┘  └──────┬───────┘  └────────┬───────┘  └───────┬────────┘
                         │                   │                   │
                         │                   │    OpenFeign +    │
                         │                   │   Circuit Breaker │
                         │                   └───────────────────┘
                         │
                    Point d'entrée
                    unique pour les
                    clients externes
```

---

## 🔢 ORDRE DE DÉMARRAGE (IMPORTANT !)

### 1️⃣ Discovery Service (Eureka Server)
**Port:** 8761
```bash
cd discovery-service-d
./mvnw spring-boot:run
```
**Vérification:** http://localhost:8761

---

### 2️⃣ Config Service
**Port:** 8888
```bash
cd config-service
./mvnw spring-boot:run
```
**Vérification:** http://localhost:8888/actuator/health

**Tester les configs:**
- http://localhost:8888/keynote-service/default
- http://localhost:8888/conference-service/default
- http://localhost:8888/gateway-service/default

---

### 3️⃣ Keynote Service
**Port:** 8081
```bash
cd keynote-service
./mvnw spring-boot:run
```
**Vérification:** http://localhost:8081/api/keynotes

---

### 4️⃣ Conference Service
**Port:** 8082
```bash
cd conference-service
./mvnw spring-boot:run
```
**Vérification:** http://localhost:8082/api/conferences

---

### 5️⃣ Gateway Service
**Port:** 9999 (⚠️ changé de 8888 à 9999)
```bash
cd gateway-service
./mvnw spring-boot:run
```
**Vérification:** http://localhost:9999/actuator/health

---

## 🧪 TESTS COMPLETS

### Via Discovery (Eureka Dashboard)
```
http://localhost:8761
```
**Vous devriez voir:**
- CONFIG-SERVICE
- GATEWAY-SERVICE
- KEYNOTE-SERVICE
- CONFERENCE-SERVICE

---

### Via Gateway (Point d'entrée unique)

#### 📌 Keynote Service via Gateway
```http
# Liste des keynotes
GET http://localhost:9999/keynote-service/api/keynotes

# Keynote par ID
GET http://localhost:9999/keynote-service/api/keynotes/1

# Créer un keynote
POST http://localhost:9999/keynote-service/api/keynotes
Content-Type: application/json

{
  "nom": "Martin",
  "prenom": "Sophie",
  "email": "sophie.martin@test.com",
  "fonction": "DevOps Engineer"
}
```

#### 📌 Conference Service via Gateway
```http
# Liste des conférences
GET http://localhost:9999/conference-service/api/conferences

# Conférence par ID
GET http://localhost:9999/conference-service/api/conferences/1

# Conférence avec détails keynote (OpenFeign)
GET http://localhost:9999/conference-service/api/conferences/1/full

# Créer une conférence
POST http://localhost:9999/conference-service/api/conferences
Content-Type: application/json

{
  "titre": "Microservices Architecture",
  "type": "ACADEMIQUE",
  "date": "2026-08-15",
  "duree": 180,
  "nombreInscrits": 200,
  "score": 4.7,
  "keynoteId": 1
}

# Ajouter une review
POST http://localhost:9999/conference-service/api/conferences/1/reviews
Content-Type: application/json

{
  "date": "2026-01-10",
  "texte": "Superbe conférence!",
  "note": 5
}
```

---

## 📊 RÉSUMÉ DES PORTS

| Service | Port | URL |
|---------|------|-----|
| **Discovery (Eureka)** | 8761 | http://localhost:8761 |
| **Config Server** | 8888 | http://localhost:8888 |
| **Keynote Service** | 8081 | http://localhost:8081 |
| **Conference Service** | 8082 | http://localhost:8082 |
| **Gateway** | 9999 | http://localhost:9999 |

---

## 🗂️ Configuration Centralisée

### Dossier de configuration
```
C:\Users\PC\Desktop\conference-management\config-repo\
```

### Fichiers disponibles
- `application.properties` - Config commune
- `keynote-service.properties`
- `conference-service.properties`
- `gateway-service.properties`

### Modifier une configuration
1. Éditez le fichier dans `config-repo/`
2. Redémarrez le service concerné
3. Ou utilisez `/actuator/refresh` (si Spring Cloud Bus configuré)

---

## ✅ CHECKLIST DE DÉMARRAGE

- [ ] Discovery Service démarré (8761)
- [ ] Config Service démarré (8888)
- [ ] Keynote Service démarré (8081)
- [ ] Conference Service démarré (8082)
- [ ] Gateway Service démarré (9999)
- [ ] Tous les services visibles dans Eureka
- [ ] Test via Gateway réussi

---

## 🎯 FONCTIONNALITÉS IMPLÉMENTÉES

### ✅ Services Techniques
- **Eureka Discovery** - Service discovery & registry
- **Config Server** - Configuration centralisée (dossier local)
- **Spring Cloud Gateway** - API Gateway avec routing dynamique

### ✅ Services Fonctionnels
- **Keynote Service** - Gestion des keynotes
- **Conference Service** - Gestion des conférences et reviews

### ✅ Communication Inter-Services
- **OpenFeign Client** - Conference → Keynote
- **Circuit Breaker** - Resilience4J avec fallback

### ✅ Bases de données
- **H2 In-Memory** - Pour chaque service
- **Console H2** - Activée sur chaque service

---

## 🔧 DÉPANNAGE

### Service ne démarre pas
1. Vérifiez que le port n'est pas déjà utilisé
2. Vérifiez les logs de démarrage
3. Attendez que Eureka soit complètement démarré

### Service n'apparaît pas dans Eureka
1. Vérifiez `eureka.client.service-url.defaultZone`
2. Attendez 30 secondes (délai d'enregistrement)
3. Vérifiez les logs pour les erreurs de connexion

### Gateway retourne 503
- Le service cible n'est pas démarré
- Le service n'est pas enregistré dans Eureka
- Nom du service incorrect (minuscules)

### Circuit Breaker s'ouvre
- Keynote service indisponible
- Le fallback retournera "Service indisponible"

---

## 📝 PROCHAINES ÉTAPES

- [ ] Angular Frontend
- [ ] Sécurité Keycloak (OAuth2/OIDC)
- [ ] Docker & Docker Compose
- [ ] Tests unitaires et d'intégration
- [ ] Monitoring (Prometheus/Grafana)
- [ ] OpenAPI/Swagger documentation

---

## 🎉 FÉLICITATIONS !

Vous avez maintenant une **architecture microservices complète** avec :
- ✅ Service Discovery (Eureka)
- ✅ Configuration centralisée (Config Server)
- ✅ API Gateway
- ✅ 2 microservices fonctionnels
- ✅ Communication inter-services (Feign)
- ✅ Fault tolerance (Circuit Breaker)

