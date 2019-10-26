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
    MatDialogModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatChipsModule} from '@angular/material';

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
        MatDialogModule,
        MatCheckboxModule,
        MatBadgeModule,
        MatChipsModule
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
        MatDialogModule,
        MatCheckboxModule,
        MatBadgeModule,
        MatChipsModule
    ]
})
export class MaterialModule {

}