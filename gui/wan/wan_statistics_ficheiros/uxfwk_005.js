define('uxfwk.string', [], function(){
   'use strict';
/** 
 * @name Uxfwk::Extension::String 
 * @description 
 *    The following methods were imported from many places across internet while others were produced internally.
 * Source information is mandatory (specially when license is envolved)
 * */

if ( !String.prototype.camelcase ){
/**
 * @name String::camelcase
 * @author Nuno Farinha
 * @description 
 *    Convert any hifen, space or dot separated phrase to a single word in camel case (first letter is preserved)
 * @example 
 * the following code<pre>
 *    "ola mundo".camelcase();
 *    "ola-mundo".camelcase();
 *    "ola.mundo".camelcase();
 * </pre>will produce string "olaMundo";
 * @license 
 *    No license required (internal production)
 */
String.prototype.camelcase = function string_camelcase (){ "use strict";
   return this.replace(/-/g,'.').replace(/( |\.[a-z])/g, function($1){return $1.toUpperCase().replace(/ |\./,'');});


   var re = /\.| |-([a-z])/;
   var str = this;

   while ( re.test(str) ){str = str.replace(re, str.match(re)[0].toUpperCase())}
   str = str.replace(/\.|-/g, '');
   return str;
};};
String.prototype.camelCase = function (){ "use strict";
   return this.replace(/-/g,'.').replace(/( |\.[a-z])/g, function($1){return $1.toUpperCase().replace(/ |\./,'');});
};
String.prototype.toDash = function (){"use strict";
	return this.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
};
String.prototype.dashCase = function (){"use strict";
	return this.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
};

if ( !String.prototype.supplant ){
/**
 * @name String::supplant 
 * @url http://javascript.crockford.com/remedial.html 
 * @author Douglas Crockford 
 * @description 
 *    A more widelly alternative to old method 'String::sprintf'.
 * @example 
 * the following code<pre>
 *    "{0} - {1}".supplant([1, 2]);
 * </pre>will produce string "1 - 2";
 * @license 
 *    No license required (direct copy/paste from URL)
 */
String.prototype.supplant = function string_supplant (o){ "use strict";
   return this.replace(/\{([^{}]*)\}/g, function (a, b){ "use strict";
      var r = o[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
   });
};
String.prototype.sprintf = function string_sprintf (){ "use strict";
   return this.supplant(arguments);
};};



if ( !String.prototype.padding ){
String.prototype.padding = function string_padding (length, token, left1right2){
   var lenr = 0, lenl = 0, len = this.length, str = "", value = this;

   length      = length || 0;
   token       = token || " ";
   left1right2 = (left1right2 || 1) & 0x03;
   if ( 1 == left1right2 ){
      lenl = length - len;
   }else if ( 2 == left1right2 ){
      lenr = length - len;
   }else if ( 3 == left1right2 ){
      lenl = ~~((length - len)/2);
      lenr = length - (len + lenl);
   }
   str = ""; while ( str.length < lenl ) str += token;
   value  = str.substr(0, lenl) + value;
   str = ""; while ( str.length < lenr ) str += token;
   value += str.substr(0, lenr);
   return value;
};};

if ( !String.prototype.trim ){
/**
 * @name String::trim
 * @author Carlos Carvalhal 
 * @description 
 *    Remove any whitespace characters from begin and end of string
 * @license 
 *    No license required (internal production)
 */
String.prototype.trim = function string_trim (){
   // As expressões regulares são bastante eficientes na "pesquisa" por padrões no início das strings mas,
   // ineficientes na "pesquisa" por padrões no final das strings, principalmete se as strings forem muito longas
   // e se a quantidade de caracteres a substituir no final da string for grande. Por isso, foi escolhida uma
   // solução mista. Para simplificar a identificação dos caracteres da categoria "whitespace", optei por usar
   // uma expressão regular.
   var targetString = this.replace(/^\s+/, ""), lastNonWhitespaceChar = targetString.length - 1, whitespaceRegExpr = /\s/;

   while ( whitespaceRegExpr.test(targetString.charAt(lastNonWhitespaceChar)) ){
      lastNonWhitespaceChar--;
   }
   return targetString.slice(0, lastNonWhitespaceChar + 1);
};};



if ( !String.prototype.properCase ){
/**
 * @name String::properCase
 * @author nuno-r-farinha
 * @description
 *    Make proper case
 * @license 
 *    No license required (internal production)
 */
String.prototype.properCase = function (){
   var str = this, re = / |^([a-z])/;

   while ( re.test(str) ){str = str.replace(re, str.match(re)[0].toUpperCase())}
   return str;
};};


});
