import {useEffect, useRef, useState} from 'react';
import Zeroconf from 'react-native-zeroconf';
import {promiseWithTimeout} from '../../util';
import {PIDS} from '../obd/obdInfo';
import {IObdResponse} from '../obd/obdTypes';
const httpBridge = require('react-native-http-bridge');

const useHostName = () => {
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
      } else {
        setHostname(null);
      }
    });
  }, []);

  return hostname;
};

const useDataListener = () => {
  const statelessAggregatedData = useRef<{[pid: string]: IObdResponse | null}>(
    {},
  );
  const [aggregatedData, setAggregatedData] = useState<{
    [pid: string]: IObdResponse | null;
  }>({});

  useEffect(() => {
    httpBridge.start(5564, 'http_server_middleware', (request: any) => {
      if (request.type === 'GET' && request.url === '/obd/get-data') {
        httpBridge.respond(
          request.requestId,
          200,
          'application/json',
          '{"message": "OK"}',
        );
      } else if (request.type === 'POST' && request.url === '/obd/save-data') {
        statelessAggregatedData.current = {
          ...statelessAggregatedData.current,
          ...request.postData,
        };
        setAggregatedData(statelessAggregatedData.current);
        httpBridge.respond(
          request.requestId,
          200,
          'application/json',
          '{"message": "OK"}',
        );
      } else {
        httpBridge.respond(
          request.requestId,
          400,
          'application/json',
          '{"message": "Bad Request"}',
        );
      }
    });

    return () => {
      httpBridge.stop();
    };
  }, []);

  return aggregatedData;
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

const useSampleData = () => {
  const hostname = useHostName();
  const aggregateOBDData = useRef<{[pid: string]: IObdResponse}>({});

  useEffect(() => {
    const interval = setInterval(() => {
      aggregateOBDData.current = {
        [PIDS.ENGINE_COOLANT_TEMPERATURE_SENSOR]: {
          name: 'temp',
          pid: PIDS.ENGINE_COOLANT_TEMPERATURE_SENSOR,
          unit: 'Celsius',
          value: Math.floor(Math.random() * 100).toString(),
        },
      };
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchRequest = () => {
      if (!hostname) {
        return Promise.reject('No hostname');
      }

      return fetch(`http://${hostname}/obd/save-data`, {
        method: 'POST',
        body: JSON.stringify(aggregateOBDData.current),
        headers: {
          'content-type': 'application/json',
        },
      });
    };

    let canBreak = false;

    Promise.resolve()
      .then(function recursiveHandle(): Promise<any> {
        if (canBreak) {
          return Promise.reject('Can break');
        }
        return promiseWithTimeout(5000, fetchRequest()).then(recursiveHandle);
      })
      .catch(console.error);

    return () => {
      canBreak = true;
    };
  }, [hostname]);
};

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (hostname) {
//         fetch(`http://${hostname}/obd/save-data`, {
//           method: 'POST',
//           body: JSON.stringify(aggregateOBDData.current),
//           headers: {
//             'content-type': 'application/json',
//           },
//         })
//           .then(_response => {
//             // console.log(response.status);
//           })
//           .catch(console.error);
//       }
//     }, 2000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [hostname]);
// };

export const hooks = {
  useSampleData,
  useHostName,
  useDataListener,
  useHttpGetRequestData,
};
