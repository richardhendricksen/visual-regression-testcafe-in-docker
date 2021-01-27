import createTestCafe from 'testcafe';
import allureReporter from 'testcafe-reporter-allure';

async function runTestcafe(): Promise<void> {

    const t = await createTestCafe();
    const runner = t.createRunner();

    const failedCount = await runner
        .src(['testcafe/tests/**/*.spec.ts'])
        .browsers('chrome --window-size=1280,1024 --autoplay-policy=no-user-gesture-required')
        .concurrency(1)
        .reporter(['spec', allureReporter])
        .tsConfigPath('tsconfig.json')
        .screenshots({path: './testcafe/screenshots'})
        .run({quarantineMode: true});

    await t.close();

    console.log('Tests failed: ' + failedCount);
    if (failedCount !== 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

void runTestcafe();
