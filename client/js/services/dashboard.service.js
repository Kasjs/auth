angular.module('rssreader').service('dashboardService', [function () {
    var that = this;
    
    this.DEFAULT_VIEW = 2;
    this.currentViewMode = that.DEFAULT_VIEW;

    // We have three view modes
    this.viewModes = [
        'list',
        'th-list',
        'th-large'
    ];
    this.resetViewMode = function () {
        that.currentViewMode = that.DEFAULT_VIEW;
    }
    this.setViewMode = function(index){
        if(index > that.viewModes.length-1){
            throw new Error("View mode you are trying to set is not defined");
        }
        else {
            that.currentViewMode = index;
        }
    }
    this.getViewMode = function(){
        console.log("Retreving view mode:");
        console.log(that.viewModes[that.currentViewMode]);        
        return that.viewModes[that.currentViewMode];
    }
    
    this.title = "";
    this.setTitle = function (title) {
        if (title == "Add Feed") {
            this.resetFeedId();
        }
        that.title = title;
    }
    this.getTitle = function () {
        return that.title;
    }
    
    this.currentView = this.DEFAULT_VIEW;
    this.currentFeed = '';
    this.getFeedId = function () {
        return that.currentFeed;
    }
    this.setFeedId = function (id) {
        that.currentFeed = id;
    }
    this.resetFeedId = function () {
        that.currentFeed = '';
    }
}]);