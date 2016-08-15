var ecTest = require('./js/easy-carousel')();

describe('StyleMaker', function () {
    
    it('can accept one style in its constructor', function () {
        var sm = ecTest.StyleMaker('color: white'),
            result = sm.getStyle();
        
        expect(result).toBe('style="color: white;"');
    });
    
    it('can accept more style in its constructor', function () {
        var sm = ecTest.StyleMaker('color: white', 'font-weight: bold'),
            result = sm.getStyle();
        
        expect(result).toBe('style="color: white; font-weight: bold;"');
    });
    
    it('can reset styles', function () {
        var sm = ecTest.StyleMaker('color: white', 'font-weight: bold'),
            result;
            
        sm.reset();
        sm.addStyle('color: blue;');
        sm.addStyle('padding: 10px');
        sm.addStyle('overflow: hidden');
        result = sm.getStyle();
        
        expect(result).toBe('style="color: blue; padding: 10px; overflow: hidden;"');
    });
    
    describe('addStyle', function () {
        var sm;
        
        beforeEach(function () {
            sm = new ecTest.StyleMaker();
        });
        
        it('can accept a style in one param', function () {
            var result = '';
            
            sm.addStyle('color: white');
            sm.addStyle('position: relative');
            result = sm.getStyle();
            
            expect(result).toBe('style="color: white; position: relative;"');
        });
        
        it('can accept a style in two param', function () {
            var result = '';
            
            sm.addStyle('color',       'red');
            sm.addStyle('font-weight', 'bold');
            sm.addStyle('background',  'black');
            sm.addStyle('padding',     '20px');
            result = sm.getStyle();
            
            expect(result).toBe('style="color: red; font-weight: bold; background: black; padding: 20px;"');
        });
    });
});