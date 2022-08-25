import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taransactionfee'
})
export class TaransactionfeePipe implements PipeTransform {

  transform(value: number) {
    value = Number(value);
    const percentagevalue = (value * 0.25)/100;
    value += percentagevalue;
    return value.toFixed(4);
  }

}
