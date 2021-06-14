import {Component, OnInit} from '@angular/core';
import {IDropdownOption, IMessageBarProps, MessageBarType} from 'office-ui-fabric-react';
import {FabDropdownComponent} from '@angular-react/fabric';
import {AssetmaxDataService} from "../../common/services/assetmax-data.service";
import ContentControlCollection = Word.ContentControlCollection;
import * as _ from 'lodash';
import * as moment from 'moment';
import {OfficeUtilsService} from "../../common/services/office-utils.service";

const data = require('../../../../data/data.json');
const sections = require('../../../../data/sections.json');
const template = require('./mandate-agreement.component.html');

@Component({
  selector: 'mandate-agreement',
  template
})
export default class MandateAgreementComponent implements OnInit {

  connected = false;
  selectedMandates = undefined;
  hiddenLoginDialog = true;
  selectedClient = undefined;
  selectedConsultant = undefined;
  selectedSecretary = undefined;
  mandateOptions: FabDropdownComponent['options'] = [];
  contentControls: ContentControlCollection;
  contentControlsPromise: Promise<any>;
  sections = sections;
  selectedLanguage;
  languageOptions = [];
  consultantOptions = [];
  clientOptions = [];
  secretaryOptions = [];
  vaultEnabled = false;
  generalTermsVisible = true;
  dataProtectionVisible = true;

  constructor(private assetmaxDataService: AssetmaxDataService,
              private officeUtilsService: OfficeUtilsService) {

  }

  toggleSectionVisibility(sectionId, $event) {

  }

  onLoginSuccess() {
    this.getClients();
    this.connected = true;
    this.hiddenLoginDialog = true;
  }

  onLoginCancel() {
    this.connected = false;
    this.hiddenLoginDialog = true;
  }

  openLoginDialog() {
    this.hiddenLoginDialog = false;
  }

  onClientChange($event) {
    this.getClients($event.newValue)
  }

  logEvent(msg, $event) {

  }

  ngOnInit() {
    console.log('sections', sections)
    this.officeUtilsService.loadContentControls();
  }

  addGermanClause() {
    if (this.selectedMandates && this.selectedMandates.length) {
      const domicileName = this.selectedMandates[0].details.mnd_legal_domicile_name;
      if (domicileName === 'Deutschland' || domicileName === 'Germany') {
        return this.officeUtilsService.replaceText('germanClause', this.sections.germanClause);
      } else {
        return this.officeUtilsService.replaceText('germanClause', '');
      }
    }
    return Promise.resolve({});
  }

  isSwissDomicile() {
    const domicileName = this.selectedMandates[0].details.mnd_legal_domicile_name;
    return domicileName === 'Schweiz' || domicileName === 'Switzerland';
  }

  onClientSelect(value) {
    this.selectedClient = value;
    this.assetmaxDataService.getClientById(this.selectedClient.id)
      .then((data) => {
        this.selectedClient.details = data;
        this.getMandates().then(data => {
          this.replaceAddress();
          this.replaceDate();
          this.replaceHeader();
          this.replaceClient();
        });
        this.getConsultants();
        this.getLanguages();
        this.getSecretaries();
      });

    this.officeUtilsService.getOoxml('generalTerms');
  }

  isVaultEnabled() {
    this.assetmaxDataService.isVault().then((result) => {
      this.vaultEnabled = result;
    })
  }

  onClientDeselect() {
    this.selectedLanguage = undefined;
    this.selectedMandates = [];
    this.selectedConsultant = [];
    this.selectedSecretary = [];
  }

  onConsultantSelect(selection) {
    this.selectedConsultant = selection;
    this.replaceConsultant();
  }

  onSecretarySelect(selection) {
    this.selectedSecretary = selection;
    this.replaceSecretary();
  }

  onMandateSelect(value) {

  }

  onlanguageSelect(value) {
    this.selectedLanguage = value.newValue;
  }

