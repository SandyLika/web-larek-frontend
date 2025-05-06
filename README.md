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

## Об архитектуре 
Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и еще они меняют значения в моделях.

## Макет
[Ссылка на макет в Figma](https://www.figma.com/design/50YEgxY8IYDYj7UQu7yChb/Веб-ларёк?node-id=0-1&t=mhsSFer0H4P8Kybi-0)

## Базовый код
### Class `Api`
Класс предназначен для выполнеия запросов к Api.
`constructor(baseUrl: string, options: RequestInit = {})` Конструктор принимает базовый URL и опции для запросов(опционально).
Методы:
  - `handleResponse` обрабатывает ответ от сервера, возвращает json.
  - `get` выполняет get запрос по указанному URL.
  - `post` выполняет один из запросов post, put, delete.
### Class `EventEmitter`
Класс реализует брокер событий, который позволяет объектам подписываться на события, отписываться от них и инициировать события.
Конструктор инициализирует обьект.
```
constructor() {
  this._events = new Map<EventName, Set<Subscriber>>();
}
```
Методы:
  - `on` подписывает на событие.
  - `off` отписывает от события.
  - `onAll` подписывает на всё.
  - `offAll` отписывает от всего.
  - `emit` инициалицирует событие.
  - `trigger` создает триггер для события.
### Class `Component`
Класс предназначен для создания компонентов интерфейса, управления DOM элемантами. Класс абстрактный.Обобщенный тип `<T>` позволяет определить тип данных компонента.
`constructor(protected readonly container: HTMLElement)` Конструктор принимает DOM-элемент, который служит контейнером для компонента.
Методы:
  - `toggleClass` - переключается класс для переданного элемента.
  - `setText` - устанавливает текстовое содержимое для переданного элемента.
  - `setImage` - устанавливает изображения и альтернативный текст(опционально) для изоображения.
  - `setDisabled` - изменяет статус блокировки для переданного элемента.
  - `setHidden` - скрывает переданные элемент.
  - `setVisible` - отоброжает переданный элемент.
  - `render` - рендерит компонент, используя переданные данные. Возвращает контейнер компонента.

## Компоненты модели данных (бизнес-логика)
### Class `Product`
Класс для создания у управлением данных продуктов. Наследует все от Model<IProduct>
### Class `AppData`
Класс для представления состояние приложения, каталога, корзины, заказа и тд. Наследуется от Model<IAppState>.
Методы:
  - `clearBasket` - очищает корзину.
  - `getTotal` - берет общую стоймость товаров в корзине.
  - `setCatalog` - устанавливает каталог продуктов.
  - `setPreview` - устанавливает просмотр продукта.
  - `addToBasket` - добавляет товар в корзину.
  - `removeFromBasket` - удаляет товар из корзины.
  - `busketItemCount` - беретколичетво товаров в корзине.
  - `setDeliveryField` - устнавливает значение данных доставки, инициализирует готовность данных при успешной валидации.
  - `setContctField` - устнавливает значение данных сонтактов, инициализирует готовность данных при успешной валидации.
  - `validteDeliveryField` - проверяет валидность форм доставки.
  - `validateContactField` - проверяет валидность форм контактов.
## Компоненты представления
### Class `Page`
Класс, предназначенный для управления и отоброжением основных элементов страницы, таких как каталог продуктов, счетчик товаров в корзине.
` constructor(container: HTMLElement, protected events: IEvents)`Конструктор принимает страницу и обьект управления
Методы:
  - set `counter` - устанавливает значение счетчика товаров в корзине.
  - set `catalog` - заменяет содержимое каталога предоставленными данными.
### Class `Card`
Класс для упраления карточками товара.
`constructor( container: HTMLElement, actions?: IActions)` Конструктор принимает карточку и действия связаные с ней(опционально)
Методы:
  - set/get `id` - управляет id товара.
  - set/get `title` - управляет названием товара.
  - set/get `price` - управляет ценой товара.
  - set/get `category` - управляет категорией и ее видом.
  - set `image` - устанавливает изображение товара.
  - set `description` - устанавливает описание товара.
  - set `inBasket` - устанавливает находится ли товар в корзине.
  - `changeButtonTitle` - меняет надпись на кнопке в зависимосли от ее нахождения в корзине или нет
### Class `Modal`
Класс для создания и управления модальными окнами.
`constructor(container: HTMLElement, protected events: IEvents)` Конструктор прринимает элемент окна и действия
Методы:
  - `content` - устанавливает содержимое модального окна.
  - `open` - открывает модальное окно и инициирует событие открытия модалки.
  - `close` - закрывает модальное окно и инициирует событие зыкрытие модалки.
  - `render` - Рендерит модальное окно с переданным содержимым и открывает его.
### Class `Form`
Класс для управлени яформами в приложениию
`constructor(protected container: HTMLFormElement, protected events: IEvents)` Конструктор принимает форму и действия.
Методы:
  - `InInputChange` - обработчик событий ввода, вызывается при каждом изменении в полях формы.
  - set `valid` - управляет доступностью кнопки отправки в зависимости от валидности формы.
  - set `errors` - устанавливает и отображает ошибки валидации формы.
  - `render` - Pендкрит состоение формы, проверяет валидность, ошибки и значенеия полей.
  
### Class `Basket`
Класс для управления корзиной покупок.
`constructor(container: HTMLElement, protected events: EventEmitter)` Конструктор принимает обьект корзины и обьект с действиями для нее(опционально)
Методы:
  - set `items` - устанавливает товары в корзине.
  - set `total` - устанавливает общую стоимость товаров.
  - set `selected` -  устанавливает доступность кнопки
### Class `OrderDelivery`
Класс для отображения и управления формой доставки. Наследуется от `Form<IDeliveryForm>`.
`constructor(container: HTMLFormElement, events: IEvents)` констурктор принимает элемент формы и обьект с событиями.
Методы:
  - `toggleButton` - переключает кнопки способа оплаты
  - set `addres` -  устанавливает аддрес доставки
### Class `OrderContact`
Класс для отображения и управления формой доставки. Наследуется от `Form<IContactForm>`.
`constructor(container: HTMLFormElement, events: IEvents)` констурктор принимает элемент формы и обьект с событиями.
Методы:
  - set `phone` - устанавливает телефон получателя заказа
  - set `email` -  устанавливает электорнную почту получателя
### Class `Success`
Класс для отображения сообщения об удачном заказе.
`constructor(container: HTMLElement, actions: ISuccessActions)` Конструктор принимает контейнер успеха и обьект с действиями(опционально)
Методы:
  - set `total` - устанавливает текст отображающий сумму операции.
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

// Список всех событий
items:changed // изменение продуктов в каталоге
card:select // выбор карточки из каталона
preview:changed // изменение окна детального просмотра
product:add // добавление продукта в корзину
product:remove // удаление продукта из корзины
basket:select // отображение модального окна корзины
counter:changed // изменение счетчика корзины
basket:open // открытие окна корзины
orderd:open // открытие окна формы доставки
formErrors:change // изменение списка ошибок
/^orderd\..*:change/ // изменение любого поля формы доставки
/^orderc\..*:change/ // изменение любого поля формы контактов
order:submit // оформление заказа
modal:open // открытие модального окна
modal:close // закрытие модального окна
```