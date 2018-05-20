using Miner_Tracker_Common.ConfigurationService;
using Miner_Tracker_Common.LogService;
using Miner_Tracker_Common.ManagementService;
using Miner_Tracker_Common.Model.Configuration;
using Miner_Tracker_Common.WindowsService;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace Miner_Tracker_Desktop
{
    /// <summary>
    /// Interaction logic for ChangePCIDDialog.xaml
    /// </summary>
    public partial class ChangePCIDWindow: Window
    {
        private UserConfiguration UserConfig;
        private ServiceConfiguration ServiceConfig;
        private MainWindow ParentWindow;
        private const string SERVICE_NAME = "MinerTrackerService";

        public ChangePCIDWindow(MainWindow parentWindow)
        {
            InitializeComponent();
            ParentWindow = parentWindow;

            var serviceConfigReader = new ConfigurationReader();
            ServiceConfig = serviceConfigReader.GetServiceConfig();

            var userConfigReader = new ConfigurationReader(isService: false, userConfigPath: ServiceConfig.UserConfigPath, userConfigFile: ServiceConfig.UserConfigFileName);
            UserConfig = userConfigReader.GetUserConfig();

            string computerName = Environment.MachineName;
            string currentUser = Environment.UserName;
            string macAddr = MacAddress.GetFirstMacAddress();

            var PCID = UserConfig.PCID.Equals("default") ? $"{computerName}-{currentUser}-{macAddr}" : UserConfig.PCID;
            PCIDTextBox.Text = PCID;
        }

        protected override void OnContentRendered(EventArgs e)
        {
            this.Focus();
            if (ParentWindow != null)
            {
                ParentWindow.Visibility = Visibility.Collapsed;
                ParentWindow.IsEnabled = false;
            }
            base.OnContentRendered(e);
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
                        PCIDTextBox.Text = UserConfig.PCID;
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

        private void ExitDialogButton_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        protected override void OnClosing(CancelEventArgs e)
        {
            Exit();
            base.OnClosing(e);
        }
        private void Exit()
        {
            if (ParentWindow != null)
            {
                ParentWindow.IsEnabled = true;
                ParentWindow.RemovePCIDWindow();
                if (ParentWindow.Visibility == Visibility.Visible)
                {
                    ParentWindow.Focus();
                }
            }
        }
        private void ShowErrorDialog(string title, string content)
        {
            System.Windows.MessageBox.Show(content, title, MessageBoxButton.OK, MessageBoxImage.Error);
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
