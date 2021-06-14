import {Injectable} from '@angular/core';
import * as _ from 'lodash';

const settingsData = require('../../../../data/settings.json');


@Injectable()
export class ConfigService {

  private settings;

  saveSettings(settings?) {
    //save to json
    const settingsString = settings ? JSON.stringify(settings) : '';
    localStorage.setItem('pcb-settings', settingsString);
    return settingsString;
    //logout
  }

  getSettings() {
    let settings = settingsData;
    const localStorageSettings = JSON.parse(localStorage.getItem('pcb-settings'));
    if (localStorageSettings) {
      settings = settings || {};
      settings = Object.assign(settings, localStorageSettings)
    }
    return settings;
  }

  getApiUrl() {

  }

}