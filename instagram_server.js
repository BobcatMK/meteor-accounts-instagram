Instagram = {};

Oauth.registerService('instagram', 2, null, function(query) {

  var response = getTokenResponse(query);
  var accessToken = response.access_token;
  var identity = response.user;

  var serviceData = _.extend(identity, {accessToken: response.access_token});

  return {
    serviceData: serviceData,
    options: {
      profile: { name: identity.full_name },
      services: { instagram: identity }
    }
  };
});

var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'instagram'});

  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.post(
      "https://api.instagram.com/oauth/access_token", {
        params: {
          code: query.code,
          client_id: config.clientId,
          redirect_uri: OAuth._redirectUri("instagram", config),
          client_secret: OAuth.openSecret(config.secret),
          grant_type: 'authorization_code'
        }
      });

    console.warn('LOGGING RESPONSE FROM THE INSTAGRAM ------------------->', response);
    console.warn('<-------------------------- END LOGGING RESPONSE');
    console.log('LOGGING RESPONSE FROM THE INSTAGRAM ------------------->', response);
    console.log('<-------------------------- END LOGGING RESPONSE');

    if (response.error) // if the http response was an error
        throw response.error;
    if (typeof response.content === "string")
        response.content = JSON.parse(response.content);
    if (response.content.error)
        throw response.content;
  } catch (err) {
    console.log('throwing error -------------->', err);
    console.log('<-------------------------- end throwing error');
    console.warn('respone -------------->', response);
    console.warn('<-------------------------- end response');
    throw _.extend(new Error("Failed to complete OAuth handshake with Instagram. " + err.message),
                   {response: err.response});
  }

  return response.content;
};

Instagram.retrieveCredential = function(credentialToken, credentialSecret) {
  return Oauth.retrieveCredential(credentialToken, credentialSecret);
};
