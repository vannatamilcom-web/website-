<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');

const FACEBOOK_VIDEO_CACHE_TTL = 300;
const FACEBOOK_VIDEO_GRAPH_VERSION = 'v20.0';

loadEnvironment(__DIR__ . DIRECTORY_SEPARATOR . '.env');

$pageId = trim((string) (getenv('FACEBOOK_PAGE_ID') ?: ''));
$pageToken = trim((string) (getenv('FB_PAGE_TOKEN') ?: ''));

if ($pageId === '' || $pageToken === '') {
    http_response_code(500);
    echo json_encode([
        'generatedAt' => gmdate(DATE_ATOM),
        'videos' => [],
        'error' => 'Facebook credentials are not configured on the server.',
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

$cacheFile = buildCachePath('facebook-videos-cache.json');
$cachedPayload = readCache($cacheFile, FACEBOOK_VIDEO_CACHE_TTL);

if ($cachedPayload !== null) {
    echo $cachedPayload;
    exit;
}

$endpoint = sprintf(
    'https://graph.facebook.com/%s/%s/videos?fields=description,source,created_time&limit=5&access_token=%s',
    FACEBOOK_VIDEO_GRAPH_VERSION,
    rawurlencode($pageId),
    rawurlencode($pageToken)
);

try {
    $apiResponse = fetchJson($endpoint);
    $videos = [];

    foreach (($apiResponse['data'] ?? []) as $item) {
        if (!is_array($item)) {
            continue;
        }

        $source = trim((string) ($item['source'] ?? ''));
        if ($source === '') {
            continue;
        }

        $videos[] = [
            'id' => (string) ($item['id'] ?? uniqid('fb_video_', true)),
            'description' => trim((string) ($item['description'] ?? '')),
            'source' => $source,
            'createdTime' => isset($item['created_time']) ? (string) $item['created_time'] : null,
        ];
    }

    $payload = json_encode([
        'generatedAt' => gmdate(DATE_ATOM),
        'pageId' => $pageId,
        'count' => count($videos),
        'videos' => $videos,
    ], JSON_UNESCAPED_SLASHES);

    if ($payload === false) {
        throw new RuntimeException('Failed to encode Facebook videos response.');
    }

    writeCache($cacheFile, $payload);
    echo $payload;
} catch (Throwable $exception) {
    http_response_code(502);
    echo json_encode([
        'generatedAt' => gmdate(DATE_ATOM),
        'videos' => [],
        'error' => 'Unable to load Facebook videos right now.',
    ], JSON_UNESCAPED_SLASHES);
}

function loadEnvironment(string $path): void
{
    if (!is_file($path) || !is_readable($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        $separatorPosition = strpos($line, '=');
        if ($separatorPosition === false) {
            continue;
        }

        $key = trim(substr($line, 0, $separatorPosition));
        $value = trim(substr($line, $separatorPosition + 1));
        $value = trim($value, "\"'");

        if ($key === '' || getenv($key) !== false) {
            continue;
        }

        putenv($key . '=' . $value);
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}

function buildCachePath(string $filename): string
{
    $directory = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'website-facebook-cache';
    if (!is_dir($directory)) {
        @mkdir($directory, 0775, true);
    }

    return $directory . DIRECTORY_SEPARATOR . $filename;
}

function readCache(string $cacheFile, int $ttl): ?string
{
    if (!is_file($cacheFile)) {
        return null;
    }

    $lastUpdated = @filemtime($cacheFile);
    if ($lastUpdated === false || (time() - $lastUpdated) > $ttl) {
        return null;
    }

    $contents = @file_get_contents($cacheFile);
    return $contents === false ? null : $contents;
}

function writeCache(string $cacheFile, string $payload): void
{
    @file_put_contents($cacheFile, $payload, LOCK_EX);
}

function fetchJson(string $url): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);

    $body = curl_exec($ch);
    $statusCode = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($body === false || $error !== '') {
        throw new RuntimeException('Facebook Graph request failed.');
    }

    $decoded = json_decode($body, true);
    if (!is_array($decoded)) {
        throw new RuntimeException('Facebook Graph returned invalid JSON.');
    }

    if ($statusCode >= 400 || isset($decoded['error'])) {
        throw new RuntimeException('Facebook Graph returned an API error.');
    }

    return $decoded;
}
