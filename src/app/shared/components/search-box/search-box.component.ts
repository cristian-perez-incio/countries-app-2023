import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html'
})
export class SearchBoxComponent {

  @Input()
  public placeholder: string = '';

  @Output()
  public onSearchTerm: EventEmitter<string> = new EventEmitter();

  emitSearchTerm(searchTerm: string): void {
    this.onSearchTerm.emit(searchTerm);
  }

}
