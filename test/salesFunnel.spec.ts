import {expect} from 'chai';
import SalesFunnel from 'src/pages/SalesFunnel';

before(() => {
    browser.url('https://hello.friday.de/quote/');
    SalesFunnel.acceptCookie();
});

// src: https://stackoverflow.com/questions/26107027/running-mocha-setup-before-each-suite-rather-than-before-each-test
function makeSuite(name, test) {
    describe(name, () => {
        before(() => {
            browser.url('https://hello.friday.de/quote/');
            expect(SalesFunnel.headline).to.eq('In 90 Sekunden zum Beitrag');
            SalesFunnel.verifyUrl('selectPrecondition');
            SalesFunnel.continueButton();
            expect(SalesFunnel.questionHeadline).to.eq('Wird das Auto auf dich zugelassen?');
            SalesFunnel.verifyUrl('selectRegisteredOwner');
            SalesFunnel.continueButton();
            console.log('test setup arranged')
        });
        test();
        after(() => {
            // stop test on entering birth date step
            $(SalesFunnel.birthdayInput).waitForDisplayed();
            SalesFunnel.verifyHeadline('Wann wurdest du geboren?');
            SalesFunnel.verifyUrl('enterBirthDate');
            // clean up session for next test
            browser.execute('sessionStorage.clear();');
            console.log('test setup re-set')
        })
    });
}

describe('Default sales funnel test', () => {
    makeSuite('register car via list', () => {
        it('registers a car using the lists', () => {
            // select manufacturer
            SalesFunnel.selectFromList({
                element: 'button[name="make"]',
                headline: 'Wähle dein Auto aus',
                urlRoute: 'selectVehicle',
                option: 'label=MERCEDES-BENZ'
            });
            // select model
            SalesFunnel.selectFromList({
                element: 'button[name="model"]',
                headline: 'Wähle dein Automodell',
                urlRoute: 'selectModel',
                option: 'label=C-Klasse'
            });
            // select body type
            SalesFunnel.selectFromList({
                element: 'button[name="bodyType"]',
                headline: 'Welche Form hat das Auto?',
                urlRoute: 'selectBodyType',
                option: 'label=Cabrio'
            });
            // select fuel type
            SalesFunnel.selectFromList({
                element: 'button[name="fuelType"]',
                headline: 'Was tankst du?',
                urlRoute: 'selectFuelType',
                option: 'label=Benzin'
            });
            // select engine power
            SalesFunnel.selectFromList({
                element: 'button[name="enginePower"]',
                headline: 'Wie viele PS hat dein Auto?',
                urlRoute: 'selectEnginePower',
                option: 'label=190 kW \/ 258 PS'
            });
            // select engine
            SalesFunnel.selectFromList({
                element: 'button[name="engine"]',
                headline: 'Ist dein Auto dabei?',
                urlRoute: 'selectEngine',
                option: 'label=C 300 CABRIO 4MATIC'
            });
            // enter registration date
            // TODO why does this headline have a different structure than the other ones?
            // expect(SalesFunnel.questionHeadline).to.eql('Wann war die Erstzulassung?');
            expect($('form > div [data-test-id="wizardTitle"] span').getText()).to.eql('Wann war die Erstzulassung?');
            SalesFunnel.verifyUrl('enterRegistrationDate');
            SalesFunnel.enterRegistrationDate('10.2018');
            SalesFunnel.continueButton();
        });
    });
    makeSuite('register car via search', () => {
        it('selects a manufacturer', () => {
            $(SalesFunnel.makeButton).waitForDisplayed();
            SalesFunnel.enterFilterValue('make', 'fia');
            expect($(SalesFunnel.makeButton).getText()).to.eql("FIAT");
            $(SalesFunnel.makeButton).click();
            $(SalesFunnel.modelButton).waitForDisplayed();
            SalesFunnel.verifyStep({
                headline: 'Wähle dein Automodell',
                urlRoute: 'selectModel',
            });
            SalesFunnel.enterFilterValue('model', 'cinq');
            expect($(SalesFunnel.modelButton).getText()).to.eql("Cinquecento");
            $(SalesFunnel.modelButton).click();
            // select engine power
            SalesFunnel.selectFromList({
                element: 'button[name="enginePower"]',
                headline: 'Wie viele PS hat dein Auto?',
                urlRoute: 'selectEnginePower',
                option: 'label=40 kW \/ 54 PS'
            });
            // select engine
            SalesFunnel.selectFromList({
                element: 'button[name="engine"]',
                headline: 'Ist dein Auto dabei?',
                urlRoute: 'selectEngine',
                option: 'label=CINQUECENTO 1.1, SPORTING'
            });
            // enter registration date
            // TODO why does this headline have a different structure than the other ones?
            // expect(SalesFunnel.questionHeadline).to.eql('Wann war die Erstzulassung?');
            expect($('form > div [data-test-id="wizardTitle"] span').getText()).to.eql('Wann war die Erstzulassung?');
            SalesFunnel.verifyUrl('enterRegistrationDate');
            SalesFunnel.enterRegistrationDate('09.2019');
            SalesFunnel.continueButton();
        });
    });

    let data = [
        // test data could be selected at random or based on popularity/ most common cars
        {
            testCase: 'car1',
            regDate: '01.2005',
            hsn: '0588',
            tsn: 'BFV',
            car: 'AUDI A4 AVANT 2.0 TDI, Kombi, Diesel, 1968 cc, 140/190 KW/PS'
        },
        {
            testCase: 'car2',
            regDate: '04.2019',
            hsn: '3001',
            tsn: 'ALE',
            car: 'C3 1.6 HDI, 1560 cc, 66/90 KW/PS'
        },
        {
            testCase: 'car3',
            regDate: '01.2005',
            hsn: '7118',
            tsn: 'AGV',
            car: 'MAZDA CX-3 2.0 AWD, Geschlossen, Benzin, 1998 cc, 110/150 KW/PS'
        }];
    data.forEach(function (dataItem) {
        makeSuite('register car via HSN/TSN', () => {
            it('registers car via HSN/TSN ' + dataItem.testCase, () => {
                $(SalesFunnel.makeButton).waitForDisplayed();
                SalesFunnel.selectVehicleHsnTsn();
                SalesFunnel.enterHsnTsn(dataItem);
                expect($(SalesFunnel.disabledContinueButton).isDisplayed()).to.be.false;
                SalesFunnel.continueButton();
                SalesFunnel.verifyHsnTsnCar(dataItem);
                SalesFunnel.continueButton();
            })
        })
    });
});
