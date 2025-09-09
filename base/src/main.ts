import { dirname, join } from "path";

const main = async () => {
  const webviewFile = join(dirname(process.execPath), process.platform === "win32" ? "webview.exe" : "webview");
  const isFileExist = await Bun.file(webviewFile).exists();
  if (!isFileExist) return console.log("Webview file not found.");

  const proc = Bun.spawn({
    cmd: [webviewFile, "--pid", process.pid.toString()],
    stdio: ["pipe", "pipe", "pipe"],
    onExit: (_, code) => process.exit(code),
  });

  const { value } = await proc.stdout.getReader().read();
  if (value) {
    proc.stdin.write(
      JSON.stringify({
        title: "Just a Title",
        url: "https://github.com/fusion-desktop",
        size: 0,
        width: 1280,
        height: 720,
        icon: "icon.ico",
      })
    );
    proc.stdin.end();
  }

  console.log("stderr:", await proc.stderr.text());
};

main();
