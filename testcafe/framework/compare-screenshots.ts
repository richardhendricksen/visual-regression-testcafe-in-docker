import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import Config from './config';

const compareImages = require('resemblejs/compareImages');

const baselineScreenshotDir = 'baseline/';
const actualScreenshotDir = 'actual/';
const diffScreenshotDir = 'diff/';

function createDirectoryIfNotExists(dir: string): void {
    if (!existsSync(dir)) {
        mkdirSync(dir, {recursive: true});
    }
}

function addBaselineAndDiffScreenshotToTestcontroller(t: TestController, baselineScreenshotPath: string, diffScreenshotPath: string): void {

    // @ts-ignore
    const actualScreenshot = t.testRun.browserManipulationQueue.screenshotCapturer.testEntry.screenshots[0];

    let attempt;
    // @ts-ignore
    if(t.testRun.quarantine) {
        // @ts-ignore
        attempt = t.testRun.quarantine.attempts.length + 1;
    } else {
        attempt = 1;
    }

    // only add baseline once
    if (attempt === 1) {
        let baselineScreenshot = {
            testRunId: actualScreenshot.testRunId,
            screenshotPath: baselineScreenshotPath,
            userAgent: actualScreenshot.userAgent,
            quarantineAttempt: attempt,
            takenOnFail: false
        };

        // @ts-ignore
        t.testRun.browserManipulationQueue.screenshotCapturer.testEntry.screenshots.unshift(baselineScreenshot);
    }

    let diffScreenshot = {
        testRunId: actualScreenshot.testRunId,
        screenshotPath: diffScreenshotPath,
        userAgent: actualScreenshot.userAgent,
        quarantineAttempt: attempt,
        takenOnFail: false
    };

    // @ts-ignore
    t.testRun.browserManipulationQueue.screenshotCapturer.testEntry.screenshots.push(diffScreenshot);
}

export async function compareElementScreenshot(t: TestController, element: Selector, feature: string): Promise<any> {
    // @ts-ignore
    const screenshotRootPath = t.testRun.opts.screenshots.path;
    // @ts-ignore
    const testCase = t.testRun.test.name;

    let imgName;
    // @ts-ignore
    if(t.testRun.quarantine) {
        // @ts-ignore
        imgName = `${testCase}_${t.browser.name}_${t.browser.os.name}_${t.testRun.quarantine.attempts.length + 1}.png`;
    } else {
        imgName = `${testCase}_${t.browser.name}_${t.browser.os.name}.png`;
    }

    const baselineImageName = `${testCase}_${t.browser.name}_${t.browser.os.name}.png`;

    createDirectoryIfNotExists(resolve(screenshotRootPath, actualScreenshotDir, feature));
    createDirectoryIfNotExists(resolve(screenshotRootPath, baselineScreenshotDir, feature));
    createDirectoryIfNotExists(resolve(screenshotRootPath, diffScreenshotDir, feature));

    const actualScreenshotPath = resolve(screenshotRootPath, actualScreenshotDir, feature, imgName);
    const baselineScreenshotPath = resolve(screenshotRootPath, baselineScreenshotDir, feature, baselineImageName);
    const diffScreenshotPath = resolve(screenshotRootPath, diffScreenshotDir, feature, imgName);

    await t.takeElementScreenshot(element, actualScreenshotDir + feature + '/' + imgName);

    if (!existsSync(baselineScreenshotPath)) {
        copyFileSync(actualScreenshotPath, baselineScreenshotPath);
        await t.expect('no baseline').notOk('No baseline present, saving actual element screenshot as baseline');
    }

    const options = {
        output: {
            errorColor: {
                red: 255,
                green: 0,
                blue: 255
            },
            errorType: 'movement',
            outputDiff: true
        },
        scaleToSameSize: true,
        ignore: 'antialiasing'
    };

    // compare images
    const result = await compareImages(
        readFileSync(baselineScreenshotPath),
        readFileSync(actualScreenshotPath),
        options
    );

    writeFileSync(diffScreenshotPath, result.getBuffer());

    addBaselineAndDiffScreenshotToTestcontroller(t, baselineScreenshotPath, diffScreenshotPath);

    return {
        areEqual: result.rawMisMatchPercentage <= Config.MAX_DIFF_PERC,
        errorMessage: `Element screenshot difference greater then max diff percentage: expected ${result.rawMisMatchPercentage} to be less or equal to ${Config.MAX_DIFF_PERC}`
    };
}
