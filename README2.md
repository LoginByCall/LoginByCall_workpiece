# Авторизация LoginByCall

##### English: https://github.com/LoginByCall/LoginByCall_workpiece/blob/master/README.md

## О сервисе LoginByCall
* `ПРОСТО`: Сервис LoginByCall позволяет надёжно и просто проводить регистрацию и авторизацию пользователей на вашем сайте.
* `РОСТ КОНВЕРСИИ`: Сервис LoginByCall достоверно доказал повышение конверсии по сравнению с обычными формами регистрации пользователей.
* `ПАРОЛИ НЕ НУЖНЫ`: Пользователям не нужно придумывать или вспоминать пароли, при этом их данные надёжно защищены.
* `АКТУАЛЬНЫЕ КОНТАКТЫ`: Вы, в свою очередь, всегда имеете актуальные контактные данные пользователей.
* `WOW-ЭФФЕКТ`: Сервис LoginByCall прост в использовании и добавит запоминаемость вашему сайту.

### Как это работает:
- Для регистрации/авторизации пользователь указывает на сайте свой номер телефона.
- Сайт через сервис LoginByCall совершает голосовой вызов со случайно выбранного номера на номер пользователя.
- Для подтверждения регистрации/авторизации пользователь должен указать на сайте последние N-цифр входящего номера.
```
Демонстрация работы сервиса LoginByCall: http://tiptopcar.ru/notyet.twig

##### Примечание: хотя сервис LoginByCall и является надёжным, мы рекомендуем оставлять его основным на вашем сайте,
но не единственно возможным способом авторизации пользователей.
```

### Определения
* `Клиент` - веб-сайт, использующий сервис простой авторизации LoginByCall для авторизации и/или регистрации своих пользователей.
* `Пользователь` - посетитель сайта Клиента, производящий авторизацию или регистрацию с помощью сервиса LoginByCall

### LoginByCall предоставляет 2 группы методов:
* методы для регистрации и управления аккаунтом к LoginByCall api;
* методы для авторизации пользователей на сайте Клиента (совершения звонков).

