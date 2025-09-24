## Store Access Token
```
POST /callback
```
### Request Body
```json
{
  "state": "aaaaaaaaaaaaaaaa",
  "code": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
}
```

## Get Access Token
```
GET /token/<state>
```
### Response Body
```json
{
  "access_token": "abcdefg",
  "refresh_token": "hijklmn",
  "expires_in": 99999,
  "scope": ["scope1", "scope2"],
  "token_type": "credential"
}
```