  getMandates(query: string = '') {
    let mandates = [];
    const clientId = this.selectedClient.id;

    return this.assetmaxDataService.getMandatesByClientId(clientId).then((result: any) => {
      mandates = result.records.map(mandate => {
        const mandateName = mandate.mnd_display_name || mandate.mnd_anon_ident;
        return {id: mandate.id, name: mandateName, anonIdent: mandate.mnd_anon_ident, details: mandate};
      });
      this.mandateOptions = mandates;
      this.selectedMandates = mandates;
      const mandatePromises = []
      _.each(this.selectedMandates, mandate => {
        const originalId = mandate.details.mnd_id;
        const mandatePromise = this.assetmaxDataService.getMandateDetails(mandate.details.mnd_id, mandate.anonIdent).then((result) => {
          mandate.details = result;
          mandate.details.mnd_id = originalId;
        });
        mandatePromises.push(mandatePromise);
      });
      return Promise.all(mandatePromises);
    });
  }

  generateDocument() {
    let promise = this.resetDocument()
      .then(() => this.insertNextDepotSection(0))
      .then(() => this.insertNextRiskSection(0))
    for (let i = 1; i < this.mandateOptions.length; ++i) {
      promise = promise.then(() => this.insertNextDepotSection(i, 'riskprofile'))
      promise = promise.then(() => this.insertNextRiskSection(i, 'depotdetails'))
    }
    promise.then(() => this.insertBeneficialOwnerSections())

    //FIXME: this should be uncommented when there will be a seamless solution to reintroduce whole word sections after removing them.
    /*if (!this.isSwissDomicile()) {
      promise.then(() => this.insertBeneficialOwnerSections())
    }
    else {
      this.removeSections('beneficialOwnerSection')
        .then(() => {
          this.officeUtilsService.replaceText('beneficialOwnerSection', ' ');
        })
    }*/
    this.addGermanClause();
  }

  resetDocument() {
    return this.removeSections('riskprofile')
      .then(() => {
        return this.removeSections('depotdetails')
      }).then(() => {
        return this.removeSections('beneficialOwnerSection')
      })
  }

  removeSections(sectionName) {
    return Word.run(async (context) => {
      this.contentControls = this.officeUtilsService.getContentControls();
      await this.contentControls.load();
      await this.contentControls.context.sync();
      const contentControlsToRemove = this.officeUtilsService.findContentControlCollection(sectionName)
      await contentControlsToRemove.load();
      await contentControlsToRemove.context.sync();
      const contentControls = [];
      let index = 0;
      _.each(contentControlsToRemove.items, (item) => {
        if (index > 0) {
          contentControls.push(item)
        }
        ++index;
      })
      _.each(contentControls, async (contentControl) => {
        await contentControl.load();
        await contentControl.context.sync()
        contentControl.delete();
        await contentControlsToRemove.load();
        await contentControlsToRemove.context.sync();
        await context.sync();
      })
      return context.sync();
    });
  }

  insertNextDepotSection(index, after?) {
    if (this.mandateOptions && this.mandateOptions.length) {
      return this.insertNextSection(index, 'depotdetails', after).then(() => {
        return this.replaceDepotDetailsFields(index);
      });
    }
    return Promise.resolve({})
  }

  insertNextRiskSection(index, after?) {
    if (this.mandateOptions && this.mandateOptions.length) {
      return this.insertNextSection(index, 'riskprofile', after).then(() => {
        return this.replaceRiskProfileFields(index);
      });
    }
    return Promise.resolve({})
  }

  insertNextSection(index, sourceTag, after?) {
    if (this.mandateOptions && this.mandateOptions.length) {
      return Word.run(async (context) => {
        if (this.mandateOptions.length > 1) {
          await context.sync();
          const duplicationPromises = []
          if (index > 0) {
            const duplicationPromise = this.officeUtilsService.duplicateContent(null, sourceTag, after);
            duplicationPromises.push(duplicationPromise);
          }
          return Promise.all(duplicationPromises);
        }
        return Promise.resolve({})
      }).then(() => {
        this.replaceRiskProfileFields(index);
        return Promise.resolve({})
      });
    }
    return Promise.resolve({})
  }

  insertBeneficialOwnerSections() {
    const beneficialOwners = this.getBeneficialOwners();
    if (beneficialOwners.length > 0) {
      return Word.run(async (context) => {
        let index = 0;
        const duplicationPromises = [];
        _.each(beneficialOwners, beneficialOwner => {
          if (index > 0) {
            const targetTag = 'beneficialOwnerSection';
            const promise = this.officeUtilsService.duplicateContent(null, targetTag, null);
            duplicationPromises.push(promise)
          }
          ++index;
        })
        return Promise.all(duplicationPromises);
      }).then(() => {
        return this.replaceBeneficialOwnerFields();
      });
    }
  }

