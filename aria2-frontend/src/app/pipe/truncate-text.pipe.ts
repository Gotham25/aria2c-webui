import { Pipe, PipeTransform } from '@angular/core';

const DEFAULT_TRUNCATE_LIMIT: number = 140;

@Pipe({
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {

  transform(value: string, ...args: any[]): string {
    const limit: number = args.length > 0 ? parseInt(args[0], 10) : DEFAULT_TRUNCATE_LIMIT;

    if(value.length > limit) {
      value = value.substring(0, limit - 3) + "...";
    }

    return value;
  }

}
