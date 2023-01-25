sap.ui.define([
	"sap/ui/core/mvc/Controller"

], function (Controller) {
	"use strict";

	return Controller.extend("sample.uiapp.controller.App", {

		onInit: function () {
			
		},
		onPress: function(e){
			console.log('SAP UI Version: ' + sap.ui.version);
		}
	});

});
