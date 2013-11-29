/*!
 * jQuery hashhandle, v1, 2013-11-28
 * https://github.com/georgekosmidis/jquery-hashhandle
 * 
 * Copyright (c) 2013 George Kosmidis
 * Under GPL license
 * http://www.georgekosmidis.com
 * 
 * GitHub       - https://github.com/georgekosmidis/jquery-hashhandle
 * Source       - https://raw.github.com/georgekosmidis/jquery-hashhandle/master/jquery.hashhandle.js
 * (Minified)   - https://raw.github.com/georgekosmidis/jquery-hashhandle/master/jquery.hashhandle.min.js
 *
 * ****Methods****
 * convertURL: Mapping simulation, from _escaped_fragment_ format to #! format, actually redirects to hide ugly URL
 *             e.g.
 *             <head>...<script>$.fn.HashHandle('convertURL');</script>...</head>
 *             Redirects from http://.../?param1=value1&_escaped_fragment_=k1=v1&k2=v2 to http://.../?param1=value1#!k1=v1&k2=v2
 * hash      : Returns a collection of fragment keys in url fragment
 *             e.g.
 *             For url http://.../?param1=value1#!k1=v1&k2=v2 get p1 with
 *             var k1 =  $.fn.HashHandle("hash").k1;
 * add(k,v)  : Adds key/value to fragment, or changes existing key
 *             e.g.
 *             $.fn.HashHandle("add", "k1", "v1") will change url to 
 *             http://...#!k1=v1
 * add       : Binds an onlick event to the object and adds key/value fragment based on href attribute
 *             e.g.
 *             <a href='#!k2=v2'>...</a>
 *             $("a").HashHandle("add");
 *             Will convert url http://...#!k1=v1 to http://...#!k1=v1&k2=v2
 * remove    : Removes a key
 *             e.g.
 *             $.fn.HashHandle("remove", "k1");
 *             Will convert url http://...#!k1=v1 to http://...
 * clear     : Clears fragment
 *             e.g.
 *             $.fn.HashHandle("clear");
 *             Will convert url http://...#!k1=v1&k2=v2 to http://...
 *
 *
 * ****Example****
 * The following example also user the jquery hash-change plugin found here: http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 *<html>
 * <head>
 *  ...
 *  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
 *  <script src="http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.min.js"></script>
 *  <script src="https://github.com/georgekosmidis/hash-handle/raw/master/...."></script>
 *  <script>$.fn.HashHandle('convertURL');</script>
 *  <script>$(document).ready(function () { 
 *           $(".HashHandle").HashHandle('add');
 *          });
 *  </script>
 *    ...
 *  </head>
 *  <body> 
 *   ...
 *   <a href='#!filter=somefitler' class='HashHandle'>Change filtering</a>
 *   <a href='#!sort=somesorting' class='HashHandle'>Change sorting</a>
 *   <a href='#!'>Reset</a>
 *   <div id='table-that-needs-filtering-and-sorting'>...</div>
 *   ...
 *   <script>
 *    //hash change event
 *    $(window).hashchange(function (e) {
 *     var filter = $.fn.HashHandle("hash").filter;
 *     var sort = $.fn.HashHandle("hash").sort;
 *     if(filter != undefined || sort != undefined){
 *      $.get("/GET_DATA_FOR_DIV?filter=" + filter + "&sort="+sort, function (data) {
 *       $("#table-that-needs-filtering-and-sorting").html(data);
 *      });
 *     }
 *    });
 *    //trigger hash change on load
 *    $(window).hashchange();
 *   </script>
 *   ...
 *  </body>
 *</html>
 */


(function ($) {

    var methods = {
        //get params from location
        convertURL: function () {
            //https://developers.google.com/webmasters/ajax-crawling/docs/specification
            //Mapping from _escaped_fragment_ format to #! format
            var l = window.location.toString();

            if (l.indexOf("_escaped_fragment_=") > -1) {
                var a = l.split("_escaped_fragment_=");
                if (a[0].lastIndexOf("&") == a[0].length - 1)
                    a[0] = a[0].substr(0, a[0].length - 1);
                if (a[0].lastIndexOf("?") == a[0].length - 1)
                    a[0] = a[0].substr(0, a[0].length - 1);

                window.location = a[0] + "#!" + a[1];
            }

        },
        hash: function () {
            var a = methods["_fragment"].call(this, null);
            return a;
        },
        //add a new key=value hash or change an old one
        add: function (k, v) {
            //if add called without params, bind click 
            if (k == undefined) {
                return $(this).bind('click.HashHandle', function (event) { methods["_addHref"].call(this, event, $(this)); });
            }
            var a = methods["_fragment"].call(this, null);
            a[k] = v;
            return methods["_go"].call(this, a);
        },
        //clear hashes
        clear: function () {
            a = {};
            return methods["_go"].call(this, a);
        },
        //remove a hash entry by key
        remove: function (k) {
            var a = methods["_fragment"].call(this, null);
            delete a[k];
            return methods["_go"].call(this, a);
        },
        //add an href loc to hash
        _addHref: function (event, o) {
            event.preventDefault();
            var href = o.attr("href");
            if (href != "") {
                var a = methods["_fragment"].call(this, null);
                $.extend(a, methods["_fragment"].call(this, href));
                return methods["_go"].call(this, a);
            }
            return this;
        },
        //get fragment (everything after last #!)
        _fragment: function (url) {
            url = url || location.href;
            var af = url.split("#!");
            var f = (af.length > 1) ? af[af.length - 1] : "";
            var a = {};
            if (f != "") {
                var ap = f.split("&");
                for (var i in ap)
                    a[ap[i].split('=')[0]] = ap[i].split('=')[1];
            }
            return a;
        },
        //join collection
        _join: function (cl) {
            var a = [];
            for (var k in cl)
                a.push(k + '=' + cl[k]);
            return a.join('&');
        },
        //actually add hash to url
        _go: function (a) {
            var f = methods["_join"].call(this, a);
            window.location = "#!" + f;
            return this;
        },
        //instance
        _ctor: function () {
            return this;
        }
    };

    $.fn.HashHandle = function (method) {

        if (!methods[method])
            throw "Invalid method '" + method + "'";

        if (methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        //else if ( typeof method === "object" || !method ) 
        //	return methods._ctor.apply( this, arguments );

        return this;
    };

})(jQuery);