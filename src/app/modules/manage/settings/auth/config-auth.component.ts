import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { map, switchMap, takeWhile } from 'rxjs';
import { AuthLocal, AuthSettings, BaseLdap, BaseOAuth, BaseOpenId, BaseRadius, BaseSaml } from 'src/app/modules/shared/models/auth';
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
      type: 'local', baseType: 'local',
      name: 'local', tags: [], isEnabled: true
    }
  }


  ngOnInit(): void {
    this.getAuthCommon().pipe(
      switchMap(y => this.getAuthLocal()),
      switchMap(y => this.getAuthOAuthProviders()),
      switchMap(y => this.getAuthLdapProviders()),
      switchMap(y => this.getAuthSamlProviders()),
      switchMap(y => this.getAuthOpenIdProviders()),
      switchMap(y => this.getAuthRadiusProviders()),
    ).subscribe(x => {

    });

  }
  addMenus = [
    {
      name: 'Active Directory/LDAP', type: 'ldap', isVisible: true, svg: 'social-microsoft', icon: undefined,
      click: () => { this.addActiveDirectory(); }
    },
    {
      name: 'Auth0/SAML', type: 'saml', isVisible: true, svg: 'social-auth0', icon: undefined,
      click: () => { this.addAuth0Saml() }
    },
    {
      name: 'Azure AD/SAML', type: 'saml', isVisible: true, svg: 'social-azure', icon: undefined,
      click: () => { this.addAzureADSaml() }
    },
    {
      name: 'Google/OAuth2', type: 'oauth', isVisible: true, svg: 'social-google', icon: undefined,
      click: () => { this.addGoogleOAuth(); }
    },
    {
      name: 'Generic/OpenID', type: 'openid', isVisible: true, svg: 'social-openid', icon: undefined,
      click: () => { this.addGenericOpenId(); }
    },
    {
      name: 'Generic/Radius', type: 'radius', isVisible: true, svg: 'radius', icon: undefined,
      click: () => { this.addGenericRadius() }
    },

    {
      name: 'Linkedin/OAuth2', type: 'oauth', isVisible: true, svg: 'social-linkedin', icon: undefined,
      click: () => { this.addLinkedinOAuth() }
    },


  ]

  getAuthCommon() {
    return this.configService.getAuthCommon().pipe(
      map(x => this.model.common = x)
    )
  }

  getAuthLocal() {
    return this.configService.getAuthLocal().pipe(
      map(x => {
        this.model.local = x
      })
    )
  }
  getAuthOAuthProviders() {
    return this.configService.getAuthOAuthProviders().pipe(
      map(x => {
        this.model.oauth = {
          providers: x.items
        }
        this.model.oauth.providers.forEach(x => x.objId = UtilService.randomNumberString())
      })
    )
  }

  getAuthLdapProviders() {
    return this.configService.getAuthLdapProviders().pipe(
      map(x => {
        this.model.ldap = {
          providers: x.items
        }
        this.model.ldap.providers.forEach(x => x.objId = UtilService.randomNumberString())
      })
    )
  }

  getAuthSamlProviders() {
    return this.configService.getAuthSamlProviders().pipe(
      map(x => {
        this.model.saml = {
          providers: x.items
        }
        this.model.saml.providers.forEach(x => x.objId = UtilService.randomNumberString())
      })
    )
  }

  getAuthOpenIdProviders() {
    return this.configService.getAuthOpenIdProviders().pipe(
      map(x => {
        this.model.openId = {
          providers: x.items
        }
        this.model.openId.providers.forEach(x => x.objId = UtilService.randomNumberString())
      })
    )
  }
  getAuthRadiusProviders() {
    return this.configService.getAuthRadiusProviders().pipe(
      map(x => {
        this.model.radius = {
          providers: x.items
        }
        this.model.radius.providers.forEach(x => x.objId = UtilService.randomNumberString())
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
      searchFilter: '', securityProfile: {}, isEnabled: true, saveNewUser: true
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
      id: '', clientId: '', clientSecret: '', isEnabled: true, saveNewUser: true
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
      id: '', clientId: '', clientSecret: '', isEnabled: true, saveNewUser: true

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
      cert: '', issuer: '', saveNewUser: true

    }
    if (!this.model.saml)
      this.model.saml = { providers: [] };
    this.model.saml.providers.push(saml);
  }



  addAzureADSaml() {
    const auth = this.model.saml?.providers.find(x => x.baseType == 'saml' && x.type == 'azure');
    if (auth) {
      this.notificationService.error(`Azure AD/SAML  ${this.translateService.translate('AllreadyExists')}`);
      return;
    }
    const saml: BaseSaml = {
      baseType: 'saml', type: 'azure', objId: UtilService.randomNumberString(), name: 'Azure AD/SAML', tags: [],
      id: '', isEnabled: true,
      loginUrl: '', usernameField: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress', nameField: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
      cert: '', issuer: '', saveNewUser: true,

    }
    if (!this.model.saml)
      this.model.saml = { providers: [] };
    this.model.saml.providers.push(saml);
  }







  addGenericOpenId() {
    const auth = this.model.openId?.providers.find(x => x.baseType == 'openId' && x.type == 'generic' && x.authName == 'generic');
    if (auth) {
      this.notificationService.error(`Generic/OpenID  ${this.translateService.translate('AllreadyExists')}`);
      return;
    }
    const openId: BaseOpenId = {
      baseType: 'openId', type: 'generic', objId: UtilService.randomNumberString(), name: 'Generic/OpenID', authName: 'generic', tags: [],
      id: '', isEnabled: true,
      discoveryUrl: '', clientId: '', clientSecret: '', saveNewUser: true,


    }
    if (!this.model.openId)
      this.model.openId = { providers: [] };
    this.model.openId.providers.push(openId);
  }

  saveOpenId($event: BaseOpenId) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(x =>
        this.configService.saveAuthOpenIdProvider($event))
    ).subscribe(x => {
      if (!this.model.openId)
        this.model.openId = { providers: [] };
      //set a follow id
      x.objId = UtilService.randomNumberString();
      const index = this.model.openId.providers.findIndex(x => x.id == $event.id);
      if (Number(index) >= 0)
        this.model.openId.providers[Number(index)] = { ...x };
      else
        this.model.openId.providers.push(x);
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));
    })
  }
  deleteOpenId($event: BaseOpenId) {
    if (!$event.id) {//not saved before
      const index = this.model.openId?.providers.findIndex(x => x.objId == $event.objId)
      if (Number(index) >= 0)
        this.model.openId?.providers.splice(Number(index), 1);
    } else {
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(x => this.configService.deleteAuthOpenIdProvider($event))
      ).subscribe(x => {

        const index = this.model.openId?.providers.findIndex(x => x.objId == $event.objId)
        if (Number(index) >= 0)
          this.model.openId?.providers.splice(Number(index), 1);
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'));
      })
    }
  }



  addGenericRadius() {
    const auth = this.model.openId?.providers.find(x => x.baseType == 'radius' && x.type == 'generic');
    if (auth) {
      this.notificationService.error(`Generic/Radius  ${this.translateService.translate('AllreadyExists')}`);
      return;
    }
    const radius: BaseRadius = {
      baseType: 'radius', type: 'generic',
      objId: UtilService.randomNumberString(), name: 'Generic/Radius', tags: [],
      id: '', isEnabled: true,
      host: '', secret: '', saveNewUser: true


    }
    if (!this.model.radius)
      this.model.radius = { providers: [] };
    this.model.radius.providers.push(radius);
  }

  saveGenericRadius($event: BaseRadius) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(x =>
        this.configService.saveAuthRadiusProvider($event))
    ).subscribe(x => {
      if (!this.model.radius)
        this.model.radius = { providers: [] };
      //set a follow id
      x.objId = UtilService.randomNumberString();
      const index = this.model.radius.providers.findIndex(x => x.id == $event.id);
      if (Number(index) >= 0)
        this.model.radius.providers[Number(index)] = { ...x };
      else
        this.model.radius.providers.push(x);
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));
    })
  }
  deleteGenericRadius($event: BaseRadius) {
    if (!$event.id) {//not saved before
      const index = this.model.radius?.providers.findIndex(x => x.objId == $event.objId)
      if (Number(index) >= 0)
        this.model.radius?.providers.splice(Number(index), 1);
    } else {
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(x => this.configService.deleteAuthRadiusProvider($event))
      ).subscribe(x => {

        const index = this.model.radius?.providers.findIndex(x => x.objId == $event.objId)
        if (Number(index) >= 0)
          this.model.radius?.providers.splice(Number(index), 1);
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'));
      })
    }
  }



  get totalCount() {
    return 1
      + (this.model.ldap?.providers?.length || 0)
      + (this.model.saml?.providers?.length || 0)
      + (this.model.oauth?.providers?.length || 0)
      + (this.model.openId?.providers?.length || 0)
      + (this.model.radius?.providers?.length || 0)
  }




}

