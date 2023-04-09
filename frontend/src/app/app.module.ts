import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatDialogModule } from "@angular/material/dialog";
import { HttpClientModule } from "@angular/common/http";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

import { ProgressBarModule } from 'angular-progress-bar';

import { RowItemComponent } from './component/row-item/row-item.component';
import { PreviewDialogComponent } from './component/preview-dialog/preview-dialog.component';
import { StateFilterChipHolderComponent } from './component/state-filter-chip-holder/state-filter-chip-holder.component';
import { SessionInfoComponent } from './component/session-info/session-info.component';
import { SupportedFeaturesComponent } from './component/supported-features/supported-features.component';
import { AddUrlComponent } from './component/add-url/add-url.component';
import { ProgressBarComponent } from './component/progress-bar/progress-bar.component';
import { MaterialElevationDirective } from './directive/material-elevation.directive';
import { TruncateTextPipe } from './pipe/truncate-text.pipe';
import { ClipboardModule } from "ngx-clipboard";

@NgModule({
  declarations: [
    AppComponent,
    RowItemComponent,
    PreviewDialogComponent,
    StateFilterChipHolderComponent,
    SessionInfoComponent,
    SupportedFeaturesComponent,
    AddUrlComponent,
    ProgressBarComponent,
    MaterialElevationDirective,
    TruncateTextPipe
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatTooltipModule,
        FlexLayoutModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        MatDialogModule,
        HttpClientModule,
        MatToolbarModule,
        MatBadgeModule,
        MatMenuModule,
        ProgressBarModule,
        ClipboardModule
    ],
  providers: [
    {
      useValue: window,
      provide: Window
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
