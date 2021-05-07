import {useEffect, useRef, useState} from 'react';
import Zeroconf from 'react-native-zeroconf';
import {promiseWithTimeout} from '../../util';
import {IObdResponse} from '../obd/obdTypes';
import {ThemeProvider} from '../services/theme-provider.service';
import {helpers} from './helpers';
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
  } | null>(null);

  useEffect(() => {
    setTimeout(() => {
      httpBridge.start(5564, 'http_server_middleware', (request: any) => {
        if (request.type === 'GET' && request.url === '/obd/get-data') {
          httpBridge.respond(
            request.requestId,
            200,
            'application/json',
            '{"message": "OK"}',
          );
        } else if (
          request.type === 'POST' &&
          request.url === '/obd/save-data'
        ) {
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
    }, 5000);

    return () => {
      try {
        if (process.env.NODE_ENV !== 'development') {
          httpBridge.stop();
        }
      } catch (err) {
        console.error('Failed to stop bridge');
      }
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

const useObdFetchRequest = () => {
  const hostname = useHostName();
  const aggregateOBDData = useRef<{[pid: string]: IObdResponse}>({});

  useEffect(() => {
    let prevData: null | string = null;
    const fetchRequest = () => {
      if (!hostname) {
        return Promise.reject('No hostname');
      }

      /**
       * Check if data is same as before
       */
      const currentData = JSON.stringify(aggregateOBDData.current);
      if (prevData === currentData) {
        return promiseWithTimeout(
          100,
          new Promise((resolve: any) => {
            setTimeout(() => {
              resolve();
            }, 50);
          }),
        );
      }

      prevData = JSON.stringify(aggregateOBDData.current);
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

  return aggregateOBDData;
};

const useSampleData = () => {
  const aggregateOBDData = useObdFetchRequest();

  useEffect(() => {
    const interval = setInterval(() => {
      aggregateOBDData.current = helpers.getSampleData();
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [aggregateOBDData]);
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

const useColors = (theme?: ThemeProvider) => {
  const [colors, setColors] = useState(theme?.currentColors!);

  useEffect(() => {
    const listener = theme?.onDidChangeColors(color => {
      setColors(color);
    });
    return () => {
      listener?.remove();
    };
  }, [theme]);

  return colors;
};

export const hooks = {
  useColors,
  useObdFetchRequest,
  useSampleData,
  useHostName,
  useDataListener,
  useHttpGetRequestData,
};
