namespace Miner_Tracker_Desktop
{
    partial class ChangePCIDForm
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

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(ChangePCIDForm));
            this.label1 = new System.Windows.Forms.Label();
            this.PCIDTextBox = new System.Windows.Forms.TextBox();
            this.SavePCIDButton = new System.Windows.Forms.Button();
            this.ExitDialogButton = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(12, 44);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(38, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "PC ID:";
            // 
            // PCIDTextBox
            // 
            this.PCIDTextBox.Location = new System.Drawing.Point(15, 60);
            this.PCIDTextBox.MinimumSize = new System.Drawing.Size(0, 20);
            this.PCIDTextBox.Name = "PCIDTextBox";
            this.PCIDTextBox.Size = new System.Drawing.Size(260, 20);
            this.PCIDTextBox.TabIndex = 1;
            this.PCIDTextBox.Text = "Loading....";
            this.PCIDTextBox.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.PCIDTextBox.TextChanged += new System.EventHandler(this.PCIDTextBox_TextChanged);
            // 
            // SavePCIDButton
            // 
            this.SavePCIDButton.Enabled = false;
            this.SavePCIDButton.Location = new System.Drawing.Point(291, 60);
            this.SavePCIDButton.Name = "SavePCIDButton";
            this.SavePCIDButton.Size = new System.Drawing.Size(75, 23);
            this.SavePCIDButton.TabIndex = 2;
            this.SavePCIDButton.Text = "Update";
            this.SavePCIDButton.UseVisualStyleBackColor = true;
            this.SavePCIDButton.Click += new System.EventHandler(this.SavePCIDButton_Click);
            // 
            // ExitDialogButton
            // 
            this.ExitDialogButton.Location = new System.Drawing.Point(151, 126);
            this.ExitDialogButton.Name = "ExitDialogButton";
            this.ExitDialogButton.Size = new System.Drawing.Size(75, 23);
            this.ExitDialogButton.TabIndex = 3;
            this.ExitDialogButton.Text = "Close";
            this.ExitDialogButton.UseVisualStyleBackColor = true;
            this.ExitDialogButton.Click += new System.EventHandler(this.ExitDialogButton_Click);
            // 
            // ChangePCIDForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(384, 161);
            this.Controls.Add(this.ExitDialogButton);
            this.Controls.Add(this.SavePCIDButton);
            this.Controls.Add(this.PCIDTextBox);
            this.Controls.Add(this.label1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(400, 200);
            this.MinimizeBox = false;
            this.MinimumSize = new System.Drawing.Size(400, 200);
            this.Name = "ChangePCIDForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "PC ID Setting";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox PCIDTextBox;
        private System.Windows.Forms.Button SavePCIDButton;
        private System.Windows.Forms.Button ExitDialogButton;
    }
}