import './scss/styles.scss';

//импорты
import { LarekAPI } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, createElement, ensureElement} from "./utils/utils";
import { AppState, CatalogChangeEvent, Product } from './components/AppData';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { OrderContact, OrderDelivery } from './components/Order';
import { Card } from './components/Card';
import { Success } from './components/common/Success';
import { IOrder , IContactForm, IDeliveryForm} from './types';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

//шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactOrderTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const delivery = new OrderDelivery(cloneTemplate(deliveryOrderTemplate), events);
const contact = new OrderContact(cloneTemplate(contactOrderTemplate),events);

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map(item => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
    });
    return card.render({
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category
    });
  });
});

//открыть карточку товара
events.on('card:select', (item: Product) => {
  appData.setPreview(item);
});

events.on('preview:changed', (item: Product) => {
  const card = new Card(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if (!item.inBasket) {
				events.emit('product:add', item);
			} else {
				events.emit('product:remove', item);
			}
      card.changeButtonTitle(item.inBasket);
    }
  });
  modal.render({
    content: card.render({
      title: item.title,
      description: item.description,
      image: item.image,
      price: item.price,
      category: item.category,
      inBasket: item.inBasket,
    })
  })
})

//открытие корзины
events.on('basket:open', () => {
  modal.render({
    content: basket.render({})
  })
});

// Добавление товара в корзину
events.on('product:add', (item: Product) => {
	item.inBasket = true;
	appData.addToBasket(item);
  modal.close();
});

// Удаление товара из корзины
events.on('product:remove', (item: Product) => {
	item.inBasket = false;
	appData.removeFromBasket(item);
  modal.close();
});

events.on('basket:change', () => {
  basket.total = appData.getTotal();
	basket.items = appData.basket.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('product:remove', item);
			},
		});
		return card.render({
			index: (index + 1).toString(),
			title: item.title,
			price: item.price,
		});
	});
  appData.order.total = appData.getTotal();
});

// Отображение модального окна корзины
events.on('basket:select', () => {
	// Активируем кнопку oформить если в корзину добавлен товар
	modal.render({
		content: basket.render({
			total: appData.getTotal(),
		}),
	});
});
//обновление количества товаров
events.on('counter:changed', (item: string[]) => {
  page.counter = appData.basket.length;
})

// Открыть форму доставкки заказа
events.on('orderd:open', () => {
  modal.render({
      content: delivery.render({
          payment: '',
          address: '',
          valid: false,
          errors: []
      })
  });
 // appData.order.address=delivery.address
});

// Изменилось состояние валидации формы
events.on('formDeliveryErrors:change', (errors: Partial<IOrder>) => {
  const { payment, address } = errors;
  delivery.valid = !payment && !address;
  delivery.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

events.on(/^order\..*:change/, (data: { field: keyof IDeliveryForm, value: string }) => {
  appData.setDeliveryField(data.field, data.value);
});

// Открыть форму контактов заказа
events.on('orderc:open', () => {
  modal.render({
      content: contact.render({
          email: '',
          phone: '',
          valid: false,
          errors: []
      })
  });
});

// Изменилось состояние валидации формы
events.on('formContactErrors:change', (errors: Partial<IOrder>) => {
  const { email, phone } = errors;
  contact.valid = !email && !phone;
  contact.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on(/^contacts\..*:change/, (data: { field: keyof IContactForm, value: string }) => {
  appData.setContactField(data.field, data.value);
});

const success = new Success(cloneTemplate(successTemplate), {
  onClick: () => {
      modal.close();
  }
});
//oформление закaза
events.on('order:submit', () => {
  const orderData = {
    ...appData.order, // здесь взяли данные пользователя, телефон, адрес и все такое
    total: appData.getTotal(), // здесь сумму товаров взяли
    items: appData.basket.map((item) => item.id) // создали массив id 
  }
  api.orderProducts(orderData)
      .then((result) => {
          appData.clearBasket();
          modal.render({
              content: success.render({
                total: result.total
              })
          });
      })
      .catch(err => {
          console.error(err);
      });
});
// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});

// Получаем товары с сервера
api.getProductList()
  .then(appData.setCatalog.bind(appData))
  .catch(err => {
      console.error(err);
  });