import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StudyStore } from './study.store';
import { Icon } from './icon';
@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Icon],
  template: `
    <a class="skip-link" href="#main" (click)="skipToContent($event)">Skip to content</a>
    <div class="mobile-bar">
      <a class="brand" routerLink="/"
        ><span class="brand-symbol"><c-icon name="compass" /></span>compass<span class="brand-dot"
          >.</span
        ></a
      ><button
        class="icon-button"
        (click)="menu.set(!menu())"
        [attr.aria-expanded]="menu()"
        aria-controls="sidebar"
        aria-label="Toggle navigation"
      >
        <c-icon [name]="menu() ? 'close' : 'menu'" />
      </button>
    </div>
    @if (menu()) {
      <button class="scrim" aria-label="Close navigation" (click)="menu.set(false)"></button>
    }
    <aside id="sidebar" class="sidebar" [class.mobile-open]="menu()">
      <a class="brand desktop-brand" routerLink="/"
        ><span class="brand-symbol"><c-icon name="compass" /></span>compass<span class="brand-dot"
          >.</span
        ></a
      >
      <div class="workspace-label"><span class="status-dot"></span> YOUR INTERVIEW WORKSPACE</div>
      <nav aria-label="Main navigation">
        @for (item of navigation; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.path === '/' }"
            ariaCurrentWhenActive="page"
            ><c-icon [name]="item.icon" /><span>{{ item.label }}</span>
            @if (item.path === '/saved' && store.progress().saved.length) {
              <span class="nav-count">{{ store.progress().saved.length }}</span>
            }
          </a>
        }
      </nav>
      <div class="sidebar-path">
        <span class="eyebrow">CURRENT PATH</span
        ><a routerLink="/roadmap"
          ><span class="angular-mini">A</span>
          <div><strong>Angular</strong><small>Senior developer</small></div>
          <c-icon name="chevron"
        /></a>
        <div
          class="meter"
          role="progressbar"
          [attr.aria-valuenow]="store.percentage()"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Path progress"
        >
          <span [style.width.%]="store.percentage()"></span>
        </div>
        <small>{{ store.learnedCount() }} / {{ store.questions().length }} understood</small>
      </div>
      <div class="sidebar-bottom">
        <p>One clear direction.<br />One question at a time.</p>
        <a href="https://github.com/Hossam-k911/compass" target="_blank" rel="noopener"
          >Built in the open <c-icon name="external" /></a
        ><small>Compass · early access</small>
      </div>
    </aside>
    <div class="app-content">
      <header class="topbar">
        <span>DEVELOPER INTERVIEW PREP</span>
        <div class="topbar-right">
          <span class="device-note"
            ><span class="status-dot"></span> Progress stays on this device</span
          ><a routerLink="/progress" class="profile-badge" aria-label="Your progress"
            ><c-icon name="chart"
          /></a>
        </div>
      </header>
      <main id="main" tabindex="-1">
        @if (store.loading()) {
          <div class="empty-state" role="status">
            <c-icon name="compass" />
            <h1>Finding your direction…</h1>
            <p>Loading your learning path.</p>
          </div>
        } @else if (store.error()) {
          <div class="empty-state" role="alert">
            <h1>Let’s try that again.</h1>
            <p>{{ store.error() }}</p>
            <button class="button primary" (click)="store.load()">Retry loading</button>
          </div>
        } @else {
          <router-outlet />
        }
      </main>
      <footer class="page-footer">
        <span>Compass · Learn with direction.</span
        ><a routerLink="/updates">Content & sources <c-icon name="arrow" /></a>
      </footer>
    </div>
    @if (store.notice()) {
      <div class="toast" role="status">
        <span>{{ store.notice() }}</span
        ><button
          class="icon-button"
          aria-label="Dismiss notification"
          (click)="store.notice.set('')"
        >
          <c-icon name="close" />
        </button>
      </div>
    }
  `,
})
export class App {
  skipToContent(event: Event) {
    event.preventDefault();
    document.getElementById('main')?.focus();
  }
  store = inject(StudyStore);
  menu = signal(false);
  navigation = [
    { path: '/', label: 'Overview', icon: 'home' },
    { path: '/roadmap', label: 'Learning path', icon: 'map' },
    { path: '/study', label: 'Study room', icon: 'book' },
    { path: '/practice', label: 'Practice', icon: 'code' },
    { path: '/saved', label: 'Saved questions', icon: 'bookmark' },
    { path: '/progress', label: 'My progress', icon: 'chart' },
    { path: '/updates', label: 'Content updates', icon: 'update' },
  ];
  constructor() {
    inject(Router)
      .events.pipe(takeUntilDestroyed())
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.menu.set(false);
          document.getElementById('main')?.focus({ preventScroll: true });
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      });
  }
}
