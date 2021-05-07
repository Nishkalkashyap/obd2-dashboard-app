import React from 'react';
import {colors, Colors, colors as initialColors} from '../../util';

type DerivedColors = {
  themeType: 'light' | 'dark';
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
    themeType: 'light',
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

  private _defaultColors: ExtendedThemeColors = JSON.parse(
    JSON.stringify({...initialColors, ...this._defaultDerivedColors}),
  );
  private _currentColors: ExtendedThemeColors = JSON.parse(
    JSON.stringify({...initialColors, ...this._defaultDerivedColors}),
  );

  public get currentColors() {
    return this._currentColors;
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
  private _themes: Themes[] = ['light', 'dark'];

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
    let extendedColors: ExtendedThemeColors = JSON.parse(
      JSON.stringify(this._defaultColors),
    );

    if (themeType === 'light') {
      // do nothing
    }
    if (themeType === 'dark') {
      extendedColors.themeType = 'dark';
      extendedColors.textColor = '#ffffff';
      extendedColors.backgroundColor = '#000000';
    }
    if (themeType === 'red') {
      const danger: Colors['danger'] = {
        color: '#D40000',
        shade: '#D40000',
        tint: '#D40000',
      };

      extendedColors = {
        ...extendedColors,
        primary: danger,
        backgroundColor: '#ffffff',
        textColor: '#D40000',
        shiftLights: {
          restingColor: colors.medium.color,
          lowColor: colors.light,
          midColor: danger,
          highColor: colors.success,
        },
        rpmIndicator: {
          baseColor: colors.light,
          lowColor: colors.light,
          midColor: danger,
          highColor: colors.success,
          extremeColor: colors.dark,
        },
      };
    }
    return extendedColors;
  };

  public changeTheme() {
    const nextTheme = this._getThemeFromType(this._getNextTheme());
    this._handlers.forEach(handler => {
      handler(nextTheme);
    });
  }

  constructor() {
    this._currentColors = this._getThemeFromType(this._currentTheme);
  }
}

export const ThemeContext = React.createContext<ThemeProvider>(null as any);
