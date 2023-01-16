import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const port = 5000;

async function getPdf(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-dev-shm-usage', '--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4' });
    
    await browser.close();

    return pdf;
}

app.get('/print', async (req, res) => {
    const { url } = req.query;

    const pdf = await getPdf(url);

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdf.length
    });
    res.send(pdf);

});

app.get('/print.pdf', async (req, res) => {
    const { url } = req.query;

    const pdf = await getPdf(url);

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdf.length
    });
    res.send(pdf);

});

app.listen(port, () => {
    console.log(`web2pdf app listening at http://localhost:${port}`)
});

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});