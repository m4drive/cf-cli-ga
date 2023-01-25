namespace sample;
using { cuid } from '@sap/cds/common';

entity Test: cuid{ 
    name: String;
    description: String;
}