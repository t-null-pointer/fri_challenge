import {expect} from 'chai';

class SalesFunnel {

    private hsnTsnCarLabel: string = '[data-test-id="carLabel"]';
    private cookieBanner: string = '.uc-banner-content';
    public makeButton: string = 'button[name="make"]';
    public modelButton: string = 'button[name="model"]';
    public disabledContinueButton: string = 'button[class*="disabled"]';
    public birthdayInput: string = 'input[name="birthDate"]';

    get headline() {
        return $('span[data-test-id="wizardTitle"]').getText();
    }

    public continueButton() {
        return $('button[type="submit"]').click();
    }

    // TODO this should be tested separately and be set via cookie / storage for other tests
    public acceptCookie() {
        browser.waitUntil(
            () => $(this.cookieBanner).isDisplayed(),
            5000, 'cookieBanner not shown'
        );
        $('#uc-btn-accept-banner').click();
        return expect($(this.cookieBanner).isDisplayed()).to.be.false;
    }

    get questionHeadline() {
        return $('form > [data-test-id="wizardTitle"]').getText();
    }

    public verifyHeadline(expectedText) {
        expect(this.questionHeadline).to.eql(expectedText);
    }

    public verifyUrl(text) {
        let url = browser.getUrl();
        return expect(url).to.contain(text);
    }

    public selectVehicleHsnTsn() {
        $('[data-test-id="wizardTitle"] + div button:nth-child(2)').click();
        $('button[class*="disabled"]').isDisplayed();
    }

    public enterHsnTsn(testO = {} as any) {
        // TODO selectors are not ideal, might not work in other languages / countries
        // this.enterRegistrationDate(date); // TODO cannot be re-used since fields have different names - why?
        $('input[placeholder="MM.JJJJ"]').setValue(testO.regDate);
        $('input[placeholder="____"]').setValue(testO.hsn);
        $('input[placeholder="___"]').setValue(testO.tsn);
    }

    public verifyHsnTsnCar(testO = {} as any) {
        $(this.hsnTsnCarLabel).waitForDisplayed();
        this.verifyUrl('showHsnTsnCar');
        expect($(this.hsnTsnCarLabel).getText()).to.eql(testO.car);
    }

    public selectFromList(testO = {} as any) {
        $(testO.element).waitForDisplayed();
        this.verifyStep(testO);
        $(testO.option).click();
    }

    public verifyStep(testO = {} as any) {
        this.verifyHeadline(testO.headline);
        this.verifyUrl(testO.urlRoute);
    }

    public enterRegistrationDate(date) {
        $('input[name="monthYearFirstRegistered"]').waitForDisplayed(); // Why is a date field of type tel?
        $('input[placeholder="MM.JJJJ"]').setValue(date);
    }

    public enterFilterValue(filter, searchString) {
        $('input[name="' + filter + 'Filter"]').setValue((searchString));
    }
}

export default new SalesFunnel;
