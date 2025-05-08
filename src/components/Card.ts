import {Component} from "./base/Component";
import {IActions, ICard} from "../types";
import { ensureElement} from "../utils/utils";

export class Card extends Component<ICard> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;
  protected _index?: HTMLElement;
  protected _image: HTMLImageElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _buttonTitle: string;
  protected _inBasket: boolean;

  constructor( container: HTMLElement, actions?: IActions) {
      super(container);

      this._title = ensureElement<HTMLElement>(`.card__title`, container);
      this._price =  container.querySelector('.card__price');
      this._image = container.querySelector('.card__image')
      this._button = container.querySelector(`.card__button`);
      this._description = container.querySelector(`.card__text`);
      this._category = container.querySelector('.card__category')
      this._index = container.querySelector('basket__item-index')
      console.log(this._index)
      if (actions?.onClick) {
          if (this._button) {
              this._button.addEventListener('click', actions.onClick);
          } else {
              container.addEventListener('click', actions.onClick);
          }
      }
  }

  set id(value: string) {
      this.container.dataset.id = value;
  }

  get id(): string {
      return this.container.dataset.id || '';
  }

  set title(value: string) {
      this.setText(this._title, value);
  }

  get title(): string {
      return this._title.textContent || '';
  }

  set image(value: string) {
      this.setImage(this._image, value, this.title)
  }

  set description(value: string | string[]) {
    this.setText(this._description, value);
  }

  set category(value: string) {
    this.setText(this._category, value);
  }

  get category(): string {
    return this._category.textContent || '';
  }

  set price(value: number | null) {
    this.setText(this._price, (value) ? `${value.toString()} синапсов` : 'Бесценно');
    if (value === null && this._button) {
			this._button.disabled = true;
		}
  }

  get price(): number {
    return Number(this._price.textContent || '');
  }

  set button(value: string) {
		this.setText(this._button, value);
	}

  set index(value: string) {
    if (this._index){
    this._index.textContent = value;
    console.log(this._index)}
  }

  set inBasket(value: boolean) {
		this.changeButtonTitle(value);
	}

  changeButtonTitle(inBasket: boolean) {
		if (inBasket) {
			this.button = 'Удалить из корзины';
		} else {
			this.button = 'В корзину';
		}
	}
}