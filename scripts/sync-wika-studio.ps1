# Copia bootstrap/wika-studio (este repo, rama UI-B) sobre un clon de wika-studio.
# Se corre DESDE wika-fundaments, no desde wika-studio-app:
#
#   cd C:\Users\jleiva\wika-fundaments
#   git fetch origin cursor/wika-studio-bootstrap-ba99
#   git checkout cursor/wika-studio-bootstrap-ba99
#   .\scripts\sync-wika-studio.ps1 -Destination C:\Users\jleiva\wika-studio-app
#   .\scripts\sync-wika-studio.ps1 -Destination C:\Users\jleiva\wika-studio-app -Email tu@correo -Password "tu-clave"
param(
    [Parameter(Mandatory = $true)]
    [string]$Destination,
    [string]$Email,
    [string]$Password
)

$ErrorActionPreference = "Stop"
$repoRoot = Join-Path $PSScriptRoot ".." | Resolve-Path
$src = Join-Path $repoRoot "bootstrap\wika-studio"

if (-not (Test-Path $src)) {
    throw @"
No existe $src.

Este script NO se corre desde wika-studio-app (ahí no hay bootstrap/).
Haz esto:

  cd C:\Users\jleiva\wika-fundaments
  git fetch origin cursor/wika-studio-bootstrap-ba99
  git checkout cursor/wika-studio-bootstrap-ba99
  .\scripts\sync-wika-studio.ps1 -Destination C:\Users\jleiva\wika-studio-app
"@
}

if (-not (Test-Path $Destination)) {
    New-Item -ItemType Directory -Path $Destination | Out-Null
}

Get-ChildItem -Path $src -Force | Where-Object { $_.Name -notin @(".git", "node_modules", ".data", ".env") } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $Destination -Recurse -Force
}

Write-Host "Copiado $src -> $Destination"

$pkg = Join-Path $Destination "package.json"
if (Test-Path $pkg) {
    $version = (Get-Content $pkg -Raw | Select-String '"version":\s*"([^"]+)"').Matches.Groups[1].Value
    Write-Host "version en destino: $version"
    if ($version -ne "0.2.0") {
        Write-Warning "Se esperaba 0.2.0. La copia no parece completa."
    }
}

if ($Email -and $Password) {
    Push-Location $Destination
    try {
        node ".\scripts\write-owner-env.mjs" --email $Email --password $Password
    } finally {
        Pop-Location
    }
}

Write-Host "Siguiente:"
Write-Host "  cd `"$Destination`""
Write-Host "  npm install"
if (-not ($Email -and $Password)) {
    Write-Host '  node scripts\write-owner-env.mjs --email tu@correo --password "tu-clave"'
}
Write-Host "  npm run dev"
