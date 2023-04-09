import {Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  @Input() progress: number = 0;
  @Input() caption?: string = "";
  @Input() centerCaption?: boolean = false;

  info: string = "#2ab573";
  warn: string = "#ef953b";
  critical: string = "#f16521";
  progressColor: string = "";

  constructor(elementRef: ElementRef) {
    const dom: HTMLElement = elementRef.nativeElement;

    this.progress = Math.min(this.progress, 100) / 100 * (dom.querySelector('.progress-bar')?.clientWidth || 1);

    if (this.progress < 33) {
      this.progressColor = this.critical;
    } else if (this.progress < 66) {
      this.progressColor = this.warn;
    } else {
      this.progressColor = this.info;
      this.progress = this.progress + 1; // to remove a tiny white bit when progress is 100.
    }

    let progressBarBar: HTMLDivElement =  dom.querySelector('.progress-bar-bar')!;
    progressBarBar.style.width = `${this.progress}px`;
    progressBarBar.style.backgroundColor = this.progressColor;

    let progressLabel: HTMLSpanElement = dom.querySelector('.progress-label')!;
    progressLabel.style.marginLeft = "3px";
    progressLabel.style.color = this.progressColor;

    /*if ($scope.largePercentText){
      progressLabel.css({'margin-left':'6px', 'color': progressColor});
    } else {
      progressLabel.css({'margin-left':'3px', 'color': progressColor});
    }*/

    if(this.centerCaption){
      let captionSpan: HTMLSpanElement = dom.querySelector('.md-caption')!;
      let captionSpanWidth = captionSpan.offsetWidth;
      let progressBarWidth = dom.querySelector('.progress-bar')!.clientWidth;
      let offset = (progressBarWidth / 2) - (captionSpanWidth / 2);
      captionSpan.style.left = `${offset}px`;
      captionSpan.style.position = "relative";
    }
  }

  ngOnInit(): void {
  }

}
