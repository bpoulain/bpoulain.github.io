# Gists

- [Launch a HTTP Server with Python](https://gist.github.com/bpoulain/ffe52ed360a1b166689235355e963004)
```
Python3 -m http.server 8000
```

- [List macOS IP address](https://gist.github.com/bpoulain/923eb17dad7a304d6674026cb8516078)
```
ifconfig | awk '/inet\ / { print $2 }'
```