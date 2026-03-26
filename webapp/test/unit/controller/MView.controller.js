/*global QUnit*/

sap.ui.define([
	"excelproject/controller/MView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MView Controller");

	QUnit.test("I should test the MView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
