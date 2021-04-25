import {useEffect, useState} from 'react';
import Zeroconf from 'react-native-zeroconf';

const useHttpClient = () => {
  const [hostname, setHostname] = useState<null | string>(null);

  useEffect(() => {
    const zeroconf = new Zeroconf();
    zeroconf.scan('http', 'tcp');

    zeroconf.on('update', () => {
      const services = zeroconf.getServices();
      const http_server_middleware = services.http_server_middleware;
      if (http_server_middleware && http_server_middleware.host) {
        setHostname(
          `${http_server_middleware.host}:${http_server_middleware.port}`,
        );
      }
    });
  }, []);

  return {
    postData: (data: string) => {
      fetch(`http://${hostname}/obd/save-data`, {
        method: 'POST',
        body: data,
        headers: {
          'content-type': 'application/json',
        },
      }).catch(console.error);
    },
  };
};

export const hooks = {
  useHttpClient,
};
