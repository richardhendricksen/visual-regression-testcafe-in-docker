module.exports = {
    RESULT_DIR: 'testcafe/reports/allure/allure-results',
    REPORT_DIR: 'testcafe/reports/allure/allure-report',
    SCREENSHOT_DIR: 'testcafe/screenshots/actual',

    CLEAN_RESULT_DIR: true,
    CLEAN_REPORT_DIR: true,
    CLEAN_SCREENSHOT_DIR: true,

    ENABLE_SCREENSHOTS: true,
    ENABLE_QUARANTINE: true,
    ENABLE_LOGGING: false,
    LABEL: {
        SCREENSHOTS: {
            BASED_ON_PATH: [
                {regex: '/baseline/', label: 'Baseline'},
                {regex: '/actual/', label: 'Actual'},
                {regex: '/diff/', label: 'Diff'}
            ]
        }
    }
};
