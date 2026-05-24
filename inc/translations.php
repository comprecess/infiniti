<?php
function sakura_custom_translations($translated, $text, $domain) {
    $translations = array(
        'Your cart is currently empty!' => 'Ваша корзина пуста!',
        'Your cart is currently empty.' => 'Ваша корзина пуста.',
        'New in store' => 'Новинки',
        'Add to cart' => 'В корзину',
        'View cart' => 'Корзина',
        'Proceed to Checkout' => 'Оформить заказ',
        'Proceed to checkout' => 'Оформить заказ',
        'Cart' => 'Корзина',
        'Checkout' => 'Оформление заказа',
        'Shop' => 'Меню',
        'Add coupons' => 'Добавить купон',
        'Estimated total' => 'Итого',
        'Return to shop' => 'Вернуться в меню',
        'Return to Shop' => 'Вернуться в меню',
        'Browse products' => 'Смотреть меню',
        'Start shopping' => 'Перейти в меню',
        'No products were found matching your selection.' => 'Блюда не найдены.',
        'Related products' => 'Похожие блюда',
        'Description' => 'Описание',
        'Additional information' => 'Дополнительная информация',
        'Reviews' => 'Отзывы',
        'Product' => 'Товар',
        'Price' => 'Цена',
        'Quantity' => 'Количество',
        'Subtotal' => 'Подытог',
        'Total' => 'Итого',
        'Update cart' => 'Обновить корзину',
        'Cart updated.' => 'Корзина обновлена.',
        'Coupon code' => 'Код купона',
        'Apply coupon' => 'Применить купон',
        'Cart totals' => 'Итого по корзине',
        'Shipping' => 'Доставка',
        'Free shipping' => 'Бесплатная доставка',
        'Flat rate' => 'Фиксированная ставка',
        'Place order' => 'Оформить заказ',
        'Order notes' => 'Примечание к заказу',
        'Cash on delivery' => 'Оплата при получении',
        'Pay with cash upon delivery.' => 'Оплата наличными или картой при доставке.',
        'Search products&hellip;' => 'Поиск блюд&hellip;',
        'Search products...' => 'Поиск блюд...',
        'Search' => 'Поиск',
        'Search &hellip;' => 'Поиск &hellip;',
        'Products' => 'Блюда',
        'Default sorting' => 'По умолчанию',
        'Sort by popularity' => 'По популярности',
        'Sort by average rating' => 'По рейтингу',
        'Sort by latest' => 'По новизне',
        'Sort by price: low to high' => 'Сначала дешёвые',
        'Sort by price: high to low' => 'Сначала дорогие',
        'has been added to your cart.' => 'добавлено в корзину.',
        'View Cart' => 'Корзина',
        'Remove this item' => 'Удалить',
    );
    if (isset($translations[$text])) {
        return $translations[$text];
    }
    return $translated;
}
add_filter('gettext', 'sakura_custom_translations', 20, 3);

function sakura_custom_ngettext($translated, $single, $plural, $number, $domain) {
    if ($single === '%s product' || $single === '%d product') {
        return $number . ' товар';
    }
    return $translated;
}
add_filter('ngettext', 'sakura_custom_ngettext', 20, 5);
