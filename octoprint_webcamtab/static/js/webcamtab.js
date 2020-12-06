/*
 * View model for OctoPrint-WebcamTab
 *
 * Author: Bryan J. Rentoul (originally Sven Lohrmann)
 * License: AGPLv3
 */
$(function() {
    function WebcamTabViewModel(dependencies) {
        var self = this;

        self.control = dependencies[0]; // reference to instance of default 'control' view model
        
        // TODO: For the following overrides, consider checking Octoprint version and 
        //       using code from v1.3x, v1.4 or v1.5 accordingly. For now, we depend on v1.5.0.

        // copy control._enableWebcam() method code from Octoprint v1.5.0
        // and override it, replacing #control with #tab_plugin_webcamtab.

        self._enableWebcam_1_5 = function () {
            // This is the offending line that make keeping up with Octoprint versions 'hackish'
            if (
                OctoPrint.coreui.selectedTab != "#tab_plugin_webcamtab" ||
                !OctoPrint.coreui.browserTabVisible
            ) {
                return;
            }

            if (self.control.webcamDisableTimeout != undefined) {
                clearTimeout(self.control.webcamDisableTimeout);  // inserted '.control'
            }

            // Determine stream type and switch to corresponding webcam.
            var streamType = determineWebcamStreamType(self.control.settings.webcam_streamUrl());
            if (streamType == "mjpg") {
                self.control._switchToMjpgWebcam()  // inserted '.control'
            } else if (streamType == "hls") {
                self.control._switchToHlsWebcam()   // inserted '.control'
            } else {
                throw "Unknown stream type " + streamType;
            }
        }

        self._enableWebcam_1_4 = function() {
            if (OctoPrint.coreui.selectedTab != "#tab_plugin_webcamtab" || !OctoPrint.coreui.browserTabVisible) {
                return;
            }

            if (self.control.webcamDisableTimeout != undefined) {
                clearTimeout(self.control.webcamDisableTimeout);
            }
            var webcamImage = $("#webcam_image");
            var currentSrc = webcamImage.attr("src");

            // safari bug doesn't release the mjpeg stream, so we just set it up the once
            if (OctoPrint.coreui.browser.safari && currentSrc != undefined) {
                return;
            }

            var newSrc = self.settings.webcam_streamUrl();
            if (currentSrc != newSrc) {
                if (newSrc.lastIndexOf("?") > -1) {
                    newSrc += "&";
                } else {
                    newSrc += "?";
                }
                newSrc += new Date().getTime();

                self.control.webcamLoaded(false);
                self.control.webcamError(false);
                webcamImage.attr("src", newSrc);
            }
        }

        self._enableWebcam_1_3 = function() {
            if (OctoPrint.coreui.selectedTab != "#tab_plugin_webcamtab" || !OctoPrint.coreui.browserTabVisible) {
                return;
            }

            if (self.control.webcamDisableTimeout != undefined) {
                clearTimeout(self.control.webcamDisableTimeout);
            }
            var webcamImage = $("#webcam_image");
            var currentSrc = webcamImage.attr("src");

            // safari bug doesn't release the mjpeg stream, so we just set it up the once
            if (OctoPrint.coreui.browser.safari && currentSrc != undefined) {
                return;
            }

            var newSrc = self.control.settings.webcam_streamUrl();
            if (currentSrc != newSrc) {
                if (newSrc.lastIndexOf("?") > -1) {
                    newSrc += "&";
                } else {
                    newSrc += "?";
                }
                newSrc += new Date().getTime();

                self.control.webcamLoaded(false);
                self.control.webcamError(false);
                webcamImage.attr("src", newSrc);
            }
        }

        // move DOM webncam elements from #control to #tab_plugin_webcamtab ...
        self.onAllBound = function(allViewModels) {
            var $tab = $("#tab_plugin_webcamtab");
            var $webcam = null

            const OctoVersion = $("#footer_version span.version").text().match(/^\d\.\d/)[0]
            if (OctoVersion == "1.5") {
                self.control._enableWebcam = self._enableWebcam_1_5
                $webcam = $("#control > #webcam_container, #control > #webcam_hls_container");
            } else if (OctoVersion == "1.4") {
                self.control._enableWebcam = self._enableWebcam_1_4
                $webcam = $("#control > #webcam_container");
            } else if (OctoVersion == "1.3") {
                self.control._enableWebcam = self._enableWebcam_1_3
                $webcam = $("#control > #webcam_container");
            } else {
                console.log("plugin_Webcam Tab: Unsupported OctoPrint version " + OctoVersion)
                return // fail silently
            }
    
            // onTabChange is identical in control.js v1.3.5, 1.4 & 1.5
            self.control.onTabChange = function (current, previous) {
                if (current == "#tab_plugin_webcamtab") {
                    self.control._enableWebcam();     // inserted '.control'
                } else if (previous == "#tab_plugin_webcamtab") {
                    self.control._disableWebcam();    // inserted '.control'
                }
            };

            if ($webcam) {
                var $hint = $webcam.next(); // same enough in control.js v1.3.5, 1.4 & 1.5
                $tab.append($webcam.detach());
                const checkString = "visible: keycontrolPossible"
                if ($hint && $hint.attr("data-bind").substr(0, checkString.length) === checkString) {
                    $tab.append($hint.detach());
                }
            }
        };

    };

    OCTOPRINT_VIEWMODELS.push({
        construct: WebcamTabViewModel,
        dependencies: ["controlViewModel"],
        elements: ["#webcamtab"]
    });
});
