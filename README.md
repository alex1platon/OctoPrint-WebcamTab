# OctoPrint-WebcamTab for Octoprint v1.3, 1.4 and 1.5

#### This OctoPrint plugin moves the webcam stream from the controls into its own tab. Keyboard control is still possible and it is compatible with the [FullScreen Plugin](https://github.com/BillyBlaze/OctoPrint-FullScreen).

Forking to add support for Octoprint v1.4 and 1.5. (Original author incomunicado.)

Unfortunately, the only way to move the webcam container to somewhere else (without a total rewrite) requires copying code from control.js, in order to ovveride a couple things in the `_enableWebcam()` method. This code changed from Octoprint v1.3 to v1.4 and again in v1.5, which is why Webcam Tab stopped working in those versions.

This new forked version checks the Octoprint version uses the appropriate code copy. It's a bit of an ugly hack but I see no other way to do it. Alas, this still means that related changes in later versions of Octoprint will need to be ported into this code.

## Setup

Install via the bundled [Plugin Manager](https://github.com/foosel/OctoPrint/wiki/Plugin:-Plugin-Manager)
or manually using this URL:

    https://github.com/gruvin/OctoPrint-WebcamTab/archive/master.zip
