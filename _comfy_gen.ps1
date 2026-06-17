# Simple ComfyUI image generation helper
# Usage: .\_comfy_gen.ps1 -Prompt "..." -Output "site\blog\images\article1.webp"

param(
  [Parameter(Mandatory=$true)]
  [string]$Prompt,
  [Parameter(Mandatory=$true)]
  [string]$Output,
  [int]$Width = 1216,
  [int]$Height = 832,
  [string]$Model = "juggernautXL_version6Rundiffusion.safetensors",
  [int]$Steps = 20,
  [int]$Seed = $null
)

$ErrorActionPreference = "Stop"

$seed = if ($Seed -eq $null) { Get-Random -Minimum 1 -Maximum 999999 } else { $Seed }

$workflow = @{
  "3" = @{
    class_type = "KSampler"
    inputs = @{
      seed = $seed
      steps = $Steps
      cfg = 7
      sampler_name = "euler"
      scheduler = "normal"
      denoise = 1
      model = @("4", 0)
      positive = @("6", 0)
      negative = @("7", 0)
      latent_image = @("5", 0)
    }
  }
  "4" = @{
    class_type = "CheckpointLoaderSimple"
    inputs = @{
      ckpt_name = $Model
    }
  }
  "5" = @{
    class_type = "EmptyLatentImage"
    inputs = @{
      width = $Width
      height = $Height
      batch_size = 1
    }
  }
  "6" = @{
    class_type = "CLIPTextEncode"
    inputs = @{
      text = $Prompt
      clip = @("4", 1)
    }
  }
  "7" = @{
    class_type = "CLIPTextEncode"
    inputs = @{
      text = "blurry, low quality, cartoon, anime, watermark, text, bad lighting, dark, messy, distorted, deformed, ugly"
      clip = @("4", 1)
    }
  }
  "8" = @{
    class_type = "VAEDecode"
    inputs = @{
      samples = @("3", 0)
      vae = @("4", 2)
    }
  }
  "9" = @{
    class_type = "SaveImage"
    inputs = @{
      filename_prefix = "deskbyai_gen"
      images = @("8", 0)
    }
  }
}

$payload = ($workflow | ConvertTo-Json -Depth 10 -Compress)
$encodedPayload = @{ prompt = $workflow }

Write-Host "Sending prompt to ComfyUI (seed: $seed)..."
$jsonBody = $encodedPayload | ConvertTo-Json -Depth 10 -Compress
$response = Invoke-RestMethod -Uri "http://127.0.0.1:8188/prompt" -Method Post -Body $jsonBody -ContentType "application/json" -UseBasicParsing
$promptId = $response.prompt_id
Write-Host "Prompt queued: $promptId"

# Wait for completion
$maxWait = 120
for ($i = 0; $i -lt $maxWait; $i++) {
  Start-Sleep -Seconds 2
  try {
    $historyRaw = Invoke-WebRequest -Uri "http://127.0.0.1:8188/history/$promptId" -UseBasicParsing -ErrorAction Stop
    $historyJson = $historyRaw.Content | ConvertFrom-Json
    if ($historyJson.$promptId) {
      $outputs = $historyJson.$promptId.outputs
      foreach ($key in $outputs.PSObject.Properties.Name) {
        $node = $outputs.$key
        if ($node.images) {
          $img = $node.images[0]
          $filename = $img.filename
          $subfolder = $img.subfolder
          $type = $img.type
          
          Write-Host "Generated: $filename"
          
          # Download the image
          $encName = [System.Uri]::EscapeDataString($filename)
          $encSub = [System.Uri]::EscapeDataString($subfolder)
          $url = "http://127.0.0.1:8188/view?filename=$encName&type=$type&subfolder=$encSub"
          $wc = New-Object System.Net.WebClient
          
          # Ensure output directory exists
          $outputDir = Split-Path -Parent $Output
          if (!(Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir -Force | Out-Null }
          
          $wc.DownloadFile($url, $Output)
          $wc.Dispose()
          Write-Host "Saved to: $Output ($( (Get-Item $Output).Length / 1KB -as [int]) KB)"
          exit 0
        }
      }
    }
  } catch {
    Write-Host "Waiting... ($i)"
  }
}

Write-Host "Timed out after $maxWait seconds"
exit 1
