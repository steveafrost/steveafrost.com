webpackJsonp([0x6bec34a06427f400],{"./node_modules/json-loader/index.js!./.cache/json/articles-setting-up-a-local-wordpress-environment.json":function(e,t){e.exports={data:{site:{siteMetadata:{title:"Steve Frost – Full Stack Web Developer",author:"Steve Frost"}},markdownRemark:{id:"/Users/stevefrost/Development/Websites/steveafrost.github.io/src/pages/articles/setting-up-a-local-wordpress-environment.md absPath of file >>> MarkdownRemark",html:'<p></p>\n<p>Creating a local environment, or more often fixing one, is an essential part of being a developer/engineer. Since the code lives on your computer, testing and deploying code is almost instant reducing the development feedback loop. There are several other benefits that make it worth the effort of setup such as the code isolation, minimized chance of breaking live products, ability to work offline, flexibility to use different tools than the production server supports, and root access, if needed.</p>\n<h3>Installing the LAMP Stack</h3>\n<p>Before installing the actual WordPress files, we need to setup the environment where it will run – specifically, an environment composed of the <a href="https://stackoverflow.com/questions/10060285/what-is-a-lamp-stack">LAMP stack</a> aka <strong>L</strong>inux <strong>A</strong>pache, <strong>M</strong>ySQL, <strong>P</strong>HP/<strong>P</strong>erl/<strong>P</strong>ython. When setting up this stack, there are two choices: manual or packaged. The <a href="https://lukearmstrong.github.io/2016/12/setup-apache-mysql-php-homebrew-macos-sierra/">manual process</a> is best done via <a href="https://steveafrost.com/using-homebrew-the-best-package-manager-for-macos/">Homebrew on Mac</a> or by installing each individual piece on Linux/Windows. There are a few options if you’d like to go the packaged route including <a href="https://www.mamp.info/en/">MAMP</a>, <a href="http://www.wampserver.com/en/">WAMP</a>, and <a href="https://www.apachefriends.org/index.html">XAMP</a>. Immediately you’ll notice that each acronym is similar with the first letter representing the operating system it is made for: <strong>M</strong>AMP for Mac though there is a Windows version of it now, <strong>W</strong>AMP for Windows, and <strong>X</strong>AMP for cross-platform. Since I’m on Mac, I’ll be using MAMP. I’ve also grown to prefer it over XAMP because of it’s simplicity and low CPU usage. <a href="https://youtu.be/I6sTPp779mA">Here is a great MAMP installation tutorial</a> if that’s’ the package you go with.</p>\n<p>Once you have the stack installed, fire up the Apache &#x26; MySQL servers at which point you’re ready to move onto installing WordPress.</p>\n<h3>Installing WordPress</h3>\n<p>To start with installing WordPress, <a href="https://wordpress.org/download/">visit the website</a> and download the most recent source code zip. Unzip the files and put them in the document root that your configuration is looking in – by default, MAMP looks inside the <code>htdocs</code> folder within it’s own application folder. This preference can be updated by changing the <code>Document Root</code> in <code>Preference -> Web Server</code> within MAMP.</p>\n<ol>\n<li>Once the files are in the correct folder, visit <code>localhost:8888</code> on your browser and you should see the file tree displayed. Go ahead and click on the WordPress item within the browser to start the WordPress setup. </li>\n<li>After setting the language, the next step is to enter details about the database but first we have to create the database! Jump back to MAMP and create a database by opening the WebStart page (the middle button on the app) and selecting PHPMyAdmin from the top bar. If it is grayed out, be sure you’re using the standard version of PHP within MAMP. As of this blog, it is the 7.0.5 option. Within PHPMyAdmin, click Databases then fill in a name by Create Database and click Create.\n</li>\n<li>Return back to the WordPress setup and enter the information you created in the previous step. For the username &#x26; password, use the MySQL login that you’ve setup in your LAMP setup – mine is <code>U: root</code>, <code>P: password</code>. It is important to note that these are only for local development. If you were to push this to a live, production website then it would be critical to have a secure username and password to avoid unauthorized users from guessing these credentials. Updating the table prefix from <code>wp</code> is also a recommended practice as hackers who may be trying to exploit WordPress databases will be searching for any databases prefixed with <code>wp</code> – I’ve updated mine to <code>lw</code> for local-wordpress. Verify these settings and click Submit.\n</li>\n<li>If everything has been setup correctly, you should receive a success message that says, “All set Sparky.”\n</li>\n<li>On the next screen, WordPress asks for a site title, username &#x26; password, and a few other basic settings as a part of it’s “famous five-minute setup.” These settings are for the WordPress CMS itself and will be used to login to the dashboard.\n</li>\n<li>Now we can navigate back to PHPMyAdmin and see that the database has been setup with the options we’ve given to it. This is a great time to make sure the information is correct and fix it if needed.\n</li>\n</ol>\n<p>That’s it! Using the database login we can edit the database and using the CMS login we can enter the WordPress dashboard through <code>siteurl.com/wp-admin</code>. If you load the CMS you’ll see the default WordPress CMS ready for the editing, testing, tinkering, and experimenting.</p>\n<p></p>\n<h3>Conclusion</h3>\n<p>Now that we have a local setup we’re free to edit it however we like to try out new plugins, themes, make it match our custom production environment, or anything the mind could dream up. It might seem like a considerable amount of labor up-front but it will save countless hours on the tail-end by giving us a safe space to efficiently &#x26; quickly try out fresh code without worry of breaking a live product.</p>',frontmatter:{title:"Setting Up a Local WordPress Environment",date:"May 14, 2017"}}},pathContext:{path:"/articles/setting-up-a-local-wordpress-environment"}}}});
//# sourceMappingURL=path---articles-setting-up-a-local-wordpress-environment-72c9c61222fc289e4912.js.map