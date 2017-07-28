webpackJsonp([0xefcab16fb5626800],{"./node_modules/json-loader/index.js!./.cache/json/articles-first-impressions-trellis.json":function(e,s){e.exports={data:{site:{siteMetadata:{title:"Steve Frost – Full Stack Web Developer",author:"Steve Frost"}},markdownRemark:{id:"/Users/stevefrost/Development/Websites/steveafrost.github.io/src/pages/articles/first-impressions-trellis.md absPath of file >>> MarkdownRemark",html:'<p></p>\n<p>After spending several months creating websites with static-site generators, I had my hesitations to come back to polishing up a WordPress site for a long-time client. On one hand, working in WordPress means I don’t have to worry about the shortcomings involved when using flat HTML files such as not having a database or method for processing forms – <a href="https://steveafrost.com/building-a-website-using-middleman/">workarounds do exist though</a>. On the other hand, I was sure I’d miss my modern tool set including live reload, included sass support, templating languages, dependency management, and so on… that is, until I heard about the <a href="https://roots.io/">tools at Roots</a>.</p>\n<h3>Roots - Modern WordPress Tools</h3>\n<p>The Roots bundle is made up of three components which can be used individually or together: <a href="https://roots.io/trellis/">Trellis</a>, <a href="https://roots.io/bedrock/">Bedrock</a>, and <a href="https://roots.io/sage/">Sage</a>. Briefly, Trellis is the server layer, Bedrock is the application layer, and Sage is the theme layer. Initially I was introduced to Sage by <a href="https://twitter.com/jesseross">Jesse Ross</a> and had whole-heartedly planned on researching the documentation then trying to build it into a legacy site. As I read more about each tool, especially Trellis, I decided to give the full bundle a run. Thus far, I’ve gone through the Trellis setup (locally &#x26; remotely, more on this soon) so this post will be exclusively about that layer. As I progress through, I’ll write an article about each.</p>\n<h3>So, What Is Trellis?</h3>\n<p>Excuse any rookie devops inaccuracies in this section. This was my introduction to isolated containers such as Vagrant &#x26; Docker which I love so far. Previously, I wrote about setting up your WordPress environment with MAMP and mentioned it can also be done more manually w/ homebrew though I think the best way to retain consistency between development, staging, and production is with Trellis. Trellis can be configured to deliver this consistent environment using a mixture of provisioning via <a href="https://www.vagrantup.com/">Vagrant</a> &#x26; <a href="https://www.ansible.com/how-ansible-works">Ansible</a>, Composer to manage dependencies, and aspects I’m sure I haven’t discovered yet. </p>\n<h3>Setup &#x26; Organization</h3>\n<p>{: .align-left}\nI’d be remiss if I wasn’t up front about the setup part of Trellis, it can be taxing. The tool is quite massive when first diving in though as with many things development, once I settled in and started to break it down folder by folder, I quite like the organization. In the screenshot, you can see that the top level is split by the Trellis tool &#x26; the site built by Trellis. I love that! That means if I have to leave Trellis at some point, the <code>/site</code> folder is easily detachable. Drilling down further, the site folder opens up and reveals the composer file, for managing dependencies – more on that soon, while also include a <code>/web</code> folder which is where our WordPress files now live. The structure does a great job of separating the logic between Trellis, site config, and actual core WordPress files. As an organization <del>freak</del> connoisseur, Trellis feels like home.</p>\n<h3>Portability</h3>\n<p>Speaking of home, Trellis makes a tremendous nomad. There has to be some way to justify all that setup, right? Once you’ve setup Trellis, the configured environment can be used to provision both a staging and production server but more importantly, another development server! That means if I forget my MacBook, or if I’m using someone elses, or if a teammate wants to work on the website, it is as easy as pulling down the repo and running <code>vagrant up</code>. By the way, that is one of the most satisfying commands. In Trellis’ case, it goes through all the Ansible playbooks and YAMLs step-by-step to setup a true local Linux box via a virtual machine like <a href="https://www.virtualbox.org/wiki/VirtualBox">Virtual Box</a>. I even tested it out… er, actually I borked my setup about halfway through setting up the production server. Reasonably confident went to reasonably nervous real quick. Had all my work paid off? A simple <code>git clone</code> from my repo and <code>vagrant up</code> got me back up and running within ten minutes. I’m a believer.</p>\n<h3>Remote Provisioning</h3>\n<p>I’ve had a Digital Ocean droplet with the new customer credits for months and never could figure out what to do with it. All my WP sites were hosted elsewhere, my web apps were on Heroku’s free tier, but I knew the free credits would come in handle eventually. Enter Trellis &#x26; Digital Ocean. If you have a Droplet on Digital Ocean, Trellis provides a <a href="https://roots.io/trellis/docs/remote-server-setup/">super simple guide</a> to provision your remote server. Once you have configured the YAML files necessary, it is a simple <code>ansible-playbook server.yml -e env=&#x3C;environment></code> command to provision the server. It doesn’t necessarily have to be Digital Ocean either, the same command can be used for Heroku and other providers.</p>\n<h3>Dependency Management</h3>\n<p>Long live Composer! Composer has been the <a href="https://benramsey.com/blog/2013/11/the-fall-of-pear-and-the-rise-of-composer/">more popular option lately</a> for PHP dependency management so I’m glad to see the Roots team rolled it into their modern tooling. At first, I didn’t understand what exactly I’d use Composer for when working inside of WordPress. Then, I read more into it and a weight was lifted off my WordPress shoulders: Composer can, and should be, used for WordPress plugins. </p>\n<div class="gatsby-highlight">\n      <pre class="language-php"><code><span class="token string">"require"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"php"</span><span class="token punctuation">:</span> <span class="token string">">=5.6"</span><span class="token punctuation">,</span>\n    <span class="token string">"composer/installers"</span><span class="token punctuation">:</span> <span class="token string">"~1.2.0"</span><span class="token punctuation">,</span>\n    <span class="token string">"vlucas/phpdotenv"</span><span class="token punctuation">:</span> <span class="token string">"^2.0.1"</span><span class="token punctuation">,</span>\n    <span class="token string">"johnpbloch/wordpress"</span><span class="token punctuation">:</span> <span class="token string">"4.8.0"</span><span class="token punctuation">,</span>\n    <span class="token string">"oscarotero/env"</span><span class="token punctuation">:</span> <span class="token string">"^1.0"</span><span class="token punctuation">,</span>\n    <span class="token string">"roots/wp-password-bcrypt"</span><span class="token punctuation">:</span> <span class="token string">"1.0.0"</span><span class="token punctuation">,</span>\n    <span class="token string">"wpackagist-plugin/akismet"</span><span class="token punctuation">:</span> <span class="token string">"3.3.2"</span><span class="token punctuation">,</span>\n    <span class="token string">"wpackagist-plugin/contact-form-7"</span><span class="token punctuation">:</span> <span class="token string">"4.8"</span><span class="token punctuation">,</span>\n    <span class="token string">"wpackagist-plugin/genesis-responsive-slider"</span><span class="token punctuation">:</span> <span class="token string">"0.9.5"</span><span class="token punctuation">,</span>\n    <span class="token string">"wpackagist-plugin/google-sitemap-generator"</span><span class="token punctuation">:</span> <span class="token string">"4.0.8"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n</code></pre>\n      </div>\n<p>The incredible site of <a href="https://wpackagist.org/">WPackagist</a> lists all WordPress plugins and themes which can be easily added to your <code>composer.json</code> file, installed with <code>composer install</code>, and updated with <code>composer update</code> – yes, updates &#x26; version locking that easy. It reminded me of <a href="https://rails-assets.org/#/">RailsAssets</a> which converts bower.json files into gems similar to how WPackagist does in mirroring WP Plugins/Themes as a Composer directory. For more info about RailsAssets, see how I used it in my Rails/Angular app <a href="https://steveafrost.com/a-greenhorns-approach-to-angular/">here</a>. The resources the developer community creates is amazing.</p>\n<h3>Onto Bedrock</h3>\n<p>Now that I have a stable Trellis base, it’s time to move onto Bedrock which is the boilerplate from the same Roots family. These tools are essential to bring WordPress into 2017, especially with all of the innovation going on in JS land. I’m excited to see what the Roots team comes up with in <a href="https://github.com/roots/trellis/releases/tag/1.0.0-rc.1">v1.0 of Trellis</a> and am optimistic about it’s growth for years beyond.</p>\n<h3>About First Impressions</h3>\n<p>First Impressions is an ongoing series intended to provide an overview of technology that I’ve had a hands-on experience with for only a few days. Each blog will cover a single topic and include my straightforward, 72-hour takeaway with any resources that I’ve found helpful. My intention is that these First Impressions will be both useful intros for others and a personal chronicle to process and reflect on material.</p>',frontmatter:{title:"First Impressions: Trellis",date:"June 12, 2017"}}},pathContext:{path:"/articles/first-impressions-trellis"}}}});
//# sourceMappingURL=path---articles-first-impressions-trellis-de3f663ea1e2550feb28.js.map