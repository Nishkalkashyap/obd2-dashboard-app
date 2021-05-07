import React from 'react';
import {Colors, colors as initialColors} from '../../util';

export class ThemeProvider {
  private _initialColors: Colors = JSON.parse(JSON.stringify(initialColors));

  public get colors() {
    return this._initialColors;
  }

  private _handlers: Function[] = [];
  public onDidChangeColors(handler: Function) {
    this._handlers.push(handler);
    return {
      remove: () => {
        this._handlers = this._handlers.filter(item => item !== handler);
      },
    };
  }

  constructor() {
    setTimeout(() => {
      this._initialColors.primary.color = '#ff0000';
    }, 5000);
  }
}

export const ThemeContext = React.createContext<ThemeProvider>(null as any);
