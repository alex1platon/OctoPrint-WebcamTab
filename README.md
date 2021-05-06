# OctoPrint-WebcamTab for Octoprint v1.3, 1.4, 1.5 and 1.6

#### This OctoPrint plugin moves the webcam stream from the controls into its own tab. Keyboard control is still possible and it is compatible with the [FullScreen Plugin](https://github.com/BillyBlaze/OctoPrint-FullScreen).

Forking to add support for Octoprint v1.4, 1.5 & 1.6. (Original author incomunicado.)

Unfortunately, the only way to move the webcam container to somewhere else (without a total rewrite) requires copying code from control.js, in order to ovveride a couple things in the `_enableWebcam()` method. This code changed from Octoprint v1.3 to v1.4 and again in v1.5, which is why Webcam Tab stopped working in those versions.

This fork checks the Octoprint version and uses the appropriate code copy. It's a bit of an ugly hack but I see no other way to do it, other than having separate plugins for each OctoPrint version. Alas, this means that related changes to Octoprint webcam related code in the future will need to be manually ported into this plugin's code.

## Setup

Install via the bundled [Plugin Manager](https://github.com/foosel/OctoPrint/wiki/Plugin:-Plugin-Manager)
or manually using this URL:

    https://github.com/gruvin/OctoPrint-WebcamTab/archive/master.zip
