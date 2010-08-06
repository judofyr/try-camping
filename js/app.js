$(function(){
  window.applet_attr = {
    "id": "applet",
    "name": "applet",
    "width": 1,
    "height": 1,
    "mayscript": "true",
    "scriptable": "true",
    "code": "SimpleApplet.class",
    "archive": "java/142dcae9.jar" // Filename from `rake build`
  }
  
  var bootstrap = "bootstrap.rb";
  var script = "<script>deployJava.runApplet(applet_attr, {}, '1.6')</script>";
  var App = window.App = {};
  var jApp = $(App)
  var applet;
  var checked = 0;
  var checker_interval;
  var ta = $("#editor textarea");
  var ti = $("#editor .infobar");
  
  App.port = 3301;
  
  // Event driven development anyone?
  App.trigger = function() { jApp.trigger.apply(jApp, arguments) }
  App.bind = function() { jApp.bind.apply(jApp, arguments) }
  
  App.PENDING = "pending";
  App.PASSED = "passed";
  App.FAILED = "failed";
  
  App.reset = function() {
    applet.newInstance();
    applet.evalRuby("load 'bootstrap.rb'");
  }
  
  var c = $("#console pre").get(0);
  
  App.input = function(str) {
    c.innerHTML += decodeURIComponent(str);
  }
  
  App.run = function(code) {
    var escaped = encodeURIComponent(code);
    applet.evalRuby("TryCamping.run(\"" + escaped + "\")");
  }
  
  App.validate = function(code) {
    var escaped = encodeURIComponent(code);
    return App.eval("TryCamping.invalid?(\"" + escaped + "\")") + "";
  }
  
  App.eval_console = function(line) {
    var escaped = encodeURIComponent(line);
    var result = applet.evalRuby("$C.run(\"" + escaped + "\")") + "";
    return {
      message: result.substring(1),
      type: result[0]
    };
  }
  
  App.eval = function(code) {
    return applet.evalRuby(code);
  }
  
  $.fn.linkTo = function() {
    return this.pushStack($("a[href='#" + this.attr("id") + "']"));
  }
  
  var overlay;
  
  $('.tab:not(.active)').bind('tab:activate', function() {
    $('.tab').trigger('tab:deactivate');
    
    $(this)
      .addClass("active")
      .linkTo()
        .parent()
          .addClass("active")
          .end()
        .end()
    
    if (!overlay) {
      $(this)
        .show()
        .trigger('tab:activated');
    }
  });
  
  $('.tab').bind('tab:deactivate', function() {
    $(this)
      .hide()
      .removeClass("active")
      .linkTo()
        .parent()
          .removeClass("active");
  })
  
  $('.overlay').bind('overlay:enable', function() {
    overlay = true;  
    $(this).show()
    $('.tab.active').hide();
  });
  
  $('.overlay').bind('overlay:disable', function(evt, keep) {
    overlay = false;
    if (!keep) { $(this).hide() }
    $('.tab.active').show();
  });
  
  // Browser
  
  $("#browser").bind("tab:activated", function() {
    var base_size = $('#browser_base').width();
    $('#browser_input').css('padding-left', base_size + 12);
  });
  
  // Sets up IRB
  $("#irb").console({
    welcomeMessage: "Interactive ruby ready.",
    animateScroll: true,
    promptLabel: ">> ",
    commandHandle: function(line){
      var result = App.eval_console(line);
      return [{
        msg: result.message,
        className: "jquery-console-message-" + result.type
      }];
    }
  });
  
  // Sets up the textarea
  var reload_timeout;
  
  ta.keyup(function(evt) {
    if (!App.loaded) { return }
    
    ti.text("Editing...");
    if (reload_timeout) { clearTimeout(reload_timeout) }
    
    reload_timeout = setTimeout(function() {
      App.trigger('reload');
    }, 2000);
    
    return true;
  });
  
  $('#extranav a').click(function() {
    var tab = $(this).attr("href");
    $(tab).trigger("tab:activate");
    return false;
  });
  
  // Browser
  
  $('#browser_open').click(function() {
    window.open($("#browser_base").text());
    return false;
  });
  
  // Activates the first tab
  $('.tab:first').trigger('tab:activate');
  
  // Enables the applet loader
  $('#applet-loader').trigger('overlay:enable');
  $('#applet-button').click(function() {
    $(this)
      .attr("disabled", "disabled")
      .attr("value", "Loading...");
      
    App.trigger('load');
  });
  
  // Checks if the applet is loaded
  function isActive(a) {
    try {
      return a.isActive();
    } catch(e) {
      return false;
    }
  }
  
  App.bind('load', function() {
    setTimeout(function() {
      $("#applet-container").writeCapture().html(script);
      applet = $('#applet')[0];
      
      var i = 0;
      var loaded = function() {
        if (isActive(applet)) {
          App.trigger('loaded');
        } else {
          if (i > 120) {
            // We've been waiting for over 2 minutes, so the applet has
            // probably failed.
            App.trigger('failed');
          } else {
            i++;
            setTimeout(loaded, 1000);
          }
        }
      }
      
      loaded();
    });
  });
  
  
  App.bind("loaded", function() {
    ti.text("Starting...");
    App.loaded = true;
    App.reset();
    $('#applet-loader').trigger('overlay:disable');
    App.trigger('reload');
  });
  
  App.bind('reload', function() {
    var res = App.validate(ta.val());
    
    if (res.length) {
      ti.text("Syntax Error: " + res);
    } else {
      ti.text("Reloading...");
      App.reset();
      App.run(ta.val());
      App.run('TryCamping.boot');
      ti.text("Reloaded!");
    }
  
    $('#browser_base').text('http://localhost:' + App.port + '/');
    $("#browser_input").css("padding-left", $("#browser_base").width() + 12);
    
    $('.tab').trigger('tab:reload');
  });
});