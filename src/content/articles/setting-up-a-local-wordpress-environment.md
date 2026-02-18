---
title: "Setting Up a Local WordPress Environment"
date: 2017-05-14
description: "Creating a local environment, or more often fixing one, is an essential part of being a developer/engineer. Since the code lives on your computer, testing and deploying code is almost instant reducing the development feedback loop. There are several other benefits that make it worth the effort of setup such as the code isolation, minimized chance of breaking live products, ability to work offline, flexibility to use different tools than the production server supports, and root access, if needed."
tags:
  - wordpress
  - lamp
  - apache
  - mysql
  - php
---

![success-messsage-wordpress](/img/blogs/localwordpress0.jpg)

Creating a local environment, or more often fixing one, is an essential part of being a developer/engineer. Since the code lives on your computer, testing and deploying code is almost instant reducing the development feedback loop. There are several other benefits that make it worth the effort of setup such as the code isolation, minimized chance of breaking live products, ability to work offline, flexibility to use different tools than the production server supports, and root access, if needed.

### Installing the LAMP Stack

Before installing the actual WordPress files, we need to setup the environment where it will run – specifically, an environment composed of the [LAMP stack](https://stackoverflow.com/questions/10060285/what-is-a-lamp-stack) aka **L**inux **A**pache, **M**ySQL, **P**HP/**P**erl/**P**ython. When setting up this stack, there are two choices: manual or packaged. The [manual process](https://lukearmstrong.github.io/2016/12/setup-apache-mysql-php-homebrew-macos-sierra/) is best done via [Homebrew on Mac](https://steveafrost.com/using-homebrew-the-best-package-manager-for-macos/) or by installing each individual piece on Linux/Windows. There are a few options if you'd like to go the packaged route including [MAMP](https://www.mamp.info/en/), [WAMP](http://www.wampserver.com/en/), and [XAMP](https://www.apachefriends.org/index.html). Immediately you'll notice that each acronym is similar with the first letter representing the operating system it is made for: **M**AMP for Mac though there is a Windows version of it now, **W**AMP for Windows, and **X**AMP for cross-platform. Since I'm on Mac, I'll be using MAMP. I've also grown to prefer it over XAMP because of it's simplicity and low CPU usage. [Here is a great MAMP installation tutorial](https://youtu.be/I6sTPp779mA) if that's' the package you go with.

Once you have the stack installed, fire up the Apache & MySQL servers at which point you're ready to move onto installing WordPress.

### Installing WordPress

To start with installing WordPress, [visit the website](https://wordpress.org/download/) and download the most recent source code zip. Unzip the files and put them in the document root that your configuration is looking in – by default, MAMP looks inside the `htdocs` folder within it's own application folder. This preference can be updated by changing the `Document Root` in `Preference -> Web Server` within MAMP.

1. Once the files are in the correct folder, visit `localhost:8888` on your browser and you should see the file tree displayed. Go ahead and click on the WordPress item within the browser to start the WordPress setup. 
2. After setting the language, the next step is to enter details about the database but first we have to create the database! Jump back to MAMP and create a database by opening the WebStart page (the middle button on the app) and selecting PHPMyAdmin from the top bar. If it is grayed out, be sure you're using the standard version of PHP within MAMP. As of this blog, it is the 7.0.5 option. Within PHPMyAdmin, click Databases then fill in a name by Create Database and click Create.
![create-database-in-phpmyadmin](/img/blogs/localwordpress1.jpg)
3. Return back to the WordPress setup and enter the information you created in the previous step. For the username & password, use the MySQL login that you've setup in your LAMP setup – mine is `U: root`, `P: password`. It is important to note that these are only for local development. If you were to push this to a live, production website then it would be critical to have a secure username and password to avoid unauthorized users from guessing these credentials. Updating the table prefix from `wp` is also a recommended practice as hackers who may be trying to exploit WordPress databases will be searching for any databases prefixed with `wp` – I've updated mine to `lw` for local-wordpress. Verify these settings and click Submit.
![create-database-in-wordpress](/img/blogs/localwordpress2.jpg)
4. If everything has been setup correctly, you should receive a success message that says, "All set Sparky."
![success-messsage-wordpress](/img/blogs/localwordpress3.jpg)
5. On the next screen, WordPress asks for a site title, username & password, and a few other basic settings as a part of it's "famous five-minute setup." These settings are for the WordPress CMS itself and will be used to login to the dashboard.
![wordpress-settings-setup](/img/blogs/localwordpress4.jpg)
6. Now we can navigate back to PHPMyAdmin and see that the database has been setup with the options we've given to it. This is a great time to make sure the information is correct and fix it if needed.
![completed-database-setup](/img/blogs/localwordpress5.jpg)

That's it! Using the database login we can edit the database and using the CMS login we can enter the WordPress dashboard through `siteurl.com/wp-admin`. If you load the CMS you'll see the default WordPress CMS ready for the editing, testing, tinkering, and experimenting.

![success-messsage-wordpress](/img/blogs/localwordpress6.jpg)

### Conclusion

Now that we have a local setup we're free to edit it however we like to try out new plugins, themes, make it match our custom production environment, or anything the mind could dream up. It might seem like a considerable amount of labor up-front but it will save countless hours on the tail-end by giving us a safe space to efficiently & quickly try out fresh code without worry of breaking a live product.
