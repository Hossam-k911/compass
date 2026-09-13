import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { App } from './app/app';
bootstrapApplication(App, {
  providers: [
    provideRouter(
      [
        {
          path: '',
          loadComponent: () => import('./app/home').then((m) => m.Home),
          title: 'Compass — Your guide to developer interviews',
        },
        {
          path: 'roadmap',
          loadComponent: () => import('./app/roadmap').then((m) => m.Roadmap),
          title: 'Angular learning path · Compass',
        },
        {
          path: 'study',
          loadComponent: () => import('./app/study').then((m) => m.Study),
          title: 'Study room · Compass',
        },
        {
          path: 'study/:id',
          loadComponent: () => import('./app/study').then((m) => m.Study),
          title: 'Study room · Compass',
        },
        {
          path: 'saved',
          loadComponent: () => import('./app/study').then((m) => m.Study),
          data: { saved: true },
          title: 'Saved questions · Compass',
        },
        {
          path: 'practice',
          loadComponent: () => import('./app/practice').then((m) => m.Practice),
          title: 'Practice · Compass',
        },
        {
          path: 'progress',
          loadComponent: () => import('./app/progress').then((m) => m.ProgressPage),
          title: 'My progress · Compass',
        },
        {
          path: 'updates',
          loadComponent: () => import('./app/updates').then((m) => m.Updates),
          title: 'Content updates · Compass',
        },
        { path: '**', redirectTo: '' },
      ],
      withHashLocation(),
    ),
  ],
}).catch((error) => {
  console.error(error);
  document.body.textContent = 'Compass could not start. Please reload the page.';
});
