using Microsoft.Win32.TaskScheduler;
using Miner_Tracker_Common.LogService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Miner_Tracker_Common.TaskSchedulerService
{
    public static class TaskManagement
    {
        public static void AddTask(string applicationPath, string startFolder, string args, string name, string description)
        {
            using (TaskService ts = new TaskService())
            {
                // Create a new task definition and assign properties
                TaskDefinition td = ts.NewTask();
                td.RegistrationInfo.Description = description;
                // Create a trigger that will fire the task 
                td.Triggers.Add(new LogonTrigger());

                // Create an action that will launch whenever the trigger fires
                td.Actions.Add(new ExecAction($"\"{applicationPath}\"", args, startFolder));
                td.Principal.RunLevel = TaskRunLevel.Highest;
                // Register the task in the root folder
                ts.RootFolder.RegisterTaskDefinition(name, td);
            }
        }

        public static void RemoveTask(string name)
        {
            using (TaskService ts = new TaskService())
            {
                ts.RootFolder.DeleteTask(name);
            }
        }

        public static void RunTask(string name)
        {
            using (TaskService ts = new TaskService())
            {
                try
                {
                    ts.RootFolder.Tasks.First(x => x.Name == name).Run();
                }
                catch (Exception ex)
                {
                    EventLogger.WriteLog("TASK ERROR", ex.ToString());
                }
            }
        }
    }
}
