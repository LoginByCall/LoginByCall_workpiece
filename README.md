# LoginByCall - easy sign in & sign up service

##### Russian: https://github.com/LoginByCall/LoginByCall_workpiece/blob/master/README2.md

## About LoginByCall
* `EASY`: LoginByCall service allows you safely and simply sign up and sign in users of your website.
* `GROWTH OF CONVERSION`: LoginByCall service reliably proved the increase in conversion compared to the usual forms of user registration.
* `PASSWORDS ARE NOT NEEDED`: Users do not need to invent or remember passwords, and their data is securely protected.
* `RELEVANT CONTACTS`: You always have relevant contact information for your users.
* `WOW-EFFECT`: LoginByCall service is easy to use and will increase memorability of your site.

### How it works:
- To sign in / sign up the user inputs his phone number on the website.
- Using the LoginByCall service the site makes a voice call from a randomly selected number to the user's number.
- The user must enter the last N-digits of the incoming number to confirm the signing in / signing up.
```
LoginByCall demo: http://tiptopcar.ru/notyet.twig

Note: although the LoginByCall service is reliable, we recommend leaving it primary on your site,
but not the only way to authenticate users.
```

### Definitions
* `Client` - a website that uses the simple login service LoginByCall to authorize and / or register its users.
* `User` - visitor of the Client's website, authorizing or registering with the LoginByCall service

### LoginByCall provides 2 groups of methods:
* methods for registering and managing the account to LoginByCall api;
* methods for signing in / signing up users on the Client's site (making calls).

