# Gists

- [Terminal | Launch a HTTP Server with Python](https://gist.github.com/bpoulain/ffe52ed360a1b166689235355e963004)
```
Python3 -m http.server 8000
```

- [Terminal | List macOS IP address](https://gist.github.com/bpoulain/923eb17dad7a304d6674026cb8516078)
```
ifconfig | awk '/inet\ / { print $2 }'
```

- [Js | Deep copy of an object ](https://gist.github.com/bpoulain/b0e6374280c99f0741752f92cc49328f)
```
b = JSON.parse(JSON.stringify(a));
```

- [Js | Check if a key exists in an object (returns boolean) ](https://gist.github.com/bpoulain/f4f2bd2c4cf7898dded6c3e5e1e790ad)
```
'key' in object
```

- [Js | Check if an Object is empty (return boolean)](https://gist.github.com/bpoulain/ac203510936ca790c8c559a89ed6dfbf)
```
function isEmpty(obj) {
  return Object.entries(obj).length === 0;
}
```

- [Js | extracts, for a given key, all the corresponding values from an array of objects and returns a list of those values without duplicates](https://gist.github.com/bpoulain/7cccbe66462fe7095f88a07dc34d9dbc)
```
function getUniqueValues(array, key) {
  return [...new Set(array.map(item => item[key]))];
}
``