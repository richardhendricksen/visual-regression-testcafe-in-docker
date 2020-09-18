import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import Config from './config';

const compareImages = require('resemblejs/compareImages');

const screenshotRootDir = 'testcafe/screenshots/';
const baselineScreenshotDir = 'baseline/';
const actualScreenshotDir = 'tests/';
const diffScreenshotDir = 'diff/';

function createDirectoryIfNotExists(dir: string): void {
    if (!existsSync(dir)) {
        mkdirSync(dir, {recursive: true});
    }
}

function addBaselineAndDiffScreenshotToTestcontroller(t: TestController): void {

    // Configured screenshot path
    // @ts-ignore
    const screenshotRootPath = t.testRun.opts.screenshots.path;

    // @ts-ignore
    const actualScreenshot = t.testRun.browserManipulationQueue.screenshotCapturer.testEntry.screenshots[0];

    let baselineScreenshot = {
        testRunId: actualScreenshot.testRunId,
        screenshotPath: actualScreenshot.screenshotPath.replace(`${screenshotRootPath}/${actualScreenshotDir}`, `${screenshotRootPath}/${baselineScreenshotDir}`),
        userAgent: actualScreenshot.userAgent,
        quarantineAttempt: actualScreenshot.quarantineAttempt,
        takenOnFail: false
    };

    let diffScreenshot = {
        testRunId: actualScreenshot.testRunId,
        screenshotPath: actualScreenshot.screenshotPath.replace(`${screenshotRootPath}/${actualScreenshotDir}`, `${screenshotRootPath}/${diffScreenshotDir}`),
        userAgent: actualScreenshot.userAgent,
        quarantineAttempt: actualScreenshot.quarantineAttempt,
        takenOnFail: false
    };

    // @ts-ignore
    t.testRun.browserManipulationQueue.screenshotCapturer.testEntry.screenshots.unshift(baselineScreenshot);
    // @ts-ignore
    t.testRun.browserManipulationQueue.screenshotCapturer.testEntry.screenshots.push(diffScreenshot);
}

export async function compareElementScreenshot(t: TestController, element: Selector, feature: string): Promise<any> {
    // @ts-ignore
    const testCase = t.testRun.test.name;

    const imgName = `${testCase}_${t.browser.name}_${t.browser.os.name}.png`;

    createDirectoryIfNotExists(resolve(screenshotRootDir, actualScreenshotDir, feature));
    createDirectoryIfNotExists(resolve(screenshotRootDir, baselineScreenshotDir, feature));
    createDirectoryIfNotExists(resolve(screenshotRootDir, diffScreenshotDir, feature));

    const actualScreenshotPath = resolve(screenshotRootDir, actualScreenshotDir, feature, imgName);
    const baselineScreenshotPath = resolve(screenshotRootDir, baselineScreenshotDir, feature, imgName);
    const diffScreenshotPath = resolve(screenshotRootDir, diffScreenshotDir, feature, imgName);

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

    addBaselineAndDiffScreenshotToTestcontroller(t);

    return {
        areEqual: result.rawMisMatchPercentage <= Config.MAX_DIFF_PERC,
        errorMessage: `Element screenshot difference greater then max diff percentage: expected ${result.rawMisMatchPercentage} to be less or equal to ${Config.MAX_DIFF_PERC}`
    };
}
