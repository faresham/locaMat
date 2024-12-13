import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {environment} from './environments/environment';

const app = initializeApp(environment.firebaseConfig);
const auth = getAuth(app);

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));
