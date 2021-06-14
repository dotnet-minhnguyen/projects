import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import * as _ from 'lodash';
import * as $ from 'jquery';

const data = require('../../../../data/data.json');
const settings = require('../../../../data/settings.json');
import * as cookie from "js-cookie";
import 'url-search-params-polyfill';
import {ConfigService} from "./config.service";

@Injectable()
export class AssetmaxDataService {
  private addInSettings: any;
  private apiPath: string;
  private basePath: string = this.apiPath + '/assetmax/moik/ext/';
  private loginPath: string = 'login/login';
  private vaultLoginPath: string = 'vault-admin/login';

  private countriesPath = 'config-country/get-countries';
  private logoutPath: string = 'login/logout';
  private clientsPath: string = 'mandate/search-nominatives';
  private clientPath: string = 'mandate/get-nominative';
  private clientAddressesPath: string = 'address/search-mandate-to-address-links';
  private mandatesPath: string = 'mandate/get-nominative-mandates';
  private mandatePath: string = 'mandate/get-mandate-by-ident';
  private isVaultPath: string = 'vault/is-registered-user';
  // getting data for investment strategy chart
  private mandateStrategyPath: string = 'portfolio/positions-tree?pf_id=17793115&options=RestrictionBreaches';
  private positions = 'portfolio/reference-positions?pf_id=5872140&options=IncludeFXDerivativesExposure%3BIncludeDerivativeContractsExposure%3B&snapshotOptions=LookThrough%3B&add_total_row=false'

  //management and performance fees
  private mandateFeesPath: string = 'fee-model/get-mandate-fee-structures';
  //&mnd_id=28591705&fee_model_type=Fee&fee_structure_type=Management&fee_structure_type=Deposit&fee_structure_type=Performance&fee_structure_type=Ticket&mnd_fee_structure_dynamic=true&mnd_fee_structure_active=true

  // has to be done for each mandate
  private beneficialOwnersForMandate: string = 'mandate/get-mandate-nominatives-tree';

  // Risk evaluation calls (has to be one by one)
  private mandateProtocols: string = 'regulation-protocol/get-protocols'
  private questionnaireResult: string = 'questionnaire/get-profile-result'; //form data: qst_filled_id: 32223292
  private riskResults: string = 'questionnaire/get-profile-result-score-categories';

  private relationshipManagersPath: string = 'auth-user/search-users';
  private languagesPath: string = 'language/get-all-languages';
  private vaultKey: string;
  private token: string;
  private username: string;
  private password: string;
  private countries;

  constructor(private http: HttpClient, private cookieService: CookieService, private configService: ConfigService) {
  }

  getBasePath() {
    this.addInSettings = this.configService.getSettings();
    this.apiPath = this.addInSettings.apiUrl;
    this.basePath = this.apiPath + '/assetmax/moik/ext/';

    return this.basePath;
  }

  setBasePath(path: string) {
    this.basePath = path || this.basePath;
  }

  setVaultKey(vaultKey: string) {
    this.vaultKey = vaultKey || this.vaultKey;
  }


  login(username: string, password: string, vaultKey: string) {
    const params = new URLSearchParams();
    this.username = username;
    this.password = password;
    this.vaultKey = vaultKey;
    params.append("email", username);
    params.append("password", password);
    params.append("auth", "emailpassword");

    const loginResponse: any = this.send(
      "POST",
      `${this.getBasePath()}login/login`,
      params.toString(),
      [{
        key: "Content-type",
        value: "application/x-www-form-urlencoded"
      }]
    );

    loginResponse.then((data) => {
      const {tokenId} = JSON.parse(data.responseText);
      cookie.set("tokenId", tokenId);
      cookie.set("user.email", username);
      cookie.set("user.auth", "emailpassword");

      return data;
    });

    return loginResponse.then((data) => {
      return this.loginVault();
    });
  }

  loginVault() {
    const path = this.getBasePath() + this.vaultLoginPath;
    const vaultParams = new URLSearchParams();
    vaultParams.append('password', this.password);
    vaultParams.append('key', this.vaultKey);

    return this.send(
      "POST",
      path,
      vaultParams.toString(),
      [{
        key: "Content-type",
        value: "application/x-www-form-urlencoded"
      }]
    ).then((data) => {
      const jsonData = JSON.parse(data.responseText);
      return jsonData.responseText;
    });
  }

