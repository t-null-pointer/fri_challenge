# Friday Challenge

## Getting Started
```
git clone https://github.com/t-null-pointer/fri_challenge.git
cd fri_challenge
yarn install
yarn test
```

## Reporters
```
yarn report
```
Allure overview: 
![allure](https://github.com/t-null-pointer/fri_challenge/blob/master/src/assets/pass.png)

Example of failed test with screenshot: 
![screenshot](https://github.com/t-null-pointer/fri_challenge/blob/master/src/assets/failWithScreenshot.png)

## Acknowledgements
Boilerplate reference: https://github.com/jpolley/WebdriverIO_v5_TypeScript/

## Issues noticed
1. the progress bar is set to a wrong stage on page reload
2. when a valid date from the first registration ("Erstzulassung") is deleted again the value is not re-set correctly (value="__._") so the placeholder text is not shown (same for all "date" fields)

Usability
1. it would be nice if the back link ("Zurück") was also available at the top of the form to avoid long scrolling on e.g. /selectVehicle

## Current limitations
1. I didn't use webdriverIO before so please do not expect best practices here :)
2. only covers some test cases in the sales funnel up until the step /enterBirthDate, focus is on car selection
3. cross-browser support needs to be added, currently only runs in chrome and firefox (but set to chrome for now)
4. different viewports need to be added
5. negative inputs + error messages are not tested yet
6. navigation (browser back, going back via link, page reload) is not tested yet
6. header and footer are not tested yet

