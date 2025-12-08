using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Maui.ApplicationModel;
using Microsoft.Maui.Storage;
using System.Windows.Input;

namespace JadeClient.PageModels
{
    public class SettingsPageModel : ObservableObject
    {
        public SettingsPageModel()
        {
            SaveShortcutsCommand = new AsyncRelayCommand(SaveShortcutsAsync);
            SaveProxyCommand = new AsyncRelayCommand(SaveProxyAsync);
            SaveStorageCommand = new AsyncRelayCommand(SaveStorageAsync);
            BrowseStorageCommand = new AsyncRelayCommand(BrowseStorageAsync);

            // Load persisted preferences
            ShortcutCaptureText = Preferences.Default.Get("ShortcutKeys", string.Empty);
            ProxyEnabled = Preferences.Default.Get("ProxyEnabled", false);
            ProxyHost = Preferences.Default.Get("ProxyHost", string.Empty);
            ProxyPort = Preferences.Default.Get("ProxyPort", string.Empty);
            GameStoragePath = Preferences.Default.Get("GameStoragePath", string.Empty);
        }

        public string ShortcutCaptureText { get; set; }
        public bool ProxyEnabled { get; set; }
        public string ProxyHost { get; set; }
        public string ProxyPort { get; set; }
        public string GameStoragePath { get; set; }

        public IAsyncRelayCommand SaveShortcutsCommand { get; }
        public IAsyncRelayCommand SaveProxyCommand { get; }
        public IAsyncRelayCommand SaveStorageCommand { get; }
        public IAsyncRelayCommand BrowseStorageCommand { get; }

        private Task SaveShortcutsAsync()
        {
            Preferences.Default.Set("ShortcutKeys", ShortcutCaptureText ?? string.Empty);
            return Task.CompletedTask;
        }

        private Task SaveProxyAsync()
        {
            Preferences.Default.Set("ProxyEnabled", ProxyEnabled);
            Preferences.Default.Set("ProxyHost", ProxyHost ?? string.Empty);
            Preferences.Default.Set("ProxyPort", ProxyPort ?? string.Empty);
            return Task.CompletedTask;
        }

        private Task SaveStorageAsync()
        {
            Preferences.Default.Set("GameStoragePath", GameStoragePath ?? string.Empty);
            return Task.CompletedTask;
        }

        private async Task BrowseStorageAsync()
        {
            try
            {
                var result = await FilePicker.PickAsync(new PickOptions { PickerTitle = "Select game storage folder" });
                if (result != null)
                {
                    GameStoragePath = result.FullPath ?? result.FileName;
                }
            }
            catch { }
        }
    }
}
