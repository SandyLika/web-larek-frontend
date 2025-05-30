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
  basket: Product[]=[];
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
    const total = this.basket.reduce((orderSum, item) =>{
      return orderSum += item.price;
    },0);
  return total;
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
      this.basket.push(item);
      this.emitChanges('basket:change', item);
      this.emitChanges('counter:changed', this.basket);
  }

  removeFromBasket(item: Product) {
    this.basket = this.basket.filter((it) => it != item);
    this.emitChanges('basket:change', item);
    this.emitChanges('counter:changed', this.basket);
  }

  busketItemsCount() {
		return this.basket.length;
	}

  setDeliveryField(field: keyof IDeliveryForm, value: string) {
    this.order[field] = value;

    this.validateDeliveryField()
  }

  setContactField(field: keyof IContactForm, value: string) {
    this.order[field] = value;

    this.validateContactField()
     
  }

  validateDeliveryField() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
        errors.email = 'Необходимо указать адрес';
    }
    this.formErrors = errors;
    this.events.emit('formDeliveryErrors:change', this.formErrors);      
    return Object.keys(errors).length === 0;
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
    this.events.emit('formContactErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  getOrder(): IOrder {
    return {
      payment: this.order.payment,
      email: this.order.email,
      phone: this.order.phone,
      address: this.order.address,
      total: this.order.total,
      items: this.order.items,
    };
  }
}