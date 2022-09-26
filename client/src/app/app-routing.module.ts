import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { GroupsComponent } from './main/groups/groups.component';
import { HomeComponent } from './main/home/home.component';
import { OrganizationsComponent } from './main/organizations/organizations.component';

const fallbackRoute: Route = { path: '**', component: HomeComponent };

const routes: Routes = [
  {path:'home', component:HomeComponent},
  {path:'shelters/:id', component:OrganizationsComponent},
  {path:'shelters/:id/animaltypes/:id', component:GroupsComponent},
  fallbackRoute
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