All methods are called by means of a universal protocol. Some methods require a digital signature.
API address: [https://internal.loginbycall.net/callapi/v2.0/](https://internal.loginbycall.net/callapi/v2.0/)

## Universal protocol

All methods are called by URL `https://internal.loginbycall.net/callapi/v2.0/<method name>`, e.g. `https://internal.loginbycall.net/callapi/v2.0/register`. The sequence of parameters does not matter.
You can call API methods by different ways. The methods are listed below.

### HTTP GET with parameters

Parameters are passed in the URL query string by an HTTP GET request.
```
GET /callapi/v2.0/call?call-api-id=npK5AJe407KnZnn9kqYIL9dMJP7WZIpP01kwNjP6&msisdn=70000000000 HTTP/1.1
Host: internal.loginbycall.net
```

### HTTP POST forms

Parameters are passed to the HTTP POST form (application/x-www-form-urlencoded encoding).
```
POST /callapi/v2.0/call HTTP/1.1
Host: internal.loginbycall.net
Content-Length: 71
Content-Type: application/x-www-form-urlencoded; charset=UTF-8

call-api-id=npK5AJe407KnZnn9kqYIL9dMJP7WZIpP01kwNjP6&msisdn=70000000000
```

### REST style HTTP GET

Parameters are passed by the address inside the URL.
```
GET /callapi/v2.0/call/call-api-id/npK5AJe407KnZnn9kqYIL9dMJP7WZIpP01kwNjP6/msisdn/70000000000 HTTP/1.1
Host: internal.loginbycall.net
```

### HTTP POST multipart

Parameters are passed to the HTTP POST form (multipart/form-data encoding).
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

### The special parameter params

`params` parameter has a special role. They can pass all parameters of the method in the JSON encoding. This special parameter applies to any of the methods above.
Examples:

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

### Digital signature

Some methods require a digital signature.

** Attention!**
The LoginByCall administrator can disable the digital signature verification for a specific LoginByCall api account, in which case all the parameters of the digital signature are ignored and may not be transmitted.

Each LoginByCall client is assigned 2 identifiers: the identifier `call-api-id` and the secret key` api-key`. Digital signature of requests is carried out with the help of a secret key using the `SHA512-HMAC` algorithm. First, the method name is hashed, and then all the input parameters of the function are encoded in `utf-8` (except for parameters that have null values). Each hash element is separated by a symbol with the code `0x00` -` '\ 0'`. The order of the parameters in the hash is given in the description of each method. The digital signature is passed either in the additional parameter `signature` or in the HTTP header` Signature` and is encoded in HEX encoding.

To ensure the uniqueness of the digital signature, two additional parameters are used: the time stamp in seconds UNIX time `timestamp` and the random number` nonce`. The pair `timestamp + nonce` must be unique for each client, also LoginByCall checks the difference between the` timestamp` parameter and the current time, they should not exceed 24 hours. These parameters are transmitted in any of the standard ways, the digital signature includes these parameters as well.

An example of using a digital signature in JavaScript.

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

An example of a digital signature.

```
GET /callapi/v2.0/call?msisdn=70000000000&call-api-id=EeaBxJlPvdARz9RBpRLSn9gJo3oeMinkrA1G2Xm8&timestamp=1492799685&nonce=p2P6YLWPk4wOfqKXwBjkXGyO33k&signature=ef716a4a32a45259147554dbb8ab1abb4a0ca3ec76e3c20964113045644a7563b48b32a86580b9f4e8f7f61cb1e16edbc0c22cf9b89446362301cdf298899779 HTTP/1.1
```

## Server replies

For any requests, the LoginByCall service sends a response in the JSON encoding. If the response contains the element `error`, then an error occurred, otherwise it is a successful response.

An example of a successful response.

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

An example of an error response. See the list of error codes at the end of the document.

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

## Methods of registration and account management LoginByCall api

### Registration of a new account `register`

The method does not require a digital signature.

##### Query Parameters
- `domain` - the domain on which this API will be used. Must be without protocol and path (eg `example.com`). It is a mandatory parameter.
- `admin_email` - E-mail client administrator. A mandatory parameter.
- `admin_phone` - Customer's telephone number. Optional parameter.
- `verify_url` - the URL by which the domain ownership will be checked. Optional parameter. Default value contains `'http://' + domain + '/lbc-' + call-api-id + '.html'`
- `balance_notify_limit` - the minimum balance of the client in the LoginByCall service in 1/10000 USD, at which a notification will be sent to the e-mail address `admin_email` with a request to refill the balance. Optional parameter. The default is `10000` which means 1 USD. You can pass `-1` - then notifications will not be sent. Notifications with decreasing balance are sent once a day at 03:00 Moscow time (GMT +3).

##### Response parameters
- `call_api_id` - the identifier of the LoginByCall api account.
- `verify_url` - URL to verify ownership of the domain. The response returns the address from the request or is created by the LoginByCall service automatically.

The new LoginByCall client's account is registered with the status "inactive". After registration, the LoginByCall service sends the secret key `api-key` to the administrator's email. Then, every 10 minutes, an HTTP GET request is made for the specified `verify_url`. A file containing the text - the user’s ID of `call-api-id` should be placed on this URL. If the domain check is successful, the LoginByCall client`s account is activated and you can use the rest of the API methods. Accounts that have not been activated are deleted within 24 hours.

##### Request examples
```
https://internal.loginbycall.net/callapi/v2.0/register?domain=example.com&admin_email=admin@example.com&verify_url=http://example.com/lbc_verify.html&balance_notify_limit=5000

https://internal.loginbycall.net/callapi/v2.0/register?domain=example.com&admin_email=admin@example.com
```

##### Response examples
```
{"call_api_id":"kJpDl7YnbX32Mn83w9puEV6OVJPQOsWL0z2dMwgm","verify_url":"http://example.com/lbc_verify.html"}

{"call_api_id":"yezoZpgG0jQ8EkqY4KZHZY23WMXegUxgrkjPMwWV","verify_url":"http://example.com/lbc-yezoZpgG0jQ8EkqY4KZHZY23WMXegUxgrkjPMwWV.html"}
```

### Status of the user `status`

The method does not require a digital signature.

##### Query Parameters
- `call-api-id` - the customer ID in the LoginByCall service.

##### Response parameters
- `activated` - 1 (account activated) or 0 (account not activated).
- `blocked` - 1 (account suspended) or 0 (account not locked).
- `allow_unsecure_calls` - 1 or 0 - whether the LoginByCall administrator has authorized or not to digitally sign requests.

##### Request examples
```
https://internal.loginbycall.net/callapi/v2.0/status?call-api-id=zpPOnM7XbZOPnLWVaPAfoMAA6yy2YTpXv6demwBk
```

##### Response examples
```
{"activated":0,"blocked":0,"allow_unsecure_calls":0}
```
### Client settings `options`

The method requires a digital signature. The order of the parameters for the signature: `call-api-id, timestamp, nonce, balance_notify_limit`.

##### Query Parameters
- `call-api-id` - the customer ID in the LoginByCall service.
- `balance_notify_limit` - Minimum balance of the client, at which the email message `admin_email` will be sent a message asking to refill the balance. You can send `-1` - then messages will not be sent. Messages with decreasing balance are sent once a day at 03:00 Moscow time (GMT +3).

##### Response parameters
- If successful, the method returns an empty response.

##### Request examples
```
https://internal.loginbycall.net/callapi/v2.0/options?call-api-id=zpPOnM7XbZOPnLWVaPAfoMAA6yy2YTpXv6demwBk&balance_notify_limit=-1&&timestamp=1492799685&nonce=p2P6YLWPk4wOfqKXwBjkXGyO33k&signature=ef716a4a32a45259147554dbb8ab1abb4a0ca3ec76e3c20964113045644a7563b48b32a86580b9f4e8f7f61cb1e16edbc0c22cf9b89446362301cdf298899779
```

### Balance of the client `balance`

The method requires a digital signature. The order of the parameters for the signature: `call-api-id, timestamp, nonce`.

##### Query Parameters
- `call-api-id` - the customer ID in the LoginByCall service.

##### Response parameters
- `balance` - the sum of all customer payments in 1/10000 USD.
- `consumed` - the amount of all customer expenses in 1/10000 USD
- `balance_notify_limit` - the established minimum balance in 1/10000 USD at which messages will be sent to the administrator. For more details, see the `register` method.
- `last_payments` - an array of the last 5 customer payments. Each element of the array is an object with `value` ()the payment amount) and` created` (the UNIX time of the payment date).

The balance of the customer is the amount of payments subtract the amount of expenses: `current_balance = balance - consumed`.

##### Request examples
```
https://internal.loginbycall.net/callapi/v2.0/balance?call-api-id=zpPOnM7XbZOPnLWVaPAfoMAA6yy2YTpXv6demwBk&timestamp=1492799685&nonce=p2P6YLWPk4wOfqKXwBjkXGyO33k&signature=ef716a4a32a45259147554dbb8ab1abb4a0ca3ec76e3c20964113045644a7563b48b32a86580b9f4e8f7f61cb1e16edbc0c22cf9b89446362301cdf298899779
```

##### Response examples
```json
{
"balance":100000000,
"consumed":40,
"balance_notify_limit":2000,
"last_payments":[{"value":100000000,"created":1492283925}]
}
```

### Refill of the client's balance `pay`

The method requires a digital signature. The order of the parameters for the signature: `call-api-id, timestamp, nonce, amount`.

##### Query Parameters
- `call-api-id` - the customer ID in the LoginByCall service.
- `amount` - the amount for replenishment, in 1/10000 USD.
- `locale` - preferred language for the form of payment is `en` or` en`. Optional parameter.
- `success_url` - URL, for redirect from the form of payment after a successful payment. Optional parameter.
- `fail_url` - URL, to redirect from the form of payment after a failed payment. Optional parameter.
- `return_url` - URL, for redirect from the form of payment in case of a voluntary refusal to pay. Optional parameter.

##### Response parameters
- `url` - the address of the payment form.
- `query` - the object for creating a payment form `{"param": "value"}`. For an example of the form of payment, see below, in the examples of the answer.
- `method` - `POST` or `GET` - http method for calling a payment system.

Optional parameters `success_url, fail_url, return_url` may not be supported by the payment system, and may also be disabled by the LoginByCall administrator.

##### Request examples (Amount 5 USD)
```
https://internal.loginbycall.net/callapi/v2.0/pay?call-api-id=npK5AJe407KnZnn9kqYIL9dMJP7WZIpP01kwNjP6&amount=50000&timestamp=1492799685&nonce=p2P6YLWPk4wOfqKXwBjkXGyO33k&signature=ef716a4a32a45259147554dbb8ab1abb4a0ca3ec76e3c20964113045644a7563b48b32a86580b9f4e8f7f61cb1e16edbc0c22cf9b89446362301cdf298899779
```

##### Response examples
```json
{
    "url": "https://www.payanyway.ru/assistant.htm",
    "query": {
        "MNT_ID":"13042359",
        "MNT_AMOUNT":"5.00",
        "MNT_TRANSACTION_ID":"29009361577",
        "MNT_SUBSCRIBER_ID":"example.com",
        "MNT_CURRENCY_CODE":"USD",
        "MNT_SIGNATURE":"781560c1567a0b675dc385aaf5ea785d"
    },
    "method": "POST"
}
```

For this answer, you need to build and run the following form of payment.
```html
<form method="post" action="https://www.payanyway.ru/assistant.htm">
    <input type="hidden" name="MNT_ID" value="13042359">
    <input type="hidden" name="MNT_AMOUNT" value="5.00">
    <input type="hidden" name="MNT_TRANSACTION_ID" value="29009361577">
    <input type="hidden" name="MNT_SUBSCRIBER_ID" value="example.com">
    <input type="hidden" name="MNT_CURRENCY_CODE" value="USD">
    <input type="hidden" name="MNT_SIGNATURE" value="781560c1567a0b675dc385aaf5ea785d">
    <input type="submit" value="PAY">
</form>
```

## Methods for signing in and signing up users (making calls)

### Make a call via LoginByCall `call`

The method requires a digital signature. The order of the parameters for the signature: `call-api-id, timestamp, nonce, msisdn, ip_address`.

##### Query Parameters
- `call-api-id` - the customer ID in the LoginByCall service.
- `msisdn` - Phone number for user authorization in E.164 format (international phone number starting with country code without "+"). By this number, the LoginByCall service will make an outgoing call.
- `ip_address` - IP address of the user. An optional parameter, preferably transmitted. It is used to calculate the timeout.

##### Response parameters
- `call` - call identifier.
- `mask` - phone from which the call will be made.
- `codelen` - the number of last random digits in the number that needs to be requested from the user.
- `repeat_timeout` - time in seconds, after which you can repeat the call to the same number.

Until the expiration of the time `repeat_timeout`, all repeated requests` call` to the same number `msisdn + ip_address` will be rejected. Repeated calls to the same number `msisdn + ip_address` within a minute are not charged. Example of the parameter `codelen` - if` mask = "79256880636" `and` codelen = 4`, then we need to check that the authorized user entered the digits `0636`, and the digits` 7925688` can be shown with the text `Waiting for the call from the number 7925688 [____ ] `. The method can return an error at once, if the method returned a successful response - then the call is queued. To check the status of the call, you must use the `call-status` method.

##### Request examples
```
https://internal.loginbycall.net/callapi/v2.0/call?call-api-id=zpPOnM7XbZOPnLWVaPAfoMAA6yy2YTpXv6demwBk&msisdn=70000000000&ip_address=80.80.88.88&timestamp=1492799685&nonce=p2P6YLWPk4wOfqKXwBjkXGyO33k&signature=ef716a4a32a45259147554dbb8ab1abb4a0ca3ec76e3c20964113045644a7563b48b32a86580b9f4e8f7f61cb1e16edbc0c22cf9b89446362301cdf298899779
```

##### Response examples
```
{"call":"ONP5qZde0pn43nDdRgmcNaEBlqoKyix3vK487LEQ","mask":"79256880636","codelen":4,"repeat_timeout":10}
```

### Check the status of the call `call-status`

The method requires a digital signature. The order of the parameters for the signature: `call-api-id, timestamp, nonce, call`.

##### Query Parameters
- `call` - call identifier.

##### Response parameters
- `status` - call status (number).
- `status_desc` - description of the status of the call.
- `last_error` - error text, only filled if the status is incorrect.

##### Статусы звонка
|`status`|`status_desc`|Description|
|--------|-------------|--------|
|**1**|queued|The call is in the queue.|
|**2**|dialing|Call in progress.|
|**4**|answered|The user picked up the phone.|
|**8**|busy|The user dropped the call or was busy.|
|**16**|notanswered|The user did not pick up the phone or drop it. The call was terminated after a timeout (30 seconds).|
|**32**|error|An error occurred while making the call. The error description is indicated in the field `last_error`.|

Statuses ** 1, 2 ** mean that the call is in processing, they may change in the future. The remaining statuses are final. When you receive the final status, you can no longer call the `call-status` method because the status will not change.

##### Request examples
```
https://internal.loginbycall.net/callapi/v2.0/call-status?call=jRM3p2wyboEgw3yeeDRiZ3pAjlVVWSz7rZLq8m1W&call-api-id=kJpDl7YnbX35Q2Nwd7OFm72pNgnQVSWm0z2dMwgm&timestamp=1493503608&nonce=xTDvsXd9lNx5ZYEbp5EFTlPnmho%3D&signature=d3b557f97b3773b7a74504145bd5306cd76dab66f2561d8bae5ad6fd467c6db31b220cccddc00fbcfe8fbecc2520d8ea8d92a0456f58de4efd6b8e22d61276a8
```

##### Response examples
```
{"status":2,"status_desc":"dialing","last_error":null}
{"status":32,"status_desc":"error","last_error":"Call rejected, try again"}
```

### End the call `call-hangup`

The method requires a digital signature. The order of the parameters for the signature: `call-api-id, timestamp, nonce, call`.

##### Query Parameters
- `call` - call identifier.

##### Response parameters
- If successful, the method returns an empty response.

The method terminates the current call to the user (the user must have an active call with the status ** 2 ** - dialing). When an authorized user receives a call from LoginByCall (the user’s phone is ringing), this method causes the connection to be broken and the call is reset. You may need to call the method if the user does not answer and does not reject the incoming call from LoginByCall, but immediately enters 4 digits of the password in the form of authorization. In this case, there is no longer any need to call the authorized user and the call can be terminated using this method. Even if the user does not respond to the call, the LoginByCall service will terminate the call itself by timeout (30 seconds).

## Error processing

In case of an error, LoginByCall returns the following arguments:
- `clazz` Error class. Can be empty.
- `error` error code. Attention! Service LoginByCall can return an error code not listed in this document. For example, in case of unexpected errors, the error code is `Error`. If an error occurs, the error code will be present in the response.
- `reason` - The text of the error. Can be empty.
- `stack` - error stack. It is needed to debug unexpected errors.
- `additional` - additional error information. Some errors may include additional parameters for more accurate processing. For other errors, this parameter is not transmitted.

##### Error codes

|Error code|Description|
|----------|---------------|
||**Класс `GENERIC` - Common mistakes**|
|UNEXPECTED|Unknown error.|
|INVALID_ARGS|Wrong arguments sent to the function.|
|NO_SIGNATURE|No digital signature found.|
|INVALID_SIGNATURE|Invalid digital signature.|
||**The class `PROCESS` - errors of processing requests**|
|INVALID_TIMESTAMP|`timestamp` is different from the current time for more than 24 hours.|
|NONCE_ALREADY_USED|`nonce` has already been used.|
|INVALID_ACCOUNT|Unknown customer ID.|
|ACCOUNT_BLOCKED|Customer account suspended.|
|NOT_ENOUGH_CREDIT|Refill your balance.|
|CALL_NOT_FOUND|Call is not found.|
|CALL_REPEAT_TIMEOUT|You can call back in a few seconds. The `additional` field contains an object with the number of seconds, for example `"additional":{"delay":23.563}`.|
|ACCOUNT_ALREADY_REGISTERED|Domain already registered in LoginByCall service.|
|ACCOUNT_VERIFY_URL_PROTOCOL|You are useing the wrong protocol to verify the domain. Only http or https are allowed.|
|ACCOUNT_VERIFY_URL_DOMAIN|You are using a different domain. The domain verification address must be in the same domain.|

##### Examples of an error response
```json
{
"clazz":"PROCESS",
"error":"CALL_REPEAT_TIMEOUT",
"reason":"You can call back in 24 seconds",
"stack":"CALL_REPEAT_TIMEOUT\nError: You can call back in 24 seconds\n    at Function.ErrObject (m:\\Projects\\__Logi\\LoginByCall\\server\\lib\\err.js:9:17)\n    at Function.ErrObject.withAdditional (m:\\Projects\\__Logi\\LoginByCall\\server\\lib\\err.js:81:27)\n    at m:\\Projects\\__Logi\\LoginByCall\\server\\lib\\originator.js:158:33\n    at Function.<anonymous> (m:\\Projects\\__Logi\\LoginByCall\\server\\lib\\db.js:370:20)\n    at m:\\Projects\\__Logi\\LoginByCall\\server\\node_modules\\synchronize\\sync.js:273:21",
"additional":{"delay":23.563}
}

{
"clazz":"PROCESS",
"error":"ACCOUNT_ALREADY_REGISTERED",
"reason":"This domain is already registered",
"stack":"ACCOUNT_ALREADY_REGISTERED\nError: This domain is already registered\n    at ErrObject (m:\\Projects\\__Logi\\LoginByCall\\server\\lib\\err.js:9:17)\n    at m:\\Projects\\__Logi\\LoginByCall\\server\\lib\\methods\\lbc_api.js:228:23\n    at Function.<anonymous> (m:\\Projects\\__Logi\\LoginByCall\\server\\lib\\db.js:370:20)\n    at m:\\Projects\\__Logi\\LoginByCall\\server\\node_modules\\synchronize\\sync.js:273:21"
}
```
