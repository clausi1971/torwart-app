const fs=require('node:fs'),path=require('node:path');
function generateAndroid(destination='android',html='index.html'){
 const files={
 'settings.gradle':`pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }
dependencyResolutionManagement { repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS); repositories { google(); mavenCentral() } }
rootProject.name = 'TorGeometrie'
include ':app'
`,
 'build.gradle':`plugins { id 'com.android.application' version '8.9.2' apply false }
`,
 'gradle.properties':`org.gradle.jvmargs=-Xmx2g -Dfile.encoding=UTF-8
android.useAndroidX=true
`,
 'app/build.gradle':`plugins { id 'com.android.application' }
def storeFilePath = rootProject.file('../_android-signing.p12')
def storePass = System.getenv('ANDROID_KEYSTORE_PASSWORD')
def keyStore = java.security.KeyStore.getInstance('PKCS12')
if (!storeFilePath.exists() || !storePass) throw new GradleException('Android signing key is missing')
storeFilePath.withInputStream { keyStore.load(it, storePass.toCharArray()) }
def aliasName = java.util.Collections.list(keyStore.aliases()).find { keyStore.isKeyEntry(it) }
if (!aliasName) throw new GradleException('Android signing key has no private key entry')
android {
 namespace 'de.clausi1971.torgeometrie'
 compileSdk 35
 defaultConfig {
  applicationId 'de.clausi1971.torgeometrie'
  minSdk 26
  targetSdk 35
  versionCode Integer.parseInt(System.getenv('GITHUB_RUN_NUMBER') ?: '1')
  versionName '1.0.' + (System.getenv('GITHUB_RUN_NUMBER') ?: '1')
 }
 signingConfigs { release {
  storeFile storeFilePath
  storeType 'PKCS12'
  storePassword storePass
  keyAlias aliasName
  keyPassword storePass
 } }
 buildTypes { release { signingConfig signingConfigs.release; minifyEnabled false } }
 compileOptions { sourceCompatibility JavaVersion.VERSION_17; targetCompatibility JavaVersion.VERSION_17 }
}
`,
 'app/src/main/AndroidManifest.xml':`<manifest xmlns:android="http://schemas.android.com/apk/res/android">
 <uses-feature android:glEsVersion="0x00020000" android:required="false" />
 <application android:label="TorGeometrie" android:icon="@drawable/ic_launcher" android:allowBackup="false" android:hardwareAccelerated="true" android:usesCleartextTraffic="false" android:supportsRtl="true" android:theme="@android:style/Theme.Material.Light.NoActionBar">
  <activity android:name=".MainActivity" android:exported="true" android:configChanges="orientation|screenSize|keyboardHidden|smallestScreenSize" android:windowSoftInputMode="adjustResize">
   <intent-filter><action android:name="android.intent.action.MAIN"/><category android:name="android.intent.category.LAUNCHER"/></intent-filter>
  </activity>
 </application>
</manifest>
`,
 'app/src/main/res/drawable/ic_launcher.xml':`<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108">
 <path android:fillColor="#174F3E" android:pathData="M0,0H108V108H0Z"/>
 <path android:fillColor="#287251" android:pathData="M0,54H108V81H0ZM0,0H108V27H0Z"/>
 <path android:fillColor="#00000000" android:strokeColor="#FFFFFF" android:strokeWidth="4" android:pathData="M22,80V31H86V80M14,80H94M35,80V60H73V80"/>
 <path android:fillColor="#F8C364" android:pathData="M54,41A7,7 0,1 1,54 55A7,7 0,1 1,54 41"/>
</vector>
`,
 'app/src/main/java/de/clausi1971/torgeometrie/MainActivity.java':`package de.clausi1971.torgeometrie;
import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.graphics.Insets;
import android.os.Build;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Collections;

public final class MainActivity extends Activity {
 private WebView web;
 private static final String HOST="appassets.androidplatform.net";
 private static final String START="https://"+HOST+"/assets/index.html";
 @Override public void onCreate(Bundle savedInstanceState) {
  super.onCreate(savedInstanceState);
  FrameLayout root=new FrameLayout(this);
  root.setBackgroundColor(Color.rgb(243,245,241));
  web=new WebView(this);
  web.setBackgroundColor(Color.rgb(243,245,241));
  root.addView(web,new FrameLayout.LayoutParams(-1,-1));setContentView(root);
  root.setOnApplyWindowInsetsListener((view,insets)->{
   if(Build.VERSION.SDK_INT>=30){Insets bars=insets.getInsets(WindowInsets.Type.systemBars()|WindowInsets.Type.displayCutout());view.setPadding(bars.left,bars.top,bars.right,bars.bottom);}
   else view.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());
   return insets;
  });root.requestApplyInsets();
  WebSettings settings=web.getSettings();
  settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);
  settings.setAllowFileAccess(false);settings.setAllowContentAccess(false);
  settings.setJavaScriptCanOpenWindowsAutomatically(false);settings.setSupportMultipleWindows(false);
  settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
  settings.setBuiltInZoomControls(false);settings.setDisplayZoomControls(false);
  web.setWebViewClient(new WebViewClient(){
   @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){
    if("https".equals(request.getUrl().getScheme())&&HOST.equals(request.getUrl().getHost())&&"/assets/index.html".equals(request.getUrl().getPath())){
     try{return new WebResourceResponse("text/html","UTF-8",getAssets().open("index.html"));}catch(IOException ignored){}
    }
    return new WebResourceResponse("text/plain","UTF-8",404,"Not found",Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));
   }
   @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){return !START.equals(request.getUrl().toString());}
   @Override public void onPageFinished(WebView view,String url){if(START.equals(url))view.evaluateJavascript("window.TorGeometrieAndroid=true",null);}
  });
  if(savedInstanceState==null||web.restoreState(savedInstanceState)==null)web.loadUrl(START);
 }
 @Override public void onBackPressed(){web.evaluateJavascript("!!(window.closeKeeper3dMobileView&&window.closeKeeper3dMobileView())",value->{if(!"true".equals(value)){if(web.canGoBack())web.goBack();else finish();}});}
 @Override protected void onSaveInstanceState(Bundle state){web.saveState(state);super.onSaveInstanceState(state);}
 @Override protected void onPause(){web.onPause();super.onPause();}
 @Override protected void onResume(){super.onResume();web.onResume();}
 @Override protected void onDestroy(){web.destroy();super.onDestroy();}
}
`};
 for(const [relative,content]of Object.entries(files)){const file=path.join(destination,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content);}
 const target=path.join(destination,'app/src/main/assets/index.html');fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(html,target);
 console.log('Android project prepared with bundled offline app.');
}
if(require.main===module)generateAndroid(process.argv[2]||'android',process.argv[3]||'index.html');
module.exports={generateAndroid};
