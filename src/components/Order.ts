import {Form} from "./common/Form";
import {IDeliveryForm, IContactForm} from "../types/index";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class OrderContact extends Form<IContactForm> {
    protected _email: string;
    protected _phone: string;
    protected emailInput:HTMLInputElement;
    protected phoneInput:HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.emailInput.addEventListener('input', () => {
			this.chek()
		});
        this.phoneInput.addEventListener('input', () => {
            console.log(this.phoneInput.value,'o')
			this.chek()
		});

        this.container.addEventListener('submit', (el) => {
            el.preventDefault();
            events.emit('order:submit')
        })
    }

    chek() {
        const emailValid = this.emailInput.value.includes('@');
		const phoneValid = this.phoneInput.value.length > 0;
        if (emailValid && phoneValid) {
            this.valid=true;
        }
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
        console.log(value,'!');
    }

    // get phone(): string {
    //     console.log(this.phoneInput.textContent.toString())
    //     return this.phoneInput.textContent || 'pho';
    // }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    // get email(): string {
    //     return this.emailInput.textContent || 'em';
    // }


}

export class OrderDelivery extends Form<IDeliveryForm>  {
    protected _OnlinePayment: HTMLButtonElement;//способ оплаты онлайн
    protected _ReceiptPayment: HTMLButtonElement;//способ оплаты при получении заказа
	protected _address: string;
    protected _addressInput: HTMLInputElement

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._OnlinePayment = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this._ReceiptPayment = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this._OnlinePayment.classList.add('button_alt-active');
    
        this._OnlinePayment.addEventListener('click', () => {

			this._OnlinePayment.classList.remove('button_alt');
			this._OnlinePayment.classList.add('button_alt-active');
			this._ReceiptPayment.classList.remove('button_alt-active');
			this._ReceiptPayment.classList.add('button_alt');
			
		});

		this._ReceiptPayment.addEventListener('click', () => {

			this._ReceiptPayment.classList.remove('button_alt');
			this._ReceiptPayment.classList.add('button_alt-active');
			this._OnlinePayment.classList.remove('button_alt-active');
			this._OnlinePayment.classList.add('button_alt');
			
		});

        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this._addressInput.addEventListener('input', () => {
			this._address = this._addressInput.value;
            this.valid=true;
		});

        
        this._submit.addEventListener('click', (el) => {
            el.preventDefault();
            events.emit('orderc:open')
        })
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
      }


    //   get address(): string {
    //     // Возвращаем либо сохраненное значение, либо значение из инпута
    //     return this._address || 
    //            (this._addressInput ? this._addressInput.value : '');
    // }
    //   get address(): string {
    //     return this._address;
    // }
    // get address(): string {
    //     return this._addressInput.textContent || 'ad';
    // }
    set valid(value: boolean) {
	    this._submit.disabled = !value;
	}
}