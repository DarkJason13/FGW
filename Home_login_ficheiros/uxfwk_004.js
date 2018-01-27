define('uxfwk.session.loader', ['uxfwk', 'angularAMD'], function (uxfwk, angularAMD){
      var service = {};
      var compiledLanguage = 'PT';
      var data = {
         model:               'GR241AG',
         is5GHzWifiSupported: !!('2' == '2'),
         language:            'pt-PT'
      }
      console.warn("SESSIONLOADER::compiledLanguage", compiledLanguage);
      switch ( compiledLanguage ){
         case 'PT': data.language = 'pt-PT'; break;
         case 'EN': data.language = 'en'; break;
      }

      return function (cbSuccess, cbError){
         //[#] Check both arguments for Type Error
         if ( !angular.isFunction(cbSuccess) ){
            throw new TypeError('Argument [cbSuccess] is mandatory and it must be a function');
         }
         if ( cbError && !angular.isFunction(cbError) ){
            throw new TypeError('Argument [cbError] is optional and when provided, must be a function');
         }

         //[#] Since this module is interpolated on server side, it just calls cbSuccess
         return cbSuccess(data);
      };// endof constructor
});
