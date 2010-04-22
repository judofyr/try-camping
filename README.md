Try Camping! - a Ruby Summer of Code proposal by Magnus Holm
============================================================

* README.md: Synopsis and goals. Short.
* PITCH.md: Article about the problem I'm trying to solve.
* ME.md: Who I am and why I will deliver.


Synopsis
--------

Try Camping! will be a webpage consisting of:

* A step-by-step tutorial for learning about web development in Ruby (HTTP,
  Rack, MVC, different frameworks) by using Camping as a learning tool.

* A syntax highlighted &lt;textarea&gt; where you can experiment with the code.

* A JRuby applet running in the background which runs your app in WEBrick
  locally on your machine.

* No download or installing required except for Java (and a browser).


Goals
-----

* Provide a simple environment where newcomers can learn about the principles of
  web development in Ruby, making it easier for them to pick up frameworks like
  Rails and Sinatra later.

* Find/create/improve a way to write syntax highlighted Ruby code in a
  &lt;textarea&gt;

* Experiment with running Ruby in a Java applet by using JRuby and Duby. 

Timeline
--------

I want to separate the project into two parts, where I will use the first half
of the summer to implement all the code needed and the second half to write the
tutorials.

In the first part I will write:

* HTML and CSS to get a decently looking site
* A textarea with syntax highlighted code
* A HTTP inspector so you can see the browser's request and Camping's response
* A simple console where you can run Ruby code
* A tutorial system which bases progress on unit tests
* A JRuby applet written in Duby which integrates everything

In the second part I will write tutorials about:

* Camping - Getting a feel of how it works
* MVC - More in detail about what MVC is all about
* HTTP - Explaing the protocol through the HTTP inspector
* Rack - How Rack connects servers and adapters
* Template engines - Present a few alternatives to Markaby
* Frameworks - Present other web frameworks

