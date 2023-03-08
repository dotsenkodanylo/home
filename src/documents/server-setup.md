## Dockerized Raspberry Pi Nginx Home Server Setup

#### Date: 2023-03-03
#### Tags: *Docker, Nginx, Raspberry Pi, Home Server, Network, Subnet, SSH, Port Forwarding, Reverse Proxy, DNS, Subdomain*

<br>

Hello! The following is some brief documentation of setting up and running a set of Docker containers on a Raspberry Pi through a reverse proxy with Nginx, and exposing it globally via a DNS registrar.

Some notes:
* For the initial setup, I did not utilize Docker Compose, which ended up being a following set of implementations that I will document at a later time. 
* Nginx reverse proxy can be configured as a Docker Container as well, however this was something I wanted to keep running on the host and not isolated in a container.

### Some preliminary setup/requirements:
1. Raspberry Pi Model B, with latest relevent distro installed. I used the default Pi OS. Please note that I ran into several issues installing it through ARM Mac, and it only worked correctly after installing the OS on a Windows machine. Also take note of your *username* (default is often just `pi`) and *password*; you will need it to SSH into your machine. You COULD also setup a pair of authorized ssh keys at a later time to simplify the SSH process.
    * Ensure you have enabled SSH in the PI by going into the Preferences > Pi Configuration > Interfaces menu, and enabling it accordingly. 
    * You may also want to use Ethernet for tethering your PI to your LAN.
2. A functional LAN network, to which you are connected and are the owner/have administrative privileges; your router will be the main gateway for all network traffic.
3. Ensure your PC is connected to the same LAN network as your Pi.
* add screenshot of bell GUI for static IPs*
## Commence!

1. Assuming your default gateway (router) address is 192.168.2.1, go ahead and enter your router GUI through your browser and navigate the GUI to the page that allows you to view the devices on your network.
2. Find the *local IP* address of your PI, and if you have the option, toggle it to be static or "reserved" so your router doesn't re-assign the IP later on. 
3. Assuming your machine is connected to your LAN network, go ahead and SSH into your PI (you will be prompted to enter your *password*):

