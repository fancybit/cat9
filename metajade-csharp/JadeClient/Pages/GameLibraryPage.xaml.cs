using System.Collections.ObjectModel;
using System.Windows.Input;
using LibMetaJade.DRM;
using Microsoft.Maui.Controls;

namespace JadeClient.Pages
{
  public partial class GameLibraryPage : ContentPage
    {
 public GameLibraryPage()
    {
       InitializeComponent();
      BindingContext = new GameLibraryPageModel();
  }

   protected override async void OnAppearing()
 {
      base.OnAppearing();
       if (BindingContext is GameLibraryPageModel viewModel)
        {
    await viewModel.InitializeAsync();
          }
 }

        protected override async void OnDisappearing()
        {
 base.OnDisappearing();
            if (BindingContext is GameLibraryPageModel viewModel)
{
     await viewModel.ShutdownAsync();
   }
        }
    }

    public class GameLibraryPageModel : BindableObject
    {
   private readonly DRMService _drmService;
        private readonly GameLauncherService _launcherService;
   private readonly GameLibraryService _libraryService;
 private string _currentUserID = "user_001";
  
 private ObservableCollection<GameLicenseViewModel> _gameLibrary = new();
     private string _clientStatusText = "客户端运行中";
   private Color _clientStatusColor = Colors.Green;
        private int _runningGamesCount;

  public ObservableCollection<GameLicenseViewModel> GameLibrary
        {
 get => _gameLibrary;
      set
 {
    _gameLibrary = value;
      OnPropertyChanged();
      }
        }

    public string ClientStatusText
        {
      get => _clientStatusText;
   set
  {
     _clientStatusText = value;
  OnPropertyChanged();
  }
}

  public Color ClientStatusColor
        {
     get => _clientStatusColor;
            set
     {
   _clientStatusColor = value;
     OnPropertyChanged();
   }
   }

        public int RunningGamesCount
 {
          get => _runningGamesCount;
   set
            {
    _runningGamesCount = value;
   OnPropertyChanged();
       }
  }

        public ICommand RefreshCommand { get; }
  public ICommand SettingsCommand { get; }
public ICommand LaunchGameCommand { get; }
        public ICommand ShowDetailsCommand { get; }
        public ICommand GoToStoreCommand { get; }

  public GameLibraryPageModel()
    {
     _drmService = new DRMService();
   _launcherService = new GameLauncherService(_drmService);
   _libraryService = new GameLibraryService(_drmService);

RefreshCommand = new Command(async () => await RefreshLibraryAsync());
     SettingsCommand = new Command(async () => await ShowSettingsAsync());
     LaunchGameCommand = new Command<GameLicenseViewModel>(async (game) => await LaunchGameAsync(game));
  ShowDetailsCommand = new Command<GameLicenseViewModel>(async (game) => await ShowGameDetailsAsync(game));
       GoToStoreCommand = new Command(async () => await GoToStoreAsync());
        }

     public async Task InitializeAsync()
        {
   // 初始化客户端
     await _launcherService.InitializeAsync(_currentUserID, "1.0.0");
      
          // 加载游戏库
 await RefreshLibraryAsync();

  // 开始监控会话
   _ = MonitorSessionsAsync();
  
      // 添加演示数据
 await AddDemoGamesAsync();
        }

        public async Task ShutdownAsync()
        {
   await _launcherService.ShutdownAsync();
  }

  private async Task RefreshLibraryAsync()
   {
            try
{
    var licenses = await _libraryService.GetUserLibraryAsync(_currentUserID);
        var runningGames = await _launcherService.GetRunningGamesAsync();
      
     GameLibrary.Clear();
    foreach (var license in licenses)
     {
         var vm = new GameLicenseViewModel(license)
{
 IsRunning = runningGames.Contains(license.GameID)
      };
     GameLibrary.Add(vm);
     }

   RunningGamesCount = runningGames.Count;
            }
     catch (Exception ex)
  {
     await Application.Current!.MainPage!.DisplayAlert(
           "错误",
   $"刷新游戏库失败: {ex.Message}",
     "确定"
                );
            }
        }

        private async Task LaunchGameAsync(GameLicenseViewModel? gameVM)
        {
            if (gameVM == null) return;

    try
{
    // 显示启动提示
 var launching = await Application.Current!.MainPage!.DisplayAlert(
      "启动游戏",
   $"正在启动 {gameVM.GameName}...\n\n需要保持 JadeClient 运行",
         "确定",
     "取消"
       );

   if (!launching) return;

     // 启动游戏
 var (success, message, process) = await _launcherService.LaunchGameAsync(
       gameVM.GameID,
         gameVM.GameName,
      gameVM.GameExecutablePath
    );

      if (success)
  {
     gameVM.IsRunning = true;
      RunningGamesCount++;

    await Application.Current!.MainPage!.DisplayAlert(
"成功",
   $"{gameVM.GameName} 启动成功！\n\n{message}",
      "确定"
  );
       }
          else
     {
      await Application.Current!.MainPage!.DisplayAlert(
       "启动失败",
       message,
   "确定"
  );
       }
   }
 catch (Exception ex)
  {
    await Application.Current!.MainPage!.DisplayAlert(
            "错误",
         $"启动游戏失败: {ex.Message}",
 "确定"
      );
    }
        }

