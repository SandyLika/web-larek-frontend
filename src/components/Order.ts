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
			this.chek()
		});

        // this.container.addEventListener('submit', (el) => {
        //     el.preventDefault();
        //     events.emit('order:submit')
        // })
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
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
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
        //this._OnlinePayment.classList.add('button_alt-active');
        this.toggleClass(this._OnlinePayment,'button_alt-active', true )
    
        this._OnlinePayment.addEventListener('click', () => {
            this.toggleCard()
            this.toggleCash(false)
		});

		this._ReceiptPayment.addEventListener('click', () => {
            this.toggleCash()
            this.toggleCard(false)
		});

        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this._addressInput.addEventListener('input', () => {
			this._address = this._addressInput.value;
            this.valid=true;
		});

        
        // this._submit.addEventListener('click', (el) => {
        //     el.preventDefault();
        //     events.emit('orderc:open')
        // })
    }


    toggleCard(state: boolean = true) {
        this.toggleClass(this._OnlinePayment, 'button_alt-active', state);
    }

    toggleCash(state: boolean = true) {
        this.toggleClass(this._ReceiptPayment, 'button_alt-active', state);
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
      }
    // set valid(value: boolean) {
	//     this._submit.disabled = !value;
	// }
}