```
ssh pi_username@local_ip_of_pi      # Don't need to apply port flag.
```
4. Assuming your SSH was successful and you're now within the Linux home directory, you can begin by updating your existing machine dependencies:
```
sudo apt-get update && sudo apt-get upgrade
```
5. Optionally, add your user to the docker group to give your user full docker permissions:
```
 sudo usermod -aG docker $USER
```
6. Next, to install Docker, run the following:
```
curl -fsSL https://get.docker.com -o get-docker.sh &&
sudo sh get-docker.sh
```
7. Ensure that docker has installed correctly by running the following:
```
docker version
```
8. Next step is installing Nginx and running it with the default services management tool 'systemctl':
```
sudo apt install nginx && sudo systemctl start nginx && systemctl status nginx
```
9. You should now be able to go to your Raspberry PI's IP address on any device in your LAN and Nginx should return the default *sites-enabled* static html file. 
10. Now, let's create a simple docker container running a NextJS app. We can create a working directory in our PI machine at /home/user/dev/test-directory and land in that directory for all our testing and work. We will want to get all our NodeJS dependencies in order, so let's run the following:
```
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash - &&
sudo apt install nodejs 
```
11. Ensure your node version is up to date, otherwise you may want to install NVM and use it to get the latest version (at this time I'm using 18.14.1).
12. At this point, we can create a repository (don't need to use git but feel free to instantiate a git repo) containing our NextJS app code. We won't be running it directly on the host however, as we are going to transfer the fleshed out code, dependencies, and modules to our Docker container and run it there. Run a fresh NextJS app installation:
```
npx create-next-app my-app
```
13. Within the root directory of the app, we can create a new Dockerfile, and populate it with the following:
```
FROM node:18-alpine3.16

WORKDIR /workdir

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD npm run dev
```
14. This is going to create a docker image containing a basic nodeJs compatible OS image, as well as copy over the root project we created with NPX. Next, let's build the actual image with the following command:
```
docker build -t docker_next_app:development .
```
15. After your docker image is built, we can run the container with:
```
docker run --publish 3000:3000 -d docker_next_app:development
```
16. If all goes well, you should have your NextJS app running in a docker container, on port 3000 on your host and container. `localhost:3000` unfortunately will not yet lead you to your docker container. We have the PI running the docker container, and you are indeed connected to said PI, but we are not *proxying* HTTP requests to the the docker container through the PI. This can be done either with a set of port forwarding rules and handlers in your router and nginx config, respectively, that will direct HTTP traffic to the PI, and you will be responsible for listening to the corresponding ports, if you use non-default ports (80 for HTTP). Or, since we will likely want to eventually enable SSL, we can set up a DNS registered name that will point to our server, and in our proxy we handle incoming requests that match the hostname, and direct to the appropriate container from there. This is the approach we will take. However, you can't access your public IP on the same network, so we will also add a proxy directive for HTTP requests from within our LAN as well. There are workarounds but we will maintain a simple HTTP port proxy for LAN connections to our server/docker container. So our end goal, TLDR:
    * DNS name registered, pointing to our public IP address.
    * Nginx proxy set up and configured to listen to requests, and matching those with the correct hostname (our purchased DNS name) to our desired container, to avert the need for port forwarding.
    * Ensuring LAN conectivity remain possible, via a port forward handler block, since we probably don't want all the requests coming in to excusively be hitting the container, in case we want future iterations. 
17. Purchase a domain name. For the sake of explaining, let's say the name purchased was foobar.org, on GoDaddy (or whichever registrar you used). You should be able to go into the settings of your purchased domain, and although the TTL (time to live) for a new domain takes a while, we can configure it so that the base domain points to our public router IP (whatsmyip should give you your public IP address). 
18. Once you have updated your DNS host, you will now need to enable port forwarding on your home network; back to your router at 192.168.2.1. Dig around your router settings until you can find the port forwarding rules/setup, and create a new rule that will listen to requests on port 80, and forward those to your desired local IP, which in this case should be your PI IP, with an internal port mapping of 80. 
19. As a quick test, if you are able to connect to the internet outside of your home network, try going to your public IP through a browser. If the DNS updated correctly and your router port forwarding is set up, and nginx is running on your PI, you SHOULD see your default nginx landing page! We haven't set up any custom port listeners on our server, and the default nginx configuration accepts connections with any hostname, so it should work correctly. 
20. The default nginx configuration, with the version I'm currently running (1.18.0), lives in `/etg/nginx/sites-enabled/default`. I think the traditional way of editing the configuration, which is by creating custom config files in `/etc/nginx/conf.d` is the best approach and will stick with it for this documentation; however you can create custom configurations within the `sites-enabled` directory. So for this example, create a new configuration file in `/etc/nginx/conf.d` called foobar.org.conf, and then add the following blocks:
```
server {
    server_name foobar.org;

    listen 80 default_server;
	listen [::]:80 default_server;

    location / {
		proxy_http_version 1.1;
        	proxy_set_header Upgrade $http_upgrade;
        	proxy_set_header Connection 'upgrade';
        	proxy_set_header Host $host;
        	proxy_set_header X-Real-IP $remote_addr;
        	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        	proxy_set_header X-Forwarded-Proto $scheme;
        	proxy_cache_bypass $http_upgrade;

        	proxy_pass http://localhost:3000/;
	}
}
```
The configuration above is going to listen to all requests on port 80 (the default HTTP request port), and proxy them to your docker container, which is published on port 3000.
```
server {
	listen 80;
	listen [::]:80;

	server_name your_raspberry_pi_local_ip;

	 location / {
		proxy_http_version 1.1;
        	proxy_set_header Upgrade $http_upgrade;
        	proxy_set_header Connection 'upgrade';
        	proxy_set_header Host $host;
        	proxy_set_header X-Real-IP $remote_addr;
        	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        	proxy_set_header X-Forwarded-Proto $scheme;
        	proxy_cache_bypass $http_upgrade;

        	proxy_pass http://localhost:3000/;
	}
}
```
The configuration here will do the same, but it will proxy from your LAN, since the host name when you access your PI through LAN will not apply. You can simplify this by just adding the PI's LAN IP to the same line as the server_name directive in the first block, but since we are going to apply SSL to the registered domain name access, we can keep them detached for now. 

* A quick side note; whenever you make major changes to your nginx config, make sure you restart the running nginx instance with:
```
sudo systemctl restart nginx
```
and test your config with:
```
sudo nginx -t   # or -T for a detailed config breakdown
```
21. If everything has been configured correctly, you should be able to go to foobar.org, and see your NextJS app being served! Hooray!
22. Now, to enable SSL access, we need a few more dependencies installed:
```
sudo apt-get install certbot &&
apt-get install python3-certbot-nginx
```
23. To create your SSL certificate, run the following:
```
sudo certbot --nginx -d foobar.org
```
What this will do is create an SSL certificate, and automatically modify your nginx condfiguration blocks that match the server name (which is why our LAN IP server block and our DNS named block were two detached blocks).

24. Restart your nginx server, and go back to your router port forwarding rules. Create a new rule, similar to the one you have already created, except this time the ports should be 443 to 443, for the same device. What this will do is port forward HTTPS requests to your machine, since SSL based requests occupy a different default port than plain HTTP. Once your rule is created, try accessing your domain through a browser on a different network, and you should now see that your access is encrypted! And that's it!




