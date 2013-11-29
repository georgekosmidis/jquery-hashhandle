jQuery Hash Handle
===========
Handling URL fragment to enable search engines crawling (google basically). 
Based on https://developers.google.com/webmasters/ajax-crawling/


##Methods

```code
convertURL : Mapping simulation, from _escaped_fragment_ format to #! format, actually redirects
             e.g.
             &lt;head>...<script>$.fn.HashHandle('convertURL');</script>...</head>
             Redirects from http://.../?param1=value1&_escaped_fragment_=k1=v1&k2=v2 to http://.../?param1=value1#!k1=v1&k2=v2
```
```code
 hash      : Returns a collection of fragment keys in url fragment
             e.g.
             For url http://.../?param1=value1#!k1=v1&k2=v2 get p1 with
             var k1 =  $.fn.HashHandle("hash").k1;
```
```code
 add(k,v)  : Adds key/value to fragment, or changes existing key
             e.g.
             $.fn.HashHandle("add", "k1", "v1") will change url to 
             http://...#!k1=v1
```
```code             
 add       : Binds an onlick event to the object and adds key/value fragment based on href attribute
             e.g.
             <a href='#!k2=v2'>...</a>
             $("a").HashHandle("add");
             Will convert url http://...#!k1=v1 to http://...#!k1=v1&k2=v2
```
```code             
 remove    : Removes a key
             e.g.
             $.fn.HashHandle("remove", "k1");
             Will convert url http://...#!k1=v1 to http://...
```
```code             
 clear     : Clears fragment
             e.g.
             $.fn.HashHandle("clear");
             Will convert url http://...#!k1=v1&k2=v2 to http://...
```

##Example
 The following example also uses the jquery hash-change plugin found here: http://benalman.com/projects/jquery-hashchange-plugin/
 UPDATE: Ben stopped the updates of hashchange plugin, a forked version with a jQuery bug corrected is https://github.com/georgekosmidis/jquery-hashchange
```html
<html>
 <head>
  ...
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
  <script src="https://raw.github.com/georgekosmidis/jquery-hashchange/master/jquery.hashhandle.min.js"></script>
  <script src="https://raw.github.com/georgekosmidis/jquery-hashchange/master/jquery.hashchange.min.js"></script>
  <script>$.fn.HashHandle('convertURL');</script>
  <script>$(document).ready(function () { 
           $(".HashHandle").HashHandle('add');
          });
  </script>
    ...
  </head>
  <body> 
   ...
   <a href='#!filter=somefitler' class='HashHandle'>Change filtering</a>
   <a href='#!sort=somesorting' class='HashHandle'>Change sorting</a>
   <a href='#!'>Reset</a>
   <div id='table-that-needs-filtering-and-sorting'>...</div>
   ...
   <script>
    //hash change event
    $(window).hashchange(function (e) {
     var filter = $.fn.HashHandle("hash").filter;
     var sort = $.fn.HashHandle("hash").sort;
     if(filter != undefined || sort != undefined){
      $.get("/GET_DATA_FOR_DIV?filter=" + filter + "&sort="+sort, function (data) {
       $("#table-that-needs-filtering-and-sorting").html(data);
      });
     }
    });
    //trigger hash change on load
    $(window).hashchange();
   </script>
   ...
  </body>
</html>
```