 private async Task ShowGameDetailsAsync(GameLicenseViewModel? gameVM)
     {
    if (gameVM == null) return;

 var details = $"游戏ID: {gameVM.GameID}\n" +
        $"游戏名称: {gameVM.GameName}\n" +
      $"所有权类型: {gameVM.OwnershipType}\n" +
  $"购买日期: {gameVM.PurchaseDate:yyyy-MM-dd HH:mm}\n" +
$"许可证ID: {gameVM.LicenseID}\n" +
      $"状态: {(gameVM.IsActive ? "激活" : "未激活")}\n" +
      $"设备授权: {gameVM.AuthorizedDevicesCount}/{gameVM.MaxDevices}";

  if (gameVM.HasExpiry)
{
     details += $"\n有效期至: {gameVM.ExpiryDate:yyyy-MM-dd}";
  }

            await Application.Current!.MainPage!.DisplayAlert(
 "游戏详情",
     details,
    "确定"
       );
        }

     private async Task ShowSettingsAsync()
        {
   await Application.Current!.MainPage!.DisplayAlert(
    "设置",
    "DRM 设置\n\n? 客户端版本: 1.0.0\n? DRM 模式: 混合模式\n? 离线宽限期: 72小时\n? 反作弊: 已启用",
            "确定"
   );
 }

  private async Task GoToStoreAsync()
   {
   await Application.Current!.MainPage!.DisplayAlert(
    "商店",
    "即将打开游戏商店...",
              "确定"
   );
     }

        private async Task MonitorSessionsAsync()
        {
 while (true)
            {
  try
       {
         await Task.Delay(TimeSpan.FromSeconds(30));
       await _drmService.MonitorSessionsAsync();
          
     // 更新运行中的游戏数量
    var runningGames = await _launcherService.GetRunningGamesAsync();
  RunningGamesCount = runningGames.Count;

      // 更新游戏运行状态
     foreach (var game in GameLibrary)
        {
         game.IsRunning = runningGames.Contains(game.GameID);
           }
     }
      catch
     {
    // Ignore
     }
       }
        }

  private async Task AddDemoGamesAsync()
  {
            // 添加演示游戏
       var demoGames = new[]
 {
 ("game_rpg_001", "幻想RPG冒险", OwnershipType.Purchased),
     ("game_fps_001", "现代战争FPS", OwnershipType.Purchased),
       ("game_strategy_001", "星际战略", OwnershipType.Subscription),
    ("game_racing_001", "极速竞技", OwnershipType.Trial)
      };

       foreach (var (gameID, gameName, ownershipType) in demoGames)
    {
    // 检查是否已存在
    var exists = await _libraryService.OwnsGameAsync(_currentUserID, gameID);
   if (!exists)
         {
      var expiryDate = ownershipType == OwnershipType.Trial
      ? DateTimeOffset.UtcNow.AddDays(7)
     : ownershipType == OwnershipType.Subscription
   ? DateTimeOffset.UtcNow.AddMonths(1)
   : (DateTimeOffset?)null;

        await _drmService.PurchaseGameAsync(
      _currentUserID,
         gameID,
        gameName,
      ownershipType,
     expiryDate
  );
      }
    }

await RefreshLibraryAsync();
   }
    }

    public class GameLicenseViewModel : BindableObject
 {
  private bool _isRunning;

      public string LicenseID { get; set; } = string.Empty;
  public string GameID { get; set; } = string.Empty;
        public string GameName { get; set; } = string.Empty;
  public OwnershipType OwnershipType { get; set; }
        public DateTimeOffset PurchaseDate { get; set; }
        public DateTimeOffset? ExpiryDate { get; set; }
 public bool IsActive { get; set; }
        public int AuthorizedDevicesCount { get; set; }
    public int MaxDevices { get; set; }
public string? GameExecutablePath { get; set; }

        public bool HasExpiry => ExpiryDate.HasValue;

        public bool IsRunning
        {
   get => _isRunning;
            set
     {
  _isRunning = value;
    OnPropertyChanged();
}
}

   public GameLicenseViewModel(GameLicense license)
        {
   LicenseID = license.LicenseID;
  GameID = license.GameID;
    GameName = license.GameName;
      OwnershipType = license.OwnershipType;
   PurchaseDate = license.PurchaseDate;
   ExpiryDate = license.ExpiryDate;
 IsActive = license.IsActive && !license.IsRevoked;
        AuthorizedDevicesCount = license.AuthorizedDevices.Count;
         MaxDevices = license.MaxDevices;
        }
    }
}
