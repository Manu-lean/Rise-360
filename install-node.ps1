# URL de téléchargement de Node.js LTS
$url = "https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi"
$output = "node-installer.msi"

# Télécharger l'installateur
Write-Host "Téléchargement de Node.js..."
Invoke-WebRequest -Uri $url -OutFile $output

# Installer Node.js
Write-Host "Installation de Node.js..."
Start-Process msiexec.exe -Wait -ArgumentList '/i', $output, '/quiet', '/norestart'

# Supprimer l'installateur
Remove-Item $output

# Vérifier l'installation
Write-Host "Vérification de l'installation..."
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
node --version
npm --version

Write-Host "Installation terminée !" 