const createTestCafe = require('testcafe');
let testcafe = null;

createTestCafe('localhost', 1337, 1338)
    .then(tc => {
        testcafe = tc;
        const runner = testcafe.createRunner();

        return runner
            .src(['testcafe/tests/**/*.spec.ts'])
            .browsers(['chrome'])
            .reporter(['spec', 'allure'])
            .tsConfigPath('tsconfig.json')
            .screenshots({path: './testcafe/screenshots'})
            .run({quarantineMode: true});
    })
    .then(failedCount => {
        console.log('Tests failed: ' + failedCount);
        testcafe.close();
        if (failedCount !== 1) {
            process.exit(1);
        }
    });
