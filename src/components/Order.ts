import {Form} from "./common/Form";
import {IDeliveryForm, IContactForm} from "../types/index";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class OrderContact extends Form<IContactForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}

export class OrderDelivery extends Form<IDeliveryForm>  {
    protected _OnlinePayment: HTMLButtonElement;//способ оплаты онлайн
    protected _ReceiptPayment: HTMLButtonElement;//способ оплаты при получении заказа
	protected _address: string;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._OnlinePayment = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this._ReceiptPayment = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this._OnlinePayment.classList.add('button_alt-active');
    }

    toggleButtons(target: HTMLElement){
        this._OnlinePayment.classList.toggle('button_alt-active');
        this._ReceiptPayment.classList.toggle('button_alt-active');
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
      }
}