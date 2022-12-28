import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { map, switchMap, takeWhile } from 'rxjs';
import { AuthLocal, AuthSettings, BaseLdap, BaseOAuth, BaseSaml } from 'src/app/modules/shared/models/auth';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';




@Component({
  selector: 'app-config-auth',
  templateUrl: './config-auth.component.html',
  styleUrls: ['./config-auth.component.scss']
})
export class ConfigAuthComponent implements OnInit {

  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService

  ) {



  }
  model: AuthSettings = {
    common: {},
    local: {
      id: '', type: 'local', baseType: 'local',
      name: 'local', tags: [], isEnabled: true
    }
  }


  ngOnInit(): void {
    this.getAuthCommon().pipe(
      switchMap(y => this.getAuthLocal()),
      switchMap(y => this.getAuthOAuthProvides()),
      switchMap(y => this.getAuthLdapProvides()),
      switchMap(y => this.getAuthSamlProvides()),
    ).subscribe(x => {
      this.model.oauth?.providers.forEach(x => x.objId = UtilService.randomNumberString());

      this.model.ldap?.providers.forEach(x => x.objId = UtilService.randomNumberString());
      this.model.saml?.providers.forEach(x => x.objId = UtilService.randomNumberString());

    });

  }
  addMenus = [
    {
      name: 'Active Directory/LDAP', type: 'ldap', isVisible: true, svg: 'social-microsoft', icon: undefined,
      click: () => { this.addActiveDirectory(); }
    },
    {
      name: 'Google/OAuth2', type: 'oauth', isVisible: true, svg: 'social-google', icon: undefined,
      click: () => { this.addGoogleOAuth(); }
    },
    {
      name: 'Linkedin/OAuth2', type: 'oauth', isVisible: true, svg: 'social-linkedin', icon: undefined,
      click: () => { this.addLinkedinOAuth() }
    },
    /* {
      name: 'Google Workspace/SAML', type: 'saml', isVisible: true, svg: 'social-google', icon: undefined,
      click: () => { this.addGoogleWorkspace() }
    }, */
    {
      name: 'Auth0/SAML', type: 'saml', isVisible: true, svg: 'social-auth0', icon: undefined,
      click: () => { this.addAuth0Saml() }
    },
  ]

  getAuthCommon() {
    return this.configService.getAuthCommon().pipe(
      map(x => this.model.common = x)
    )
  }

  getAuthLocal() {
    return this.configService.getAuthLocal().pipe(
      map(x => this.model.local = x)
    )
  }
  getAuthOAuthProvides() {
    return this.configService.getAuthOAuthProviders().pipe(
      map(x => {
        this.model.oauth = {
          providers: x.items
        }
      })
    )
  }

  getAuthLdapProvides() {
    return this.configService.getAuthLdapProviders().pipe(
      map(x => {
        this.model.ldap = {
          providers: x.items
        }
      })
    )
  }

  getAuthSamlProvides() {
    return this.configService.getAuthSamlProviders().pipe(
      map(x => {
        this.model.saml = {
          providers: x.items
        }
      })
    )
  }


  saveAuthLocal($event: AuthLocal) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(x =>
        this.configService.saveAuthLocal($event))
    ).subscribe(x => {
      this.model.local = {
        ...x
      }
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));
    })
  }

  saveOAuth($event: BaseOAuth) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(x =>
        this.configService.saveAuthOAuthProvider($event))
    ).subscribe(x => {
      if (!this.model.oauth)
        this.model.oauth = { providers: [] };
      //set a follow id
      x.objId = UtilService.randomNumberString();
      const index = this.model.oauth.providers.findIndex(x => x.id == $event.id);
      if (Number(index) >= 0)
        this.model.oauth.providers[Number(index)] = { ...x };
      else
        this.model.oauth.providers.push(x);
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));
    })
  }
  deleteOAuth($event: BaseOAuth) {
    if (!$event.id) {//not saved before
      const index = this.model.oauth?.providers.findIndex(x => x.objId == $event.objId)
      if (Number(index) >= 0)
        this.model.oauth?.providers.splice(Number(index), 1);
    } else {
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(x => this.configService.deleteAuthOAuthProvider($event))
      ).subscribe(x => {
        const index = this.model.oauth?.providers.findIndex(x => x.objId == $event.objId)
        if (Number(index) >= 0)
          this.model.oauth?.providers.splice(Number(index), 1);
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'));
      })
    }
  }



  saveLdap($event: BaseLdap) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(x =>
        this.configService.saveAuthLdapProvider($event))
    ).subscribe(x => {
      if (!this.model.ldap)
        this.model.ldap = { providers: [] };
      //set a follow id
      x.objId = UtilService.randomNumberString();
      const index = this.model.ldap.providers.findIndex(x => x.id == $event.id);
      if (Number(index) >= 0)
        this.model.ldap.providers[Number(index)] = { ...x };
      else
        this.model.ldap.providers.push(x);
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));
    })
  }
  deleteLdap($event: BaseLdap) {
    if (!$event.id) {//not saved before
      const index = this.model.ldap?.providers.findIndex(x => x.objId == $event.objId)
      if (Number(index) >= 0)
        this.model.ldap?.providers.splice(Number(index), 1);
    } else {
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(x => this.configService.deleteAuthLdapProvider($event))
      ).subscribe(x => {
        const index = this.model.ldap?.providers.findIndex(x => x.objId == $event.objId)
        if (Number(index) >= 0)
          this.model.ldap?.providers.splice(Number(index), 1);
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'));
      })
    }
  }

  saveSaml($event: BaseSaml) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(x =>
        this.configService.saveAuthSamlProvider($event))
    ).subscribe(x => {
      if (!this.model.saml)
        this.model.saml = { providers: [] };
      //set a follow id
      x.objId = UtilService.randomNumberString();
      const index = this.model.saml.providers.findIndex(x => x.id == $event.id);
      if (Number(index) >= 0)
        this.model.saml.providers[Number(index)] = { ...x };
      else
        this.model.saml.providers.push(x);
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));
    })
  }
  deleteSaml($event: BaseSaml) {
    if (!$event.id) {//not saved before
      const index = this.model.saml?.providers.findIndex(x => x.objId == $event.objId)
      if (Number(index) >= 0)
        this.model.saml?.providers.splice(Number(index), 1);
    } else {
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(x => this.configService.deleteAuthSamlProvider($event))
      ).subscribe(x => {
        const index = this.model.saml?.providers.findIndex(x => x.objId == $event.objId)
        if (Number(index) >= 0)
          this.model.saml?.providers.splice(Number(index), 1);
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'));
      })
    }
  }






  addActiveDirectory() {
    const activeDirectory = this.model.ldap?.providers.find(x => x.baseType == 'ldap' && x.type == 'activedirectory');
    if (activeDirectory) {
      this.notificationService.error(`Active Directory/Ldap  ${this.translateService.translate('AllreadyExists')}`);
      return;
    }
    const ldap: BaseLdap = {
      baseType: 'ldap', type: 'activedirectory', objId: UtilService.randomNumberString(),
      name: 'Active Directory/Ldap', tags: [],
      id: '', host: '', groupnameField: 'memberOf', usernameField: 'sAMAccountName',
      searchBase: 'CN=Users,DC=ferrum,DC=local', allowedGroups: [], bindDN: 'CN=yourAdminAccount,CN=Users,DC=ferrum,DC=local', bindPass: '',
      searchFilter: '', securityProfile: {}, isEnabled: true,
    }
    if (!this.model.ldap)
      this.model.ldap = { providers: [] };
    this.model.ldap.providers.push(ldap);


  }

  addGoogleOAuth() {
    const googleOAuth = this.model.oauth?.providers.find(x => x.baseType == 'oauth' && x.type == 'google');
    if (googleOAuth) {
      this.notificationService.error(`Google/OAuth2  ${this.translateService.translate('AllreadyExists')}`);
      return;
    }
    const oauth: BaseOAuth = {
      baseType: 'oauth', type: 'google', objId: UtilService.randomNumberString(),
      name: 'Google/OAuth2', tags: [],
      id: '', clientId: '', clientSecret: '', isEnabled: true
    }
    if (!this.model.oauth)
      this.model.oauth = { providers: [] };
    this.model.oauth.providers.push(oauth);

  }

  addLinkedinOAuth() {
    const linkedOAuth = this.model.oauth?.providers.find(x => x.baseType == 'oauth' && x.type == 'linkedin');
    if (linkedOAuth) {
      this.notificationService.error(`Linkedin/OAuth2  ${this.translateService.translate('AllreadyExists')}`);
      return;
    }
    const oauth: BaseOAuth = {
      baseType: 'oauth', type: 'linkedin', objId: UtilService.randomNumberString(), name: 'Linkedin/OAuth2', tags: [],
      id: '', clientId: '', clientSecret: '', isEnabled: true,
    }
    if (!this.model.oauth)
      this.model.oauth = { providers: [] };
    this.model.oauth.providers.push(oauth);
  }

  addGoogleWorkspace() {

  }
  addAuth0Saml() {
    const auth = this.model.saml?.providers.find(x => x.baseType == 'saml' && x.type == 'auth0');
    if (auth) {
      this.notificationService.error(`Auth0/SAML  ${this.translateService.translate('AllreadyExists')}`);
      return;
    }
    const saml: BaseSaml = {
      baseType: 'saml', type: 'auth0', objId: UtilService.randomNumberString(), name: 'Auth0/SAML', tags: [],
      id: '', isEnabled: true,
      loginUrl: '', usernameField: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress', nameField: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
      cert: '', issuer: ''

    }
    if (!this.model.saml)
      this.model.saml = { providers: [] };
    this.model.saml.providers.push(saml);
  }

  get totalCount() {
    return 1
      + (this.model.ldap?.providers?.length || 0)
      + (this.model.saml?.providers?.length || 0)
      + (this.model.oauth?.providers?.length || 0)
  }




}

