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

        $webcamTab = $("#tab_plugin_webcamtab")

        // move webcam related elements from #control to #tab_plugin_webcamtab ...
        self.onAllBound = function(allViewModels) {

            console.log("Plugin webcamtab detected OctoPrint v" + window.VERSION)

            // move webcam elements from #control to #tab_plugin_webcamtab
            $webcamElements = $(
                 "#control > #webcam_video_container"   // introduced in OctoPrint v1.8
                +",#control > #webcam_container"        // since at least OctoPrint v1.3
                +",#control > #webcam_hls_container"    // introduced in OctoPrint v1.5
                +",#control > #webcam_container + div"  // 'Hint:' text; introduced in OctoPrint v1.5
            )
            $webcamTab.append($webcamElements.detach())

            // modify behaviour of control.js functions to work with relocated webcam elements
            self._onTabChange = self.control.onTabChange.bind(control)
            self.control.onTabChange = function (current, previous) {
                if (previous == "#tab_plugin_webcamtab") {
                    self.control._disableWebcam()
                } else {
                    self._onTabChange((current == "#tab_plugin_webcamtab") ? "#control" : current, previous)
                }
            }

            self._enableWebcam = self.control._enableWebcam.bind(control)
            self.control._enableWebcam = function() {
                const storeSelectedTab = OctoPrint.coreui.selectedTab 
                if (OctoPrint.coreui.selectedTab == "#tab_plugin_webcamtab") OctoPrint.coreui.selectedTab = "#control"
                self._enableWebcam()
                OctoPrint.coreui.selectedTab = storeSelectedTab
            }
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: WebcamTabViewModel,
        dependencies: ["controlViewModel"],
        elements: ["#tab_plugin_webcamtab"]
    });
});
