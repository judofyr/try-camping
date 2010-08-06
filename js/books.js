$(function() {
  var current_page = 0;
  var title;
  var area = $("#tutorial_content");
  function $$(s) { return $(s, area) };
  
  $.get('books/introduction.html', function(data) {
    App.trigger('book:loaded', [data]);
  });
  
  App.bind('book:loaded', function(evt, data) {
    area.empty().append(data);
    title = $$('h1').remove().text();
    App.trigger('book:page', [0]);
  });
  
  App.bind('book:page', function(evt, page) {
    var pages = $$('.page');
    var visible = pages.filter(':visible');
    var show = function() {
      setTimeout(function() {
        pages.eq(page).show("fast");
        App.trigger('progress:load');
      }, 50);
    };
    
    if (visible.length) {
      visible.hide("fast", show);
    } else {
      show();
    }
  });
  
  App.bind('book:page:next', function() {
    var next_page = $$('.page:visible').index('.page') + 1;
    App.trigger('book:page', [next_page]);
  });
  
  App.bind('progress:load', function() {
    var list = $('#progress_list');
    var tasks = $('.page:visible').nextUntil('.page');
    
    $('#progress .loading').remove();
    list.empty();
    
    tasks.each(function() {
      var task = $(this);
      var li = $('<li>');
      var link = $('<a href="#"/>');
      link.text(task.find('h2').text());
      link.appendTo(li);
      li.appendTo(list);
      
      task.find('textarea').each(function() {
        var script = $(this);
        if (script.attr('class') == "tc/js") {
          var onload = function(){};
          
          eval(script.val());
          
          onload(function(thing) {
            li.attr("class", thing);
          });
        }
      });
    });
  });
});