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

        self.methodOverrides = {

            _enableWebcam_v1_8plus: function() {
                if (
                    OctoPrint.coreui.selectedTab != "#tab_plugin_webcamtab" || // was '"#control"'
                    !OctoPrint.coreui.browserTabVisible
                ) {
                    return;
                }

                if (self.webcamDisableTimeout != undefined) {
                    clearTimeout(self.control.webcamDisableTimeout);    // inserted '.control'
                }

                // IF disabled then we dont need to do anything
                if (self.settings.webcam_webcamEnabled() == false) {
                    return;
                }

                // Determine stream type and switch to corresponding webcam.
                var streamType = determineWebcamStreamType(self.settings.webcam_streamUrl());
                if (streamType == "mjpg") {
                    self.control._switchToMjpgWebcam();                 // inserted '.control'
                } else if (streamType == "hls") {
                    self.control._switchToHlsWebcam();                  // inserted '.control'
                } else if (isWebRTCAvailable() && streamType == "webrtc") {
                    self.control._switchToWebRTCWebcam();               // inserted '.control'
                } else {
                    throw "Unknown stream type " + streamType;
                }
            },

            _enableWebcam_v1_7: function() {
                if (
                    OctoPrint.coreui.selectedTab != "#tab_plugin_webcamtab" ||
                    !OctoPrint.coreui.browserTabVisible
                ) {
                    return;
                }

                if (self.control.webcamDisableTimeout != undefined) {
                    clearTimeout(self.control.webcamDisableTimeout);  // inserted '.control'
                }

                // IF disabled then we dont need to do anything
                if (self.settings.webcam_webcamEnabled() == false) {
                    return;
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
            },

            _enableWebcam_v1_5: function() {
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
            },

            _enableWebcam_v1_4: function() {
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
            },

            _enableWebcam_v1_3: function() {
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
        }

        // move DOM webcam elements from #control to #tab_plugin_webcamtab ...
        self.onAllBound = function(allViewModels) {
            const $webcamTab = $("#tab_plugin_webcamtab")
            var webcamElements = null
            var _enableWebcamOverride = null

            const OctoVersion = $("#footer_version span.version").text().match(/^\d\.\d/)[0]

            switch (OctoVersion) {

                case "1.8":
                    _enableWebcamOverride = self.methodOverrides['_enableWebcam_v1_8plus']
                    break

                case "1.7":
                    _enableWebcamOverride = self.methodOverrides['_enableWebcam_v1_7']
                    break

                case "1.6":
                case "1.5":
                    _enableWebcamOverride = self.methodOverrides['_enableWebcam_v1_5']
                    break

                case "1.4":
                    _enableWebcamOverride = self.methodOverrides['_enableWebcam_v1_4']
                    break

                case "1.3":
                    _enableWebcamOverride = self.methodOverrides['_enableWebcam_v1_3']
                    break

                default:
                    console.log("plugin_Webcam_Tab: Unsupported OctoPrint version " + OctoVersion)
                    break

            } // switch

            $webcamElements = $(
                "#control > #webcam_container"
                +",#control > #webcam_hls_container, #control > #webcam_container + div"  // introduced in OctoPrint v1.5
                +",#control > #webcam_webrtc_container"                                   // introduced in OctoPrint v1.8
            )
            onTabChangeOverride = function (current, previous) {
                if (current == "#tab_plugin_webcamtab") {
                    self.control._enableWebcam();     // inserted '.control'
                } else if (previous == "#tab_plugin_webcamtab") {
                    self.control._disableWebcam();    // inserted '.control'
                }
            }

            $webcamTab.append($webcamElements.detach());
            self.control._enableWebcam = _enableWebcamOverride
            self.control.onTabChange = onTabChangeOverride
        }

    }

    OCTOPRINT_VIEWMODELS.push({
        construct: WebcamTabViewModel,
        dependencies: ["controlViewModel"],
        elements: ["#tab_plugin_webcamtab"]
    });
});
