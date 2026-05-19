# NeuroScreen — Server locale HTTP
# Necessario per abilitare la webcam (getUserMedia richiede http:// o https://)
# Esegui: .\start.ps1

$port = 8080
$root = $PSScriptRoot

$mimeTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css'
  '.js'   = 'application/javascript'
  '.json' = 'application/json'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
  '.wasm' = 'application/wasm'   # Necessario per MediaPipe
  '.bin'  = 'application/octet-stream'
}

$http = [System.Net.HttpListener]::new()
$http.Prefixes.Add("http://localhost:$port/")
$http.Start()

Write-Host ""
Write-Host "  NeuroScreen server avviato" -ForegroundColor Cyan
Write-Host "  Apri nel browser: http://localhost:$port" -ForegroundColor Green
Write-Host "  Premi Ctrl+C per fermare" -ForegroundColor Gray
Write-Host ""

# Apri browser automaticamente
Start-Process "http://localhost:$port"

try {
  while ($http.IsListening) {
    $ctx = $http.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    $path = $req.Url.LocalPath.TrimStart('/')
    if ($path -eq '') { $path = 'index.html' }

    $filePath = Join-Path $root $path

    if (Test-Path $filePath -PathType Leaf) {
      $ext  = [IO.Path]::GetExtension($filePath).ToLower()
      $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }

      $bytes = [IO.File]::ReadAllBytes($filePath)
      $res.ContentType     = $mime
      $res.ContentLength64 = $bytes.Length
      $res.Headers.Add('Cache-Control', 'no-cache')
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      $res.StatusCode = 200
    } else {
      $msg   = [Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
      $res.StatusCode      = 404
      $res.ContentType     = 'text/plain'
      $res.ContentLength64 = $msg.Length
      $res.OutputStream.Write($msg, 0, $msg.Length)
    }

    $res.Close()
  }
} finally {
  $http.Stop()
  Write-Host "Server fermato." -ForegroundColor Gray
}
