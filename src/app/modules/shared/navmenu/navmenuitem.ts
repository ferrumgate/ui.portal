export interface NavMenuItem {
    name: string;
    icon: string;
    isSVG?: boolean;
    navigate: any;
    isClicked: boolean;
    isExpanded: boolean;
    subItems: NavMenuItem[];

}