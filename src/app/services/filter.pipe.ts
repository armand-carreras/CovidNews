import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: Object[], property: string, trozo: string): any[] {
    if (!property) {
      return items;
    }
    return items.filter(element => {
      return element[property].toLowerCase().includes(trozo);
    });
  }

}
