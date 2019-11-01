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
    MatChipsModule,
    MatProgressSpinnerModule} from '@angular/material';

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
        MatChipsModule,
        MatProgressSpinnerModule
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
        MatChipsModule,
        MatProgressSpinnerModule
    ]
})
export class MaterialModule {

}