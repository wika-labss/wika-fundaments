# Copia bootstrap/wika-studio (este repo, rama con UI-B) sobre un clon de wika-studio.
# Uso (PowerShell):
#   git clone https://github.com/wika-labss/wika-fundaments.git
#   cd wika-fundaments
#   git checkout cursor/wika-studio-bootstrap-ba99
#   .\scripts\sync-wika-studio.ps1 -Destination C:\Users\jleiva\wika-studio-app
param(
    [Parameter(Mandatory = $true)]
    [string]$Destination
)

$ErrorActionPreference = "Stop"
$src = Join-Path $PSScriptRoot "..\bootstrap\wika-studio" | Resolve-Path
if (-not (Test-Path $src)) {
    throw "No existe $src. Haz checkout de la rama cursor/wika-studio-bootstrap-ba99."
}
if (-not (Test-Path $Destination)) {
    New-Item -ItemType Directory -Path $Destination | Out-Null
}

Get-ChildItem -Path $src -Force | Where-Object { $_.Name -notin @(".git", "node_modules", ".data", ".env") } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $Destination -Recurse -Force
}

Write-Host "Copiado $src -> $Destination"
Write-Host "Siguiente:"
Write-Host "  cd `"$Destination`""
Write-Host "  npm install"
Write-Host "  Copy-Item .env.example .env"
Write-Host "  node scripts/hash-password.mjs"
Write-Host "  # edita .env: STUDIO_OWNERS y STUDIO_PASSWORD_HASH"
Write-Host "  npm run dev"
