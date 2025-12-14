# Script to reinstall dependencies and restart server using SSH key

$sshKeyPath = "./id_rsa"
$server = "www.metajade.online"
$user = "root"
$remotePath = "/www/wwwroot/cat9"

Write-Host "Starting to reinstall dependencies and restart server on $server..."

# Commands to execute remotely
$commands = @(
    "cd $remotePath",
    "cd server",
    "npm install --force",  # Force reinstall dependencies
    "npm audit fix",       # Fix vulnerabilities
    "pm2 restart cat9-server",  # Restart only cat9-server
    "pm2 restart cat9-frontend"  # Restart only cat9-frontend
)

$fullCommand = $commands -join "; "

Write-Host "Executing command: $fullCommand"

# Execute using Windows built-in ssh
try {
    # Set proper permissions for SSH key
    icacls $sshKeyPath /inheritance:r
    icacls $sshKeyPath /grant:r "$env:USERNAME`:F"
    icacls $sshKeyPath /remove:g "Everyone"
    
    # Execute ssh command
    $result = ssh -i $sshKeyPath $user@$server $fullCommand
    Write-Host "Result:"
    Write-Host $result
    Write-Host "Reinstall and restart completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Operation failed: $_" -ForegroundColor Red
    exit 1
}
