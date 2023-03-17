<h1 align="center">📂 Web app for searching Github repositories</h1>

<p align="center">
    <img height="100px" alt="HTML, CSS, JS" src="https://user-images.githubusercontent.com/99616798/225798818-8fdb9041-e98d-427a-bd68-c56ba7babdc6.png" />
</p>

<p align="center">
   <span>The search takes place using the <a href="https://docs.github.com/en/rest?apiVersion=2022-11-28)">Github API</span>
</p>

<p align="center">
   Style reference <a href="https://github.com/">dark theme of Github</a>
</p>

## 🔗 Github Pages

Live link: [Github search repo page](https://safym.github.io/git-repo-search/)

## 🖥️ Screenshots

<p align="center">
    <img height="400px" src="https://user-images.githubusercontent.com/99616798/225789642-c992c1a7-6c92-4abd-9b63-96d194951216.png" />
    <img height="200px" src="https://user-images.githubusercontent.com/99616798/225789656-6c6a857d-4bc5-4dad-ac40-837eed007d2b.png" />
    <img height="200px" src="https://user-images.githubusercontent.com/99616798/225789649-da5f0e79-d0c8-44fd-89f2-7489c2369cea.png" />
</p>

## 📑 Implementation:

The search page is logically an instance of the *SearchSection* class.

Features of behavior:

* **Validation** and message of incorrect data:
    + Query string: not empty from 3 to 200 characters
* **Submit** of the search form occurs by pressing the button or the Enter key if the input is valid
* The query **results** in 10 repositories with the best match
* The **result card** contains:
    + Name-link to the repository (opens in a new browser tab)
    + Last modified date
    + Repository Description
    + Count of "stars"
    + Count of "forks"
    + The main language of the repository
* There is a **loader** element during query execution of the request
* There is a message about an **empty search result**


## 🔒 API limit

> For unauthenticated requests, the rate limit allows for up to 60 requests per hour. Unauthenticated requests are associated with the originating IP address, and not the user making requests.

For more information, see the [API documentation](https://docs.github.com/ru/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28).


<h1 align="center">📂 Веб приложение для поиска Github репозиториев</h1>

Для поиска используется [Github API](https://docs.github.com/en/rest?apiVersion=2022-11-28)

Style reference - [dark theme of Github](https://github.com/)

## 📑 Реализация:

Страница поиска логически - экземпляр класса *SearchSection*.

Особенности поведения:

* **Валидация** и сообщение о некорректных данных:
    + Строка запроса: не пустая от 3 до 200 символов
* **Submit** формы поиска происходит по нажатию кнопки или клавиши Enter если строка вопроса валидна
* В **результате запроса** выводится 10 репозиториев с наилучшим совпадением
* **Карточка результата** содержит:
    + Название-ссылка на репозиторий (открывается в новой вкладке браузера)
    + Последняя дата изменения
    + Описание репозитория
    + Количество "звезд"
    + Количество "форков"
    + Основной язык репозитория
* Присутсвует **loader-элемент**, пока выполняется запрос
* Присуствует сообщение о **пустом результате** поиска
    
## 🔒 Ограничение API

> Для запросов, не прошедших проверку подлинности, ограничение скорости допускает до 60 запросов в час. Неаутентифицированные запросы связаны с исходным IP-адресом, а не с пользователем, отправляющим запросы.

Подробнее, в [API документации](https://docs.github.com/ru/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28).
