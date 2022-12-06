const fs = require("fs");

const baseTemplate = (entries) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title></title>
    <link href="style.css" rel="stylesheet" />
  </head>
  <body>
    <!--script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script-->

    <div class="index">
      ${entries}
    </div>
  </body>
</html>
`;

const entryTemplate = (projectDir) => `
<div class="entry" onclick="window.location.href = './${projectDir}/index.html';">
<div class="left-tab"></div>

<div class="left-margin"></div>

<div class="entry-content">
  <p>${projectDir.replace(/[-_]/, " ")}</p>
</div>

<iframe class="thumbnail" src="${projectDir}/index.html"></iframe>

<div class="right-tab"></div>
</div>
`;

function main() {
  const exceptions = [".git", "libs"];

  const directories = fs
    .readdirSync(".", { withFileTypes: true })
    .filter((direc) => direc.isDirectory() && !exceptions.includes(direc.name))
    .map((dirent) => dirent.name);

  const entriesHtml = directories.map((dir) => entryTemplate(dir)).join("\n\n");
  const indexHtml = baseTemplate(entriesHtml);

  fs.writeFileSync("./index.html", indexHtml);
}

main();
