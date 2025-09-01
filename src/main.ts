import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    importProvidersFrom(FormsModule)
  ]
}).catch(err => console.error(err));