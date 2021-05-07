import React from 'react';
import {colors, Colors, colors as initialColors} from '../../util';

type DerivedColors = {
  backgroundColor: string;
  textColor: string;
  shiftLights: {
    restingColor: string;
    lowColor: Colors['danger'];
    midColor: Colors['danger'];
    highColor: Colors['danger'];
  };
  rpmIndicator: {
    baseColor: Colors['danger'];
    lowColor: Colors['danger'];
    midColor: Colors['danger'];
    highColor: Colors['danger'];
    extremeColor: Colors['danger'];
  };
};
export type ExtendedThemeColors = Colors & DerivedColors;
type ThemeHandler = (colors: ExtendedThemeColors) => void;
type Themes = 'light' | 'dark' | 'red';
export class ThemeProvider {
  private _defaultDerivedColors: DerivedColors = {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    shiftLights: {
      restingColor: colors.medium.color,
      lowColor: colors.success,
      midColor: colors.danger,
      highColor: colors.secondary,
    },
    rpmIndicator: {
      baseColor: colors.primary,
      lowColor: colors.secondary,
      midColor: colors.success,
      highColor: colors.warn,
      extremeColor: colors.tertiary,
    },
  };

  private _deaultColors: ExtendedThemeColors = JSON.parse(
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

  private _currentTheme: Themes = 'light';
  private _themes: Themes[] = ['light', 'dark', 'red'];

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

  private _getThemeFromType = (themeType: Themes): ExtendedThemeColors => {
    const proxiedColors: Colors = JSON.parse(
      JSON.stringify(this._deaultColors),
    );
    const extendedColors: ExtendedThemeColors = {
      ...proxiedColors,
      ...this._defaultDerivedColors,
    };

    if (themeType === 'light') {
      // extendedColors.primary.color = '#0000ff';
    }
    if (themeType === 'dark') {
      extendedColors.textColor = '#ffffff';
      extendedColors.backgroundColor = '#000000';
    }
    if (themeType === 'red') {
      extendedColors.textColor = '#ffffff';
      extendedColors.backgroundColor = '#D40000';
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
