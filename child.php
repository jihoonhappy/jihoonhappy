<?php
/**
 * 크로스 도메인 iframe 내부 페이지
 * 이 페이지는 다른 도메인의 iframe에서 로드됩니다.
 */

// 세션 설정 (반드시 session_start() 전에 호출)
require_once __DIR__ . '/session-config.php';

// 세션 시작
session_start();

// Partitioned 쿠키 설정 (CHIPS 지원)
set_partitioned_cookie();

// 방문 횟수 추적
if (!isset($_SESSION['visit_count'])) {
    $_SESSION['visit_count'] = 0;
}
$_SESSION['visit_count']++;
$_SESSION['last_visit'] = date('Y-m-d H:i:s');

// POST 요청 처리 (데이터 저장)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['user_name'])) {
    $_SESSION['user_name'] = htmlspecialchars($_POST['user_name']);
}

// 세션 초기화
if (isset($_GET['reset'])) {
    session_destroy();
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
    exit;
}

$sessionId = session_id();
$visitCount = $_SESSION['visit_count'];
$userName = $_SESSION['user_name'] ?? '';
$lastVisit = $_SESSION['last_visit'] ?? 'N/A';
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Child Page (Domain B)</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f5f5f5;
        }
        .session-info {
            background: white;
            border: 2px solid #4caf50;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .success {
            background: #c8e6c9;
            color: #2e7d32;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
        }
        .session-data {
            background: #e8f5e9;
            padding: 15px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .session-data dt {
            font-weight: bold;
            color: #2e7d32;
            margin-top: 8px;
        }
        .session-data dd {
            margin-left: 20px;
            font-family: monospace;
            color: #333;
        }
        .form-container {
            background: white;
            border: 2px solid #2196f3;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
        }
        input[type="text"] {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            background: #2196f3;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
        }
        button:hover {
            background: #1976d2;
        }
        .reset-btn {
            background: #f44336;
        }
        .reset-btn:hover {
            background: #d32f2f;
        }
        h2 {
            color: #1976d2;
            margin-top: 0;
        }
        .cookie-info {
            background: #fff3e0;
            border: 2px solid #ff9800;
            border-radius: 5px;
            padding: 15px;
            margin-top: 20px;
            font-size: 13px;
        }
        .cookie-info code {
            background: #ffe0b2;
            padding: 2px 6px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="session-info">
        <div class="success">
            ✅ 세션이 정상적으로 유지되고 있습니다!
        </div>

        <h2>📊 세션 정보</h2>
        <dl class="session-data">
            <dt>세션 ID:</dt>
            <dd><?php echo $sessionId; ?></dd>

            <dt>방문 횟수:</dt>
            <dd><?php echo $visitCount; ?>회</dd>

            <dt>마지막 방문:</dt>
            <dd><?php echo $lastVisit; ?></dd>

            <?php if ($userName): ?>
            <dt>저장된 사용자 이름:</dt>
            <dd><?php echo $userName; ?></dd>
            <?php endif; ?>
        </dl>

        <p style="color: #666; font-size: 14px;">
            페이지를 새로고침하면 방문 횟수가 증가합니다.<br>
            세션이 유지되지 않으면 매번 1로 초기화됩니다.
        </p>
    </div>

    <div class="form-container">
        <h2>💾 데이터 저장 테스트</h2>
        <form method="POST">
            <label for="user_name">이름을 입력하세요:</label>
            <input type="text" id="user_name" name="user_name"
                   placeholder="이름 입력..."
                   value="<?php echo $userName; ?>">
            <button type="submit">저장</button>
            <a href="?reset=1"><button type="button" class="reset-btn">세션 초기화</button></a>
        </form>
    </div>

    <div class="cookie-info">
        <h3 style="margin-top: 0;">🍪 쿠키 설정 정보</h3>
        <p>현재 세션 쿠키는 다음과 같이 설정되어 있습니다:</p>
        <ul>
            <li><code>SameSite=None</code>: 크로스 도메인 허용</li>
            <li><code>Secure</code>: HTTPS에서만 전송</li>
            <li><code>Partitioned</code>: CHIPS(Cookies Having Independent Partitioned State) 지원</li>
            <li><code>HttpOnly</code>: JavaScript 접근 방지 (보안)</li>
        </ul>
        <p><strong>주의:</strong> HTTPS 환경에서만 동작합니다!</p>
    </div>

    <script>
        // 부모 페이지로 메시지 전송 (선택사항)
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'session_info',
                sessionId: '<?php echo $sessionId; ?>',
                visitCount: <?php echo $visitCount; ?>
            }, '*'); // 실제로는 특정 origin 지정 필요
        }

        // 자동 새로고침 데모 (선택사항)
        // setTimeout(() => location.reload(), 5000);
    </script>
</body>
</html>
