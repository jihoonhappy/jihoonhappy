<?php
/**
 * 크로스 도메인 iframe 세션 설정
 *
 * 이 파일은 session_start() 전에 반드시 include 해야 합니다.
 * 3rd-party 쿠키 차단 문제를 해결하기 위한 설정입니다.
 */

// PHP 버전 확인
if (version_compare(PHP_VERSION, '7.3.0', '<')) {
    die('PHP 7.3 이상이 필요합니다. 현재 버전: ' . PHP_VERSION);
}

/**
 * 방법 1: session_set_cookie_params() 사용 (PHP 7.3+)
 * 가장 권장되는 방법
 */
session_set_cookie_params([
    'lifetime' => 0,                    // 브라우저 종료시까지
    'path' => '/',                      // 전체 경로
    'domain' => '',                     // 현재 도메인
    'secure' => true,                   // HTTPS 필수 (중요!)
    'httponly' => true,                 // XSS 방지
    'samesite' => 'None'               // 크로스 도메인 허용 (중요!)
]);

/**
 * Partitioned 쿠키 설정 (CHIPS - Chrome, Edge 등)
 *
 * session_set_cookie_params()는 Partitioned 속성을 지원하지 않으므로
 * 세션 시작 후 header()로 직접 설정해야 합니다.
 */
if (!headers_sent()) {
    // Storage Access API 권한 요청을 위한 헤더
    header('Permissions-Policy: storage-access=(*)');

    // CORS 설정 (필요한 경우)
    // 실제 사용시 '*' 대신 특정 도메인 지정 권장
    // header('Access-Control-Allow-Origin: https://도메인A.com');
    // header('Access-Control-Allow-Credentials: true');
}

/**
 * 세션 시작 후 Partitioned 속성 추가를 위한 함수
 * session_start() 직후 호출하세요.
 */
function set_partitioned_cookie() {
    if (headers_sent()) {
        return false;
    }

    $session_name = session_name();
    $session_id = session_id();

    if (empty($session_id)) {
        return false;
    }

    // 기존 세션 쿠키를 Partitioned 속성과 함께 재설정
    $cookie_params = session_get_cookie_params();

    $cookie_string = sprintf(
        '%s=%s; Path=%s; SameSite=None; Secure; HttpOnly; Partitioned',
        $session_name,
        $session_id,
        $cookie_params['path']
    );

    if (!empty($cookie_params['domain'])) {
        $cookie_string .= '; Domain=' . $cookie_params['domain'];
    }

    if ($cookie_params['lifetime'] > 0) {
        $expires = gmdate('D, d M Y H:i:s T', time() + $cookie_params['lifetime']);
        $cookie_string .= '; Expires=' . $expires;
        $cookie_string .= '; Max-Age=' . $cookie_params['lifetime'];
    }

    header('Set-Cookie: ' . $cookie_string, false);

    return true;
}

/**
 * 방법 2: 직접 헤더 설정 (더 많은 제어가 필요한 경우)
 *
 * 아래 코드를 session_start() 대신 사용하세요:
 */
/*
function start_cross_domain_session() {
    $session_name = 'CROSS_DOMAIN_SESS';
    $session_id = $_COOKIE[$session_name] ?? null;

    if ($session_id && preg_match('/^[a-zA-Z0-9,-]{22,40}$/', $session_id)) {
        session_id($session_id);
    }

    session_name($session_name);
    session_start();

    $new_session_id = session_id();

    // Partitioned 쿠키 설정
    $cookie = sprintf(
        '%s=%s; Path=/; SameSite=None; Secure; HttpOnly; Partitioned',
        $session_name,
        $new_session_id
    );

    header('Set-Cookie: ' . $cookie, false);

    return true;
}
*/

/**
 * 브라우저별 호환성 체크
 */
function check_browser_support() {
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';

    $info = [
        'browser' => 'Unknown',
        'supports_samesite_none' => false,
        'supports_partitioned' => false
    ];

    // Chrome/Edge
    if (preg_match('/Chrome\/(\d+)/', $user_agent, $matches)) {
        $version = (int)$matches[1];
        $info['browser'] = 'Chrome/Edge';
        $info['supports_samesite_none'] = $version >= 80;
        $info['supports_partitioned'] = $version >= 114; // CHIPS 지원
    }
    // Firefox
    elseif (preg_match('/Firefox\/(\d+)/', $user_agent, $matches)) {
        $version = (int)$matches[1];
        $info['browser'] = 'Firefox';
        $info['supports_samesite_none'] = $version >= 69;
        $info['supports_partitioned'] = false; // 아직 미지원
    }
    // Safari
    elseif (preg_match('/Safari\/(\d+)/', $user_agent, $matches)) {
        if (!preg_match('/Chrome/', $user_agent)) { // Chrome이 아닌 실제 Safari
            $info['browser'] = 'Safari';
            $info['supports_samesite_none'] = true; // iOS 13+, macOS 10.15+
            $info['supports_partitioned'] = false; // 아직 미지원
        }
    }

    return $info;
}

/**
 * 디버그 정보 출력 (개발 환경에서만 사용)
 */
function debug_session_info() {
    if (php_sapi_name() === 'cli') {
        return;
    }

    echo "<!-- Session Debug Info\n";
    echo "Session ID: " . session_id() . "\n";
    echo "Session Name: " . session_name() . "\n";
    echo "Cookie Params: " . print_r(session_get_cookie_params(), true) . "\n";
    echo "Browser Support: " . print_r(check_browser_support(), true) . "\n";
    echo "HTTPS: " . ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'Yes' : 'No') . "\n";
    echo "-->\n";
}

/**
 * 사용 예시:
 *
 * require_once 'session-config.php';
 * session_start();
 * set_partitioned_cookie(); // Partitioned 속성 추가
 *
 * // 개발 환경에서만
 * // debug_session_info();
 */
