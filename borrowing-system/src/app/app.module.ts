import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Routes
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { HomeComponent,
  FinesComponent,
  LoginComponent,
  AddProductComponent
} from './components/index.components';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddProductComponent,
    FinesComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
