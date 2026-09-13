import { Component, input } from '@angular/core';
@Component({
  selector: 'c-icon',
  template: `<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path [attr.d]="paths[name()] || paths['arrow']" />
  </svg>`,
  styles: [
    `
      :host {
        display: inline-flex;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }
      svg {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class Icon {
  name = input('arrow');
  paths: Record<string, string> = {
    home: 'M3 10 12 3 21 10V21H15V14H9V21H3Z',
    map: 'M3 5 9 3 15 5 21 3V19L15 21 9 19 3 21ZM9 3V19M15 5V21',
    book: 'M12 5C8 2 4 3 2 4V20C6 18 9 19 12 21C15 19 18 18 22 20V4C18 2 15 3 12 5ZM12 5V21',
    code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18',
    bookmark: 'M6 3H18V21L12 17 6 21Z',
    chart: 'M4 20V12M12 20V4M20 20V8',
    update: 'M20 7A9 9 0 1 0 21 14M20 2V7H15M12 7V12L15 14',
    arrow: 'M4 12H20M14 6 20 12 14 18',
    search: 'M21 21 16 16M18 10A8 8 0 1 1 2 10 8 8 0 0 1 18 10',
    check: 'm5 12 4 4L19 6',
    chevron: 'm9 5 7 7-7 7',
    menu: 'M4 6H20M4 12H20M4 18H20',
    close: 'm6 6 12 12M18 6 6 18',
    compass: 'M22 12A10 10 0 1 1 2 12 10 10 0 0 1 22 12ZM16 8 14 14 8 16 10 10Z',
    download: 'M12 3V16M7 11 12 16 17 11M3 17V21H21V17',
    external: 'M14 3H21V10M21 3 10 14M10 3H3V21H21V14',
    clock: 'M22 12A10 10 0 1 1 2 12 10 10 0 0 1 22 12ZM12 6V12L16 14',
  };
}
