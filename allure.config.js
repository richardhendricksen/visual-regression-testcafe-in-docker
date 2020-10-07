module.exports = {
    RESULT_DIR: 'testcafe/.reports/allure/allure-results',
    REPORT_DIR: 'testcafe/.reports/allure/allure-report',
    SCREENSHOT_DIR: 'testcafe/screenshots/actual',

    CLEAN_RESULT_DIR: true,
    CLEAN_REPORT_DIR: true,
    CLEAN_SCREENSHOT_DIR: true,

    ENABLE_SCREENSHOTS: true,
    ENABLE_QUARANTINE: true,
    ENABLE_LOGGING: false,
    ENABLE_VISUAL_REGRESSION_REPORTING: true,
    VISUAL_REGRESSION: {
        BASELINE_PATH: '/baseline/',
        ACTUAL_PATH: '/actual/',
        DIFF_PATH: '/diff/',
    }

};
