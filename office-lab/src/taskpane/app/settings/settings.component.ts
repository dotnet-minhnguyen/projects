import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IDialogProps, IMessageBarProps, MessageBarType} from "office-ui-fabric-react";
import {AssetmaxDataService} from "../../common/services/assetmax-data.service";
import {ConfigService} from "../../common/services/config.service";
const template = require('./settings.component.html');
const settingsData = require('../../../../data/settings.json');

@Component({
  selector: 'settings-tab',
  template
})
export default class SettingsComponent implements OnInit {
  @Input() url: string;
  @Output() urlChange: EventEmitter<string> = new EventEmitter<string>();
  settings;

  constructor(private assetmaxDataService: AssetmaxDataService, private configService: ConfigService) {

  }

  ngOnInit(): void {
    this.settings = this.configService.getSettings();
  }

  setApiUrl(value) {
    this.settings.apiUrl = value && value.newValue;
  }

  saveSettings(settings?) {
    //save to json
    return this.configService.saveSettings(this.settings);
  }

  resetSettings() {
    this.settings = this.configService.getSettings();
    //read settings from data/settings.json
  }
}
