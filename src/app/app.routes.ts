import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrainsComponent } from './trains/trains.component';
import { CustomersComponent } from './customers/customers.component';
import { PaymentComponent } from './payment/payment.component';
import { TktCheckReturnComponent } from './tkt-check-return/tkt-check-return.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path: "/საწყისი",
        component: HomeComponent
    },
    {
        path: "/რეისები",
        component: TrainsComponent
    },{
        path: "/მგზავრთა მონაცემები",
        component: CustomersComponent
    },{
        path: "/გადახდა",
        component: PaymentComponent
    },{
        path: "/ჯავშნები",
        component: TktCheckReturnComponent
    },
];
