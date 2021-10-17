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
            },
            onTabChange_common: function (current, previous) {
                if (current == "#tab_plugin_webcamtab") {
                    self.control._enableWebcam();     // inserted '.control'
                } else if (previous == "#tab_plugin_webcamtab") {
                    self.control._disableWebcam();    // inserted '.control'
                }
            }
        }

        // move DOM webncam elements from #control to #tab_plugin_webcamtab ...
        self.onAllBound = function(allViewModels) {
            const $webcamTab = $("#tab_plugin_webcamtab")
            var webcamElements = null
            var hintDivEl = null
            var _enableWebcamOverride = null
            var onTabChangeOverride = null

            const OctoVersion = $("#footer_version span.version").text().match(/^\d\.\d/)[0]

            switch (OctoVersion) {

            case "1.4":
                _enableWebcamOvveride = self.methodOverrides['_enableWebcam_v1_4']
                onTabChangeOverride = self.methodOverrides['onTabChange_common']
                webcamElements = $("#control > #webcam_container, #control > div:nth-child(2)") // TODO: needs testing again
                hintDivEl = webcamElements[1]
                break

            case "1.3":
                _enableWebcamOvveride = self.methodOverrides['_enableWebcam_v1_3']
                onTabChangeOverride = self.methodOverrides['onTabChange_common']
                webcamElements = $("#control > #webcam_container, #control > div:nth-child(2)") // TODO: needs testing again
                hintDivEl = webcamElements[1]
                break

            default:
                if (parseFloat(OctoVersion) > 1.7){
		            console.log("plugin_Webcam Tab: Unsupported OctoPrint version " + OctoVersion)
                }
		        _enableWebcamOvveride = self.methodOverrides['_enableWebcam_v1_5']
                onTabChangeOverride = self.methodOverrides['onTabChange_common']
                webcamElements = $("#control > #webcam_container, #control > #webcam_hls_container, #control > div:nth-child(3)")
                hintDivEl = webcamElements[2]
                break
                    
            } // switch
    
            const hintDivCheck = "visible: keycontrolPossible" // TODO: needs double-checking for v1.4
            let s = hintDivCheck
            if (!$(hintDivEl) || !$(hintDivEl).attr("data-bind").substr(0, s.length) === s) {
                console.log("plugin_Webcam Tab: Unsupported OctoPrint version " + OctoVersion + ". (\"Hint:\" text differs?)")
                return // fail silently
            }

            $webcamTab.append($(webcamElements).detach());
            self.control._enableWebcam = _enableWebcamOvveride
            self.control.onTabChange = onTabChangeOverride
        };

    };

    OCTOPRINT_VIEWMODELS.push({
        construct: WebcamTabViewModel,
        dependencies: ["controlViewModel"],
        elements: ["#webcamtab"]
    });
});
