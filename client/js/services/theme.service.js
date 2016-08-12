angular.module('rssreader').service('themeService', [ '$window', function ($window) {
    that = this;
    this.layout = 'style';
    this.getTheme = function(){
        return that.layout!==undefined ? that.layout : "style";
    }
    this.layouts = [
        {
            name: 'Blue',
            url: 'style'
        },
        {
            name: 'Black',
            url: 'style2'
        },
        {
            name: 'Grey',
            url: 'style3'
        }
    ];
}]);