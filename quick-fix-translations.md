# ШВИДКЕ ВИПРАВЛЕННЯ ПЕРЕКЛАДІВ

## Проблема
У коді 303 використаних ключі, але в translation.json тільки 156.

## Рішення

### 1. Найкращий підхід (рекомендується)
**Виправити код**, щоб використовувати правильні вкладені ключі:

```javascript
// Замість
t('loading')
t('save')  
t('email')

// Використовувати
t('common.loading')
t('common.save')
t('auth.email')
```

### 2. Швидке виправлення
Додати найбільш використовувані ключі в root translation.json (вже зроблено):
- loading, save, update, error, success
- email, phone, notes, price, mileage
- year, vin, login, register
- та інші базові (28 ключів)

### 3. Наступні кроки

#### Додати категорії витрат:
```json
"expense_category_fuel": "Паливо",
"expense_category_repair": "Ремонт",
"expense_category_parts": "Запчастини",
"expense_category_insurance": "Страхування",
"expense_category_tax": "Податки",
"expense_category_purchase": "Купівля",
"expense_category_other": "Інше"
```

#### Додати помилки:
```json
"error_loading": "Помилка завантаження",
"error_saving": "Помилка збереження",
"please_select_car": "Будь ласка, оберіть автомобіль",
"please_select_category": "Будь ласка, оберіть категорію",
"please_enter_valid_amount": "Введіть коректну суму"
```

#### Додати mileage:
```json
"mileage_history": "Історія пробігу",
"update_mileage": "Оновити пробіг",
"km": "км",
"current_mileage": "Поточний пробіг"
```

## Поточний статус після виправлення

✅ Додано 28 базових ключів в root
⏳ Залишилось ~238 ключів

## Рекомендація

Замість додавання 238 ключів, краще:
1. ✅ Використовувати вкладені ключі (common.*, auth.*, cars.*)
2. ✅ Додати тільки найчастіше використовувані root ключі
3. ✅ Поступово рефакторити код для використання правильних шляхів