  isVault() {
    const path = this.getBasePath() + this.isVaultPath;
    return this.http.get<any>(path, {
      headers: this.getHeaders(),
      withCredentials: true
    }).toPromise().then(vaultEnabledResponse => {
      return vaultEnabledResponse
    })
  }

  logout() {
    const path = this.getBasePath() + this.logoutPath;
    return this.http.get<any>(path).toPromise().then(loginResponse => {
      this.token = loginResponse.tokenId;
    })
  }

  getClients(clientNameQuery: string = '') {
    const path = this.getBasePath() + this.clientsPath;

    return this.http.get<any>(path, {
      headers: this.getHeaders(), withCredentials: true, params: {
        mnd_search_names: '',
        mnd_search_mnd_names: '',
      }
    }).toPromise()
      .then(clients => {
        return clients;
      })
  }

  getClientById(clientId) {
    const path = this.getBasePath() + this.clientPath;

    return this.http.get<any>(path, {
      headers: this.getHeaders(), withCredentials: true, params: {
        id: clientId,
      }
    }).toPromise().then(client => {
      return client.records[0]
    });
  }

  getCountryById(id) {
    return this.getCountries().then((countries) => {
      return _.find(countries, {id: id});
    })
  }

  getCountries() {
    const path = this.getBasePath() + this.countriesPath;
    if (!this.countries) {
      return this.http.get<any>(path, {
        headers: this.getHeaders(), withCredentials: true, params: {}
      }).toPromise().then(countries => {
        return countries.records;
      });
    } else {
      return Promise.resolve(this.countries);
    }

  }

  getMandateAddressesById(mandateId) {
    const path = this.getBasePath() + this.clientAddressesPath;

    if (mandateId) {
      return this.http.get<any>(path, {
        headers: this.getHeaders(), withCredentials: true, params: <any>{
          mnd_id: mandateId,
          addr_is_copy_to: false,
          page: '1',
          start: '0',
          limit: '25',
        }
      }).toPromise()
    } else {
      return Promise.resolve({});
    }
  }

  getClientDetailsAndAddress(clientId, mandateId) {
    let clientDetails;
    return this.getClientById(clientId).then(result => {
      clientDetails = result.records[0];
    });
  }

  getMandatesByClientId(clientId) {
    const path = this.getBasePath() + this.mandatesPath;

    return this.http.get<any>(path, {
      headers: this.getHeaders(), withCredentials: true, params: {
        nom_id: clientId
      }
    }).toPromise().then(mandates => {
      return mandates;
    })
  }

  getMandateById(mandateId, mandateAnonId) {
    const path = this.getBasePath() + this.mandatePath;
    let mandate;
    return this.http.get<any>(path, {
      headers: this.getHeaders(), withCredentials: true, params: {
        mnd_anon_ident: mandateAnonId,
      }
    })
      .toPromise()
      .then(result => {
        mandate = result.records ? result.records[0] : {};
        return mandate
      })
      .then(() => this.getMandateBeneficialOwnersById(mandateId))
      .then(beneficialOwners => {
        mandate.beneficialOwners = beneficialOwners;
        return mandate;
      })
  }

  getMandateDetails(mandateId, mandateAnonId) {
    let mandateDetails;
    return this.getMandateById(mandateId, mandateAnonId)
      .then((result) => {
        mandateDetails = result;
        return mandateDetails;
      })
      .then(() => this.getMandateAddressesById(mandateId))
      .then(addresses => {
        const correspondenceAddress = addresses ? addresses.records[0] : null;
        mandateDetails.correspondenceAddress = correspondenceAddress;
        return mandateDetails;
      })
  }

  getMandateFeesById(mandateId) {
    const path = this.getBasePath() + this.mandateFeesPath;

    return this.http.get<any>(path, {
      headers: this.getHeaders(), withCredentials: true, params: {
        mnd_id: mandateId,
      }
    }).toPromise().then(fees => {
      return fees
    })
  }

