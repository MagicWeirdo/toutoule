module.exports = function($validator, $authService, req, res) {
  /**
   * @public
   * @param {String} type
   * @param {Function} callback
   * @desc
   * authenticate request
  **/
  req.doAuth = function(type, callback) {
    // get apiToken
    var data = {
      token: req.headers.authorization,
      type: type
    };

    // register validations
    $validator.required("token", "密匙不能为空");
    $validator.notEmptyString("token", "密匙不能为空");

    // do validation
    $validator.validate(data, function(err) {
      if(err) {
        res.sendAsJson(400, {
          isError: true,
          errorMessage: err.msg,
          result: ""
        });
      }else {
        $authService.verify(data, function(err) {
          if(err) {
            res.sendAsJson(401, {
              isError: true,
              errorMessage: err,
              result: ""
            });
          }else {
            // get the user
            $authService.getUser(data.token, function(username) {
              callback(username);
            });
          }
        });
      }
    });
  }
};
