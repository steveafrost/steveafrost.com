webpackJsonp([0x70afd0ae9464c000],{"./node_modules/json-loader/index.js!./.cache/json/articles-javascript-type-coercion.json":function(e,a){e.exports={data:{site:{siteMetadata:{title:"Steve Frost – Full Stack Web Developer",author:"Steve Frost"}},markdownRemark:{id:"/Users/stevefrost/Development/Websites/steveafrost.github.io/src/pages/articles/javascript-type-coercion.md absPath of file >>> MarkdownRemark",html:'<p></p>\n<p>When I made my transition from Ruby to Javascript, the various nuances of the language were frustrating and I was tempted to retreat back to Ruby. After investing time to understand them, I grew fond of Javascript and left my past love behind. At the forefront of subtle, pesky behaviors is <em>Type Coercion</em>. If you break down the word, it tells you exactly what behavior is happening here: Javascript is <a href="http://www.dictionary.com/browse/coerce">coercing</a>, or persuading, a value to a different type as in the string ‘1’ becomes 1.</p>\n<h3>When Does Coercion Occur</h3>\n<p>Now that we have a definition of coercion, what does it actually occur in Javascript? The answer can be split into two sections: implicit coercion and explicit coercion. If you are unfamiliar with implicit vs explicit, the way I usually remember it is that being explicit means you’re being very detailed and dictating each step while implicit describes behaviors that happen without the programmer providing all steps. Before continuing, here are two examples to represent each type of coercion.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token operator">*</span>Implicit Coercion<span class="token operator">*</span>\n<span class="token keyword">var</span> a <span class="token operator">=</span> <span class="token number">1</span>\n<span class="token keyword">var</span> b <span class="token operator">=</span> <span class="token string">"1"</span>\na <span class="token operator">==</span> b  <span class="token comment" spellcheck="true">// returns true</span>\n\n<span class="token operator">*</span>Explicit Coercion<span class="token operator">*</span>\nb <span class="token operator">=</span> a<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">typeof</span> a <span class="token comment" spellcheck="true">// number</span>\n<span class="token keyword">typeof</span> b <span class="token comment" spellcheck="true">// string</span>\n</code></pre>\n      </div>\n<p>Hopefully this helps differentiate implicit vs explicit. In the implicit example, Javascript is coercing <code>b</code> to a <code>number</code> type so that it can compare to <code>a</code> which is a number. In the explicit example, we are providing the exact steps to coerce a value.</p>\n<p>Since explicit coercion is fairly easy to understand and typically intentional, we’ll focus on implicit coercion and the most notorious situation: comparing two values.</p>\n<h3>Breaking Traditions and Taking Sides</h3>\n<p>It is a long-standing, popular stance to avoid coercion when comparing values by using the strict equality operator: <code>===</code> or <code>!==</code>. Numerous JS books such as <a href="https://www.amazon.com/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742">“Javascript: The Good Parts”</a> recommend this approach of avoiding coercion in all situations and it specifically squares off against the loose equality (<code>==</code>) operator. There is plenty of similar debate in the community as a whole around whether coercion is a feature or a bug.</p>\n<p>While it may be a tradition to stick to <code>==</code> instead of <code>===</code> – in fact, it was how I was taught – I am under the belief now that we should understand what is happening behind each (hint: implicit coercion) and use the proper comparison operator in each situation. If I could point to one passage that helped me wrap my head around the coercion happening behind loose and strict comparisons, it would be the community guide assembled by Kyle Simpson called, <a href="https://github.com/getify/You-Dont-Know-JS">“You Don’t Know JS”</a> which is an exhaustive, brilliant guide to Javascript.</p>\n<blockquote>\n<p>The difference between <code>==</code> and <code>===</code> is usually characterized that <code>==</code> checks for value equality and <code>===</code> checks for both value &#x26; type equality. However, this is inaccurate. The proper way to characterize them is that <code>==</code> checks for value equality <em>with</em> coercion allowed, and <code>===</code> checks for value equality <em>without</em> allowing coercion.</p>\n</blockquote>\n<h3>Wrap-Up</h3>\n<p>While it can be intimidating that there are a sufficient number of nooks to explore in Javascript, I believe learning these core behaviors can be extremely beneficial in both creating our programs as well as debugging them – especially debugging them. As I continue to create, I hope to expand my understanding of exactly what is happening ‘under the hood’ such as the difference explained here regarding coercion and apply that knowledge to future programs. I’m hopeful that this post also spurred your interest in diving deep into some of the ‘magic’ behind-the-scenes of your latest creation.</p>',frontmatter:{title:"Javascript Type Coercion",date:"April 23, 2017"}}},pathContext:{path:"/articles/javascript-type-coercion"}}}});
//# sourceMappingURL=path---articles-javascript-type-coercion-7b7f4a97d9a9fb6872bb.js.map