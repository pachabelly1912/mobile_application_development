using Miner_Tracker_Common.ManagementService;
using System;
using System.Collections.Generic;
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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace Miner_Tracker_Updater
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private const string DESKTOP_FILE_NAME = @"C:\Program Files\Miner Tracker\Miner Tracker Desktop.exe";
        public MainWindow(Dictionary<string, string> args)
        {
            InitializeComponent();
        }

        private void Window_ContentRendered(object sender, EventArgs e)
        {
            var currentVersion = AssemblyInformationManager.GetAssemblyVersion(DESKTOP_FILE_NAME);
            CurrentVersionTextBlock.Text = currentVersion;
            if (currentVersion.Equals("Error"))
            {
                CurrentVersionTextBlock.Foreground = new SolidColorBrush(Colors.Red);
            }
        }
    }
}
