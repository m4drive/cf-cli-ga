using {sample  as my} from '../db/schema';
using {sap} from '@sap/cds/common';

@path : 'service/test' 
service TestService @(requires: 'authenticated-user') {
    entity Test as projection on my.Test;
}
annotate TestService.Test with @(
    UI:{
        LineItem:[
            {
                $Type : 'UI.DataField',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Value : description
            }
        ]
    }
);
