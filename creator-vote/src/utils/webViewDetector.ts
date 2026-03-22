/**
 * WebView（App内ブラウザ）かどうかを判定するユーティリティ
 */

export const isWebView = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  
  // 一般的なWebView判定パターン
  const webViewPatterns = [
    /webview/i,                    // Android WebView
    /wv\)/i,                       // Android WebView alternative
    /Version\/[\d.]+\s+Chrome\/(?![\d.]+\s)/i, // Older Android WebView
    /Android.*AppleWebKit(?!.*Chrome)/i,      // Older Android WebView
    /Chrome\/[0-9.]+\s+Mobile/i,  // Chrome Mobile (check for webview)
    /Instagram/i,                 // Instagram In-App Browser
    /FBAN|FBAV/i,                 // Facebook In-App Browser
    /EdgeiOS|EdgedHTML/i,         // Microsoft Edge iOS
    /WhatsApp/i,                  // WhatsApp In-App Browser
    /Line\//i,                    // LINE In-App Browser
    /TikTok/i,                    // TikTok In-App Browser
    /Alipay/i,                    // Alipay In-App Browser
    /WeChat/i,                    // WeChat In-App Browser
    /QQ\//i,                      // QQ In-App Browser
  ];

  // User Agentがいずれかのパターンにマッチするかチェック
  return webViewPatterns.some(pattern => pattern.test(ua));
};

export default isWebView;
