import React from 'react';
import {Colors, colors as initialColors} from '../../util';

type ThemeHandler = (colors: Colors) => void;
export class ThemeProvider {
  private _deaultColors: Colors = JSON.parse(JSON.stringify(initialColors));

  public get defaultColors() {
    return this._deaultColors;
  }

  private _handlers: ThemeHandler[] = [];
  public onDidChangeColors(handler: ThemeHandler) {
    this._handlers.push(handler);
    return {
      remove: () => {
        this._handlers = this._handlers.filter(item => item !== handler);
      },
    };
  }

  public changeTheme() {
    console.log('Change theme called');
    const proxiedColors: Colors = JSON.parse(
      JSON.stringify(this._deaultColors),
    );
    proxiedColors.primary.color = '#ff00ff';
    this._handlers.forEach(handler => {
      handler(proxiedColors);
    });
  }
}

export const ThemeContext = React.createContext<ThemeProvider>(null as any);
