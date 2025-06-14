# Gists

- [Terminal | Launch a HTTP Server with Python](https://gist.github.com/bpoulain/ffe52ed360a1b166689235355e963004)
```
Python3 -m http.server 8000
```

- [Terminal | List macOS IP address](https://gist.github.com/bpoulain/923eb17dad7a304d6674026cb8516078)
```
ifconfig | awk '/inet\ / { print $2 }'
```

- [Js | Check if an Object is empty (return boolean)](https://gist.github.com/bpoulain/ac203510936ca790c8c559a89ed6dfbf)
```
function isEmpty(obj) {
  return Object.entries(obj).length === 0;
}
```
