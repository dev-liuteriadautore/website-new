const Translate = require ('@vitalets/google-translate-api');
const Tunnel = require ('tunnel');

function getTranslation (input, fromLang, toLang) {
  (async () => {
    try {
      const res = await Translate (`${input}`, {
        from: `${fromLang}`,
        to: `${toLang}`,
        agent: Tunnel.httpsOverHttp ({
          proxy: {
            host: '138.68.60.8',
            proxyAuth: 'user:pass',
            port: '8080',
            headers: {
              'User-Agent': 'Node',
            },
          },
        }),
      });
      console.log (res.text);
    } catch (error) {
      console.log (error);
    }
  }) ();
}

exports.getTranslation = getTranslation;
