#!/usr/bin/env node

import 'babel-polyfill';
import program from 'commander';
import * as core from './core';

const websites = [];
const viewports = [];
let domElement;

const addWebsite = (website) => websites.push(website);
const addViewport = (viewport) => viewports.push(viewport);
const addDomElement = (selectedDomElement) => (domElement = selectedDomElement);

program
  .option('-w, --website [url]', 'add website', addWebsite)
  .option('-v, --viewport [widthxheight]', 'add viewport', addViewport)
  .option('-d, --dom-element [query]', 'query dom element', addDomElement)
  .parse(process.argv);

if (websites.length === 0 || viewports.length === 0) {
    console.log('You should try: wshots -h');
    process.exit(0);
}

console.log(`Websites: ${websites.join(', ')}`);
console.log(`Viewports: ${viewports.join(', ')}`);
if (domElement) {
    console.log(`DOM element: ${domElement}`);
}

const start = async () => {
    await core.launchBrowser();
    for (let i = 0; i < websites.length; i++) {
        for (let j = 0; j < viewports.length; j ++) {
            const website = websites[i];
            const viewport = viewports[j];
            const path = `${process.cwd()}/${i}${j}.png`;
            await core.getScreenshot({ website, path, viewport, domElement });
        }
    }
    await core.closeBrowser();
};

(async () => {
    try {
        await start();
    } catch (err) {
        console.log(err.message);
    }
})();
