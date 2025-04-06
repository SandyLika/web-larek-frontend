# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Макет
[Ссылка на макет в Figma](https://www.figma.com/design/50YEgxY8IYDYj7UQu7yChb/Веб-ларёк?node-id=0-1&t=mhsSFer0H4P8Kybi-0)

## Базовый код
скоро появиться...
## Компоненты модели данных (бизнес-логика)
скоро появиться..
## Компоненты представления
скоро появиться...
## Ключевые типы данных
```
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
}
//описание заказа
export interface IOrder {
  item:string[];//товары в заказе
  total: number;//итоговая сумма заказа
  payment: string;//способ оплаты
  address: string;//адрес
  email:string;//почта
  phone:string;//телефон
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
```