import {Component} from "../base/Component";
import {createElement, ensureElement} from "../../utils/utils";
import {EventEmitter} from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('orderd:open');
            });
        }
        //this._button.disabled = true;
        this.setDisabled(this._button, true)
        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            //this._button.disabled = false;
            this.setDisabled(this._button, false)
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            //this._button.disabled = true;
            this.setDisabled(this._button, true)
        }
    }

    set total(total: number) {
        this.setText(this._total, `${total.toString()} синапсов`);
    }


    get total(): number {
        const text = this._total.textContent;
        if (!text) return 0;
    
        const numbers = text.match(/\d+/);
        if (!numbers) return 0;
    
        return parseInt(numbers[0]);
    }
}