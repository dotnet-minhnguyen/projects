/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
import 'zone.js'; // Required for Angular
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'office-ui-fabric-core/dist/css/fabric.min.css';
import '@ng-select/ng-select/themes/default.theme.css';
import '@microsoft/office-js-helpers/dist/office.helpers.js';
import 'lodash/lodash.js'
import AppModule from './app/app.module';

Office.initialize = reason => {
    document.getElementById('sideload-msg').style.display = 'none';

    // Bootstrap the app
    platformBrowserDynamic().bootstrapModule(AppModule).catch(error => console.error(error));
};