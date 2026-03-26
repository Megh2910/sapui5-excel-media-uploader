sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("excelproject.controller.MView", {

        /* ================= EXCEL ================= */

        onUpload: function (oEvent) {

            var file = oEvent.getParameter("files")[0];
            var that = this;

            var reader = new FileReader();

            reader.onload = function (e) {

                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, { type: 'array' });
                var sheet = workbook.Sheets[workbook.SheetNames[0]];
                var json = XLSX.utils.sheet_to_json(sheet);

                var oModel = new JSONModel({
                    employees: json
                });

                that.getView().setModel(oModel);
            };

            reader.readAsArrayBuffer(file);
        },

        onClearData: function () {

            this.getView().setModel(null);
            this.byId("previewImage").setVisible(false);
            this.byId("previewVideo").setVisible(false);
        },
        

        /* ================= IMAGE ================= */

        onImageUpload: function (oEvent) {

            var file = oEvent.getParameter("files")[0];
            var that = this;

            if (file) {

                var reader = new FileReader();

                reader.onload = function (e) {

                    that._imageData = e.target.result;
                    that.byId("dialogImage").setSrc(e.target.result);
                    that.byId("imagePreviewDialog").open();
                };

                reader.readAsDataURL(file);
            }
        },

        onConfirmImage: function () {

            this.byId("previewImage").setSrc(this._imageData);
            this.byId("previewImage").setVisible(true);
            this.byId("imagePreviewDialog").close();
        },

        onCancelImage: function () {
            this.byId("imagePreviewDialog").close();
        },

        /* ================= VIDEO ================= */

    onVideoUpload: function (oEvent) {

    var file = oEvent.getParameter("files")[0];
    var that = this;

    if (file) {

        if (this._videoURL) {
            URL.revokeObjectURL(this._videoURL);
        }

        this._videoURL = URL.createObjectURL(file);

        // Open the dialog first
        this.byId("videoPreviewDialog").open();

        // After dialog is in DOM, manually inject video element
        setTimeout(function () {

            var oDialog = that.byId("videoPreviewDialog");
            var oDomRef = oDialog.getDomRef();

            if (oDomRef) {

                // Find the container where dialogVideo core:HTML sits
                var oHTMLControl = that.byId("dialogVideo");
                var oHTMLDom = oHTMLControl.getDomRef();

                if (oHTMLDom) {
                    // Clear and inject fresh video element
                    oHTMLDom.innerHTML = '<video width="600" controls style="display:block;" src="' + that._videoURL + '"></video>';
                }
            }

        }, 400);
    }
},


onConfirmVideo: function () {

    if (!this._videoURL) {
        MessageToast.show("No video selected");
        return;
    }

    // Set the HTML content with src directly
    this.byId("previewVideo").setContent(
        '<video width="500" controls src="' + this._videoURL + '"></video>'
    );

    this.byId("previewVideo").setVisible(true);
    this.byId("videoPreviewDialog").close();
},

onCancelVideo: function () {
    this.byId("videoPreviewDialog").close();
},
       

    });
});