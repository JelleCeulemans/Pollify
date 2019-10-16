import { NgModule } from '@angular/core';
import { 
    MatToolbarModule, 
    MatIconModule,
    MatButtonModule, 
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule} from '@angular/material';

@NgModule({
    imports: [
        MatToolbarModule, 
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule
    ],
    exports: [
        MatToolbarModule, 
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule
    ]
})
export class MaterialModule {

}