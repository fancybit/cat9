using JadeClient.Models;
using JadeClient.PageModels;
using Microsoft.Maui.ApplicationModel;
using System.Globalization;
using System.Threading;
using System.Diagnostics;
using System.Text.Json;
using System.Net;

namespace JadeClient.Pages
{
    public partial class MainPage : ContentPage
    {
        private const string ProdUrl = "https://www.metajade.online";
        private const string LocalUrl = "http://localhost:8080";

        public MainPage(MainPageModel model)
        {
            InitializeComponent();
            BindingContext = model;

            // Subscribe to navigation events to detect page language and to receive messages from the page
            MainWebView.Navigated += MainWebView_Navigated;
            MainWebView.Navigating += MainWebView_Navigating;

            // Ensure initial url
            MainWebView.Source = ProdUrl;
        }

        protected override void OnDisappearing()
        {
            base.OnDisappearing();
            MainWebView.Navigated -= MainWebView_Navigated;
            MainWebView.Navigating -= MainWebView_Navigating;
        }

        private async void MainWebView_Navigated(object sender, WebNavigatedEventArgs e)
        {
            // Try detect language after navigation completes
            await TryDetectAndApplyLanguageAsync();

            // Inject script to forward LangChannel.postMessage messages to the native app using a custom URL scheme
            try
            {
                var injectJs = @"(function(){ try{ var ch=(window.channels && window.channels.LangChannel); if(ch && ch.postMessage){ var orig=ch.postMessage.bind(ch); ch.postMessage = function(msg){ try{ orig(msg); }catch(e){} try{ var p=encodeURIComponent(JSON.stringify(msg)); window.location.href = 'app://lang?payload=' + p; }catch(e){} }; } }catch(e){} })();";
                await MainWebView.EvaluateJavaScriptAsync(injectJs);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"JS injection failed: {ex.Message}");
            }
        }

        private void LocalSwitch_Toggled(object sender, ToggledEventArgs e)
        {
            MainWebView.Source = e.Value ? LocalUrl : ProdUrl;
        }

        private void ReloadButton_Clicked(object sender, EventArgs e)
        {
            try
            {
                MainWebView.Reload();
            }
            catch
            {
                // Fallback: reset source
                var src = MainWebView.Source?.ToString() ?? ProdUrl;
                MainWebView.Source = src;
            }
        }

        private async void OpenExternButton_Clicked(object sender, EventArgs e)
        {
            var src = MainWebView.Source?.ToString();
            if (string.IsNullOrWhiteSpace(src)) src = ProdUrl;
            try
            {
                await Launcher.OpenAsync(src);
            }
            catch
            {
                // ignore
            }
        }

