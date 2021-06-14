import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IDialogProps, IMessageBarProps, MessageBarType} from "office-ui-fabric-react";
import {AssetmaxDataService} from "../../common/services/assetmax-data.service";
const template = require('./login.component.html');
@Component({
  selector: 'login-dialog',
  template
})
export default class LoginComponent implements OnInit {

  constructor(private assetmaxDataService: AssetmaxDataService) {
  }

  private loginResult: any = '';
  private loginProps: IDialogProps = {
    title: 'Login to Assetmax',
    onDismiss: () => {
      this.closeLoginDialog();
    }
  };

  private messageBarErrorProps: IMessageBarProps = {
    messageBarType: MessageBarType.error,
  }

  @Output() public onLoginSuccess: EventEmitter<any> = new EventEmitter();
  @Output() public onLoginCancel: EventEmitter<any> = new EventEmitter();

  @Input() username: string;
  @Output() usernameChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() password: string;
  @Output() passwordChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() vaultKey: string;
  @Output() vaultKeyChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() dialogHidden: boolean;

  ngOnInit(): void {
    this.username = 'a.vonmentlen@etops.ch';
    this.password = 'etops!assetmax';
    this.vaultKey = 't135bQ7tBGHMza5PWXPK';
  }

  setUsername(value) {
    this.username = value.newValue;
  }

  setPassword(value) {
    this.password = value.newValue;
  }

  setVaultKey(value) {
    this.vaultKey = value.newValue;
  }

  closeLoginDialog(){
    this.dialogHidden = true;
    this.onLoginCancel.emit();
  }

  login() {
    this.loginResult = undefined;
    this.assetmaxDataService.login(this.username, this.password, this.vaultKey).then((response) => {
      this.loginResult = response;
      this.onLoginSuccess.emit();
    }, (err) => {
      this.loginResult = err;
    })
  }

}