Все методы вызываются посредством универсального протокола. Некоторые методы требуют наличия цифровой подписи.
API находится по адресу: [https://internal.loginbycall.net/callapi/v2.0/](https://internal.loginbycall.net/callapi/v2.0/)

## Универсальный протокол

Все методы вызываются по URL `https://internal.loginbycall.net/callapi/v2.0/<имя метода>`, например `https://internal.loginbycall.net/callapi/v2.0/register`. Порядок следования параметров неважен.
Методы API можно вызывать любым из нескольких способов. Способы перечислены ниже.

### HTTP GET с параметрами

Передача параметров производится внутри URL query string запросом HTTP GET.
```
GET /callapi/v2.0/call?call-api-id=npK5AJe407KnZnn9kqYIL9dMJP7WZIpP01kwNjP6&msisdn=70000000000 HTTP/1.1
Host: internal.loginbycall.net
```

### HTTP POST формы

Передача параметров производится HTTP POST формы (кодировка application/x-www-form-urlencoded).
```
POST /callapi/v2.0/call HTTP/1.1
Host: internal.loginbycall.net
Content-Length: 71
Content-Type: application/x-www-form-urlencoded; charset=UTF-8

call-api-id=npK5AJe407KnZnn9kqYIL9dMJP7WZIpP01kwNjP6&msisdn=70000000000
```

### REST style HTTP GET

Передача параметров производится адресом внутри URL.
```
GET /callapi/v2.0/call/call-api-id/npK5AJe407KnZnn9kqYIL9dMJP7WZIpP01kwNjP6/msisdn/70000000000 HTTP/1.1
Host: internal.loginbycall.net
```

### HTTP POST multipart

Передача параметров производится HTTP POST формы (кодировка multipart/form-data).
```
POST /callapi/v2.0/call HTTP/1.1
Host: internal.loginbycall.net
Content-Length: 110
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryP7bZDAwOQaxMGJ95

------WebKitFormBoundaryP7bZDAwOQaxMGJ95
Content-Disposition: form-data; name="call-api-id"

npK5AJe407KnZnn9kqYIL9dMJP7WZIpP01kwNjP6
------WebKitFormBoundaryP7bZDAwOQaxMGJ95
Content-Disposition: form-data; name="msisdn"

70000000000
------WebKitFormBoundaryP7bZDAwOQaxMGJ95--
```

### Специальный параметр params

Параметр `params` имеет специальное значение. В нем можно передавать все параметры метода в JSON кодировке. Этот специальный параметр применим к любым протоколам выше.
Примеры:

```
GET /callapi/v2.0/call?params=%7B%22call-api-id%22:%22npK5AJe407KnZnn9kqYIL9dMJP7WZIpP01kwNjP6%22,%22msisdn%22:%2270000000000%22%7D HTTP/1.1
Host: internal.loginbycall.net
```

```
POST /callapi/v2.0/call HTTP/1.1
Host: internal.loginbycall.net
Content-Length: 71
Content-Type: application/x-www-form-urlencoded; charset=UTF-8

params=%7B%22call-api-id%22:%22npK5AJe407KnZnn9kqYIL9dMJP7WZIpP01kwNjP6%22,%22msisdn%22:%2270000000000%22%7D
```

```
POST /callapi/v2.0/call HTTP/1.1
Host: internal.loginbycall.net
Content-Length: 110
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryP7bZDAwOQaxMGJ95

------WebKitFormBoundaryP7bZDAwOQaxMGJ95
Content-Disposition: form-data; name="params"

{"call-api-id":"npK5AJe407KnZnn9kqYIL9dMJP7WZIpP01kwNjP6","msisdn":"70000000000"}
------WebKitFormBoundaryP7bZDAwOQaxMGJ95--
```

### Цифровая подпись

Некоторые методы требуют наличия цифровой подписи.

** Внимание!**
Администратор LoginByCall может отключить проверку цифровой подписи для конкретного аккаунта LoginByCall api, в таком случае все параметры цифровой подписи игнорируются и могут не передаваться.

Каждому клиенту LoginByCall присваиваются 2 идентификатора: идентификатор `call-api-id` и секретный ключ `api-key`. Цифровая подпись запросов осуществляется с помощью секретного ключа по алгоритму `SHA512-HMAC`. Сначала хэшируется имя метода, а затем все входные параметры функции в кодировке `utf-8` (кроме параметров имеющих пустые значения). Каждый элемент хэша разделяется символом с кодом `0x00` - `'\0'`. Порядок следования параметров в хэше приведён в описании каждого метода. Цифровая подпись передается либо в дополнительном параметре `signature` либо в HTTP header `Signature` и кодируется в HEX кодировке.

Для обеспечения уникальности цифровой подписи используются 2 дополнительных параметра: метка времени в секундах UNIX time `timestamp` и случайное число `nonce`. Пара `timestamp + nonce` должна быть уникальна для каждого клиента, также LoginByCall проверяет разницу между параметром `timestamp` и текущим временем, они не должна превышать 1 сутки. Эти параметры передаются любым из стандартных способов, цифровая подпись включает в себя и эти параметры.

Пример подсчета цифровой подписи на JavaScript.

```javascript
var crypto = require('crypto');
var SIGN_ORDER = ["call-api-id", "timestamp", "nonce"];
var SIGN_ORDER_CALL = SIGN_ORDER.concat("msisdn");
var SIGN_ORDER_STATUS = SIGN_ORDER.concat("call");
var call_api_id = "npK5AJe407KnZnn9kqYIL9dMJP7WZIpP01kwNjP6";
var apikey = "eVLAWyB20L32gqpQM2liqGd4GGPJxIW1r8Kw1RNq";

function addSignature(method, query, signorder) {
    query['call-api-id'] = call_api_id;
    if(!apikey)
        return query;
    query.timestamp = String(Math.round(Date.now() / 1000));
    query.nonce = crypto.randomBytes(20).toString("base64");

    var zerobuf = new Buffer([0]);
    var hmac = crypto.createHmac('sha512', new Buffer(apikey, 'utf-8'));
    hmac.update(new Buffer(method, 'utf-8'));
    for(var i = 0; i < signorder.length; i++) {
        var param = signorder[i];
        if(!query[param])
            continue;
        hmac.update(zerobuf).update(new Buffer(param, 'utf-8'));
        hmac.update(zerobuf).update(new Buffer(String(query[param]), 'utf-8'));
    }
    query.signature = hmac.digest('hex');
    return query;
}

var query = addSignature('call', {msisdn: '70000000000'}, SIGN_ORDER_CALL);
var query = addSignature('call-status', {call: call_id}, SIGN_ORDER_STATUS);

```

Пример цифровой подписи.

```
GET /callapi/v2.0/call?msisdn=70000000000&call-api-id=EeaBxJlPvdARz9RBpRLSn9gJo3oeMinkrA1G2Xm8&timestamp=1492799685&nonce=p2P6YLWPk4wOfqKXwBjkXGyO33k&signature=ef716a4a32a45259147554dbb8ab1abb4a0ca3ec76e3c20964113045644a7563b48b32a86580b9f4e8f7f61cb1e16edbc0c22cf9b89446362301cdf298899779 HTTP/1.1
```

## Ответы сервера

На любые запросы сервис LoginByCall присылает ответ в JSON кодировке. Если в ответе присутствует элемент `error` значит произошла ошибка, иначе это успешный ответ.

Пример успешного ответа.

```
HTTP/1.1 200 OK
X-Powered-By: Express
X-Request-Id: 0239_04282346_4
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json;charset=UTF-8
Vary: Accept-Encoding
Date: Fri, 28 Apr 2017 17:59:28 GMT
Connection: keep-alive
Transfer-Encoding: chunked


{"call":"PR3MaG1orzx9GBXNeoGtEKamYWG17FW6bZ4kNXK5","mask":"70000000000","codelen":4,"repeat_timeout":30}
```

Пример ответа с ошибкой. Список кодов ошибок приведен в конце документа.

```
HTTP/1.1 200 OK
Server: nginx/1.10.3
Date: Fri, 28 Apr 2017 17:14:23 GMT
Content-Type: application/json;charset=UTF-8
Transfer-Encoding: chunked
Connection: keep-alive
X-Powered-By: Express
X-Request-Id: 0247_04232116_309
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
Vary: Accept-Encoding

{
"clazz":"PROCESS",
"error":"INVALID_ACCOUNT",
"reason":"Unknown user npK5AJe407KnZnn9kqYIL9dMJP7WZIpP01fwNjP6",
"stack":"INVALID_ACCOUNT\nError: Unknown user npK5AJe407KnZnn9kqYIL9dMJP7WZIpP01fwNjP6\n    at ErrObject (/usr/local/LoginByCall/lib/err.js:9:17)\n    at Function.<anonymous> (/usr/local/LoginByCall/lib/methods/lbc_api.js:72:23)\n    at /usr/local/LoginByCall/node_modules/synchronize/sync.js:273:21"
}
```

## Методы регистрации и управления аккаунтом LoginByCall api

### Регистрация нового аккаунта `register`

Метод не требует цифровой подписи.

##### Параметры запроса
- `domain` - домен, на котором будет использоваться настоящий API. Должен быть именем домена, без протокола и пути (например `example.com`). Обязательный параметр.
- `admin_email` - электронная почта администратора клиента. Обязательный параметр.
- `admin_phone` - номер телефона администратора клиента. Необязательный параметр.
- `verify_url` - URL по которому будет производиться проверка принадлежности домена клиенту. Необязательный параметр. По умолчанию `'http://' + domain + '/lbc-' + call-api-id + '.html'`
- `balance_notify_limit` - минимальный баланс клиента в сервисе LoginByCall в копейках, при котором на электронную почту `admin_email` будет отправляться уведомление с просьбой пополнить баланс. Необязательный параметр. По умолчанию `10000` что означает 100 рублей. Можно передать `-1` - тогда уведомления отправляться не будут. Уведомления при снижении баланса отправляются раз в сутки в 03:00 по Московскому времени (GMT +3).

##### Параметры ответа
- `call_api_id` - идентификатор аккаунта LoginByCall api.
- `verify_url` - адрес для проверки принадлежности домена. Возвращается либо тот, который получен в запросе, либо созданный сервисом LoginByCall автоматически.

Новый аккаунт клиента LoginByCall регистрируется со статусом "неактивный". После регистрации сервис LoginByCall высылает секретный ключ `api-key` на указанную электронную почту. Затем каждые 10 минут производится HTTP GET запрос по указанному `verify_url`. По данному URL должен быть размещен файл, содержащий текст - идентификатор пользователя `call-api-id`. Если проверка домена прошла успешно - аккаунт клиента LoginByCall активируется и можно использовать остальные методы  API. Аккаунты не прошедшие активацию в течении суток удаляются.

##### Примеры запроса
```
https://internal.loginbycall.net/callapi/v2.0/register?domain=example.com&admin_email=admin@example.com&verify_url=http://example.com/lbc_verify.html&balance_notify_limit=5000

https://internal.loginbycall.net/callapi/v2.0/register?domain=example.com&admin_email=admin@example.com
```

##### Примеры ответа
```
{"call_api_id":"kJpDl7YnbX32Mn83w9puEV6OVJPQOsWL0z2dMwgm","verify_url":"http://example.com/lbc_verify.html"}

{"call_api_id":"yezoZpgG0jQ8EkqY4KZHZY23WMXegUxgrkjPMwWV","verify_url":"http://example.com/lbc-yezoZpgG0jQ8EkqY4KZHZY23WMXegUxgrkjPMwWV.html"}
```

### Статус пользователя `status`

Метод не требует цифровой подписи.

##### Параметры запроса
- `call-api-id` - идентификатор клиента в сервисе LoginByCall.

##### Параметры ответа
- `activated` - 1 (аккаунт активирован) или 0 (аккаунт не активирован).
- `blocked` - 1 (аккаунт заблокирован) или 0 (аккаунт не заблокирован).
- `allow_unsecure_calls` - 1 или 0 - разрешил или нет администратор сервиса LoginByCall не подписывать цифровой подписью запросы.

##### Примеры запроса
```
https://internal.loginbycall.net/callapi/v2.0/status?call-api-id=zpPOnM7XbZOPnLWVaPAfoMAA6yy2YTpXv6demwBk
```

##### Примеры ответа
```
{"activated":0,"blocked":0,"allow_unsecure_calls":0}
```

### Настройки клиента `options`

Метод требует цифровую подпись. Порядок параметров для подписи: `call-api-id, timestamp, nonce, balance_notify_limit`.

##### Параметры запроса
- `call-api-id` - идентификатор клиента в сервисе LoginByCall.
- `balance_notify_limit` - минимальный баланс клиента в копейках, при котором на электронную почту `admin_email` будет отправляться сообщение с просьбой пополнить баланс. Можно передать `-1` - тогда сообщения отправляться не будут. Сообщения при снижении баланса отправляются раз в сутки в 03:00 по Московскому времени (GMT +3).

##### Параметры ответа
- В случае успеха метод возвращает пустой ответ.

##### Примеры запроса
```
https://internal.loginbycall.net/callapi/v2.0/options?call-api-id=zpPOnM7XbZOPnLWVaPAfoMAA6yy2YTpXv6demwBk&balance_notify_limit=-1&&timestamp=1492799685&nonce=p2P6YLWPk4wOfqKXwBjkXGyO33k&signature=ef716a4a32a45259147554dbb8ab1abb4a0ca3ec76e3c20964113045644a7563b48b32a86580b9f4e8f7f61cb1e16edbc0c22cf9b89446362301cdf298899779
```

### Баланс клиента `balance`

Метод требует цифровую подпись. Порядок параметров для подписи: `call-api-id, timestamp, nonce`.

##### Параметры запроса
- `call-api-id` - идентификатор клиента в сервисе LoginByCall.

##### Параметры ответа
- `balance` - сумма всех платежей клиента в копейках.
- `consumed` - сумма всех расходов клиента в копейках.
- `balance_notify_limit` - установленный минимальный баланс в копейках при котором будут отправляться сообщения администратору. Подробнее см. в методе `register`.
- `last_payments` - массив из 5 последних платежей клиента. Каждый элемент массива это объект с двумя свойствами `value` - сумма платежа и `created` - UNIX time даты платежа.

Чтобы узнать баланс клиента, нужно от суммы платежей отнять сумму расходов `current_balance = balance - consumed`.

##### Примеры запроса
```
https://internal.loginbycall.net/callapi/v2.0/balance?call-api-id=zpPOnM7XbZOPnLWVaPAfoMAA6yy2YTpXv6demwBk&timestamp=1492799685&nonce=p2P6YLWPk4wOfqKXwBjkXGyO33k&signature=ef716a4a32a45259147554dbb8ab1abb4a0ca3ec76e3c20964113045644a7563b48b32a86580b9f4e8f7f61cb1e16edbc0c22cf9b89446362301cdf298899779
```

##### Примеры ответа
```json
{
"balance":100000000,
"consumed":40,
"balance_notify_limit":2000,
"last_payments":[{"value":100000000,"created":1492283925}]
}
```

### Пополнение баланса клиента `pay`

Метод требует цифровую подпись. Порядок параметров для подписи: `call-api-id, timestamp, nonce, amount`.

##### Параметры запроса
- `call-api-id` - идентификатор клиента в сервисе LoginByCall.
- `amount` - сумма для пополнения, в копейках.
- `locale` - предпочитаемый язык для формы оплаты - `ru` или `en`. Необязательный параметр.
- `success_url` - адрес, для перехода с формы оплаты после успешной оплаты. Необязательный параметр.
- `fail_url` - адрес, для перехода с формы оплаты после неуспешной оплаты. Необязательный параметр.
- `return_url` - адрес, для перехода с формы оплаты при добровольном отказе от оплаты. Необязательный параметр.

##### Параметры ответа
- `url` - адрес платежной системы, на который необходимо перейти для совершения платежа.
- `query` - объект формата `{"param": "value"}` из которого надо сформировать форму - запрос в систему платежей. Пример формы оплаты см. ниже, в примерах ответа.
- `method` - `POST` или `GET` - http метод для вызова системы платежей.

Необязательные параметры `success_url, fail_url, return_url` могут не поддерживаться текущей платежной системой, а также могут быть отключены администратором сервиса LoginByCall.

##### Примеры запроса (сумма 600 рублей)
```
https://internal.loginbycall.net/callapi/v2.0/pay?call-api-id=npK5AJe407KnZnn9kqYIL9dMJP7WZIpP01kwNjP6&amount=60000&timestamp=1492799685&nonce=p2P6YLWPk4wOfqKXwBjkXGyO33k&signature=ef716a4a32a45259147554dbb8ab1abb4a0ca3ec76e3c20964113045644a7563b48b32a86580b9f4e8f7f61cb1e16edbc0c22cf9b89446362301cdf298899779
```

##### Примеры ответа
```json
{
    "url": "https://www.payanyway.ru/assistant.htm",
    "query": {
        "MNT_ID":"13042359",
        "MNT_AMOUNT":"600.00",
        "MNT_TRANSACTION_ID":"29009361577",
        "MNT_SUBSCRIBER_ID":"example.com",
        "MNT_CURRENCY_CODE":"RUB",
        "MNT_SIGNATURE":"781560c1567a0b675dc385aaf5ea785d"
    },
    "method": "POST"
}
```

По данному ответу необходимо построить и запустить следующую форму оплаты.
```html
<form method="post" action="https://www.payanyway.ru/assistant.htm">
    <input type="hidden" name="MNT_ID" value="13042359">
    <input type="hidden" name="MNT_AMOUNT" value="600.00">
    <input type="hidden" name="MNT_TRANSACTION_ID" value="29009361577">
    <input type="hidden" name="MNT_SUBSCRIBER_ID" value="example.com">
    <input type="hidden" name="MNT_CURRENCY_CODE" value="RUB">
    <input type="hidden" name="MNT_SIGNATURE" value="781560c1567a0b675dc385aaf5ea785d">
    <input type="submit" value="Оплатить">
</form>
```

## Методы для авторизации и регистрации пользователей (совершения звонков)

### Совершить звонок через LoginByCall `call`

Метод требует цифровую подпись. Порядок параметров для подписи: `call-api-id, timestamp, nonce, msisdn, ip_address`.

##### Параметры запроса
- `call-api-id` - идентификатор клиента в сервисе LoginByCall.
- `msisdn` - номер телефона для авторизации пользователя в формате E.164 (номер телефона в международном формате начиная с кода страны без "+"). По этому номеру сервис LoginByCall совершит исходящий вызов.
- `ip_address` - IP адрес авторизуемого пользователя. Необязательный параметр, желательно передавать, используется при расчете таймаута.

##### Параметры ответа
- `call` - идентификатор звонка.
- `mask` - номер, с которого будет совершен звонок.
- `codelen` - количество последних случайных цифр в номере, которые нужно запросить у авторизуемого пользователя.
- `repeat_timeout` - время в секундах, после которого можно будет повторить звонок на тот-же номер.

До истечения времени `repeat_timeout` все повторные запросы `call` на тот-же номер `msisdn + ip_address` будут отвергаться. Повторные звонки на тот-же номер `msisdn + ip_address` в течение минуты не тарифицируются. Пример параметра `codelen` - если `mask = "79256880636"` и `codelen = 4` то надо проверить, чтобы авторизуемый пользователь ввел цифры `0636`, а цифры `7925688` можно показать с текстом `Ожидайте звонка с номера 7925688[____]`. Метод может вернуть ошибку сразу, если метод вернул успешный ответ - значит звонок поставлен в очередь. Для проверки статуса звонка надо использовать метод `call-status`.

##### Примеры запроса
```
https://internal.loginbycall.net/callapi/v2.0/call?call-api-id=zpPOnM7XbZOPnLWVaPAfoMAA6yy2YTpXv6demwBk&msisdn=70000000000&ip_address=80.80.88.88&timestamp=1492799685&nonce=p2P6YLWPk4wOfqKXwBjkXGyO33k&signature=ef716a4a32a45259147554dbb8ab1abb4a0ca3ec76e3c20964113045644a7563b48b32a86580b9f4e8f7f61cb1e16edbc0c22cf9b89446362301cdf298899779
```

##### Примеры ответа
```
{"call":"ONP5qZde0pn43nDdRgmcNaEBlqoKyix3vK487LEQ","mask":"79256880636","codelen":4,"repeat_timeout":10}
```

### Проверить статус звонка `call-status`

Метод требует цифровую подпись. Порядок параметров для подписи: `call-api-id, timestamp, nonce, call`.

##### Параметры запроса
- `call` - идентификатор звонка.

##### Параметры ответа
- `status` - статус звонка (число).
- `status_desc` - описание статуса звонка.
- `last_error` - текст ошибки, заполнено только если статус ошибочный.

##### Статусы звонка
|`status`|`status_desc`|Описание|
|--------|-------------|--------|
|**1**|queued|Звонок находится в очереди.|
|**2**|dialing|Звонок совершается.|
|**4**|answered|Авторизуемый пользователь поднял трубку.|
|**8**|busy|Авторизуемый пользователь сбросил вызов, либо у него было занято.|
|**16**|notanswered|Авторизуемый пользователь не поднимал трубку и не сбрасывал. Звонок был завершен по истечении таймаута (30 секунд).|
|**32**|error|Произошла ошибка при совершении звонка. Описание ошибки указано в поле `last_error`.|

Статусы **1, 2** означают что звонок находится в обработке, они могут измениться в будущем. Остальные статусы - финальные. При получении финального статуса можно больше не вызывыть метод `call-status` так как статус не изменится.

##### Примеры запроса
```
https://internal.loginbycall.net/callapi/v2.0/call-status?call=jRM3p2wyboEgw3yeeDRiZ3pAjlVVWSz7rZLq8m1W&call-api-id=kJpDl7YnbX35Q2Nwd7OFm72pNgnQVSWm0z2dMwgm&timestamp=1493503608&nonce=xTDvsXd9lNx5ZYEbp5EFTlPnmho%3D&signature=d3b557f97b3773b7a74504145bd5306cd76dab66f2561d8bae5ad6fd467c6db31b220cccddc00fbcfe8fbecc2520d8ea8d92a0456f58de4efd6b8e22d61276a8
```

##### Примеры ответа
```
{"status":2,"status_desc":"dialing","last_error":null}
{"status":32,"status_desc":"error","last_error":"Вызов отклонен, попробуйте еще раз"}
```

### Завершить звонок `call-hangup`

Метод требует цифровую подпись. Порядок параметров для подписи: `call-api-id, timestamp, nonce, call`.

##### Параметры запроса
- `call` - идентификатор звонка.

##### Параметры ответа
- В случае успеха метод возвращает пустой ответ.

Метод завершает текущий вызов пользователю (у пользователя должен быть активный вызов со статусом **2** - dialing). Когда авторизуемому пользователю идёт вызов от LoginByCall (у пользователя звонит телефон), то этот метод вызывает разрыв соединения и вызов сбрасывается. Вызов метода может понадобиться в том случае, если пользователь не отвечает и не отклоняет входящий звонок от LoginByCall, а сразу вводит 4 цифры пароля в форме авторизации. В этом случае больше нет нужды звонить авторизуемому пользователю и вызов можно завершить настоящим методом. Даже если пользователь не отреагирует на вызов, сервис LoginByCall сам завершит вызов по таймауту (30 секунд).

## Обработка ошибок

В случае ошибки сервис LoginByCall возвращает следующие аргументы:
- `clazz` класс ошибки. Может отсутствовать.
- `error` код ошибки. Внимание! Сервис LoginByCall может вернуть код ошибки, не перечисленный в данном документе. Например в случае неожиданных ошибок код ошибки будет `Error`. В случае возникновения ошибки код ошибки будет обязательно присутствовать в ответе.
- `reason` - текст ошибки. Может быть пустым.
- `stack` - стек ошибки. Нужен для отладки непредвиденных ошибок.
- `additional` - объект - дополнительные данные ошибки. Некоторые ошибки могут включать дополнительные параметры для более точной обработки. Для остальных ошибок данный параметр не передается.

##### Коды ошибок

|Код ошибки|Описание ошибки|
|----------|---------------|
||**Класс `GENERIC` - общие ошибки**|
|UNEXPECTED|Неизвестная ошибка.|
|INVALID_ARGS|В функцию переданы неправильные аргументы.|
|NO_SIGNATURE|Не найдена подпись.|
|INVALID_SIGNATURE|Неправильная подпись.|
||**Класс `PROCESS` - ошибки обработки запросов**|
|INVALID_TIMESTAMP|`timestamp` переданный в функцию отличается от текущего времени больше чем на 24 часа.|
|NONCE_ALREADY_USED|`nonce` уже использовалось.|
|INVALID_ACCOUNT|Неизвестный идентификатор клиента.|
|ACCOUNT_BLOCKED|Аккаунт клиента заблокирован.|
|NOT_ENOUGH_CREDIT|Пополните баланс.|
|CALL_NOT_FOUND|Вызов не найден.|
|CALL_REPEAT_TIMEOUT|Можно перезвонить через несколько секунд. В поле `additional` содержится объект с числом секунд, например `"additional":{"delay":23.563}`.|
|ACCOUNT_ALREADY_REGISTERED|Домен уже зарегистрирован.|
|ACCOUNT_VERIFY_URL_PROTOCOL|Для проверки домена используется неправильный протокол. Разрешены только http или https.|
|ACCOUNT_VERIFY_URL_DOMAIN|Для проверки используется другой домен. Адрес для проверки домена должен находиться на том-же домене.|

##### Примеры
```json
{
"clazz":"PROCESS",
"error":"CALL_REPEAT_TIMEOUT",
"reason":"Можно перезвонить через 24 секунд",
"stack":"CALL_REPEAT_TIMEOUT\nError: Можно перезвонить через 24 секунд\n    at Function.ErrObject (m:\\Projects\\__Logi\\LoginByCall\\server\\lib\\err.js:9:17)\n    at Function.ErrObject.withAdditional (m:\\Projects\\__Logi\\LoginByCall\\server\\lib\\err.js:81:27)\n    at m:\\Projects\\__Logi\\LoginByCall\\server\\lib\\originator.js:158:33\n    at Function.<anonymous> (m:\\Projects\\__Logi\\LoginByCall\\server\\lib\\db.js:370:20)\n    at m:\\Projects\\__Logi\\LoginByCall\\server\\node_modules\\synchronize\\sync.js:273:21",
"additional":{"delay":23.563}
}

{
"clazz":"PROCESS",
"error":"ACCOUNT_ALREADY_REGISTERED",
"reason":"Домен уже зарегистрирован",
"stack":"ACCOUNT_ALREADY_REGISTERED\nError: Домен уже зарегистрирован\n    at ErrObject (m:\\Projects\\__Logi\\LoginByCall\\server\\lib\\err.js:9:17)\n    at m:\\Projects\\__Logi\\LoginByCall\\server\\lib\\methods\\lbc_api.js:228:23\n    at Function.<anonymous> (m:\\Projects\\__Logi\\LoginByCall\\server\\lib\\db.js:370:20)\n    at m:\\Projects\\__Logi\\LoginByCall\\server\\node_modules\\synchronize\\sync.js:273:21"
}
```
