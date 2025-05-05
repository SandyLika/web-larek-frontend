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

      this._title = ensureElement<HTMLElement>(`.__title`, container);
      this._price =  container.querySelector('.card__price');
      this._image = container.querySelector('')
      this._button = container.querySelector(`.__button`);
      this._description = container.querySelector(`.__description`);
      this._category = container.querySelector('')
      this._index = container.querySelector('')
      
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
    //this._category.classList.add(categoryClasses[value])
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

  set button(value: string) {
		this.setText(this._button, value);
	}

  set index(value: string) {
    this._index.textContent = value;
  }

  get index(): string {
    return this._index.textContent || '';
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