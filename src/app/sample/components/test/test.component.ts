import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  signal,
} from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { NgxTranslateModule } from '../../../ngx-translate/ngx-translate.module';
import { TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}
@Component({
  selector: 'ebb-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  standalone: true,
  imports: [MaterialModule, NgxTranslateModule, HttpClientModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements OnInit {
  constructor(public translateService: TranslateService) {}
  ngOnInit(): void {
    // Sets language from browser settings.
    this.setupLanguage();
  }
  private setupLanguage() {
    // Setups language using browser settings.
    this.translateService.setDefaultLang(this.getLanguage(navigator.language));
    this.translateService.use(this.getLanguage(navigator.language));
  }
  private getLanguage(language: string): string {
    console.log('SignInPageComponent #getLanguage() language:' + language);

    // ブラウザ言語設定に-が含まれている場合(en-USとか)は、-前の文字列から設定を返す。
    const CHAR_HYPHEN = '-';
    if (language.indexOf(CHAR_HYPHEN) > 0) {
      const splittedLanguage: string[] = language.split(CHAR_HYPHEN);
      console.log(
        'SignInPageComponent #getLanguage() splittedLanguage[0]:' +
          splittedLanguage[0]
      );

      return splittedLanguage[0];
    }
    return language;
  }
  readonly task = signal<Task>({
    name: 'Parent task',
    completed: false,
    subtasks: [
      { name: 'Child task 1', completed: false },
      { name: 'Child task 2', completed: false },
      { name: 'Child task 3', completed: false },
    ],
  });

  readonly partiallyComplete = computed(() => {
    const task = this.task();
    if (!task.subtasks) {
      return false;
    }
    return (
      task.subtasks.some((t) => t.completed) &&
      !task.subtasks.every((t) => t.completed)
    );
  });

  update(completed: boolean, index?: number) {
    this.task.update((task) => {
      if (index === undefined) {
        task.completed = completed;
        task.subtasks?.forEach((t) => (t.completed = completed));
      } else {
        task.subtasks![index].completed = completed;
        task.completed = task.subtasks?.every((t) => t.completed) ?? true;
      }
      return { ...task };
    });
  }
}
