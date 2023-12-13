import { LightningElement ,track} from 'lwc';

export default class Testselecet extends LightningElement {
    address = {
        street: '121 Spear St.',
        city: 'San Francisco',
        province: 'CA',
        postalCode: '94105',
        country: 'US',
    };

    _country = 'US';

    countryProvinceMap = {
        US: [
            { label: 'California', value: 'CA' },
            { label: 'Texas', value: 'TX' },
            { label: 'Washington', value: 'WA' },
        ],
        CN: [
            { label: 'GuangDong', value: 'GD' },
            { label: 'GuangXi', value: 'GX' },
            { label: 'Sichuan', value: 'SC' },
        ],
        VA: [],
    };

    countryOptions = [
        { label: 'United States', value: 'US' },
        { label: 'China', value: 'CN' },
        { label: 'Vatican', value: 'VA' },
    ];

    get getProvinceOptions() {
        return this.countryProvinceMap[this._country];
    }
    get getCountryOptions() {
        return this.countryOptions;
    }

    handleChange(event) {
        this._country = event.detail.country;
    }
   
    chooseopt(event){
        debugger;
        this.opt=event.target.value;
        console.log('opt---->'+this.opt);
        const item = this.template.querySelector(".selectclass1")
        item.style.border = '1px solid yellow';
        this.clickinp();
    }
    focusinp(){
        const item = this.template.querySelector(".selectclass1")
        item.style.border = '1px solid yellow';  
    }
    clickinp(){
        debugger;
        const item = this.template.querySelector(".selectclass1")
        item.style.border = '1px solid black'; 
        //item.style.box_shadow='none'; 
       // item.classList.add('sample');
    }
    @track opt;
}