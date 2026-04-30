Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$paths = @(
    (Join-Path $root "public\trello\icon.png"),
    (Join-Path $root "public\favicon.png")
)

$size = 512
$bitmap = New-Object System.Drawing.Bitmap $size, $size
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

function New-RoundedRectPath {
    param(
        [float]$X,
        [float]$Y,
        [float]$W,
        [float]$H,
        [float]$R
    )

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $R * 2
    $path.AddArc($X, $Y, $d, $d, 180, 90)
    $path.AddArc($X + $W - $d, $Y, $d, $d, 270, 90)
    $path.AddArc($X + $W - $d, $Y + $H - $d, $d, $d, 0, 90)
    $path.AddArc($X, $Y + $H - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

function Fill-RoundedRect {
    param($Graphics, $Brush, [float]$X, [float]$Y, [float]$W, [float]$H, [float]$R)
    $path = New-RoundedRectPath $X $Y $W $H $R
    $Graphics.FillPath($Brush, $path)
    $path.Dispose()
}

function Stroke-RoundedRect {
    param($Graphics, $Pen, [float]$X, [float]$Y, [float]$W, [float]$H, [float]$R)
    $path = New-RoundedRectPath $X $Y $W $H $R
    $Graphics.DrawPath($Pen, $path)
    $path.Dispose()
}

$bgRect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $bgRect,
    [System.Drawing.Color]::FromArgb(255, 11, 83, 190),
    [System.Drawing.Color]::FromArgb(255, 0, 190, 172),
    45
)
$graphics.FillRectangle($bgBrush, $bgRect)

$shadowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(70, 0, 20, 55))
Fill-RoundedRect $graphics $shadowBrush 64 70 384 360 58

$panelBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(235, 255, 255, 255))
Fill-RoundedRect $graphics $panelBrush 54 58 384 360 58

$innerBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 242, 248, 255))
Fill-RoundedRect $graphics $innerBrush 86 104 320 238 26

$cardColors = @(
    [System.Drawing.Color]::FromArgb(255, 28, 105, 212),
    [System.Drawing.Color]::FromArgb(255, 0, 155, 196),
    [System.Drawing.Color]::FromArgb(255, 18, 178, 126)
)

for ($i = 0; $i -lt 3; $i++) {
    $x = 112 + ($i * 92)
    $h = 86 + ($i * 24)
    $y = 246 - $h
    $brush = New-Object System.Drawing.SolidBrush $cardColors[$i]
    Fill-RoundedRect $graphics $brush $x $y 60 $h 14
    $brush.Dispose()
}

$linePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 255, 198, 41)), 18
$linePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$linePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$linePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$points = @(
    (New-Object System.Drawing.Point 124, 292),
    (New-Object System.Drawing.Point 208, 245),
    (New-Object System.Drawing.Point 282, 260),
    (New-Object System.Drawing.Point 370, 176)
)
$graphics.DrawLines($linePen, $points)

$arrowPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 255, 198, 41)), 16
$arrowPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$arrowPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$graphics.DrawLine($arrowPen, 370, 176, 366, 218)
$graphics.DrawLine($arrowPen, 370, 176, 328, 180)

$checkPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 255, 255, 255)), 24
$checkPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$checkPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$graphics.DrawLine($checkPen, 174, 358, 218, 398)
$graphics.DrawLine($checkPen, 218, 398, 314, 316)

$badgeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 198, 41))
Fill-RoundedRect $graphics $badgeBrush 344 326 74 74 24

$font = New-Object System.Drawing.Font "Segoe UI", 42, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 12, 55, 112))
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center
$format.LineAlignment = [System.Drawing.StringAlignment]::Center
$graphics.DrawString("K", $font, $textBrush, (New-Object System.Drawing.RectangleF 344, 322, 74, 78), $format)

$borderPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(90, 255, 255, 255)), 8
Stroke-RoundedRect $graphics $borderPen 6 6 500 500 86

foreach ($path in $paths) {
    $dir = Split-Path -Parent $path
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
    }
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
}

$format.Dispose()
$font.Dispose()
$textBrush.Dispose()
$badgeBrush.Dispose()
$checkPen.Dispose()
$arrowPen.Dispose()
$linePen.Dispose()
$innerBrush.Dispose()
$panelBrush.Dispose()
$shadowBrush.Dispose()
$bgBrush.Dispose()
$graphics.Dispose()
$bitmap.Dispose()
