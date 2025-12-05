# Deploy local script para Windows
# Uso: .\deploy-local.ps1 -Build -Clean

param(
    [switch]$Build,
    [switch]$Clean
)

# Variáveis
$CONTAINER_NAME = "saude-em-acao-web"
$IMAGE_NAME = "saude-em-acao-web:local"
$PORT = 3000
$API_URL = $env:VITE_API_URL -or "http://23.22.153.89:3000"

# Cores
function Write-Success {
    Write-Host "✅ $args" -ForegroundColor Green
}

function Write-Info {
    Write-Host "ℹ️  $args" -ForegroundColor Cyan
}

function Write-Error-Custom {
    Write-Host "❌ $args" -ForegroundColor Red
}

# Limpeza se solicitado
if ($Clean) {
    Write-Info "Limpando containers antigos..."
    docker stop $CONTAINER_NAME 2>$null
    docker rm $CONTAINER_NAME 2>$null
    docker rmi $IMAGE_NAME 2>$null
    Write-Success "Limpeza concluída"
}

# Build se solicitado
if ($Build) {
    Write-Info "Fazendo build da imagem Docker..."
    docker build --build-arg VITE_API_URL="$API_URL" -t $IMAGE_NAME .
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Build falhou"
        exit 1
    }
    Write-Success "Build concluído"
}

# Preparar container
Write-Info "Preparando container..."
docker stop $CONTAINER_NAME 2>$null
docker rm $CONTAINER_NAME 2>$null

# Executar container
Write-Info "Iniciando container na porta $PORT..."
docker run -d `
    --name $CONTAINER_NAME `
    -p ${PORT}:3000 `
    --restart unless-stopped `
    $IMAGE_NAME

# Verificar se está rodando
Start-Sleep -Seconds 2

$running = docker ps | Select-String $CONTAINER_NAME
if ($running) {
    Write-Success "Container está rodando!"
    docker ps | Select-String $CONTAINER_NAME
}
else {
    Write-Error-Custom "Container falhou ao iniciar"
    docker logs $CONTAINER_NAME 2>$null
    exit 1
}

# Health check
Write-Info "Verificando saúde da aplicação..."
Start-Sleep -Seconds 3

try {
    $response = Invoke-WebRequest -Uri "http://localhost:$PORT" -TimeoutSec 3 -ErrorAction Stop
    Write-Success "Aplicação respondendo em http://localhost:$PORT"
}
catch {
    Write-Host "⚠️  Aplicação pode estar ainda iniciando, tente acessar em alguns segundos" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Deploy local concluído!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:$PORT" -ForegroundColor Cyan
Write-Host "API: $API_URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "Comandos úteis:"
Write-Host "  Logs: docker logs -f $CONTAINER_NAME" -ForegroundColor Cyan
Write-Host "  Parar: docker stop $CONTAINER_NAME" -ForegroundColor Cyan
Write-Host "  Remover: docker rm $CONTAINER_NAME" -ForegroundColor Cyan
