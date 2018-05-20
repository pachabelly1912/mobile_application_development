using Miner_Tracker_Common.LogService;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Media;

namespace Miner_Tracker_Desktop
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        const int GWL_EXSTYLE = (-20);
        const uint WS_EX_APPWINDOW = 0x40000;

        const uint WM_SHOWWINDOW = 0x0018;
        const int SW_PARENTOPENING = 3;

        [DllImport("user32.dll")]
        static extern IntPtr SendMessage(IntPtr hWnd, UInt32 Msg, IntPtr wParam, IntPtr lParam);

        [DllImport("user32.dll")]
        private static extern bool EnumDesktopWindows(IntPtr hDesktop, EnumWindowsProc ewp, int lParam);

        [DllImport("user32.dll")]
        static extern uint GetWindowThreadProcessId(IntPtr hWnd, out int lpdwProcessId);

        [DllImport("user32.dll")]
        private static extern uint GetWindowTextLength(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern uint GetWindowText(IntPtr hWnd, StringBuilder lpString, uint nMaxCount);

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        static extern bool GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);

        [DllImport("user32.dll")]
        static extern int GetWindowLong(IntPtr hWnd, int nIndex);

        delegate bool EnumWindowsProc(IntPtr hWnd, int lParam);

        static bool IsApplicationWindow(IntPtr hWnd)
        {
            return (GetWindowLong(hWnd, GWL_EXSTYLE) & WS_EX_APPWINDOW) != 0;
        }

        static IntPtr GetWindowHandle(int pid, string title)
        {
            var result = IntPtr.Zero;

            EnumWindowsProc enumerateHandle = delegate (IntPtr hWnd, int lParam)
            {
                int id;
                GetWindowThreadProcessId(hWnd, out id);

                if (pid == id)
                {
                    var clsName = new StringBuilder(256);
                    var hasClass = GetClassName(hWnd, clsName, 256);
                    if (hasClass)
                    {

                        var maxLength = (int)GetWindowTextLength(hWnd);
                        var builder = new StringBuilder(maxLength + 1);
                        GetWindowText(hWnd, builder, (uint)builder.Capacity);

                        var text = builder.ToString();
                        var className = clsName.ToString();

                        // There could be multiple handle associated with our pid, 
                        // so we return the first handle that satisfy:
                        // 1) the handle title/ caption matches our window title,
                        // 2) the window class name starts with HwndWrapper (WPF specific)
                        // 3) the window has WS_EX_APPWINDOW style

                        if (title == text && className.StartsWith("HwndWrapper") && IsApplicationWindow(hWnd))
                        {
                            result = hWnd;
                            return false;
                        }
                    }
                }
                return true;
            };

            EnumDesktopWindows(IntPtr.Zero, enumerateHandle, 0);

            return result;
        }

        [DllImport("user32.dll")]
        private static extern Boolean ShowWindow(IntPtr hWnd, Int32 nCmdShow);

        public App()
        {
            string[] args = Environment.GetCommandLineArgs();
            Dictionary<String, String> dictionary = new Dictionary<string, string>();
            for (int index = 1; index < args.Length; index += 2)
            {
                dictionary.Add(args[index], args[index + 1]);
            }
            Process currentProcess = Process.GetCurrentProcess();
            var runningProcess = (from process in Process.GetProcesses()
                                  where
                                  process.Id != currentProcess.Id &&
                                  process.ProcessName.Equals(
                                  currentProcess.ProcessName,
                                  StringComparison.Ordinal)
                                  select process).FirstOrDefault();
     
            if (runningProcess != null)// && runningProcess.MainWindowHandle == IntPtr.Zero)
            {
                var handle = GetWindowHandle(runningProcess.Id, "Miner Tracker Desktop");
                if (handle != IntPtr.Zero)
                {
                    // show window
                    ShowWindow(handle, 5);
                    // send WM_SHOWWINDOW message to toggle the visibility flag
                    SendMessage(handle, WM_SHOWWINDOW, IntPtr.Zero, new IntPtr(SW_PARENTOPENING));
                }
                Application.Current.Shutdown();
            }
            else
            {
                var mainWindow = new MainWindow(dictionary);
                Run(mainWindow);
            }
        }

        protected override void OnStartup(StartupEventArgs e)
        {
            RenderOptions.ProcessRenderMode = System.Windows.Interop.RenderMode.SoftwareOnly;
            base.OnStartup(e);
        }
    }
}
