import {
    trigger,
    animate,
    transition,
    style,
    query,
} from '@angular/animations';

//this animation comes from
//https://arminzia.com/blog/angular-router-fade-animation

export const fadeAnimation = trigger('fadeAnimation', [
    transition('* => *', [
        query(':enter', [style({ opacity: 0, position: 'relative' })], {
            optional: true,
        }),
        query(
            ':leave',
            [
                style({ opacity: 1 }),
                animate('0.5s', style({ opacity: 0, position: 'relative' })),
            ],
            { optional: true }
        ),
        query(
            ':enter',
            [
                style({ opacity: 0 }),
                animate('1s', style({ opacity: 1, position: 'relative' })),
            ],
            { optional: true }
        ),
    ]),
]);