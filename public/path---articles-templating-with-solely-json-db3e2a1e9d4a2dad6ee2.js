webpackJsonp([0x907ccd9574a35800],{"./node_modules/json-loader/index.js!./.cache/json/articles-templating-with-solely-json.json":function(a,n){a.exports={data:{site:{siteMetadata:{title:"Steve Frost – Full Stack Web Developer",author:"Steve Frost"}},markdownRemark:{id:"/Users/stevefrost/Development/Websites/steveafrost.github.io/src/pages/articles/templating-with-solely-json.md absPath of file >>> MarkdownRemark",html:'<p></p>\n<p>Over the weekend, I created a simple messaging act appropriately called <a href="https://github.com/steveafrost/simple-messaging">simple-messaging</a>. After about 6-8 hours of work, I was able to create a functional prototype that allows for users to send dynamically generated messages to a list of users. Although there are established templating languages like mustache.js, I decided to use solely JSON &#x26; JS to create the templates needed for the messages and was really impressed with how robust, yet simple, it turned out in the end.</p>\n<h3>Objective</h3>\n<p>Create a functional, stable bite-sized web app that covers several criteria:</p>\n<ol>\n<li>Loads templates, company list, and current hotel guests from local JSON files.</li>\n<li>Support placeholders/variables within the template that can be replaced with values from the company &#x26; guest data.</li>\n<li>Allow the user to enter a custom message.</li>\n<li>Develop solution to have a greeting variable that changes based on the time of day, specifically: good morning, good afternoon, and good evening.</li>\n<li>Generate a final message output after populating placeholders in the message template with the correct values from the other data collections.</li>\n</ol>\n<h3>Using Placeholders/Variables in JSON</h3>\n<p>Although there are plenty of templating languages, the challenge on this product was to do it without those &#x26; rely solely on JSON. To do that, the message within the template had to have some kind of placeholder, similar to how mustache.js has {{ thisIsAVariable }} to denote where data will be replaced.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>    <span class="token string">"id"</span><span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n    <span class="token string">"name"</span><span class="token punctuation">:</span> <span class="token string">"Restaurant Recommendations"</span><span class="token punctuation">,</span>\n    <span class="token string">"message"</span><span class="token punctuation">:</span> <span class="token string">"If you\'re looking for somewhere to enjoy a delicious meal, try out #company restaurant right downstairs in the lobby."</span><span class="token punctuation">,</span>\n    <span class="token string">"parameters"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"#company"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"type"</span><span class="token punctuation">:</span> <span class="token string">"string"</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>The important piece here is that we’ve included <code>#company</code> within both the message &#x26; the parameters. By including a parameters object, it allows us to loop over all placeholders in a simple, lean way later on without having to use RegEx to search the string for all occurrences of our placeholder delineators. We can also include a type for each parameter to validate proper input once the form is submitted. The current code base includes these types though checking the input data against them is not currently live – great addition for version two!</p>\n<h3>Handling Parameters in Javascript</h3>\n<p>Now that we have a template with placeholders, or just one placeholder in the example here, we can look at loading the template message. Once we do grab the template message, we’ll want to loop over the parameters and fill them in with the data retrieved from our company.json and guests.json files. Let’s parse!</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>      <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">var</span> parameter <span class="token keyword">in</span> template<span class="token punctuation">.</span>parameters<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">var</span> trimmedParam <span class="token operator">=</span> parameter<span class="token punctuation">.</span><span class="token function">substring</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n        <span class="token keyword">if</span><span class="token punctuation">(</span>guest<span class="token punctuation">[</span>trimmedParam<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          template<span class="token punctuation">.</span>message <span class="token operator">=</span> template<span class="token punctuation">.</span>message<span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span>parameter<span class="token punctuation">,</span> guest<span class="token punctuation">[</span>trimmedParam<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>company<span class="token punctuation">[</span>trimmedParam<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          template<span class="token punctuation">.</span>message <span class="token operator">=</span> template<span class="token punctuation">.</span>message<span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span>parameter<span class="token punctuation">,</span> company<span class="token punctuation">[</span>trimmedParam<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n          template<span class="token punctuation">.</span>message <span class="token operator">=</span> template<span class="token punctuation">.</span>message<span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span>parameter<span class="token punctuation">,</span> greeting<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>template<span class="token punctuation">.</span>message<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>This code is a prime candidate for refactoring, but let’s ignore that for a second. First, we grab the template that was selected &#x26; look at it’s parameters. For each parameter, we trim off the <code>#</code> symbol so that it is a 1:1 match with the properties in our other data objects. </p>\n<p>Next, we see if it is located in the guest or company object and if it isn’t, we know it is our custom greeting variable. If the parameter does match a property in the guest or company objects, then that parameter is replaced with the actual value from the data &#x26; the template.message is saved each time because <code>.replace</code> will not mutate the string in place. </p>\n<p>Finally, after our template.message has had all it’s parameters looped over &#x26; replaced with data from either guests.json or company.json, we send along that string to the render method which places it on the page.</p>\n<h3>Conclusion</h3>\n<p>As easy as mustache.js and other templating libraries/engines are, I kind of fell into liking this pure JSON approach. It is obviously not as efficient and although I haven’t run into any issues, I imagine it is more prone to bugs. Nevertheless, it makes for a nice, quick way to prototype an idea or to keep a project lean when not all the capabilities of a templating library/engine will be utilized.</p>',frontmatter:{title:"Templating with Solely JSON",date:"July 17, 2017"}}},pathContext:{path:"/articles/templating-with-solely-json"}}}});
//# sourceMappingURL=path---articles-templating-with-solely-json-db3e2a1e9d4a2dad6ee2.js.map