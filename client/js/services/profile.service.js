angular.module('rssreader')
    .service('profileService', ['$window', 'Upload',
      function (Upload, $window) {
//            vm.submit = function (file) { //function to call on form submit
//                vm.file = file;
//                console.log("SUBMIT!!");
//                if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
//                    vm.upload(vm.file); //call upload function
//                }
//            }
//
//            vm.upload = function (file) {
//                console.log(upload);
//                console.log(file);
//                Upload.upload({
//                    url: 'http://localhost:8080/upload', //webAPI exposed to upload the file
//                    data: {
//                        file: file
//                    } //pass file as data, should be user ng-model
//                }).then(function (resp) { //upload function returns a promise
//                    if (resp.data.error_code === 0) { //validate success
//                        $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
//                    } else {
//                        $window.alert('an error occured');
//                    }
//                }, function (resp) { //catch error
//                    console.log('Error status: ' + resp.status);
//                    $window.alert('Error status: ' + resp.status);
//                });
//            };
}]);