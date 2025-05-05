import {Model} from "./base/Model";
import {FormErrors, IAppState, IProduct, IOrder, IDeliveryForm, IContactForm} from "../types";

export type CatalogChangeEvent = {
  catalog: Product[]
};

export class Product extends Model<IProduct> {
  id: string;
  title: string;
  price: number | null;
  description: string;
  category: string;
  image: string;
  inBasket: boolean;
}

export class AppState extends Model<IAppState> {
  basket: Product[];
  catalog: Product[];
  loading: boolean;
  order: IOrder = {
    payment: 'online',
    address: '',
    email: '',
    phone: '',
    total: 0,
    items: []
  };
  preview: string | null;
  formErrors: FormErrors = {};

  clearBasket() {
    this.basket = [];
    this.catalog.forEach((item) => {
			item.inBasket = false;
		});
  }

  getTotal() {
    let orderSum = 0;
    this.basket.forEach((item) => {
			orderSum += item.price;
		});
    return orderSum;
  }

  setCatalog(items: IProduct[]) {
    this.catalog = items.map(item => new Product(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  setPreview(item: Product) {
      this.preview = item.id;
      this.emitChanges('preview:changed', item);
  }

  addToBasket(item: Product){
    if(this.basket.indexOf(item) < 0){
      this.basket.push(item);
      this.emitChanges('basket:change', item);
    }
  }

  removeFromBasket(item: Product) {
    this.basket = this.basket.filter((it) => it != item);
    this.emitChanges('basket:change', item);
  }

  busketItemsCount() {
		return this.basket.length;
	}

  setDeliveryField(field: keyof IDeliveryForm, value: string) {
    this.order[field] = value;

    if (this.validateDeliveryField()) {
      this.events.emit('delivery:ready', this.order);
    }
  }

  setContactField(field: keyof IContactForm, value: string) {
    this.order[field] = value;

    if (this.validateContactField()) {
      this.events.emit('contact:ready', this.order);
    }
  }

  validateDeliveryField() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
        errors.email = 'Необходимо указать адрес';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);      return Object.keys(errors).length === 0;
  }

  validateContactField() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
        errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.email = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }
}