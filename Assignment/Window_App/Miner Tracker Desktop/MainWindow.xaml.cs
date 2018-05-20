using Miner_Tracker_Common.ConfigurationService;
using Miner_Tracker_Common.CryptoService;
using Miner_Tracker_Common.LogService;
using Miner_Tracker_Common.ManagementService;
using Miner_Tracker_Common.Model.Configuration;
using Miner_Tracker_Common.Model.Monitoring;
using Miner_Tracker_Common.NetworkService;
using Miner_Tracker_Common.WindowsService;
using Miner_Tracker_Common.Utils;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Reflection;
using System.Threading;
using System.Timers;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Forms;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;

namespace Miner_Tracker_Desktop
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private string CLIENT_ID;
        private const string SYSTEM_TRAY_ICON = "logo.ico";
        private const string SERVICE_RUNNING_ICON = @"Resources\logo-service-on.ico";
        private const string SERVICE_DOWN_ICON = @"Resources\logo-service-down.ico";
        private const string INTERNET_DOWN_ICON = @"Resources\logo-internet-down.ico";
        private const string SERVER_DOWN_ICON = @"Resources\logo-cloud-down.ico";
        private const string SERVICE_NAME = "MinerTrackerService";
        private UserConfiguration UserConfig;
        private ServiceConfiguration ServiceConfig;
        private System.Timers.Timer CheckTimer;
        private int NumberOfGPU = 0;
        private UserGPU[] gpuList = null;
        private string ToolTipsText = "Miner Tracker Desktop";
        private NotifyIcon systemTrayIcon;
        private const string TASK_NAME = "MinerTrackerDesktop";
        private System.Windows.Forms.MenuItem GPUContextMenu;
        private System.Windows.Forms.MenuItem PCIDContextMenu;
        private Window PCIDSettingWindows;

        public MainWindow(Dictionary<string,string> args)
        {
            InitializeComponent();

            //Set Client ID
            string rawID = $"{Environment.MachineName}-{Environment.UserName}-Miner Tracker-Client";
            CLIENT_ID = CryptTool.Encrypt(rawID);

            //Set SystemTray Icon
            systemTrayIcon = new NotifyIcon();
            systemTrayIcon.Icon = new Icon(SYSTEM_TRAY_ICON);
            systemTrayIcon.Visible = true;
            systemTrayIcon.Text = ToolTipsText;
            this.Hide();
            systemTrayIcon.DoubleClick +=
                delegate (object callBack, EventArgs mouseEvent)
                {
                    this.Show();
                    this.WindowState = WindowState.Normal;
                    this.Activate();
                };
            systemTrayIcon.BalloonTipClosed += (sender, e) => { var thisIcon = (NotifyIcon)sender; thisIcon.Visible = false; thisIcon.Dispose(); };
            System.Windows.Forms.ContextMenu contextMenu = new System.Windows.Forms.ContextMenu();
            PCIDContextMenu = contextMenu.MenuItems.Add("Checking PCID...");
            PCIDContextMenu.Enabled = false;
            GPUContextMenu = contextMenu.MenuItems.Add("GPU List");
            GPUContextMenu.Enabled = false;
            contextMenu.MenuItems.Add("View Log", (s, e) =>
            {
                try
                {
                    Process.Start("notepad.exe", Path.Combine(ServiceConfig.LogPath, EventLogger.GetLogFileName()));
                }
                catch (Exception ex)
                {
                    ShowErrorDialog("Unable to open log", ex.ToString());
                    EventLogger.WriteLog("OPEN LOG ERROR", ex.ToString());
                }
            });
            contextMenu.MenuItems.Add("Change PC ID", (s, e) =>
            {
                OpenSettingContextMenu();
            });

            contextMenu.MenuItems.Add("Restore", (s, e) =>
            {
                this.Show();
                this.WindowState = WindowState.Normal;
                this.Activate();
            });
            contextMenu.MenuItems.Add("Exit", (s, e) =>
            {
                System.Windows.Application.Current.Shutdown();
            });

            systemTrayIcon.ContextMenu = contextMenu;
            //Get version
            var currentVersion = Assembly.GetExecutingAssembly().GetName().Version.ToString();
            FooterVersionTextBlock.Text = $"Version: {currentVersion}";
            var createdTime = AssemblyInformationManager.GetCreatedTime(@"C:\Program Files\Miner Tracker\Miner Tracker Desktop.exe");
            AboutVersionTextBlock.Text = $"Version {currentVersion} -Released {createdTime.Month}/{createdTime.Year}";

            //Get config
            var serviceConfigReader = new ConfigurationReader();
            ServiceConfig = serviceConfigReader.GetServiceConfig();
            //If can not get service config, then show error and shutdown
            if (!ClassUtils.CheckNull(ServiceConfig))
            {
                EventLogger.WriteLog("CLIENT READ SERVICE CONFIG ERROR", "Null retrieved config");
                ShowErrorDialog("File system error", "Unable to retrieve service configuration");
                System.Windows.Application.Current.Shutdown();
            }

            var userConfigReader = new ConfigurationReader(isService: false, userConfigPath: ServiceConfig.UserConfigPath, userConfigFile: ServiceConfig.UserConfigFileName);
            UserConfig = userConfigReader.GetUserConfig();
            var CurrentUserConfig = UserConfig;

            //Service config is okay but can not retrieve the user.config

            if (!ClassUtils.CheckNull(UserConfig))
            {
                ShowErrorDialog("File system error", "Unable to retrieve client configuration. Options have been set to default.");
                UserConfig = new UserConfiguration
                {
                    ID = CurrentUserConfig == null || CurrentUserConfig.ID == 0 ? ServiceConfig.UserID : CurrentUserConfig.ID,
                    LogPath = CurrentUserConfig == null || CurrentUserConfig.LogPath == null ? ServiceConfig.UserLogPath : CurrentUserConfig.LogPath,
                    OpenOnStartup = CurrentUserConfig == null || CurrentUserConfig.OpenOnStartup == null ? ServiceConfig.UserOpenOnStartup : CurrentUserConfig.OpenOnStartup,
                    CheckInterval = CurrentUserConfig == null || CurrentUserConfig.CheckInterval == null ? ServiceConfig.UserCheckInterval : CurrentUserConfig.CheckInterval,
                    MinimizedWhenClose = CurrentUserConfig == null || CurrentUserConfig.MinimizedWhenClose == null ? ServiceConfig.UserMinimizedWhenClose : CurrentUserConfig.MinimizedWhenClose,
                    PCID = CurrentUserConfig == null || CurrentUserConfig.PCID == null ? ServiceConfig.UserPCID : CurrentUserConfig.PCID,
                    PreviousPCID = CurrentUserConfig == null || CurrentUserConfig.PreviousPCID == null ? ServiceConfig.UserPCID : CurrentUserConfig.PreviousPCID
                };
                SaveUserConfig();
            }
            // Since here, can use UserConfig
            SetupComputerSection();
            SetupConfigSection();
            SetupOptionSection();
            try
            {
                CheckTimer = new System.Timers.Timer();
                CheckTimer.Elapsed += new ElapsedEventHandler(OnTimer);
                CheckTimer.Interval = 10;
                CheckTimer.Start();
            }
            catch (Exception ex)
            {
                EventLogger.WriteLog("TIMER ERROR", ex.ToString(), UserConfig.LogPath);
                EventLogger.WriteLog("", "Exiting....", UserConfig.LogPath);
                return;
            }

            if (args.TryGetValue("--minimized", out string value))
            {
                if (value.Equals("true"))
                {
                    //this.Hide();
                }
            }


        }



        private void SetupOptionSection()
        {
            RunOnStartupCheckbox.IsChecked = UserConfig.OpenOnStartup == "1" ? true : false;
            MinimizeWhenCloseCheckBox.IsChecked = UserConfig.MinimizedWhenClose == "1" ? true : false;
            RefreshRateComboBox.IsSynchronizedWithCurrentItem = true;
            foreach (ComboBoxItem item in RefreshRateComboBox.Items)
                if (item.Content.ToString() == UserConfig.CheckInterval)
                {
                     RefreshRateComboBox.SelectedValue = item;
                    break;
                }   
        }   

        private void SetupComputerSection()
        {
            //OS Name
            string osName = ComputerManager.GetOSName().Replace("Microsoft", "").Trim();

            OperatingSystemTextBlock.Text = osName;

            if (osName.Equals("Unknown"))
            {
                OperatingSystemTextBlock.Foreground = new SolidColorBrush(Colors.Red);
            }
            else
            {
                OperatingSystemTextBlock.Foreground = new SolidColorBrush(Colors.Blue);
                OperatingSystemImage.Visibility = Visibility.Visible;
                try
                {
                    if (osName.Contains("7"))
                    {
                        OperatingSystemImage.Source = new BitmapImage(new Uri(@"Resources\windows10.png", UriKind.Relative));
                    }
                    else if (osName.Contains("8.1"))
                    {
                        OperatingSystemImage.Source = new BitmapImage(new Uri(@"Resources\windows8.1.png", UriKind.Relative));
                    }
                    else if (osName.Contains("8"))
                    {
                        OperatingSystemImage.Source = new BitmapImage(new Uri(@"Resources\Windows8.png", UriKind.Relative));
                    }
                    else if (osName.Contains("10"))
                    {
                        OperatingSystemImage.Source = new BitmapImage(new Uri(@"Resources\windows10.png", UriKind.Relative));
                    }
                    else
                    {
                        OperatingSystemImage.Visibility = Visibility.Hidden;
                        EventLogger.WriteLog("SYSTEM OS VERSION ERROR", osName);

                    }
                } catch (Exception ex)
                {
                    EventLogger.WriteLog("SYSTEM OS VERSION ERROR", ex.ToString());
                    OperatingSystemImage.Visibility = Visibility.Hidden;
                }

                //OS Version
                string OSVersion = ComputerManager.GetOSVersion();
                BuildVersionTextBlock.Text = OSVersion;
                if (OSVersion.Equals("Unknown"))
                {
                    BuildVersionTextBlock.Foreground = new SolidColorBrush(Colors.Red);
                }
                else
                {
                    BuildVersionTextBlock.Foreground = new SolidColorBrush(Colors.Blue);
                }


                //Machine Name
                try
                {
                    string computerName = Environment.MachineName;
                    string currentUser = Environment.UserName;
                    ComputerNameTextBlock.Foreground = new SolidColorBrush(Colors.Blue);
                    ComputerIDTextBlock.Foreground = new SolidColorBrush(Colors.Black);
                    ComputerNameTextBlock.Text = computerName;
                    string macAddr = MacAddress.GetFirstMacAddress();
                    var PCID = UserConfig.PCID.Equals("default") ? $"{computerName}-{currentUser}-{macAddr}" : UserConfig.PCID;
                    ComputerIDTextBlock.Text = $"PC ID: {PCID}";
                    PCIDTextBox.Text = PCID;
                    PCIDContextMenu.Text = $"PC ID: {PCID}";
                }
                catch (Exception ex)
                {
                    EventLogger.WriteLog("SYSTEM MACHINE NAME ERROR", ex.ToString(), UserConfig.LogPath);
                    ComputerNameTextBlock.Foreground = new SolidColorBrush(Colors.Red);
                    ComputerNameTextBlock.Text = "Unknown";

                    ComputerIDTextBlock.Foreground = new SolidColorBrush(Colors.Gray);
                    ComputerIDTextBlock.Text = "Unknown ID";
                }

                //User Name
                try
                {
                    string userName = Environment.UserName;
                    CurrentUserTextBlock.Foreground = new SolidColorBrush(Colors.Blue);
                    CurrentUserTextBlock.Text = userName;
                }
                catch (Exception ex)
                {
                    EventLogger.WriteLog("SYSTEM USERNAME ERROR", ex.ToString(), UserConfig.LogPath);
                    CurrentUserTextBlock.Foreground = new SolidColorBrush(Colors.Red);
                    CurrentUserTextBlock.Text = "Unknown";
                }
            }
        }

        private void SetupConfigSection()
        {
            CheckIntervalTextBlock.Text = ServiceConfig.CheckInterval + "s";
        }

        private void SetupServiceSection()
        {
            //Service status
            bool isRunning = ServiceManager.CheckIfServiceRunning(SERVICE_NAME);
            if (isRunning)
            {

                this.Dispatcher.Invoke(() =>
                {
                    ServiceStatusIndicator.Fill = new SolidColorBrush(Colors.Green);
                    ServiceStatusTextBlock.Text = "Running";
                    ServiceStatusTextBlock.Foreground = new SolidColorBrush(Colors.Green);
                    systemTrayIcon.Icon = new Icon(SERVICE_RUNNING_ICON);
                    ToolTipsText += "Running";
                });

            }
            else
            {
                this.Dispatcher.Invoke(() =>
                {

                    ServiceStatusIndicator.Fill = new SolidColorBrush(Colors.Red);
                    ServiceStatusTextBlock.Text = "Stopped";
                    ServiceStatusTextBlock.Foreground = new SolidColorBrush(Colors.Red);
                    systemTrayIcon.Icon = new Icon(SERVICE_DOWN_ICON);
                    ToolTipsText += "Service Down";
                });
            }
            //Server 
            UserComputer computer = new UserComputer("TestingConnection", 999, "", new List<UserGPU>());
            var returnRequest = HttpRequest.SendPostRequest(ServiceConfig.ServerAddress, JsonConverter.ConvertToJson(computer));
            if (returnRequest.Equals("OK") || returnRequest.Contains("200"))
            {
                this.Dispatcher.Invoke(() =>
                {
                    ServerStatusTextBlock.Foreground = new SolidColorBrush(Colors.Green);
                    ServerStatusTextBlock.Text = "Online";
                });
            }
            else
            {
                this.Dispatcher.Invoke(() =>
                {
                    ServerStatusTextBlock.Foreground = new SolidColorBrush(Colors.Red);
                    ServerStatusTextBlock.Text = "Offline";
                    systemTrayIcon.Icon = new Icon(SERVER_DOWN_ICON);
                    ToolTipsText += "\nServer: Offine";
                });
            }

            //Internet status
            if (ConnectionStatus.IsConnected())
            {
                this.Dispatcher.Invoke(() =>
                {
                    InternetStatusTextBlock.Foreground = new SolidColorBrush(Colors.Green);
                    InternetStatusTextBlock.Text = "Connected";
                });
            }
            else
            {
                this.Dispatcher.Invoke(() =>
                {
                    InternetStatusTextBlock.Foreground = new SolidColorBrush(Colors.Red);
                    InternetStatusTextBlock.Text = "Disconnected";
                    systemTrayIcon.Icon = new Icon(INTERNET_DOWN_ICON);
                    ToolTipsText += "\nInternet: Disconnected";
                });
            }

        }

        private void OnTimer(object callBack, EventArgs args)
        {
            ToolTipsText = "Miner Tracker Desktop - ";
            CheckTimer.Interval = int.Parse(UserConfig.CheckInterval) * 1000;
            SetupServiceSection();
            GetGPUInformation();
            this.Dispatcher.Invoke(() =>
            {
                systemTrayIcon.Text = ToolTipsText;
            });

            //Update PCID 
            //Get new PC ID from config
            var userConfigReader = new ConfigurationReader(isService: false, userConfigPath: ServiceConfig.UserConfigPath, userConfigFile: ServiceConfig.UserConfigFileName);
            var userConfig = userConfigReader.GetUserConfig();
            userConfig = userConfig ?? UserConfig;

            string computerName = Environment.MachineName;
            string currentUser = Environment.UserName;
            string macAddr = MacAddress.GetFirstMacAddress();
            if (userConfig != null && PCIDContextMenu != null)
            {
                var PCID = userConfig.PCID.Equals("default") ? $"{computerName}-{currentUser}-{macAddr}" : userConfig.PCID;
                PCIDContextMenu.Text = $"PC ID: {PCID}";
                this.Dispatcher.Invoke(() =>
                {
                    ComputerIDTextBlock.Text = $"PC ID: {PCID}";
                    if (SavePCIDButton.IsEnabled == false)
                    {
                        PCIDTextBox.Text = PCID;
                    }
                });
            }
        }
        private void GetGPUInformation()
        {
            gpuList = DeviceManager.GetAllGPUInformation().ToArray();
            if (gpuList.Length > 0)
            {
                this.Dispatcher.Invoke(() =>
                {
                    GPUSelectionCombobox.IsSynchronizedWithCurrentItem = true;
                    NumberOfGPUsTextBlock.Text = gpuList.Length.ToString();
                    GPUSelectionCombobox.IsEnabled = true;

                    if (gpuList.Length > 0)
                    {
                        int j = 0;
                        GPUContextMenu.Enabled = true;
                        GPUContextMenu.MenuItems.Clear();

                        foreach (var gpu in gpuList)
                        {
                            var thisGPUMenu = GPUContextMenu.MenuItems.Add($"GPU {j}: {gpu.Name}");
                            UpdateGPUMenu(gpu, thisGPUMenu);
                            j++;
                        }
                    }

                    if (gpuList.Length != NumberOfGPU)
                    {
                        GPUSelectionCombobox.Items.Clear();
                        NumberOfGPU = gpuList.Length;
                        int i = 0;
                        foreach (var gpu in gpuList)
                        {
                            GPUSelectionCombobox.Items.Add($"GPU {i}: {gpu.Name}");
                            i++;
                        }
                        GPUSelectionCombobox.SelectedIndex = 0;
                    }

                    var selectedGPU = gpuList[GPUSelectionCombobox.SelectedIndex];
                    UpdateGPUInformation(selectedGPU);
                });
            }
            ToolTipsText = ToolTipsText.Replace($"\n{gpuList.Length} GPUs","") + $"\n{gpuList.Length} GPUs";
        }

        private void UpdateGPUMenu(UserGPU gpu, System.Windows.Forms.MenuItem menu)
        {
            menu.MenuItems.Add("Temperature: " + gpu.Temperature.ToString() + "°C");
            menu.MenuItems.Add("Fan Speed: " + gpu.FanSpeed.ToString() + "%");
            menu.MenuItems.Add("Used Memory: " + ((gpu.MemoryUsage.ToString().Length >= 4) ? gpu.MemoryUsage.ToString().Substring(0, 4) + "%" : gpu.MemoryUsage.ToString() + "%"));
            if (gpu.Name.ToLower().Contains("nvidia"))
            {
                menu.MenuItems.Add("Power Usage: " + gpu.PowerUsage.ToString() + "W");
                menu.MenuItems.Add("Power Limit: " + gpu.PowerLimit.ToString() + "W");
                menu.MenuItems.Add("Memory Total: " + gpu.MemoryTotal.ToString() + "MB");
                menu.MenuItems.Add("Utilization: " + gpu.MemoryUtilization.ToString() + "%");
            }

        }

        private void UpdateGPUInformation(UserGPU gpu)
        {
            GPUImage.Source = gpu.Name.ToLower().Contains("nvidia") ? new BitmapImage(new Uri(@"Resources\nvidia.jpg", UriKind.Relative)) : new BitmapImage(new Uri(@"Resources\amd.png", UriKind.Relative));
            GPUImage.Visibility = Visibility.Visible;

            GPUNameTextBlock.Text = gpu.Name;
            GPUNameLabel.Foreground = new SolidColorBrush(Colors.Black);

            GPUTemperatureTextBlock.Text = gpu.Temperature == -1? "Error" : gpu.Temperature.ToString() + "°C";
            TemperatureLabel.Foreground = gpu.Temperature == -1? new SolidColorBrush(Colors.Red) : new SolidColorBrush(Colors.Black);

            FanSpeedTextBlock.Text = gpu.FanSpeed == -1? "Error" : gpu.FanSpeed.ToString() + "%";
            FanSpeedLabel.Foreground = gpu.FanSpeed == -1? new SolidColorBrush(Colors.Red) : new SolidColorBrush(Colors.Black);

            MemoryUsageLabel.Foreground = gpu.MemoryUsage == -1? new SolidColorBrush(Colors.Red) : new SolidColorBrush(Colors.Black);
            if (gpu.Name.ToLower().Contains("nvidia"))
            {
                MemoryUsageTextBlock.Text = gpu.MemoryUsage == -1? "Error" : (gpu.MemoryUsage.ToString().Length >= 4) ? gpu.MemoryUsage.ToString().Substring(0, 4) + "%" : gpu.MemoryUsage.ToString() + "%";
                PowerUsageTextBlock.Text = gpu.PowerUsage == -1? "Error" : gpu.PowerUsage.ToString()+"W";
                PowerUsageLabel.Foreground = gpu.PowerUsage == -1? new SolidColorBrush(Colors.Red) : new SolidColorBrush(Colors.Black);

                PowerLimitTextBlock.Text = gpu.PowerLimit == -1? "Error" : gpu.PowerLimit.ToString()+"W";
                PowerLimitLabel.Foreground = gpu.PowerLimit == -1? new SolidColorBrush(Colors.Red) : new SolidColorBrush(Colors.Black);

                MemoryTotalTextBlock.Text = gpu.MemoryTotal == -1? "Error" : gpu.MemoryTotal.ToString()+"MB";
                MemoryTotalLabel.Foreground = gpu.MemoryTotal == -1 ? new SolidColorBrush(Colors.Red) : new SolidColorBrush(Colors.Black);

                UtilizationTextBlock.Text = gpu.MemoryUtilization == -1? "Error" : gpu.MemoryUtilization.ToString()+"%";
                UtilizationLabel.Foreground = gpu.MemoryUtilization == -1 ? new SolidColorBrush(Colors.Red) : new SolidColorBrush(Colors.Black);
            }
            else
            {
                MemoryUsageTextBlock.Text = (gpu.MemoryUsage.ToString().Length >= 4)? gpu.MemoryUsage.ToString().Substring(0, 4) + "%" : gpu.MemoryUsage.ToString() +"%";

                PowerUsageTextBlock.Text = "N/A";
                PowerUsageLabel.Foreground = new SolidColorBrush(Colors.Gray);

                PowerLimitTextBlock.Text = "N/A";
                PowerLimitLabel.Foreground = new SolidColorBrush(Colors.Gray);

                MemoryTotalTextBlock.Text = "N/A";
                MemoryTotalLabel.Foreground = new SolidColorBrush(Colors.Gray);

                UtilizationTextBlock.Text = "N/A";
                UtilizationLabel.Foreground = new SolidColorBrush(Colors.Gray);
            }
        }


        public void OpenSettingContextMenu()
        {
            PCIDSettingWindows = new ChangePCIDWindow(this);
            PCIDSettingWindows.Show();
        }

        public void RemovePCIDWindow()
        {
            PCIDSettingWindows = null;
        }

        private void ShowErrorDialog(string title, string content)
        {
            System.Windows.MessageBox.Show(content, title, MessageBoxButton.OK, MessageBoxImage.Error);
        }

        protected override void OnClosing(CancelEventArgs e)
        {
            if (UserConfig.MinimizedWhenClose.Equals("1"))
            {
                e.Cancel = true;
                this.Hide();
            }
            else
            {
                System.Windows.Application.Current.Shutdown();
            }
            base.OnClosing(e);
        }

        private void GPUSelectionCombobox_SelectionChanged(object sender, System.Windows.Controls.SelectionChangedEventArgs e)
        {
            int selectedIndex = GPUSelectionCombobox.Items.CurrentPosition;
            var selectedGPU = gpuList[selectedIndex];
            UpdateGPUInformation(selectedGPU);
        }

        private void SeeServiceLogButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                Process.Start("notepad.exe", Path.Combine(ServiceConfig.LogPath,EventLogger.GetLogFileName()));
            }
            catch (Exception ex)
            {
                ShowErrorDialog("Unable to open log", ex.ToString());
                EventLogger.WriteLog("OPEN LOG ERROR", ex.ToString());
            }
        }

        private void SeeApplicationLogButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                Process.Start("notepad.exe", Path.Combine(UserConfig.LogPath, EventLogger.GetLogFileName()));
            }
            catch (Exception ex)
            {
                ShowErrorDialog("Unable to open log", ex.ToString());
                EventLogger.WriteLog("OPEN LOG ERROR", ex.ToString());
            }
        }

        private void RunOnStartupCheckbox_Checked(object sender, RoutedEventArgs e)
        {
            //TaskManagement.AddTask(Assembly.GetExecutingAssembly().Location, AppDomain.CurrentDomain.BaseDirectory, "--minimized true", TASK_NAME, "Start Miner Tracker Desktop");
            UserConfig.OpenOnStartup = "1";
            SaveUserConfig();
        }

        private void RunOnStartupCheckbox_Unchecked(object sender, RoutedEventArgs e)
        {
            //TaskManagement.RemoveTask(TASK_NAME);
            UserConfig.OpenOnStartup = "0";
            SaveUserConfig();
        }
        private void SaveUserConfig()
        {
            ConfigurationSaver configurationSaver = new ConfigurationSaver(UserConfig.LogPath);
            if (!configurationSaver.SaveUserConfiguration(UserConfig))
            {
                ShowErrorDialog("Error", "Error when save user configuration!");
                EventLogger.WriteLog("CLIENT SAVE CLIENT CONFIG ERROR", "Error when save user configuration!", UserConfig.LogPath);
            }
        }

        private void MinimizeWhenCloseCheckBox_Checked(object sender, RoutedEventArgs e)
        {
            UserConfig.MinimizedWhenClose = "1";
            SaveUserConfig();
        }

        private void MinimizeWhenCloseCheckBox_Unchecked(object sender, RoutedEventArgs e)
        {
            UserConfig.MinimizedWhenClose = "0";
            SaveUserConfig();
        }

        private void RefreshRateComboBox_SelectionChanged(object sender, System.Windows.Controls.SelectionChangedEventArgs e)
        {
            UserConfig.CheckInterval = ((System.Windows.Controls.ComboBoxItem) RefreshRateComboBox.SelectedItem).Content.ToString();
            SaveUserConfig();
            if (CheckTimer != null)
            {
                CheckTimer.Stop();
                CheckTimer.Interval = int.Parse(UserConfig.CheckInterval)*1000;
                CheckTimer.Start();
            }
        }

        private void Hyperlink_RequestNavigate(object sender, RequestNavigateEventArgs e)
        {
            Process.Start(new ProcessStartInfo(e.Uri.AbsoluteUri));
            e.Handled = true;
        }

        private void SavePCIDButton_Click(object sender, RoutedEventArgs e)
        {
            UserConfig.PCID = PCIDTextBox.Text;
            ConfigurationSaver configurationSaver = new ConfigurationSaver();
            if (!configurationSaver.SaveUserConfiguration(UserConfig))
            {
                ShowErrorDialog("Error", "Error when save user configuration!");
                EventLogger.WriteLog("CLIENT SAVE CLIENT CONFIG ERROR", "Error when save user configuration!");
            }
            else
            {
                if (WindowsServiceManager.RestartService(SERVICE_NAME))
                {
                    //Get new User Config
                    var userConfigReader = new ConfigurationReader(isService: false, userConfigPath: ServiceConfig.UserConfigPath, userConfigFile: ServiceConfig.UserConfigFileName);
                    UserConfig = userConfigReader.GetUserConfig();
                    string computerName = Environment.MachineName;
                    string currentUser = Environment.UserName;
                    string macAddr = MacAddress.GetFirstMacAddress();
                    var PCID = UserConfig.PCID.Equals("default") ? $"{computerName}-{currentUser}-{macAddr}" : UserConfig.PCID;

                    if (PCID.Equals(PCIDTextBox.Text))
                    {
                        SavePCIDButton.IsEnabled = false;
                        ComputerIDTextBlock.Text = UserConfig.PCID;
                    }
                    else
                    {
                        PCIDTextBox.Text = PCID;
                        ShowErrorDialog("Error", "Error when update new PC ID! Check Log for more detail");
                    }
                }
                else
                    SavePCIDButton.IsEnabled = true;
            }
        }

        private void PCIDTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            string computerName = Environment.MachineName;
            string currentUser = Environment.UserName;
            string macAddr = MacAddress.GetFirstMacAddress();
            if (UserConfig != null)
            {
                var PCID = UserConfig.PCID.Equals("default") ? $"{computerName}-{currentUser}-{macAddr}" : UserConfig.PCID;
                if (!PCIDTextBox.Text.Equals(PCID))
                {
                    SavePCIDButton.IsEnabled = true;
                }
                else
                {
                    SavePCIDButton.IsEnabled = false;
                }
            }
        }
    }
}
