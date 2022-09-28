import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { CheckboxModule } from 'primeng/checkbox';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FilterService } from 'primeng/api';
import { ListboxModule } from 'primeng/listbox';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { NavComponent } from './header/nav/nav.component';
import { SearchComponent } from './header/search/search.component';
import { HomeComponent } from './main/home/home.component';
import { OrganizationsComponent } from './main/organizations/organizations.component';
import { GroupsComponent } from './main/groups/groups.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    NavComponent,
    SearchComponent,
    HomeComponent,
    OrganizationsComponent,
    GroupsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CardModule,
    ButtonModule,
    ProgressBarModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    BrowserAnimationsModule,
    SidebarModule,
    CheckboxModule,
    BreadcrumbModule,
    DropdownModule,
    AutoCompleteModule,
    ListboxModule
  ],
  providers: [FilterService],
  bootstrap: [AppComponent],
})
export class AppModule {}
