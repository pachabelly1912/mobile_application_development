namespace Miner_Tracker_Service
{
    partial class ProjectInstaller
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.MinerTrackerServiceProcessInstaller = new System.ServiceProcess.ServiceProcessInstaller();
            this.MinerTrackerServiceInstaller = new System.ServiceProcess.ServiceInstaller();
            // 
            // MinerTrackerServiceProcessInstaller
            // 
            this.MinerTrackerServiceProcessInstaller.Account = System.ServiceProcess.ServiceAccount.LocalSystem;
            this.MinerTrackerServiceProcessInstaller.Password = null;
            this.MinerTrackerServiceProcessInstaller.Username = null;
            // 
            // MinerTrackerServiceInstaller
            // 
            this.MinerTrackerServiceInstaller.Description = "Miner Tracker Background Service";
            this.MinerTrackerServiceInstaller.DisplayName = "Miner Tracker Service";
            this.MinerTrackerServiceInstaller.ServiceName = "MinerTrackerService";
            this.MinerTrackerServiceInstaller.StartType = System.ServiceProcess.ServiceStartMode.Automatic;
            // 
            // ProjectInstaller
            // 
            this.Installers.AddRange(new System.Configuration.Install.Installer[] {
            this.MinerTrackerServiceProcessInstaller,
            this.MinerTrackerServiceInstaller});

        }

        #endregion

        private System.ServiceProcess.ServiceProcessInstaller MinerTrackerServiceProcessInstaller;
        private System.ServiceProcess.ServiceInstaller MinerTrackerServiceInstaller;
    }
}