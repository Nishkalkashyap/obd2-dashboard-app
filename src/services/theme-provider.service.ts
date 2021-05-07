import React from 'react';
import {Colors, colors as initialColors} from '../../util';

type DerivedColors = {
  backgroundColor: string;
  textColor: string;
};
type ExtendedColors = Colors & DerivedColors;
type ThemeHandler = (colors: ExtendedColors) => void;
type Themes = 'red' | 'blue' | 'green';
export class ThemeProvider {
  private _defaultDerivedColors: DerivedColors = {
    backgroundColor: '#ffffff',
    textColor: '#000000',
  };

  private _deaultColors: ExtendedColors = JSON.parse(
    JSON.stringify({...initialColors, ...this._defaultDerivedColors}),
  );

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

  private _getThemeFromType = (
    themeType: 'red' | 'blue' | 'green',
  ): ExtendedColors => {
    const proxiedColors: Colors = JSON.parse(
      JSON.stringify(this._deaultColors),
    );
    const extendedColors: ExtendedColors = {
      ...proxiedColors,
      backgroundColor: '#ffffff',
      textColor: '#000000',
    };

    if (themeType === 'red') {
      extendedColors.primary.color = '#ff0000';
    }
    if (themeType === 'blue') {
      extendedColors.primary.color = '#0000ff';
    }
    if (themeType === 'green') {
      extendedColors.primary.color = '#00ff00';
    }
    return extendedColors;
  };

  public changeTheme() {
    const nextTheme = this._getThemeFromType(this._getNextTheme());
    this._handlers.forEach(handler => {
      handler(nextTheme);
    });
  }
}

export const ThemeContext = React.createContext<ThemeProvider>(null as any);
