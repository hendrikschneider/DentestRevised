angular.module('auth').controller('UpdateProfileFormCtrl',['$location','Notification','RestfulAuthService',
function($location,Notification,RestfulAuthService){
    var self = this;

    //Instantiate fields with saved values for user
    self.user_details = angular.copy(RestfulAuthService.user_profile());
    self.edit_mode = false;

    self.email_errors = [];
    self.first_name_errors = [];
    self.last_name_errors = [];
    self.non_field_errors = [];

    self.update_profile = function(){
        RestfulAuthService.update_profile(self.user_details).then(
            function(){
                self.user_details = angular.copy(RestfulAuthService.user_profile()); //Update form field
                self.edit_mode=false;
                Notification.success({
                    title:"Account details updated successfully",
                    message:"Your details have been saved",
                });

                self.email_errors = [];
                self.first_name_errors =  [];
                self.last_name_errors = [];
                self.non_field_errors = [];
            },
            function(response){
                self.email_errors = response.email || [];
                self.first_name_errors = response.first_name || [];
                self.last_name_errors = response.last_name || [];
                self.non_field_errors = response.non_field_errors || [];
            }
        );
    };

    self.allow_editing = function(){
        self.edit_mode = true;
    };


}]);


