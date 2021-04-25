import {BluetoothDevice} from 'react-native-bluetooth-classic';
import {writePIDsToDevice} from '../../util';
import {parseOBDCommand} from '../obd/obdParser';
import {IObdResponse} from '../obd/obdTypes';

interface IQueryPIDParam {
  PID: string;
  delay: number;
}

export class OBDQueryService {
  private _canQueryOBD = false;
  private _lastQueriedTimestamps: {
    [pid: string]: number;
  } = {};

  constructor(
    private _queryParams: IQueryPIDParam[],
    private _device: BluetoothDevice,
  ) {}

  public subscribe(fn: (data: IObdResponse) => void) {
    this._canQueryOBD = true;

    const subscription = this._device.onDataReceived(data => {
      if (data.data.startsWith('>') || data.data === '\r') {
        return;
      }

      const parsedObdData = parseOBDCommand(data.data);
      this._lastQueriedTimestamps[parsedObdData.pid || '222'] = Date.now();
      fn(parsedObdData);
    });

    // eslint-disable-next-line consistent-this
    const self = this;
    Promise.resolve()
      .then(function resolver(): Promise<void> {
        return self._triggerQuery().then(resolver);
      })
      .catch(console.error);

    return {
      remove: () => {
        this._canQueryOBD = false;
        subscription.remove();
      },
    };
  }

  private _triggerQuery() {
    if (!this._canQueryOBD) {
      return Promise.reject();
    }

    const currentTimestamp = Date.now();
    const pidsToQuery = this._queryParams
      .filter(pid => {
        const lastQueriedTimestamp = this._lastQueriedTimestamps[pid.PID] || 0;
        const canQuery = currentTimestamp - lastQueriedTimestamp > pid.delay;
        return canQuery;
      })
      .map(item => item.PID);

    if (pidsToQuery.length === 0) {
      return Promise.reject();
    }

    return writePIDsToDevice(pidsToQuery, this._device, 50);
  }
}
