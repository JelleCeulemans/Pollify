import { NgModule } from '@angular/core';
import { 
    MatToolbarModule, 
    MatIconModule,
    MatButtonModule, 
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatCardModule,
    MatRadioModule} from '@angular/material';

@NgModule({
    imports: [
        MatToolbarModule, 
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatCardModule,
        MatRadioModule
    ],
    exports: [
        MatToolbarModule, 
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatCardModule,
        MatRadioModule
    ]
})
export class MaterialModule {

}