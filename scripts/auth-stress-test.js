// const puppeteer = require('puppeteer');
// install npm i puppeteer
// const EMAIL = process.argv[2] || 'clothrage@gmail.com';
// const PASSWORD = process.argv[3] || '12345678';
// const BASE_URL = 'http://localhost:9002';
// const DURATION_MINUTES = 15;

// (async () => {
//     console.log('Starting Auth Stability Test...');
//     console.log(`Target: ${BASE_URL}`);
//     console.log(`User: ${EMAIL}`);
//     console.log(`Duration: ${DURATION_MINUTES} minutes`);

//     const browser = await puppeteer.launch({
//         headless: false,
//         defaultViewport: null,
//         args: ['--start-maximized']
//     });

//     try {
//         const page = await browser.newPage();

//         // 1. Manual Login Phase
//         console.log('\n--- Waiting for Manual Login ---');
//         console.log('Please interact with the browser to Log In.');
//         console.log('The test will start automatically when you navigate to the Home Page (root URL).');

//         await page.goto(`${BASE_URL}/auth/login`);

//         // Wait indefinitely until the URL is the home page
//         await page.waitForFunction(
//             (baseUrl) => window.location.href === `${baseUrl}/` || window.location.href === `${baseUrl}`,
//             { timeout: 0 },
//             BASE_URL
//         );

//         console.log('Home page detected! Starting stress test loop...');

//         // 2. Random Browsing Loop
//         console.log(`\n--- Starting ${DURATION_MINUTES}m Browsing Loop ---`);

//         const paths = [
//             '/',
//             '/products',
//             '/profile',
//             '/profile/orders',
//             '/cart',
//             '/products?category=men',
//             '/products?category=women'
//         ];

//         const endTime = Date.now() + (DURATION_MINUTES * 60 * 1000);
//         let iterations = 0;

//         while (Date.now() < endTime) {
//             iterations++;
//             const randomPath = paths[Math.floor(Math.random() * paths.length)];
//             const targetUrl = `${BASE_URL}${randomPath}`;

//             process.stdout.write(`[${iterations}] Visiting ${randomPath}... `);

//             try {
//                 await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

//                 // Wait a random amount of time (2s to 6s) to simulate reading
//                 const stayDuration = Math.random() * 4000 + 2000;
//                 await new Promise(r => setTimeout(r, stayDuration));

//                 // Check URL to see if we were bounced to login
//                 const currentUrl = page.url();

//                 if (currentUrl.includes('/auth/login')) {
//                     console.log('\n❌ ERROR: Redirected to Login Page!');
//                     console.log('Possible Session Logout detected.');
//                 } else if (currentUrl.includes('/auth/otp') && randomPath !== '/auth/otp') {
//                     console.log('\n❌ ERROR: Redirected to OTP Page (Unexpected)!');
//                 } else {
//                     if (randomPath === '/auth/otp') {
//                         process.stdout.write('✅ OK (Safe Redirect)\n');
//                     } else {
//                         process.stdout.write('✅ OK\n');
//                     }
//                 }

//             } catch (err) {
//                 console.log(`\n⚠️ Error visiting page: ${err.message}`);
//             }
//         }

//         console.log('\n--- Test Completed Successfully ---');
//         console.log('Session survived the duration.');

//     } catch (error) {
//         console.error('Script Error:', error);
//     } finally {
//         await browser.close();
//     }
// })();
