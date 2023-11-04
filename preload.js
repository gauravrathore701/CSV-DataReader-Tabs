const { contextBridge, ipcRenderer } = require("electron");
const Papa = require("papaparse");
const child_process = require("child_process");

contextBridge.exposeInMainWorld("electron", {
  parseCSV: (file, callback) => {
    Papa.parse(file, {
      complete: function (results) {
        callback(results.data);
      },
    });
  },
});

contextBridge.exposeInMainWorld("shell", {
  exec: (cmd, callback) => {
    child_process.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  },
});
