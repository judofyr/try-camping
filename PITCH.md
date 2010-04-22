Try Camping!
============

Getting into the mindset of web development in Ruby can be confusing for
newcomers, especially when coming from file-centric platforms like PHP. You not
only need to understand HTTP, but also things like Rack, RESTful thinking and
the Model-View-Controller pattern.

At the moment, the only way to learn this is to follow books or tutorials
written for a specific framework. While this works fairy well, these tutorials
are naturally centered around the framework and not the concepts, so it's
optimal. Buying books is also not an alternative for some people. You also have
to install everything on your machine, which can be tiresome for someone who
only wants to learn. These are some of the issues I met years ago when I started
with web development in Ruby, and I still believe they exist today.

By providing an interactive, online tutorial which only requires a browser, I
believe we can make it easier for newcomers to understand how web development
works in Ruby. The goal should be to teach *concepts*, not libraries and APIs.
It should just be an introduction so your mind is ready for other frameworks
like Rails and Sinatra.


The webpage
-----------

The end product of this project is going to a webpage.

When you load the page you're going to see two things: A big textarea where you
can type code and a sidebar with some instructions. Whenever you type something
in the textarea, there's a JRuby applet hidden in the background which does
several things:

1. If the Ruby code causes a syntax error, it will show a nice error message.
2. If not, it will spawn a new WEBrick server, running locally on the user's
   machine. (Yes, JRuby in an applet is capable of doing that.)
3. Then it will run the test case to see if you've completed the current step.
4. You can also test your application by going to http://localhost:xxxx/

In addition there will also be a an console (like Try Ruby!) and an HTTP
inspector (so you can easily see how the requests/responses look like).


Why a JRuby applet?
-------------------

Let me guess: Your first thought was something like "WTF? Java applet?" Nobody
likes Java applets, but I still believe it's the best option for this project.
Applets have been improved in the last years, and you will infact never even see
the applet in Try Camping!

There is only one other option: running the code on the backend server in a
limited process. I don't like this because (1) it means I'll have to maintain a
server which is going to run untrusted code and (2) the applet solution only
requires static files which can be hosted on any server and scales easily.


What's Camping?
---------------

Camping is a microframework written by why the lucky stiff (also called _why)
which constantly tries to stay below 4k of code. Read more about at
<http://whywentcamping.com/>


Why Camping?
------------

You might wondering why I've chosen to use Camping, and not Rack or Sinatra, for
this project.

First of all, I'm the maintainer of Camping and it's definitely the framework I
know most about. I've contributed 9080 lines of diff (only beated by _why with
11384 lines) and know pretty much what every single byte does. By choosing
Camping, I can take full advantage of my knowledge.

More importantly, I believe Camping is a an excellent representation of HTTP in
Ruby and also encourages best-practices for organizing code. Let me give you
four examples:

### 1. Camping.goes :Unpolluted

In Camping every applications lives in its own module:

    Camping.goes :Blog
    module Blog
    end
    
    Camping.goes :Wiki
    module Wiki
    end

This keeps the namespace unpolluted and also makes every app a little more
library-like.

### 2. Model-View-Controller

Camping follows a strict Model-View-Controller pattern and structures the code
in modules:

    module Blog
      module Controllers; end
      module Models; end
      module Views; end
      module Helpers; end
    end

This makes it very clear what should go where, so the user can more easily
understand other MVC frameworks like Rails.

### 3. RESTful

HTTP and REST is all about *resources* and *methods*. Those are the nouns and
verbs of HTTP. Camping uses the Ruby equivalent: classes (or instances of
classes) and methods:

    module Blog::Controllers
      class Posts
        def get; end
        def post; end
      end
    end

This is a very "correct" representation of HTTP in Ruby. It also means that
Camping is totally method-agnostic. If the server receives a request like `HELLO
/posts`, Camping is going to try to call Posts#hello. It doesn't matter if
you're using GET, POST, DELETE, PROPFIND or something completely different, all
Camping tries is to call the method on the resource.


### 4. Named resources

In Camping you *must* name your resources, and they will always be accessible as
constants:

    module Blog::Controllers
      class Posts
      end
    end

This means that your resouces are objects and can e.g. be used for generating
routes:

    module Blog::Views
      def index
        a "Find all posts", :href => R(Posts)
      end
    end

This teaches you to keep things DRY and not hardcode paths everywhere (yes, I'm
looking at you Sinatra).

### Camping as a tool, not a library

I hope you understand that Try Camping! is less about Camping, and more about
teaching web development in Ruby. I'm only using Camping as a learning tool;
it's not Camping I'm trying to teach.


Pitfalls
--------

The biggest issue I can think of at the moment is the syntax highlighted
textarea. Handling both syntax highlighting and automatic indentation in
cross-browser JavaScript isn't an easy task. Hopefully I'll be able to re-use
some previous Ruby parser, or maybe the JavaScript-to-Applet bridge is fast
enough, but in worst case the editor will be more or less like a regular
textarea. It's at least not going to block any progress.

Another solution to this issue would be to talk with the Heroku guys and see if
they want to open-source the editor they used in Heroku Garden.


