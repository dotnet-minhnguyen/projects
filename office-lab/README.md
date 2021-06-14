# Office-Addin-TaskPane-Angular
 
This repository contains the source code used by the [Yo Office generator](https://github.com/OfficeDev/generator-office) when you create a new Office Add-in that appears in the task pane. 

## Instalation

Check if you have a compatible node.js version. This project is working fine on node `v8.11.4`

To install the application type: 
   > npm i

## Starting the application

To start the application type: 
   > npm start

Other useful commands are available in `package.json` file in the root directory.

## TypeScript

This template is written using [TypeScript](http://www.typescriptlang.org/). For the JavaScript version of this template, go to [Office-Addin-TaskPane-Angular-JS](https://github.com/OfficeDev/Office-Addin-TaskPane-Angular-JS).

## Debugging

This template supports debugging using any of the following techniques:

- [Use a browser's developer tools](https://docs.microsoft.com/office/dev/add-ins/testing/debug-add-ins-in-office-online)
- [Attach a debugger from the task pane](https://docs.microsoft.com/office/dev/add-ins/testing/attach-debugger-from-task-pane)
- [Use F12 developer tools on Windows 10](https://docs.microsoft.com/office/dev/add-ins/testing/debug-add-ins-using-f12-developer-tools-on-windows-10)
  
> Important note - to use Microsoft Edge DevTools (which is probably the most convenient way of debugging on Windows 10) you need an updated Windows version, which is at least `v1903`.

## Bundling

To bundle the project you need to do following steps:
1. Make sure your manifest_prod file has URLs pointing into the right web server.

2. Execute command:
    > npm run build
    
    It will generate a dist folder with all the files required to run the add-in independently. 
    It consist also of word templates and `dev` and `prod` versions of manifest file (to be able to run it locally
    and in the target environment.
   
3. Verify your bundle is working (paths etc.) by starting a web server like this (in root project directory): 
    > http-server ./dist -p 3000 -S
                                                                                                       
    You may need to install `http-server` first with:
    > npm i -g http-server
    
    In certain situations it may be required to go to `https://127.0.0.1/taskpane.html`
    in the browser to trust the certificate used by this add in. A potential fix would be to use a certificate trusted by one of major Certificate Authorities or generte a `let's encrypt` certificate every few months.
    
4. It's always good to check if your manifest.xml is still valid by running:
    > npm run validate
5. You may have issues with bundling this project in case of not enough memory for node process.
This may be a way to go: https://www.npmjs.com/package/increase-memory-limit
6. There may be a path issue to office.js dependency in the bundle, which is located under `/assets` folder (this location is both - in bundled and unbundled source code).
 In case of issues with current setup, it may be required to prefix the office.js path with a dot in taskpane.html in the dist folder.
 
    Current path: `/assets/office-js/dist/office.js`
    
    Solution: `./assets/office-js/dist/office.js`
    
  
## Additional resources

* [Office add-in documentation](https://docs.microsoft.com/office/dev/add-ins/overview/office-add-ins)
* More Office Add-in samples at [OfficeDev on Github](https://github.com/officedev)

## Current status: 
    Done:
     - Replacing simple fields like client, consultant, secretary, contract header, contract address, mandate data etc.
     - Filling risk results table
     - Duplicating beneficial owners section
     - Adding german clause
     - Adding "execution only" clause
     - Duplicating "Depot Details" and "Risk Profile" sections in correct order
     - Showing/hiding last 2 optional sections in the document - "Data protection" & "General terms"
       It is achieved with Base64 strings adding/removing. It is not perfect as some formatting is altered during that process
    
    Improvement needed:
     - For "Beneficial Owner" section there is a logic which checks if the domicile is Swiss and can remove this section 
       This logic is not active, as reintroducing this section is problematic - formatting is altered after reintroducing a file fragment from Base64 format
       and it has to be investigated or formatting should somehow be reworked, so it will work fine with file fragment converted to Base64 
       (which is saved in data/sections.json) 
     - Adding page breaks after "Risk Profile" & "Depot Details" - it caused formatting issues, so after many tries I left this, as not implemented
     - Fees
     - Settings tab with the new features (inserting page breaks etc.)
     - Finding a way to reintroduce whole formatted sections. I tested Base64 strings. With ooxml should be easier, but they have special characters, 
       not well parsed in JSON format, so it's a potential issue.