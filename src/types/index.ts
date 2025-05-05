//отображение главной страницы
export interface IPage {
  basketCount:number;
  catalog: HTMLElement[];
}
//описание приложения
export interface IAppState {
  catalog:IProduct[];
  basket:IProduct[];
  order: IOrder;
}
//описание апи методов
export interface IApi {
  getProductList: () => Promise<IProduct[]>;
  getProductItem: (id: string) => Promise<IProduct>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}
//действия
export interface IActions {
  onClick: (event: MouseEvent) => void;
}
//описание товара
export interface IProduct {
  id: string;
	title: string;
	price: number | null;
	category: string;
	image: string;
	description: string;
  inBasket: boolean;
  //index?: string;
  //buttonTitle? : string;
}

export interface ICard extends IProduct {
  index?: string;
  buttonTitle? : string;
}
// Данные доставки
export interface IDeliveryForm {
  payment: string; //способ оплаты
  address: string; //адрес покупателя
}

// контактные данные покупателя
export interface IContactForm {
  email: string; //почта покупателя
  phone: string; //телефон покупателя
}
//описание всего заказа
export interface IOrder extends IDeliveryForm, IContactForm {
  items:string[];//товары в заказе
  total: number;//итоговая сумма заказа
}
//описание результата заказа
export interface IOrderResult {
	id: string;
	total: number;
}

export interface IBasket {
  items: HTMLElement[];//Массив элементов товара в корзине
  total:number;
  addToBasket(val:IProduct):void;//добавить в корзину
  deleteFromBasket(id:string):void; //удалить из корзины
  clearBasket():void;//очистить корзину
  getTotalPrice():number; //посчитать итоговую сумму
}

export interface ISuccess {
  total: number;
}

export interface ISuccessActions {
  onClick: () => void;
}

//ошибки форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;