import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'conversion'
})
export class ConversionPipe implements PipeTransform {

  transform(value: number, code: string){
      // return something always
      switch (code) {
        case 'USD':
          return (value *= 74.21);
        case 'EUR':
          return (value *= 84);
        case 'GBP':
          return (value *= 102);
        case 'JPY':
          return (value *= 0.645);
        default:
          return value;
      }
    }

}