  insertPageBreak(pageNumber) {

    return this;
  }

  getBeneficialOwners() {
    let beneficialOwners = [];
    _.each(this.mandateOptions, mandate => {
      const connectedPersons = _.get(mandate, 'details.beneficialOwners.children');

      if (connectedPersons) {
        _.each(connectedPersons, (container) => {
          if (container.name === "Beneficial Owner" && container.children) {
            _.each(container.children, child => {
              child.domicile = mandate.details.mnd_beneficial_owner_domicile;
            });
            beneficialOwners = beneficialOwners.concat(container.children)
          }
        })
      }
    });

    return _.uniqBy(beneficialOwners, 'nom_id');
  }

  replaceBeneficialOwnerFields() {
    const beneficialOwners = this.getBeneficialOwners();
    return Word.run(async (context) => {
      this.contentControls = this.officeUtilsService.getContentControls();
      await this.contentControls.load('items');
      await this.contentControls.context.sync();
      await context.sync();
      const beneficialOwnerSections = _.filter(this.contentControls.items, {tag: 'beneficialOwnerSection'})
      let index = 0;
      _.each(beneficialOwners, beneficialOwner => {
        this.officeUtilsService.replaceText('beneficialOwner', beneficialOwner.nom_name, beneficialOwnerSections[index].contentControls)
        ++index;
      })
    })
  }

  getClients(query: string = '') {
    let clients = [];
    return this.assetmaxDataService.getClients(query).then((result: any) => {
      clients = result.records.map(client => {
        return {id: client.id, name: client.nom_label, details: client};
      });
      this.clientOptions = clients;
      return clients;
    });
  }

  getSecretaries() {
    const secretaries = [];
    _.forOwn(data.secretaries, (value, key) => {
      secretaries.push({id: key, name: value.fullName})
    });
    this.secretaryOptions = secretaries;
    return secretaries;
  }

  toggleGeneralTerms(state) {
    console.log('state', state)
    this.generalTermsVisible = state.checked;

    if (state.checked) {
      this.officeUtilsService.insertFileFragment('generalTerms', this.sections.generalTerms)
        .catch(function (error) {
          console.log('Error: ' + JSON.stringify(error));
          if (error instanceof OfficeExtension.Error) {
            console.log('Debug info: ' + JSON.stringify(error.debugInfo));
          }
        });
    } else {
      this.officeUtilsService.replaceText('generalTerms', ' ');
    }
  }

  toggleDataProtection(state) {
    this.dataProtectionVisible = state.checked;
    if (state.checked) {
      this.officeUtilsService.insertFileFragment('dataProtection', this.sections.dataProtection)
        .catch(function (error) {
          console.log('Error: ' + JSON.stringify(error));
          if (error instanceof OfficeExtension.Error) {
            console.log('Debug info: ' + JSON.stringify(error.debugInfo));
          }
        });
    } else {
      this.officeUtilsService.replaceText('dataProtection', ' ');
    }
  }

  getLanguages() {
    this.assetmaxDataService.getLanguages()
      .then(languages => {
        this.languageOptions = languages;
        this.selectedLanguage = _.find(this.languageOptions, {id: 'de'});
      })
  }

  getConsultants() {
    this.assetmaxDataService.getRms()
      .then(rms => {
        this.consultantOptions = rms;
      })
  }

  replaceDate() {
    const currentDate = moment().format('DD.MM.YYYY');
    this.officeUtilsService.replaceText('contractDate', currentDate);
  }

