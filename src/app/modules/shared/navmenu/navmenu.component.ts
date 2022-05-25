import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavMenuItem } from './navmenuitem';

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class NavMenuComponent implements OnInit {

  @Input('items')
  items: NavMenuItem[] = []


  constructor() {

  }

  ngOnInit(): void {
  }
  subItemClicked(item: NavMenuItem, subItem: NavMenuItem) {
    this.items.forEach(x => {
      x.isClicked = false;
      x.subItems.forEach(y => y.isClicked = false);
    });
    item.isClicked = true;
    subItem.isClicked = true;
    subItem.isExpanded = !subItem.isExpanded;
    subItem.navigate();

  }
  itemClicked(item: NavMenuItem) {
    this.items.forEach(x => {
      x.isClicked = false;
      x.subItems.forEach(y => { y.isClicked = false; y.isExpanded = false });
    });
    item.isClicked = true;
    item.isExpanded = !item.isExpanded;
    item.navigate();

  }

}
