import { dark, light, ThemeMode } from '../assets/themes/themes';
import { makeAutoObservable } from 'mobx';

class Theme {
	private _get: typeof light = light;
	private _mode: ThemeMode = ThemeMode.light;

	public constructor() {
		makeAutoObservable(this);
	}

	public get get(): typeof light {
		return this._get;
	}

	public get mode(): ThemeMode {
		return this._mode;
	}

	public setMode = (mode: ThemeMode) => {
		this._get = mode === ThemeMode.light ? light : dark;
		this._mode = mode;
	}

	public toggle = () => {
		if (this._mode === ThemeMode.light) {
			this.setMode(ThemeMode.dark);
		} else {
			this.setMode(ThemeMode.light);
		}
	}

	public get palette() {
		return this._get.palette;
	}

	public get zIndex() {
		return this._get.zIndex;
	}

	public get breakpoints() {
		return this._get.breakpoints;
	}

	public get typography() {
		return this._get.typography;
	}
}

export default new Theme();