  replaceAddress() {
    if (this.selectedMandates && this.selectedMandates.length) {
      let countryName = '';
      this.assetmaxDataService.getCountryById(_.get(this.selectedMandates[0], 'details.correspondenceAddress.addr_country_id')).then(country => {
        if (country) {
          countryName = country.country_name;
        }
        const addr1 = _.get(this.selectedMandates[0], 'details.correspondenceAddress.default_heading');
        const addr2 = _.get(this.selectedMandates[0], 'details.correspondenceAddress.addr_address_1');
        const addr3 = _.get(this.selectedMandates[0], 'details.correspondenceAddress.addr_address_2');
        const addr4 = _.get(this.selectedMandates[0], 'details.correspondenceAddress.addr_address_3');
        const addr5 = _.get(this.selectedMandates[0], 'details.correspondenceAddress.addr_postal_code');
        const addr6 = _.get(this.selectedMandates[0], 'details.correspondenceAddress.addr_city');
        const addr7 = countryName;
        let address = '';
        if (addr1) {
          address += addr1 + '\n'
        }
        if (addr2) {
          address += addr2 + '\n'
        }
        if (addr3) {
          address += addr3 + '\n'
        }
        if (addr4) {
          address += addr4 + '\n'
        }
        if (addr5) {
          address += addr5
        }
        if (addr6) {
          address += ' ' + addr6;
        }
        if (addr7) {
          address += '\n' + addr7;
        }
        this.officeUtilsService.replaceText('contractAddress', address);
      })

    }
  }

  replaceHeader() {
    if (this.selectedMandates && this.selectedMandates.length) {
      const header = `${_.get(this.selectedMandates[0], 'details.correspondenceAddress.default_full_heading')},`;
      this.officeUtilsService.replaceText('contractHeader', header);
    }
  }

  replaceClient() {
    this.officeUtilsService.replaceText('client', `${this.selectedClient.details.nom_pers_first_name} ${this.selectedClient.details.nom_pers_last_name}`);
  }

  replaceSecretary() {
    this.officeUtilsService.replaceText('secretary', this.selectedSecretary.name);
  }

  replaceDepotDetailsFields(index) {
    const ccPromise = Word.run(async (context) => {
      const depotDetailsCollection = this.officeUtilsService.findContentControlCollection('depotdetails');
      await depotDetailsCollection.load();
      await depotDetailsCollection.context.sync();
      await context.sync();
      if (depotDetailsCollection.items && depotDetailsCollection.items[index]) {
        const foundCollection = depotDetailsCollection.items[index].contentControls;
        await foundCollection.load();
        await foundCollection.context.sync();

        this.officeUtilsService.replaceText('mandateClient',
          `${this.selectedClient.details.nom_pers_first_name} ${this.selectedClient.details.nom_pers_last_name}`,
          foundCollection);
        this.officeUtilsService.replaceText('mandateNumber',
          `${this.selectedMandates[index].name}`,
          foundCollection);
        this.officeUtilsService.replaceText('depotNumber',
          `${_.get(this.selectedMandates[index], 'details.mnd_bank_account')}`,
          foundCollection);
        this.officeUtilsService.replaceText('depotBank',
          `${_.get(this.selectedMandates[index], 'details.custody_full_name')}`,
          foundCollection);

        this.officeUtilsService.replaceText('referenceCurrency',
          `${_.get(this.selectedMandates[index], 'details.mnd_currency')}`,
          foundCollection);
        const mandateType = _.get(this.selectedMandates[index], 'details.mnd_relation_type_name');
        if (mandateType) {
          this.officeUtilsService.replaceText('mandateType',
            `${_.get(this.selectedMandates[index], 'details.mnd_relation_type_name')}`,
            foundCollection);
          if (mandateType === 'Execution only') {
            this.officeUtilsService.replaceText('mandateExecutionOnly',
              this.sections.mandateExecutionOnly,
              foundCollection);
          }
          else {
            this.officeUtilsService.replaceText('mandateExecutionOnly',
              '\n\n\n',
              foundCollection);
          }
        } else {
          this.officeUtilsService.replaceText('mandateType', '',
            foundCollection);
          this.officeUtilsService.replaceText('mandateExecutionOnly',
            '\n\n\n',
            foundCollection);
        }
      }
      return {};
    });
    return ccPromise;
  }

  getRiskScores(mandate, clientId) {
    return this.assetmaxDataService.getRiskProfile(mandate.details.mnd_id, clientId).then((records) => {
      let riskType = _.get(records[0], 'qst_score_category_ident');
      if (riskType) {
        mandate.details[riskType] = _.get(records[0], 'qst_profile_result_score_category_score');
      }
      riskType = _.get(records[1], 'qst_score_category_ident');
      if (riskType) {
        mandate.details[riskType] = _.get(records[1], 'qst_profile_result_score_category_score');
      }
    })
  }

