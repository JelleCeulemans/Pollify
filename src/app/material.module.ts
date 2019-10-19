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
    MatRadioModule,
    MatDialogModule} from '@angular/material';

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
        MatRadioModule,
        MatDialogModule
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
        MatRadioModule,
        MatDialogModule
    ]
})
export class MaterialModule {

}