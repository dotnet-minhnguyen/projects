import 'core-js';
import { NgModule } from '@angular/core';
import AppComponent from './app.component';
import MandateAgreementComponent from "./madate-agreement/mandate-agreement.component";
import SettingsComponent from "./settings/settings.component";
import { AngularReactBrowserModule } from '@angular-react/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import {
  FabBreadcrumbModule,
  FabButtonModule,
  FabCalendarModule,
  FabCalloutModule,
  FabCheckboxModule,
  FabChoiceGroupModule,
  FabComboBoxModule,
  FabCommandBarModule,
  FabDatePickerModule,
  FabDetailsListModule,
  FabDialogModule,
  FabDividerModule,
  FabFabricModule,
  FabDropdownModule,
  FabGroupModule,
  FabGroupedListModule,
  FabHoverCardModule,
  FabIconModule,
  FabImageModule,
  FabLinkModule,
  FabMarqueeSelectionModule,
  FabMessageBarModule,
  FabModalModule,
  FabPanelModule,
  FabPersonaModule,
  FabPivotModule,
  FabSearchBoxModule,
  FabShimmerModule,
  FabSliderModule,
  FabSpinnerModule,
  FabToggleModule,
  FabTooltipModule,
  FabSpinButtonModule,
  FabTextFieldModule,
  FabPeoplePickerModule,
  FabTagPickerModule,
} from '@angular-react/fabric';
import LoginComponent from "./login/login.component";
import {AssetmaxDataService} from "../common/services/assetmax-data.service";
import {OfficeUtilsService} from "../common/services/office-utils.service";
import {ConfigService} from "../common/services/config.service";

@NgModule({
  declarations: [AppComponent, LoginComponent, MandateAgreementComponent, SettingsComponent],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AssetmaxDataService,
    CookieService,
    OfficeUtilsService,
    ConfigService
    // Other providers suppressed
  ],
  imports: [
    NgSelectModule,
    FormsModule,
    AngularReactBrowserModule,
    FabFabricModule,
    FabIconModule,
    FabButtonModule,
    FabDialogModule,
    FabImageModule,
    FabDropdownModule,
    FabPanelModule,
    FabCommandBarModule,
    FabBreadcrumbModule,
    FabCalloutModule,
    FabCheckboxModule,
    FabChoiceGroupModule,
    FabComboBoxModule,
    FabGroupedListModule,
    FabDatePickerModule,
    FabDividerModule,
    FabSpinnerModule,
    FabToggleModule,
    FabPersonaModule,
    FabPivotModule,
    FabLinkModule,
    FabMessageBarModule,
    FabHoverCardModule,
    FabModalModule,
    FabTooltipModule,
    FabShimmerModule,
    FabSliderModule,
    FabSearchBoxModule,
    FabCalendarModule,
    FabDetailsListModule,
    FabGroupModule,
    FabMarqueeSelectionModule,
    FabSpinButtonModule,
    FabTextFieldModule,
    FabPeoplePickerModule,
    FabTagPickerModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export default class AppModule {

  constructor() {
    initializeIcons();
  }

}
