export interface NavMenuItem {
    name: string;
    icon: string;
    navigate: any;
    isClicked: boolean;
    isExpanded: boolean;
    subItems: NavMenuItem[];
}