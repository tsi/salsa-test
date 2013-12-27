/**
 * This script will watch files for changes and
 * automatically refresh the browser when a file is modified.
 *
 * Usage:
 *
 * - Include it:
 *   <script src="/js/fileWatcher.js"></script>
 *
 * - Call it from your script (or un-comment the call below):
 *   jQuery(document).ready(function() {
 *     jQuery(document).watch('/path/to/your/stylesheet.css');
 *   });
 *
 * - Un-watch (e.g. in you console):
 *   jQuery(document).trigger('unWatch');
 *
 */

(function($) {

  // // Modify the path to the watched file
  // // You can call watch() multiple times
  $(document).ready(function() {
    $(document).watch('/css/screen.css');
  });

  $.fn.extend({
    watch: function(url) {

      var dateModified, lastDateModified, init;

      var updateStyle = function(filename) {
        var headElm = $('head > link[href*="' + filename + '.css"]');
        var charSet = "abcdefghijklmnopqrstuvwxyz0123456789";
        var randChar = charSet.charAt(Math.floor(Math.random() * charSet.length));

        if (headElm.length > 0) {
          // If it's in a <link> tag
          headElm.attr('href', headElm.attr('href').replace(filename + '.css?', filename + '.css?' + randChar));
        } else {
          // If it's in an @import rule
          headElm = $("head > *:contains('" + filename + ".css')");
          headElm.html(headElm.html().replace(filename + '.css?', filename + '.css?' + randChar));
        }
      };

      // Check every second if the timestamp was modified
      var check = function(dateModified) {
        if (init === true && lastDateModified !== dateModified) {
          var filename = url.split('/');
          filename = filename[filename.length - 1].split('.');
          var fileExt = filename[1];
          filename = filename[0];
          if (fileExt === 'css') {
            // css file - update head
            updateStyle(filename);
          } else {
            // Reload the page
            document.location.reload(true);
          }
        }
        init = true;
        lastDateModified = dateModified;
      };

      var fileWatch = function(url) {
        $.ajax({
          url: url + '?' + Math.random(),
          type:"HEAD",
          error: function() {
            console.log('There was an error watching ' + url);
            clearInterval(watchInterval);
          },
          success:function(res,code,xhr) {
            check(xhr.getResponseHeader("Last-Modified"));
          }
        });
      };

      var watchInterval = window.setInterval(function() {
        fileWatch(url);
      }, 1000);

      $(document).bind('unWatch', function() {
        clearInterval(watchInterval);
      });

    }

  });

})(jQuery);
