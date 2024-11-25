import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DasboardOpenAiComponent } from './Front/dasboard-open-ai/dasboard-open-ai.component';



const routes: Routes = [
  {
    path: '',
    component: DasboardOpenAiComponent,
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
