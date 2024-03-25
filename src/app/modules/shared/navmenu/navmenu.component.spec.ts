import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { click, findEl, findEls } from '../helper.spec';
import { MaterialModule } from '../material-module';
import { NavMenuComponent } from './navmenu.component';

describe('NavMenuComponent', () => {
  let component: NavMenuComponent;
  let fixture: ComponentFixture<NavMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavMenuComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule, MaterialModule],
      providers: [TranslateService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a nav menu', fakeAsync(async () => {
    component.items = [
      {
        icon: 'folder', isClicked: false, isExpanded: false, name: 'dashboard',
        navigate: () => { }, subItems: []
      },
      {
        icon: 'folder', isClicked: false, isExpanded: false, name: 'settings',
        navigate: () => { }, subItems: [
          {
            icon: 'folder', isClicked: false, isExpanded: false, name: 'security',
            navigate: () => { }, subItems: [

            ]
          }
        ]
      }
    ]

    fixture.detectChanges();

    //find menu
    const navlist = findEl(fixture, 'navmenu-navlist');
    expect(navlist).toBeTruthy();

    //find firt tree nodes
    const menus = findEls(fixture, 'navmenu-item');
    expect(menus.length).toBe(2);

    //find child nodes
    const submenus = findEls(fixture, 'navmenu-subitem');
    expect(submenus.length).toBe(0);

  }));

  it('should create a  submenu', fakeAsync(async () => {
    component.items = [
      {
        icon: 'folder', isClicked: false, isExpanded: false, name: 'settings',
        navigate: () => { }, subItems: [
          {
            icon: 'folder', isClicked: false, isExpanded: false, name: 'security',
            navigate: () => { }, subItems: [

            ]
          }
        ]
      },
      {
        icon: 'folder', isClicked: false, isExpanded: false, name: 'dashboard',
        navigate: () => { }, subItems: []
      }
    ]

    fixture.detectChanges();

    //find firt tree nodes
    const menus = findEls(fixture, 'navmenu-item');
    expect(menus.length).toBe(2);

    click(fixture, 'navmenu-item');
    tick(1000);
    fixture.detectChanges();

    //find child nodes
    const submenus = findEls(fixture, 'navmenu-subitem');
    expect(submenus.length).toBe(1);

  }));

});
