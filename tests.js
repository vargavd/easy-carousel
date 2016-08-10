var ecTest = require('./js/easy-carousel')();

describe('StyleMaker', function () {
    
    it('can accept default styles in constructor', function () {
        var sm = ecTest.StyleMaker(['color: white']),
            result = sm.getStyle();
        
        expect(result).toBe('style="color: white;"');
    });
    
    describe('getString', function () {
        var sm;
        
        beforeEach(function () {
            sm = new ecTest.StyleMaker();
        });
        
        it('returns nothing with zero styles in constructor', function () {
            var result = sm.getStyle();

            expect(result).toBe('');
        });
    });
});