        private void MainWebView_Navigating(object sender, WebNavigatingEventArgs e)
        {
            try
            {
                var url = e.Url ?? string.Empty;
                if (url.StartsWith("app://lang", StringComparison.OrdinalIgnoreCase))
                {
                    // This is our in-band message from the page. Cancel navigation and handle payload.
                    e.Cancel = true;

                    try
                    {
                        // Extract payload param manually to avoid System.Web dependency
                        var idx = url.IndexOf("payload=", StringComparison.OrdinalIgnoreCase);
                        if (idx >= 0)
                        {
                            var payload = url.Substring(idx + "payload=".Length);
                            // If there are other query params, cut them off
                            var amp = payload.IndexOf('&');
                            if (amp >= 0) payload = payload.Substring(0, amp);

                            if (!string.IsNullOrWhiteSpace(payload))
                            {
                                var json = WebUtility.UrlDecode(payload);
                                using var doc = JsonDocument.Parse(json);
                                if (doc.RootElement.ValueKind == JsonValueKind.Object && doc.RootElement.TryGetProperty("lang", out var langElem))
                                {
                                    var lang = langElem.GetString() ?? string.Empty;
                                    if (!string.IsNullOrWhiteSpace(lang))
                                    {
                                        // Apply culture and update UI
                                        ApplyCultureFromLang(lang);
                                        MainThread.BeginInvokeOnMainThread(() =>
                                        {
                                            LocalLabel.Text = JadeClient.Resources.Strings.Loc.UseLocalDebug;
                                            ReloadButton.Text = JadeClient.Resources.Strings.Loc.Reload;
                                            OpenExternButton.Text = JadeClient.Resources.Strings.Loc.OpenExtern;
                                            // Update Shell titles
                                            if (Application.Current?.MainPage is Shell shell)
                                            {
                                                try
                                                {
                                                    shell.Title = JadeClient.Resources.Strings.Loc.AppTitle;
                                                    foreach (var item in shell.Items)
                                                    {
                                                        if (item.Route == "main") item.Title = JadeClient.Resources.Strings.Loc.Dashboard;
                                                        if (item.Route == "projects") item.Title = JadeClient.Resources.Strings.Loc.Projects;
                                                        if (item.Route == "manage") item.Title = JadeClient.Resources.Strings.Loc.Options;
                                                    }
                                                }
                                                catch { }
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Debug.WriteLine($"Failed parsing app://lang payload: {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Navigating handler failed: {ex.Message}");
            }
        }

        private async Task TryDetectAndApplyLanguageAsync()
        {
            try
            {
                // Try get <html lang> first, fall back to navigator.language / navigator.languages
                var js = "(function(){ try{ return document.documentElement.lang || (navigator.language || (navigator.languages && navigator.languages[0]) || ''); } catch(e){ return ''; } })();";
                var raw = await MainWebView.EvaluateJavaScriptAsync(js);
                var lang = NormalizeJsStringResult(raw);
                if (string.IsNullOrWhiteSpace(lang))
                    return;

                // If we already have this culture, no-op
                var cultureName = lang.Split(';', ',')[0].Replace('_', '-').Trim();
                var current = CultureInfo.CurrentUICulture?.Name ?? string.Empty;
                if (string.Equals(current, cultureName, StringComparison.OrdinalIgnoreCase))
                    return;

                ApplyCultureFromLang(lang);

                // Update UI texts on main thread
                MainThread.BeginInvokeOnMainThread(() =>
                {
                    LocalLabel.Text = JadeClient.Resources.Strings.Loc.UseLocalDebug;
                    ReloadButton.Text = JadeClient.Resources.Strings.Loc.Reload;
                    OpenExternButton.Text = JadeClient.Resources.Strings.Loc.OpenExtern;
                    // Update Shell titles
                    if (Application.Current?.MainPage is Shell shell)
                    {
                        try
                        {
                            shell.Title = JadeClient.Resources.Strings.Loc.AppTitle;
                            foreach (var item in shell.Items)
                            {
                                if (item.Route == "main") item.Title = JadeClient.Resources.Strings.Loc.Dashboard;
                                if (item.Route == "projects") item.Title = JadeClient.Resources.Strings.Loc.Projects;
                                if (item.Route == "manage") item.Title = JadeClient.Resources.Strings.Loc.Options;
                            }
                        }
                        catch { }
                    }
                });
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Language detection failed: {ex.Message}");
            }
        }

        private static string NormalizeJsStringResult(string jsResult)
        {
            if (string.IsNullOrWhiteSpace(jsResult))
                return jsResult ?? string.Empty;

            var s = jsResult.Trim();
            // Remove surrounding quotes if present
            if ((s.StartsWith("\"") && s.EndsWith("\"")) || (s.StartsWith("'") && s.EndsWith("'")))
            {
                if (s.Length >= 2)
                    s = s.Substring(1, s.Length - 2);
            }
            // Unescape common escapes
            s = s.Replace("\\\"", "\"").Replace("\\'", "'");
            return s;
        }

        private void ApplyCultureFromLang(string lang)
        {
            try
            {
                var cultureName = lang.Trim();
                // Take first token if contains quality values or commas
                var idx = cultureName.IndexOfAny(new char[] { ';', ',' });
                if (idx >= 0) cultureName = cultureName.Substring(0, idx).Trim();

                cultureName = cultureName.Replace('_', '-');

                CultureInfo culture = null!;
                try
                {
                    culture = new CultureInfo(cultureName);
                }
                catch
                {
                    // Fallback to language part only (e.g. "en" from "en-US")
                    var langPart = cultureName.Split('-')[0];
                    culture = new CultureInfo(langPart);
                }

                CultureInfo.DefaultThreadCurrentCulture = culture;
                CultureInfo.DefaultThreadCurrentUICulture = culture;
                Thread.CurrentThread.CurrentCulture = culture;
                Thread.CurrentThread.CurrentUICulture = culture;

                // Persist preference
                try { Preferences.Default.Set("AppLanguage", culture.Name); } catch { }

                Debug.WriteLine($"Applied culture from web: {culture.Name}");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"ApplyCulture failed: {ex.Message}");
            }
        }
    }
}