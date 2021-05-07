import React from 'react';
import {Colors, colors as initialColors} from '../../util';

type ThemeHandler = (colors: Colors) => void;
type Themes = 'red' | 'blue' | 'green';
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

  private _currentTheme: Themes = 'red';
  private _themes: Themes[] = ['red', 'blue', 'green'];

  private _getNextTheme() {
    const currentThemeIndex = this._themes.findIndex(
      item => item === this._currentTheme,
    );
    const totalNumberOfThemes = this._themes.length;
    if (currentThemeIndex === totalNumberOfThemes - 1) {
      this._currentTheme = this._themes[0];
      return this._currentTheme;
    }

    this._currentTheme = this._themes[currentThemeIndex + 1];
    return this._currentTheme;
  }

  private _getThemeFromType = (themeType: 'red' | 'blue' | 'green') => {
    const proxiedColors: Colors = JSON.parse(
      JSON.stringify(this._deaultColors),
    );
    if (themeType === 'red') {
      proxiedColors.primary.color = '#ff0000';
    }
    if (themeType === 'blue') {
      proxiedColors.primary.color = '#0000ff';
    }
    if (themeType === 'green') {
      proxiedColors.primary.color = '#00ff00';
    }
    return proxiedColors;
  };

  public changeTheme() {
    const nextTheme = this._getThemeFromType(this._getNextTheme());
    this._handlers.forEach(handler => {
      handler(nextTheme);
    });
  }
}

export const ThemeContext = React.createContext<ThemeProvider>(null as any);
