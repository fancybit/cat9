using System.Resources;

namespace JadeClient.Resources.Strings
{
    public static class Loc
    {
        private static readonly ResourceManager _rm = new ResourceManager("JadeClient.Resources.Strings.Resources", typeof(Loc).Assembly);

        public static string AppTitle => _rm.GetString("AppTitle") ?? "MetaJadeGaming";
        public static string Dashboard => _rm.GetString("Dashboard") ?? "Dashboard";
        public static string Projects => _rm.GetString("Projects") ?? "Projects";
        public static string ManageMeta => _rm.GetString("ManageMeta") ?? "Manage Meta";
        public static string Options => _rm.GetString("Options") ?? "Options";
        public static string GameLibrary => _rm.GetString("GameLibrary") ?? "Game Library";
        public static string UseLocalDebug => _rm.GetString("UseLocalDebug") ?? "Use Local Debug (localhost:8080)";
        public static string Reload => _rm.GetString("Reload") ?? "Reload";
        public static string OpenExtern => _rm.GetString("OpenExtern") ?? "Open Extern";

        // Settings page strings
        public static string Shortcuts => _rm.GetString("Shortcuts") ?? "Shortcuts";
        public static string ProxySettings => _rm.GetString("ProxySettings") ?? "Proxy Settings";
        public static string GameStorage => _rm.GetString("GameStorage") ?? "Game Storage";
        public static string Save => _rm.GetString("Save") ?? "Save";
        public static string Browse => _rm.GetString("Browse") ?? "Browse";
        public static string ResetApp => _rm.GetString("ResetApp") ?? "Reset App";
        public static string EnableProxy => _rm.GetString("EnableProxy") ?? "Enable Proxy";
        public static string ProxyHost => _rm.GetString("ProxyHost") ?? "Proxy Host";
        public static string ProxyPort => _rm.GetString("ProxyPort") ?? "Proxy Port";
        public static string StoragePath => _rm.GetString("StoragePath") ?? "Storage Path";
        public static string ShortcutKeys => _rm.GetString("ShortcutKeys") ?? "Shortcut Keys";
    }
}
