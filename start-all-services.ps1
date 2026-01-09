# Script de démarrage de tous les microservices
# Ordre correct : Discovery -> Config -> Services métier -> Gateway

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Démarrage des Microservices" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$baseDir = "C:\Users\PC\Desktop\conference-management"

# 1. Discovery Service (Eureka)
Write-Host "1️⃣  Démarrage Discovery Service (Eureka - Port 8761)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\discovery-service-d'; .\mvnw.cmd spring-boot:run"
Write-Host "   Attendre 20 secondes..." -ForegroundColor Gray
Start-Sleep -Seconds 20

# 2. Config Service
Write-Host "2️⃣  Démarrage Config Service (Port 8888)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\config-service'; .\mvnw.cmd spring-boot:run"
Write-Host "   Attendre 15 secondes..." -ForegroundColor Gray
Start-Sleep -Seconds 15

# 3. Keynote Service
Write-Host "3️⃣  Démarrage Keynote Service (Port 8081)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\keynote-service'; .\mvnw.cmd spring-boot:run"
Write-Host "   Attendre 10 secondes..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# 4. Conference Service
Write-Host "4️⃣  Démarrage Conference Service (Port 8082)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\conference-service'; .\mvnw.cmd spring-boot:run"
Write-Host "   Attendre 10 secondes..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# 5. Gateway Service
Write-Host "5️⃣  Démarrage Gateway Service (Port 9999)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\gateway-service'; .\mvnw.cmd spring-boot:run"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  ✅ Tous les services démarrés !" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Attendez 30 secondes que tous les services s'enregistrent sur Eureka..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 URLs à vérifier :" -ForegroundColor White
Write-Host "   • Eureka Dashboard : http://localhost:8761" -ForegroundColor Gray
Write-Host "   • Config Service   : http://localhost:8888/actuator/health" -ForegroundColor Gray
Write-Host "   • Keynote Service  : http://localhost:8081/api/keynotes" -ForegroundColor Gray
Write-Host "   • Conference Svc   : http://localhost:8082/api/conferences" -ForegroundColor Gray
Write-Host "   • Gateway          : http://localhost:9999/actuator/health" -ForegroundColor Gray
Write-Host ""
Write-Host "🧪 Test via Gateway :" -ForegroundColor White
Write-Host "   http://localhost:9999/conference-service/api/conferences" -ForegroundColor Gray
Write-Host ""

