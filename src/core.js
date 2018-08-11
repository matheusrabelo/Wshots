import puppeteer from 'puppeteer';

export let browser;

export const launchBrowser = async () => (browser = await puppeteer.launch());
export const closeBrowser = async () => browser.close();

const getViewportDimensions = ({ viewport }) => {
    try {
        const [strWidth, strHeight] = viewport.split('x');
        return { width: parseInt(strWidth), height: parseInt(strHeight) };
    } catch (err) {
        console.log('Invalid viewport dimension, using 1024x768 instead');
        return { width: 1024, height: 768 };
    }
}

export const getScreenshot = async ({ website, path, viewport, domElement }) => {
    let page = await browser.newPage();
    const { width, height } = getViewportDimensions({ viewport });
    await page.setViewport({ width, height });
    await page.goto(website, { waitUntil: 'networkidle2' });
    if (domElement) {
        page = await page.$(domElement);
    }
    await page.screenshot({ path });
} 
