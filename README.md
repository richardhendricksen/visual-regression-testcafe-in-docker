# Visual Regression Testing with TestCafe in Docker

This repository contains an example how to run visual regression testing with TestCafe in Docker.  
This eliminates variables as OS/screen resolution/etc when making the screenshots for the comparison.  

This repository uses TestCafe with ResembleJS for Visual Regression testing. A custom Allure reporter is used to create the reports.

## Run
1. Build docker image with `yarn docker:build`  
2. Run tests in docker image with `yarn docker:run`  
3. Open report with `yarn test:report` 


## Report
A custom Allure reporter is used to create reports with screenshots for baseline, actual and diff screenshots.  
After running test open with `yarn test:report`  

![alt text](https://raw.githubusercontent.com/richardhendricksen/visual-regression-testcafe-in-docker/master/images/allure_report.png "Allure report")
