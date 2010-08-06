$(function() {
  var gutter;
  
  $(".gutter").mousedown(function(evt) {
    gutter = {
      base: $(this),
      x: evt.screenX,
      y: evt.screenY
    };
    return false;
  });
  
  $(window).mouseup(function() { gutter = null });
  
  $(window).mousemove(function(evt) {
    if (gutter) {
      var x = gutter.base.hasClass("x");
      var i = x ? (evt.screenY - gutter.y) : (evt.screenX - gutter.x);
      var func = x ? adjust_x_sections : adjust_y_sections;
      
      func(gutter.base, i, function() {
        gutter.x = evt.screenX;
        gutter.y = evt.screenY;
        $(window).resize();
      });
    }
  });
  
  function adjust_x_sections(gutter, i, callback) {
    var first = gutter.prev(),
        last = gutter.next(),
        new_fh = first.height() + i,
        new_lh = last.height() - i;
    
    // The colums must be at least 70 pixels wide
    if (new_fh > 70 && new_lh > 70) {
      first.height(new_fh);
      last.height(new_lh);
      if (callback) { callback(); }
    }
  }
  
  function adjust_y_sections(gutter, i, callback) {
    var first = gutter.prev(),
        last = gutter.next(),
        new_fw = first.width() + i,
        new_lw = last.width() - i;
    
    if (new_fw > 200 && new_lw > 200) {
      first.width(new_fw);
      last.width(new_lw);
      if (callback) { callback() }
    }
  }
  
  $(".gutter.x").each(function() {
    var self = $(this);
    var s = self.siblings();
    var h = self.parent().height();
    s.height((h - self.height()) / s.length);
  });
  
  $(".gutter.y").each(function() {
    var self = $(this);
    var s = self.siblings();
    var h = self.parent().width();
    s.width((h - self.height()) / s.length);
  });

  $('#content').css('height', '66%');
  $('#progress').css('height', '33%');
  
  function resize_gutter_layout() {
    $(".gutter").each(function() {
      var gutter = $(this),
          first = gutter.prev(),
          last = gutter.next(),
          parent = gutter.parent(),
          attr = gutter.hasClass("x") ? "height" : "width";
      
      var inner = first[attr]() + gutter[attr]() + last[attr]();
      var outer = parent[attr]();
      first[attr](Math.floor(first[attr]() / inner * outer));
      last[attr](Math.floor(last[attr]() / inner * outer));
    });
  };
  
  var auto_height = [
    ["#workarea", window],
    ["#editor textarea"],
    ["#browser_content"],
    ["#irb"],
    ["#console"],
    ["#applet-loader"]
  ];
  
  function resize_auto_height() {
    $.each(auto_height, function(index, value) {
      var ele = $(value[0]);
      var sib = ele.siblings(":visible");
      var par = $(value[1] || ele.parent());
      var h = par.height();
      sib.each(function() {
        h -= $(this).outerHeight(true);
      })
      ele.css("height", h);
    });
  }
  
  function resizer() {
    resize_gutter_layout();
    resize_auto_height();
    var min_width = parseInt($("body").css("min-width"));
    var real_width = $(window).width();
    $("#workarea").width(Math.max(real_width, min_width));
  }
  
  $(window).resize(resizer)
  $(window).resize(resizer)
  $(window).resize();
});