import React from 'react';

export interface User {
    id: string;
    name: string;
    colorBg: string;
    colorText: string;
    colorBorder: string;
}

export interface Settlement {
    from: User;
    to: User;
    amount: number;
}

export type SplitMode = 'EQUAL' | 'UNEQUAL';

export interface Chore {
    id: string;
    name: string;
    value: number;
    Icon: React.ElementType;
    description: string;
}