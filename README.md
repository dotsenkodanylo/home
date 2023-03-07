# NextJS Home Server Landing Page/App

This application is the landing page for my personal home server. Currently it repressents a sort of temporal *proxy* if you will, for future applications, features, and documentation. 

Till then, all updates will be flowing in with minimal documentation/release notes, mostly in the form of squashed commits, until proper git release strategy is developed; woo!

Deployment strategy:
    * In github actions container, SSH to server.
    * In repo, run all installations & build, before any docker behaviour invoked.
    * Build docker container, with all the files just copied in.
    * Success!

Next steps:
* Optimize yaml workflow; something iffy with updating the images/containers to correct state.
* FontAwesome authorization will be through a custom domain specific npmrc file. 
