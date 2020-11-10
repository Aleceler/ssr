import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { ServerLocation } from "@reach/router";
import fs from "fs";
import App from "./src/App";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

const sheet = new ServerStyleSheet();

const getStyle = renderToString(sheet.collectStyles(<App />));

const css = sheet.getStyleTags();

const PORT = process.env.PORT || 3001;

const html = fs.readFileSync("dist/index.html");
const parts = html.toString().split("not rendered");

const head = parts[0].split("<head>");

const app = express();

app.use("./dist", express.static("dist"));
app.use((req, res) => {
  const reactMarkup = (
    <ServerLocation url={req.url}>
      <App />
    </ServerLocation>
  );

  res.send(
    `${head[0] + "<head>"}${css}${head[1]}${renderToString(reactMarkup)}${
      parts[1]
    }`
  );
  res.end();
});

console.log(`listening on ${PORT}`);
app.listen(PORT);
