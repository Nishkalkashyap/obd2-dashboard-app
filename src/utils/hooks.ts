import {useEffect, useState} from 'react';
import Zeroconf from 'react-native-zeroconf';
import {IObdResponse} from '../obd/obdTypes';

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

const useHttpGetRequestData = () => {
  const [hostname, setHostname] = useState<null | string>(null);
  const [data, setData] = useState<{[pid: string]: IObdResponse} | null>(null);

  useEffect(() => {
    const zeroconf = new Zeroconf();
    zeroconf.scan('http', 'tcp');
    zeroconf.on('error', err => {
      console.error(err);
    });

    zeroconf.on('update', () => {
      const services = zeroconf.getServices();
      const http_server_middleware = services.http_server_middleware;
      console.log(http_server_middleware);
      if (http_server_middleware && http_server_middleware.host) {
        const iosFilteredOs = http_server_middleware.host.replace(
          '.local.',
          '.local',
        ); // host has extra \. appended at end: e.g. MacBook-Pro-136.local.
        setHostname(`${iosFilteredOs}:${http_server_middleware.port}`);
      }
    });
  }, []);

  useEffect(() => {
    if (!hostname) {
      return;
    }

    console.log(`http://${hostname}/obd/get-data`);
    const interval = setInterval(() => {
      fetch(`http://${hostname}/obd/get-data`, {
        method: 'GET',
      })
        .then(response => {
          return response.json();
        })
        .then(response => {
          setData(response);
        })
        .catch(console.error);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [hostname]);

  return data;
};

export const hooks = {
  useHttpClient,
  useHttpGetRequestData,
};