  replaceRiskProfileLevels(mandate, foundCollection) {
    this.officeUtilsService.replaceText('riskCap1', ' ', foundCollection);
    this.officeUtilsService.replaceText('riskCap2', ' ', foundCollection);
    this.officeUtilsService.replaceText('riskCap3', ' ', foundCollection);
    this.officeUtilsService.replaceText('riskWill1', ' ', foundCollection);
    this.officeUtilsService.replaceText('riskWill2', ' ', foundCollection);
    this.officeUtilsService.replaceText('riskWill3', ' ', foundCollection);
    this.officeUtilsService.replaceText('riskResult1', ' ', foundCollection);
    this.officeUtilsService.replaceText('riskResult2', ' ', foundCollection);
    this.officeUtilsService.replaceText('riskResult3', ' ', foundCollection);

    const riskCap = mandate.details.capability;
    const riskWill = mandate.details.willingness;
    let riskCapLevel;
    let riskWillLevel;

    if (riskCap <= 5) {
      this.officeUtilsService.replaceText('riskCap1',
        'X',
        foundCollection);
      riskCapLevel = 0;
    } else if (riskCap <= 21) {
      this.officeUtilsService.replaceText('riskCap2',
        'X',
        foundCollection);
      riskCapLevel = 1;
    } else if (riskWill <= 32) {
      this.officeUtilsService.replaceText('riskCap3',
        'X',
        foundCollection);
      riskCapLevel = 2;
    }

    if (riskWill <= 5) {
      this.officeUtilsService.replaceText('riskWill1',
        'X',
        foundCollection);
      riskWillLevel = 0;
    } else if (riskWill <= 21) {
      this.officeUtilsService.replaceText('riskWill2',
        'X',
        foundCollection);
      riskWillLevel = 1;
    } else if (riskWill <= 32) {
      this.officeUtilsService.replaceText('riskWill3',
        'X',
        foundCollection);
      riskWillLevel = 2;
    }

    let resultLevel = _.min([riskWillLevel, riskCapLevel]);

    if (resultLevel === 0) {
      this.officeUtilsService.replaceText('riskResult1',
        'X',
        foundCollection);
    } else if (resultLevel === 1) {
      this.officeUtilsService.replaceText('riskResult2',
        'X',
        foundCollection);
    } else {
      this.officeUtilsService.replaceText('riskResult3',
        'X',
        foundCollection);
    }

  }

  replaceRiskProfileFields(index) {
    return Word.run(async (context) => {
      const riskProfileCollection = this.officeUtilsService.findContentControlCollection('riskprofile');
      await riskProfileCollection.load();
      await riskProfileCollection.context.sync();
      await context.sync();
      if (riskProfileCollection.items && riskProfileCollection.items[index]) {
        const foundCollection = riskProfileCollection.items[index].contentControls;
        await foundCollection.load();
        await foundCollection.context.sync();

        this.officeUtilsService.replaceText('mandateClient',
          `${this.selectedClient.details.nom_pers_first_name} ${this.selectedClient.details.nom_pers_last_name}`,
          foundCollection);
        this.officeUtilsService.replaceText('mandateNumber',
          `${this.selectedMandates[index].name}`,
          foundCollection);
        this.officeUtilsService.replaceText('depotNumber',
          `${_.get(this.selectedMandates[index], 'details.mnd_bank_account')}`,
          foundCollection);
        this.officeUtilsService.replaceText('depotBank',
          `${_.get(this.selectedMandates[index], 'details.custody_full_name')}`,
          foundCollection);
        this.officeUtilsService.replaceText('referenceCurrency',
          `${_.get(this.selectedMandates[index], 'details.mnd_currency')}`,
          foundCollection);
        this.officeUtilsService.replaceText('mandateStrategy',
          `${_.get(this.selectedMandates[index], 'details.ip_name')}`,
          foundCollection);
        this.getRiskScores(this.selectedMandates[index], this.selectedClient.details.id).then(() => {
          this.replaceRiskProfileLevels(this.selectedMandates[index], foundCollection);
        })
      }


      return {};
    });
  }

  replaceConsultant() {
    this.officeUtilsService.replaceText('consultant', this.selectedConsultant.name);
  }

}