  getMandateBeneficialOwnersById(mandateId) {
    const path = this.getBasePath() + this.beneficialOwnersForMandate;

    return this.http.get<any>(path, {
      headers: this.getHeaders(),
      withCredentials: true,
      params: {
        mnd_id: mandateId,
      }
    }).toPromise().then(nominativeTree => {
      //filter beneficial owners
      return nominativeTree;
    })
  }

  getMandateBeneficialOwners(mandateId) {
    const path = this.getBasePath() + this.relationshipManagersPath;

    return this.http.get<any>(path, {
      headers: this.getHeaders(), withCredentials: true, params: {
        user_active: 'true',
        user_roles: 'RelationshipManager'
      }
    }).toPromise().then(rms => {
      _.each(rms.records, rm => {
        rm.name = this.mapRmIdentToFullName(rm.user_ident);
      });
      return rms.records
    })
  }

  getUniqueBeneficialOwnersFromSelectedMandates(mandates) {

  }

  getMandateProtocols(mandateId, clientId) {
      const path = this.getBasePath() + this.mandateProtocols;
      return this.http.get<any>(path, {
          headers: this.getHeaders(), withCredentials: true, params: {
              reg_protocol_type: 'Profile',
              mnd_id: mandateId,
              nom_id: clientId,
              reg_protocol_with_filled_qst: "true",
              page: '1',
              start: '0',
              limit: '25'
          }
      }).toPromise().then(protocols => {
          return _.get(protocols, 'records[0].qst_filled_id');
      })
  }

    getMandateQuestionnaires(qstId) {
        const path = this.getBasePath() + this.questionnaireResult;
        return this.http.get<any>(path, {
            headers: this.getHeaders(), withCredentials: true, params: {
                qst_filled_id: qstId,
            }
        }).toPromise().then(result => {
            return _.get(result, 'records[0].id');
        })
    }

    getRiskResults(id) {
        const path = this.getBasePath() + this.riskResults;
        return this.http.get<any>(path, {
            headers: this.getHeaders(), withCredentials: true, params: {
                qst_profile_result_id: id,
            }
        }).toPromise().then(result => {
            return _.get(result, 'records');
        })
    }

    getRiskProfile(mandateId, clientId) {
      return this.getMandateProtocols(mandateId, clientId)
        .then((qstId) => this.getMandateQuestionnaires(qstId))
        .then((profileId) => this.getRiskResults(profileId))
    }

  getRms() {
    const path = this.getBasePath() + this.relationshipManagersPath;

    return this.http.get<any>(path, {
      headers: this.getHeaders(), withCredentials: true, params: {
        user_active: 'true',
        user_roles: 'RelationshipManager'
      }
    }).toPromise().then(rms => {
      _.each(rms.records, rm => {
        rm.name = this.mapRmIdentToFullName(rm.user_ident);
      });
      return rms.records
    })
  }

  mapRmIdentToFullName(rmIdent) {
    const translations = data.rmTranslations;
    let fullName = '';
    const rm = _.find(translations, {initials: rmIdent});

    return rm ? `${rm.firstName} ${rm.lastName}` : rmIdent;
  }

  getLanguages() {
    const path = this.getBasePath() + this.languagesPath;

    return this.http.get<any>(path, {
      headers: this.getHeaders(), withCredentials: true, params: {}
    }).toPromise().then(languages => {
      return languages.records
    })
  }

  getGlByClientId() {
    return Promise.resolve(
      [
        {id: 0, name: 'GL 1'},
        {id: 1, name: 'GL 2'},
        {id: 2, name: 'GL 3'}
      ]
    );
  }

  getHeaders() {
    const headers = new HttpHeaders();
    headers.append('Cookie', `tokenId=${this.token}; user.email=${this.username}; user.auth=emailpassword`);
    return headers;
  }

  send(method: string, url: string, body?: any, headers?: any[]) {
    return new Promise<XMLHttpRequest>((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open(method, url, true);
      req.withCredentials = true;
      for (const header of headers || []) {
        req.setRequestHeader(header.key, header.value);
      }
      req.addEventListener("readystatechange", () => {
        if (req.readyState === 4) {
          if (req.status === 200) resolve(req);
          else reject(req);
        }
      });
      req.send(body);
    });
  };
}